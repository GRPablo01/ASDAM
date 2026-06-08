import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Evenement {
  _id?: string;
  titre: string;
  date: string;
  description : string;
  lieu : string;
  heureDebut : string;
  heureFin : string;
  image?: string;
  categorie : string;
  status : string;
  
}

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private apiUrl = 'http://localhost:3000/api/events';

  constructor(private http: HttpClient) {}

  createEvent(data: any): Observable<Evenement> {
    return this.http.post<Evenement>(this.apiUrl, data);
  }

  getEvents(): Observable<Evenement[]> {
    return this.http.get<Evenement[]>(this.apiUrl);
  }

  deleteEvent(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}