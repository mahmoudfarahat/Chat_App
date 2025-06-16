export interface Message{
  id: string;
  content: string;
  senderId: string | null;
  receiverId: string | null;
  createdDate: string | null;
  isRead: boolean;

}
