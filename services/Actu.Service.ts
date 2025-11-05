import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Actu {
  _id: string;
  text: string;
  date?: string | Date;
}

@Injectable({
  providedIn: 'root'
})
export class ActuService {
  private apiUrl = 'http://localhost:3000/api/posts'; // <== Remplace par ton URL API

  constructor(private http: HttpClient) {}

  getActus(): Observable<Actu[]> {
    return this.http.get<Actu[]>(this.apiUrl);
  }
}
