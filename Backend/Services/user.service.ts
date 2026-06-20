import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // 👉 adapte si ton backend tourne ailleurs
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  // ======================================================
  // 🔥 GET ALL USERS
  // ======================================================
  getAllUsers(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // ======================================================
  // 🔥 GET USER BY ID
  // ======================================================
  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // ======================================================
  // 🔥 UPDATE USER
  // ======================================================
  updateUser(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // ======================================================
  // 🗑️ DELETE USER
  // ======================================================
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}