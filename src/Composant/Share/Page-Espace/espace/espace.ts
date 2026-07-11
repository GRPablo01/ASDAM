import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeanceService, Seance } from '../../../../../Backend/Services/seance.service';
import { MatchService, Match2 } from '../../../../../Backend/Services/match.service';
import { EventService, Evenement } from '../../../../../Backend/Services/event.Service';
import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { Icon } from '../../icon/icon';


@Component({
  selector: 'app-espace',
  standalone: true,
  imports: [
    CommonModule,
    Icon
  ],
  templateUrl: './espace.html',
  styleUrl: './espace.css',
})
export class Espace implements OnInit {


  // ================================
  // DONNEES
  // ================================

  seances: Seance[] = [];
  matchs: Match2[] = [];
  evenements: Evenement[] = [];


  // ================================
  // PROCHAIN ELEMENT
  // ================================

  prochaineSeance!: Seance | null;
  prochainMatch!: Match2 | null;
  prochainEvenement!: Evenement | null;



  // ================================
  // ROLE USER
  // ================================

  roleUser: string = '';



  // ================================
  // LOADING
  // ================================

  loadingSeances = true;
  loadingMatchs = true;
  loadingEvents = true;



  constructor(
    private seanceService: SeanceService,
    private matchService: MatchService,
    private eventService: EventService,
    public themeService: ThemeService,
  ) {}





  ngOnInit(): void {


    // récupération du rôle connecté
    this.getRoleUser();



    // Tous les rôles voient :
    // Match + Event

    this.getAllMatchs();

    this.getAllEvenements();



    // Seulement joueur + entraineur voient les séances

    if(
      this.roleUser === 'joueur' ||
      this.roleUser === 'entraineur' ||
      this.roleUser === 'coach'
    ){

      this.getAllSeances();

    }else{


      // évite le chargement infini côté HTML

      this.loadingSeances=false;

      this.prochaineSeance=null;

    }


  }







  // =====================================
  // RECUPERATION ROLE LOCALSTORAGE
  // =====================================

  getRoleUser():void{


    const user = localStorage.getItem('utilisateur');


    if(user){

      try{

        const data = JSON.parse(user);

        this.roleUser = data.role || '';

        console.log(
          "👤 Role connecté :",
          this.roleUser
        );


      }catch(error){

        console.error(
          "Erreur lecture utilisateur",
          error
        );

      }

    }


  }







  // =====================================
  // PROCHAINE DATE
  // =====================================

  getProchaineDate<T>(
    liste:T[],
    getDate:(item:T)=>string
  ):T|null {


    const aujourdHui = new Date();



    return liste

      .filter(item=>{


        const dateItem = new Date(getDate(item));


        return dateItem >= aujourdHui;


      })



      .sort((a,b)=>{


        return (

          new Date(getDate(a)).getTime()

          -

          new Date(getDate(b)).getTime()

        );


      })[0] || null;


  }









  // =====================================
  // SEANCES
  // =====================================

  getAllSeances():void{


    this.seanceService.getSeances()

    .subscribe({

      next:(data)=>{


        this.seances=data;



        this.prochaineSeance =

        this.getProchaineDate(

          data,

          (s:any)=>s.date

        );



        this.loadingSeances=false;



        console.log(
          "📅 Prochaine séance",
          this.prochaineSeance
        );


      },


      error:(err)=>{


        console.error(err);


        this.loadingSeances=false;


      }


    });


  }









  // =====================================
  // MATCHS
  // =====================================

  getAllMatchs():void{


    this.matchService.getMatches()

    .subscribe({

      next:(data)=>{


        this.matchs=data;



        this.prochainMatch =

        this.getProchaineDate(

          data,

          (m:any)=>m.date

        );



        this.loadingMatchs=false;



        console.log(
          "⚽ Prochain match",
          this.prochainMatch
        );


      },


      error:(err)=>{


        console.error(err);


        this.loadingMatchs=false;


      }


    });


  }









  // =====================================
  // EVENEMENTS
  // =====================================

  getAllEvenements():void{


    this.eventService.getEvents()

    .subscribe({

      next:(data)=>{


        this.evenements=data;



        this.prochainEvenement =

        this.getProchaineDate(

          data,

          (e:any)=>e.date

        );



        this.loadingEvents=false;



        console.log(
          "🎉 Prochain événement",
          this.prochainEvenement
        );


      },


      error:(err)=>{


        console.error(err);


        this.loadingEvents=false;


      }


    });


  }



}