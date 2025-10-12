// src/app/services/message.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export interface Message {
  id: string;
  content: string;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private unreadCountSubject = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  markAsRead(messageId: string): Observable<any> {
    return this.http.post(`/api/messages/read/${messageId}`, {}).pipe(
      // Mettre à jour le compteur après lecture
      tap(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
          this.getUnreadCount(userId);
        }
      })
    );
  }

  getUnreadCount(userId: string): void {
    this.http.get<{ count: number }>(`http://localhost:3000/api/messages/unread/${userId}`)
      .subscribe({
        next: res => this.unreadCountSubject.next(res.count),
        error: err => {
          console.warn('Impossible de récupérer le compteur de messages.', err);
          this.unreadCountSubject.next(0);
        }
      });
  }
}
