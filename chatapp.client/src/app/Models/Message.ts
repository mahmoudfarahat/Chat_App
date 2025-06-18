export interface Message{
  id: number;
  content: string;
  senderId: string | null;
  receiverId: string | null;
  createdDate: string | null;
  isRead: boolean;

}
