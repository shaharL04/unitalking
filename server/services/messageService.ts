    import { pool } from "../config/dbConfig";
    import { Message } from "../types/message";
    import { redisClient } from "../config/redisClient";
    import axios from "axios";
    import userService from "./userService";

    class messageService {
    async retrieveMessagesSentByUser(
        userId: string,
        groupId: string
    ): Promise<Message[]> {
        const query = `
                SELECT * FROM messages
                WHERE sender_id = $1 AND receiver_group_id = $2
                ORDER BY timestamp;
            `;

        try {
        const result = await pool.query(query, [userId, groupId]);
        return result.rows;
        } catch (error) {
        console.error("Error executing query:", error);
        throw error;
        }
    }

    async retrieveMessagesSentByGroupUsers(
        userId: string,
        groupId: string
    ): Promise<Message[]> {
        const query = `
                SELECT * FROM messages
                WHERE sender_id != $1 AND receiver_group_id = $2
                ORDER BY timestamp;
            `;

        try {
        const result = await pool.query(query, [userId, groupId]);
        console.log("chatByothers" + result.rows);
        return result.rows;
        } catch (error) {
        console.error("Error executing query:", error);
        throw error;
        }
    }

    async sortMessagesByTimeOrder(messagesArray: Message[]): Promise<Message[]> {
        return messagesArray.sort(
        (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
    }

    async newMessage(
        userId: string,
        targetGroupId: string,
        incomingMessage: string
    ): Promise<Message> {
        const query = `
            INSERT INTO messages (sender_id, receiver_group_id, message_type, content)
            VALUES ($1, $2, 'text', $3)
            RETURNING *;
        `;

        const queryToUpdateChatLatestMessage = `
            UPDATE chats
            SET updated_at = CURRENT_TIMESTAMP, latest_message_in_chat = $1
            WHERE id = $2
        `;

        try {
        const result = await pool.query(query, [
            userId,
            targetGroupId,
            incomingMessage,
        ]);
        await pool.query(queryToUpdateChatLatestMessage, [
            incomingMessage,
            targetGroupId,
        ]);
        console.log(
            "this is the result rows after new incoming message" +
            JSON.stringify(result.rows[0])
        );
        return result.rows[0];
        } catch (error) {
        console.error("Error executing query:", error);
        throw error;
        }
    }

    async translateNewMessage(userId: string, message: Message) {
        try {
        let translatedText;
        const userLangCode = await userService.getUserLangCode(userId);
        if (userLangCode != "NULL") {
            const response = await axios.post("http://127.0.0.1:5000/translate", {
            q: message.content,
            source: "auto",
            target: userLangCode,
            });

            //if there is an error in the target language and it cant be translated then change it to english and then try again
            if (response.data.error) {
            const englishResponse = await axios.post(
                "http://127.0.0.1:5000/translate",
                {
                q: message.content,
                source: "auto",
                target: "en",
                }
            );
            const responseToPreferdLang = await axios.post(
                "http://127.0.0.1:5000/translate",
                {
                q: englishResponse.data.translatedText,
                source: "en",
                target: userLangCode,
                }
            );
            translatedText = responseToPreferdLang.data.translatedText;
            } else {
            translatedText = response.data.translatedText;
            }
        }
        else{
            translatedText = message
        }

        // Update the message content and cache it in Redis
        const translatedMessage = { ...message, content: translatedText };
        await redisClient.setEx(
            `translated_message:${message.id}:${userLangCode}`,
            86400,
            translatedText
        ); // Cache the translation
        console.log(
            "this is the translated message that was recieved: " +
            JSON.stringify(translatedMessage)
        );
        return translatedMessage;
        } catch (error) {
        console.error("Error translating message:", error);
        return message; // Fall back to the original message if translation fails
        }
    }

    async batchTranslateMessages(
        messages: Message[],
        targetLanguage: string
    ): Promise<Message[]> {
        const cachedTranslations: Message[] = [];
        const messagesToTranslate: Message[] = [];

        // Check Redis for cached translations and prepare messages for translation
        for (const message of messages) {
        const cacheKey = `translated_message:${message.id}:${targetLanguage}`;
        const cachedTranslation = await redisClient.get(cacheKey); // Use the redisClient here

        if (cachedTranslation) {
            // Use object spread to maintain all message properties
            cachedTranslations.push({ ...message, content: cachedTranslation });
        } else {
            messagesToTranslate.push(message);
        }
        }

        if (messagesToTranslate.length > 0) {
        const translationPromises = messagesToTranslate.map(async (message) => {
            try {
            const response = await axios.post("http://127.0.0.1:5000/translate", {
                q: message.content,
                source: "auto",
                target: targetLanguage,
            });

            //if there is an error in the target language and it cant be translated then change it to english and then try again
            let translatedText;
            if (response.data.error) {
                const englishResponse = await axios.post(
                "http://127.0.0.1:5000/translate",
                {
                    q: message.content,
                    source: "auto",
                    target: "en",
                }
                );
                const responseToPreferdLang = await axios.post(
                "http://127.0.0.1:5000/translate",
                {
                    q: englishResponse.data.translatedText,
                    source: "en",
                    target: targetLanguage,
                }
                );
                translatedText = responseToPreferdLang.data.translatedText;
            } else {
                translatedText = response.data.translatedText;
            }
            // Update the message content and cache it in Redis
            const translatedMessage = { ...message, content: translatedText };
            await redisClient.setEx(
                `translated_message:${message.id}:${targetLanguage}`,
                86400,
                translatedText
            ); // Cache the translation
            return translatedMessage;
            } catch (error) {
            console.error("Error translating message:", error);
            return message; // Fall back to the original message if translation fails
            }
        });

        const translatedMessages = await Promise.all(translationPromises);

        // Combine cached and newly translated messages
        return [...cachedTranslations, ...translatedMessages];
        }

        // Return cached translations only if all were found in the cache
        return cachedTranslations;
    }
    }

    export default new messageService();
