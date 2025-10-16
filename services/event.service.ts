import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EventItem {
  _id?: string;
  day: string;
  hour: string;
  endHour: string;
  title: string;
  coach: string;
  category: string;
  level: string;
  duration: number;
  description?: string; // <-- ajout du champ description

}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:3000/api/events';

  constructor(private http: HttpClient) {}

  getEvents(): Observable<EventItem[]> {
    return this.http.get<EventItem[]>(this.apiUrl);
  }

  addEvent(event: EventItem, file?: File): Observable<EventItem> {
    const formData = new FormData();
    Object.entries(event).forEach(([k, v]) => { if(v != null) formData.append(k, String(v)); });
    if (file) formData.append('image', file);
    return this.http.post<EventItem>(this.apiUrl, formData);
  }

  updateEvent(id: string, event: EventItem, file?: File): Observable<EventItem> {
    const formData = new FormData();
    Object.entries(event).forEach(([k, v]) => { if(v != null) formData.append(k, String(v)); });
    if (file) formData.append('image', file);
    return this.http.put<EventItem>(`${this.apiUrl}/${id}`, formData);
  }

  deleteEvent(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
