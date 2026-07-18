import { Component, OnInit } from '@angular/core';
import { MatchService, Match2 } from '../../../../../Backend/Services/match.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-coup-envoi',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './coup-envoi.html',
  styleUrl: './coup-envoi.css',
})
export class CoupEnvoi implements OnInit {

  // ======================================================
  // VARIABLES
  // ======================================================

  matchs: Match2[] = [];

  matchAffiche?: Match2;

  equipeUtilisateur = '';

  isLoading = true;


  constructor(
    private matchService: MatchService
  ) {}


  // ======================================================
  // INIT
  // ======================================================

  ngOnInit(): void {

    this.recupererEquipeUtilisateur();

    this.chargerMatchs();

  }



  // ======================================================
  // RECUPERATION EQUIPE USER LOCALSTORAGE
  // ======================================================

  recupererEquipeUtilisateur(): void {

    const userStocke = localStorage.getItem('utilisateur');


    if (!userStocke) {

      console.warn('⚠️ Aucun utilisateur trouvé');

      return;

    }


    try {

      const user = JSON.parse(userStocke);


      /*
        Selon ton schema utilisateur,
        l'équipe peut être stockée sous :
        - equipe
        - categorie
        - equipeCategorie
      */

      this.equipeUtilisateur =
        user.equipe ||
        user.categorie ||
        user.equipeCategorie ||
        '';


      console.log(
        '⚽ Equipe utilisateur :',
        this.equipeUtilisateur
      );


    } catch(error) {

      console.error(
        '❌ Erreur lecture utilisateur',
        error
      );

    }

  }



  // ======================================================
  // RECUPERATION MATCHS
  // ======================================================

  chargerMatchs(): void {


    this.matchService.getMatches()
      .subscribe({

        next: (data) => {


          console.log(
            '✅ Tous les matchs :',
            data
          );


          this.matchs = data;


          this.selectionnerMatch();


          this.isLoading = false;


        },


        error: (err) => {

          console.error(
            '❌ Erreur récupération matchs',
            err
          );


          this.isLoading = false;

        }

      });


  }




  // ======================================================
// SELECTION MATCH DU JOUR OU PROCHAIN AVEC HEURE
// ======================================================

selectionnerMatch(): void {


  if (!this.equipeUtilisateur) {

    console.warn(
      '⚠️ Pas d\'équipe utilisateur'
    );

    return;

  }



  const maintenant = new Date();



  // ==================================================
  // FILTRE PAR CATEGORIE EQUIPE
  // ==================================================

  const matchsEquipe =
    this.matchs.filter(match =>

      match.categorie?.toLowerCase()
      ===
      this.equipeUtilisateur.toLowerCase()

    );



  console.log(
    '⚽ Matchs de mon équipe :',
    matchsEquipe
  );



  if(matchsEquipe.length === 0){

    console.warn(
      '⚠️ Aucun match trouvé'
    );

    this.matchAffiche = undefined;

    return;

  }




  // ==================================================
  // AJOUT DATE + HEURE POUR COMPARAISON
  // ==================================================

  const matchsAvecDateComplete =
    matchsEquipe.map(match => {


      const dateComplete =
        new Date(
          `${match.dateMatch}T${match.heureMatch || '00:00'}`
        );


      return {

        ...match,

        dateComplete

      };


    });





  console.log(
    '📅 Matchs avec date complète :',
    matchsAvecDateComplete
  );





  // ==================================================
  // MATCH DU JOUR ENCORE DISPONIBLE
  // ==================================================

  const matchDuJour = 
    matchsAvecDateComplete.find(match => {


      const dateMatch =
        match.dateComplete;



      return (

        dateMatch.getDate() === maintenant.getDate()
        &&
        dateMatch.getMonth() === maintenant.getMonth()
        &&
        dateMatch.getFullYear() === maintenant.getFullYear()

        &&

        dateMatch >= maintenant

      );


    });





  if(matchDuJour){


    this.matchAffiche =
      matchDuJour;


    console.log(
      '🔥 Match du jour trouvé :',
      this.matchAffiche
    );


    return;

  }






  // ==================================================
  // SINON PROCHAIN MATCH FUTUR
  // ==================================================

  const prochainMatch =

    matchsAvecDateComplete

    .filter(match =>

      match.dateComplete > maintenant

    )

    .sort((a,b) =>


      a.dateComplete.getTime()
      -
      b.dateComplete.getTime()


    )[0];





  if(prochainMatch){


    this.matchAffiche =
      prochainMatch;


    console.log(
      '📅 Prochain match :',
      this.matchAffiche
    );


  }
  else {


    console.warn(
      '⚠️ Aucun match à venir'
    );


    this.matchAffiche =
      undefined;


  }


}


// ======================================================
// MODIFICATION SCORE
// ======================================================

modifierScore(
  equipe: 'domicile' | 'exterieur',
  valeur: number
): void {


  if(!this.matchAffiche){
    return;
  }


  if(equipe === 'domicile'){


    this.matchAffiche.scoreDomicile =
      Math.max(
        0,
        (this.matchAffiche.scoreDomicile || 0) + valeur
      );


  }


  if(equipe === 'exterieur'){


    this.matchAffiche.scoreExterieur =
      Math.max(
        0,
        (this.matchAffiche.scoreExterieur || 0) + valeur
      );


  }



  // Sauvegarde MongoDB

  if(this.matchAffiche._id){


    this.matchService.updateMatch(
      this.matchAffiche._id,
      {

        scoreDomicile:
        this.matchAffiche.scoreDomicile,


        scoreExterieur:
        this.matchAffiche.scoreExterieur

      }

    )
    .subscribe({

      next:()=>{

        console.log(
          '✅ Score mis à jour'
        );

      },


      error:(err)=>{

        console.error(
          '❌ Erreur mise à jour score',
          err
        );

      }

    });


  }


}


}