export interface Message {
    id: number;
    sender_id: number;
    receiver_id: number;
    message_type: string;
    content: string;
    attachment_url: string | null;
    timestamp: string; 
  }