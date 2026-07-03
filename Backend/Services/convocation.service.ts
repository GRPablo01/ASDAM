import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  Observable,
  switchMap,
  map
} from 'rxjs';

/* =========================================================
   INTERFACE JOUEUR
   ========================================================= */

export interface Joueur {

  _id?: string;

  key: string;

  prenom: string;

  nom: string;

  email?: string;

  present: 'oui' | 'non' | 'non_repondu';

}

/* =========================================================
   INTERFACE CONVOCATION
   ========================================================= */

export interface Convocation {

  _id?: string;

  key: string;

  joueurs: Joueur[];

  // Équipe principale
  equipe: string;

  // 🔥 NOUVEAUX CHAMPS
  equipeDom: string;

  equipeExt: string;

  TypeCompetition: string;

  // Match
  match: string;

  // Date
  dateMatch: string;

  // Lieu
  lieu: string;

  // UI
  statut?: string;

  isRead?: boolean;

  expanded?: boolean;

  isLoading?: boolean;

}

/* =========================================================
   SERVICE
   ========================================================= */

@Injectable({
  providedIn: 'root'
})

export class ConvocationService {

  /* =========================================================
     API URL
     ========================================================= */

  private apiUrl =
    'http://localhost:3000/api/convocation';

  private logUrl =
    'http://localhost:3000/api/logs';

  constructor(
    private http: HttpClient
  ) {}

  /* =========================================================
     USER CONNECTÉ
     ========================================================= */

  private getCurrentUser(): any {

    return JSON.parse(
      localStorage.getItem('utilisateur') || '{}'
    );

  }

  /* =========================================================
     GET ALL CONVOCATIONS
     ========================================================= */

  getConvocations(): Observable<Convocation[]> {

    return this.http.get<Convocation[]>(
      this.apiUrl
    );

  }

  /* =========================================================
     GET CONVOCATION BY ID
     ========================================================= */

  getConvocationById(
    id: string
  ): Observable<Convocation> {

    return this.http.get<Convocation>(
      `${this.apiUrl}/${id}`
    );

  }

  /* =========================================================
     CREATE CONVOCATION + LOG
     ========================================================= */

  createConvocation(
    convocation: Convocation
  ): Observable<any> {

    const user = this.getCurrentUser();

    return this.http.post<Convocation>(
      this.apiUrl,
      convocation
    ).pipe(

      switchMap((createdConvocation) => {

        const logData = {

          user:
            `${user.prenom || 'Inconnu'} ${user.nom || ''}`,

          role:
            user.role || 'unknown',

          action:
            'CREATE_CONVOCATION',

          description:
            `${user.role || 'Utilisateur'} a créé une convocation : ` +
            `${createdConvocation.equipeDom} vs ${createdConvocation.equipeExt} ` +
            `(${createdConvocation.TypeCompetition})`,

          type:
            'CREATE',

          field:
            'convocation',

          newValue:
            createdConvocation,

          date:
            new Date()

        };

        return this.http.post(
          this.logUrl,
          logData
        ).pipe(

          map(() => createdConvocation)

        );

      })

    );

  }

  /* =========================================================
     UPDATE CONVOCATION + LOG
     ========================================================= */

  updateConvocation(
    id: string,
    data: any
  ): Observable<any> {

    const user = this.getCurrentUser();

    return this.http.put(
      `${this.apiUrl}/${id}`,
      data
    ).pipe(

      switchMap((updatedConvocation: any) => {

        const logData = {

          user:
            `${user.prenom || 'Inconnu'} ${user.nom || ''}`,

          role:
            user.role || 'unknown',

          action:
            'UPDATE_CONVOCATION',

          description:
            `${user.role || 'Utilisateur'} a modifié une convocation : ` +
            `${updatedConvocation.equipeDom || data.equipeDom} vs ` +
            `${updatedConvocation.equipeExt || data.equipeExt}`,

          type:
            'UPDATE',

          field:
            'convocation',

          newValue:
            updatedConvocation,

          date:
            new Date()

        };

        return this.http.post(
          this.logUrl,
          logData
        ).pipe(

          map(() => updatedConvocation)

        );

      })

    );

  }

  /* =========================================================
     UPDATE STATUT JOUEUR
     ========================================================= */

  updateStatut(
    convocationId: string,
    joueurId: string,
    present: string
  ): Observable<any> {

    return this.http.put(

      `${this.apiUrl}/${convocationId}/joueur/${joueurId}`,

      { present }

    );

  }

  /* =========================================================
     DELETE CONVOCATION + LOG
     ========================================================= */

  deleteConvocation(
    id: string
  ): Observable<any> {

    const user = this.getCurrentUser();

    return this.http.get<Convocation>(
      `${this.apiUrl}/${id}`
    ).pipe(

      switchMap((convocation) => {

        return this.http.delete(
          `${this.apiUrl}/${id}`
        ).pipe(

          switchMap((deleted) => {

            const logData = {

              user:
                `${user.prenom || 'Inconnu'} ${user.nom || ''}`,

              role:
                user.role || 'unknown',

              action:
                'DELETE_CONVOCATION',

              description:
                `${user.role || 'Utilisateur'} a supprimé une convocation : ` +
                `${convocation.equipeDom} vs ${convocation.equipeExt}`,

              type:
                'DELETE',

              field:
                'convocation',

              oldValue:
                convocation,

              date:
                new Date()

            };

            return this.http.post(
              this.logUrl,
              logData
            ).pipe(

              map(() => deleted)

            );

          })

        );

      })

    );

  }

}