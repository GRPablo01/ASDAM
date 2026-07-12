import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Equipe {

    _id?: string;

    nom: string;

    categorie:
        | 'U6'
        | 'U7'
        | 'U8'
        | 'U9'
        | 'U10'
        | 'U11'
        | 'U12'
        | 'U13'
        | 'U13F'
        | 'U18'
        | 'U23'
        | 'SeniorA'
        | 'SeniorB'
        | 'SeniorD'
        | 'ALL';

    anneeCreation: number;

    logo: string;
}


@Injectable({
    providedIn: 'root'
})

export class EquipeService {


    apiUrl = 'http://localhost:3000/api/team';


    constructor(
        private http: HttpClient
    ) {}



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

    getTeams(): Observable<Equipe[]> {

        return this.http.get<Equipe[]>(
            this.apiUrl
        );

    }


}