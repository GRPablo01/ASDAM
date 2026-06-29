import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ==========================================
// INTERFACE COMMUNIQUER (CORRIGÉE)
// ==========================================

export interface Communiquer {

  _id?: string;

  titre: string;

  message: string;

  // 🔥 MULTI-CATÉGORIES
  categories: string[];

  dateCreation?: Date;

}

@Injectable({
  providedIn: 'root'
})

export class CommuniquerService {

  apiUrl = 'http://localhost:3000/api/communiquer';

  constructor(private http: HttpClient) {}

  // ==========================================
  // AJOUTER COMMUNIQUÉ
  // ==========================================

  ajouterCommuniquer(data: Communiquer): Observable<any> {

    console.log('📤 Envoi API :', data);

    return this.http.post(this.apiUrl, data);

  }

}