import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification } from '../src/Model/Notif'; // adapte le chemin selon ton projet

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:3000/api/messages';

  constructor(private http: HttpClient) {}

  // 📩 Récupérer tous les messages d’un utilisateur (reçus et envoyés)
  getUserMessages(userId: string): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/user/${userId}`);
  }

  // 🆕 Récupérer uniquement les messages non lus
  getUnreadMessages(userId: string): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/unread/${userId}`);
  }

  // 🔢 Compter les messages non lus
  getUnreadCount(userId: string): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/unreadcount/${userId}`);
  }

  // ✉️ Envoyer un nouveau message
  sendMessage(payload: {
    senderId: string;
    receiverId: string;
    text: string;
    senderName?: string;
  }): Observable<Notification> {
    return this.http.post<Notification>(this.apiUrl, payload);
  }
}
