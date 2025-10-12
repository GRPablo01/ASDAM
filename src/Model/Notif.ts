export interface Notification {
    id: number;
    type: 'match' | 'message' | 'alerte';
    message: string;
    date: Date;
}
  