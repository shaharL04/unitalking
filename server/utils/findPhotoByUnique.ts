import fs from 'fs';
import path from 'path';

const findPhotosByUnique = (photosUnique: { chatId: string; uniqueToMatchInFolder: string }[] ) => {
    // Define the directory where the photos are stored
    const photosDirectory = path.join(__dirname, '../..', 'photos', 'chatPhotos');
    console.log(photosDirectory); 
    const chatIdNphotoPath: {chatId: string; pathToPhoto: string}[] = []
    try {
        const files = fs.readdirSync(photosDirectory);
         photosUnique.map((photoUnique,index) => {
            const matchingFile = files.find(file => file.startsWith(`${photoUnique.uniqueToMatchInFolder}_`));
            if (matchingFile) {
                chatIdNphotoPath[index] = {chatId: photoUnique.chatId, pathToPhoto: matchingFile }
                console.log("matching file "+matchingFile)
            } else {
                return null; 
            }
        });
        console.log(photosUnique);
        console.log(chatIdNphotoPath)
        return chatIdNphotoPath;
    } catch (error) {
        console.error('Error reading the chatPhotos directory:', error);
        // Return an array of nulls in case of an error
        return photosUnique.map(() => null);
    }
};

export default findPhotosByUnique;
