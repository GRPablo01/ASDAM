import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Equipe {
    _id?: string;
    nom: string;
    ville?: string;
    logo: string;
}

@Injectable({
    providedIn: 'root'
})
export class EquipeService {

    apiUrl = 'http://localhost:3000/api/equipes';

    constructor(private http: HttpClient) {}



    // ======================================
    // AJOUTER
    // ======================================

    createTeam(data: FormData): Observable<any> {

        return this.http.post(
            `${this.apiUrl}/create`,
            data
        );

    }



    // ======================================
    // RECUPERER
    // ======================================

    getTeams(): Observable<any> {

        return this.http.get(this.apiUrl);

    }

}