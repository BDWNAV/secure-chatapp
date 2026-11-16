export type Message = {
  id: string;
  content: string;
  sender: {
    id: string;
    username: string;
    name: string;
  };
  sentAt: string;
}