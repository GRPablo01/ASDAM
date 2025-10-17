import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError, map, catchError } from 'rxjs';

export interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
}

export interface Message {
  id?: string;
  senderId: string;
  receiverId: string;
  text: string;
  senderName?: string;
  receiverName?: string;
  senderInitiales?: string;
  timestamp?: string | Date;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private newMessageSubject = new Subject<Message>();
  private apiUrl = 'http://localhost:3000/api/messages';

  constructor(private http: HttpClient) {}

  getContacts(): Observable<Contact[]> {
    return this.http.get<any[]>('http://localhost:3000/api/users/contacts').pipe(
      map(users => users.map(u => ({
        _id: u._id || u.id,
        firstName: u.firstName || u.prenom || u.name || 'Utilisateur',
        lastName: u.lastName || u.nom || '',
        email: u.email || ''
      }))),
      catchError(this.handleError)
    );
  }

  getConversation(user1Id: string, user2Id: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/conversation/${user1Id}/${user2Id}`).pipe(
      catchError(this.handleError)
    );
  }

  sendMessage(msg: Message): Observable<Message> {
    if (!msg.senderId || !msg.receiverId || !msg.text?.trim()) {
      return throwError(() => new Error('Champs manquants'));
    }
    return this.http.post<Message>(this.apiUrl, msg).pipe(
      catchError(this.handleError)
    );
  }

  onNewMessage(): Observable<Message> {
    return this.newMessageSubject.asObservable();
  }

  emitNewMessage(msg: Message) {
    this.newMessageSubject.next(msg);
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Erreur API messages :', error);
    return throwError(() => new Error(error.message || 'Erreur API'));
  }
  getOlderMessages(contactId: string, beforeDate: Date) {
    return this.http.get<Message[]>(`${this.apiUrl}/messages/older`, {
      params: {
        contactId,
        before: beforeDate.toISOString()
      }
    });
  }
  
}
