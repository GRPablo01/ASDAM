export interface Notification {
  _id: string;
  senderId: string;   
  sender?: {          
    nom: string;
    prenom: string;
  };
  receiverId: string;
  text: string;
  createdAt: string;
  __v?: number;
  removing?: boolean;
}
