export interface Chat {
    id: number;
    name: string;
    group_photo?: string;
    latest_message_in_chat: string;
    created_at?: Date; 
    updated_at?: Date;
  }