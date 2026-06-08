import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Match {
    _id?: string;

    // Équipes
    equipeDomicile: string;
    equipeExterieur: string;

    // Logos
    logoDom?: string;
    logoExt?: string;

    // Date / heure
    dateMatch: string;
    heureMatch?: string;

    // Lieu
    stade?: string;
    localisationMatch?: string;

    // Score
    scoreDomicile?: number;
    scoreExterieur?: number;

    // État du match
    enCours: boolean;
    statut?: string; // ex: "à venir", "terminé", "en cours"

    // Temps de jeu
    minute?: number;
    periode?: string;
    tempsAdditionnel?: number;

    // Infos UI
    compteRebours?: string;
    showInfos?: boolean;

    // Classification
    categorie?: string;
    typeMatch?: string;
    competition?: string; // ✅ ajouté (corrige ton erreur TS2339)

    // Métadonnées
    key?: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

@Injectable({
    providedIn: 'root'
})
export class MatchService {

    apiUrl = 'http://localhost:3000/api/matchs';

    constructor(private http: HttpClient) { }

    // ======================
    // GET ALL MATCHS
    // ======================
    getMatchs(): Observable<Match[]> {
        return this.http.get<Match[]>(this.apiUrl);
    }


    // ======================================
    // AJOUTER MATCH
    // ======================================

    createMatch(data: any): Observable<any> {

        return this.http.post(
            `${this.apiUrl}/create`,
            data
        );

    }

    // ======================================
    // RECUPERER MATCHS
    // ======================================

    getMatches(): Observable<any> {

        return this.http.get(this.apiUrl);

    }

}