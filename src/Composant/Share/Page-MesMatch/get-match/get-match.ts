import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { MatchService, Match2 } from '../../../../../Backend/Services/match.service';
import { EquipeService, Equipe } from '../../../../../Backend/Services/equipe.Service';
import { SeanceService, Seance } from '../../../../../Backend/Services/seance.service';

import { Icon } from '../../icon/icon';
import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-get-match',
  standalone: true,

  imports: [
    CommonModule,
    Icon
  ],

  templateUrl: './get-match.html',
  styleUrls: ['./get-match.css'],

  providers:[
    DatePipe
  ]

})


export class GetMatch implements OnInit {



  // ======================================================
  // MATCHS
  // ======================================================

  matches: Match2[] = [];



  // ======================================================
  // EQUIPES
  // ======================================================

  equipes: Equipe[] = [];




  // ======================================================
  // SEANCES AJOUT
  // ======================================================

  seances: Seance[] = [];

  




  isLoading = false;

  errorMessage = '';




  equipeMap: Map<string,string> = new Map();

  invalidLogos:Set<string> = new Set();



  private uploadBaseUrl =
  'http://localhost:3000/uploads/equipe/';





  // ======================================================
  // USER CONNECTE
  // ======================================================

  userEquipe:string='';

  userCategorie:string='';





  constructor(

    private matchService:MatchService,

    private equipeService:EquipeService,

    private seanceService:SeanceService,

    public themeService:ThemeService,

    private datePipe:DatePipe,
    private router: Router,

  ){}





  ngOnInit():void{


    this.loadUserFromStorage();


    this.loadData();


    this.loadSeances();


    this.buildCalendar();


  }





  // ======================================================
  // USER LOCAL STORAGE
  // ======================================================

  loadUserFromStorage():void{


    const user =
    JSON.parse(
      localStorage.getItem('utilisateur') || '{}'
    );



    this.userEquipe =
    user?.equipe || '';



    this.userCategorie =
    user?.categorie || '';



  }






  // ======================================================
  // FILTRE MATCHS
  // ======================================================

  get filteredMatches():Match2[]{


    return this.matches.filter(m=>{


      const matchCategorie =
      (m.categorie || '')
      .toUpperCase();



      const equipeUser =
      (this.userEquipe || '')
      .toUpperCase();



      return equipeUser === matchCategorie;



    });


  }







  // ======================================================
  // FILTRE SEANCES
  // ======================================================

  get filteredSeances():Seance[]{


    const equipeUser =
    (this.userEquipe || '')
    .toUpperCase()
    .trim();



    return this.seances.filter(s=>{


      const equipeSeance =
      (s.equipe || '')
      .toUpperCase()
      .trim();



      if(equipeSeance === 'ALL'){
        return true;
      }



      return equipeUser === equipeSeance;



    });


  }







  // ======================================================
  // LOAD MATCH + EQUIPES
  // ======================================================

  loadData():void{


    this.isLoading=true;


    this.errorMessage='';




    this.equipeService.getTeams()
    .subscribe({


      next:(teams:Equipe[])=>{


        this.equipes=teams;


        this.equipeMap.clear();




        teams.forEach(e=>{


          if(e.nom && e.logo){


            this.equipeMap.set(

              e.nom
              .toLowerCase()
              .trim(),

              this.buildLogoUrl(e.logo)

            );


          }



        });






        this.matchService.getMatches()
        .subscribe({


          next:(data:Match2[])=>{


            this.matches=data || [];


            this.isLoading=false;



          },



          error:(err)=>{


            console.error(err);


            this.errorMessage =
            'Erreur chargement matchs';


            this.isLoading=false;


          }


        });



      },



      error:(err)=>{


        console.error(err);


        this.errorMessage =
        'Erreur chargement équipes';


        this.isLoading=false;


      }



    });



  }







  // ======================================================
  // LOAD SEANCES
  // ======================================================

  loadSeances():void{


    this.seanceService.getSeances()
    .subscribe({


      next:(data:Seance[])=>{


        this.seances =
        data || [];



      },


      error:(err)=>{


        console.error(
          'Erreur séances',
          err
        );


      }


    });



  }







  // ======================================================
  // FORMAT DATE
  // ======================================================

  formatDateFr(date:string|Date):string{


    if(!date)
      return '';



    return this.datePipe.transform(

      date,

      'dd MMM yyyy',

      undefined,

      'fr-FR'

    ) || '';



  }







  // ======================================================
  // LOGOS
  // ======================================================

  buildLogoUrl(logo:string):string{


    if(!logo)
      return '';



    if(logo.startsWith('http'))
      return logo;



    return this.uploadBaseUrl + logo;



  }





  getLogo(nomEquipe:string):string{


    if(!nomEquipe)
      return '';



    return this.equipeMap.get(

      nomEquipe
      .toLowerCase()
      .trim()

    ) || '';



  }







  handleImageError(
    event:Event,
    equipeName:string
  ):void{


    const target =
    event.target as HTMLImageElement;



    target.style.display='none';



    this.invalidLogos.add(

      equipeName
      .toLowerCase()
      .trim()

    );



  }







  hasInvalidLogo(
    nomEquipe:string
  ):boolean{


    return this.invalidLogos.has(

      nomEquipe
      .toLowerCase()
      .trim()

    );


  }







  // ======================================================
  // STATS MATCHS
  // ======================================================


  getMatchsEnCours():number{


    return this.filteredMatches
    .filter(
      m=>m.statut==='EN_COURS'
    )
    .length;


  }



  getMatchsTermines():number{


    return this.filteredMatches
    .filter(
      m=>m.statut==='TERMINE'
    )
    .length;


  }



  getMatchsAVenir():number{


    return this.filteredMatches
    .filter(
      m=>m.statut==='A_VENIR'
    )
    .length;


  }






  // ======================================================
  // STATS SEANCES
  // ======================================================


  getSeancesAujourdHui():number{


    const today =
    new Date();



    return this.filteredSeances
    .filter(s=>

      this.isSameDay(
        new Date(s.date),
        today
      )

    )
    .length;


  }





  getSeancesAVenir():number{


    return this.filteredSeances
    .filter(s=>

      new Date(s.date)>new Date()

    )
    .length;


  }





  getSeancesTotal():number{


    return this.filteredSeances.length;


  }






  // ======================================================
  // INITIALES
  // ======================================================

  getInitiales(nom:string):string{


    if(!nom)
      return '';



    return nom
    .split(' ')
    .map(
      p=>p.charAt(0).toUpperCase()
    )
    .join('')
    .slice(0,2);


  }







  // ======================================================
  // CALENDRIER
  // ======================================================


  currentMonth:Date=new Date();

  calendarDays:Date[]=[];




  buildCalendar():void{


    const year =
    this.currentMonth.getFullYear();



    const month =
    this.currentMonth.getMonth();



    const start =
    new Date(year,month,1);



    const end =
    new Date(year,month+1,0);



    this.calendarDays=[];



    for(
      let d=new Date(start);
      d<=end;
      d.setDate(d.getDate()+1)
    ){


      this.calendarDays.push(
        new Date(d)
      );


    }



  }






  previousMonth():void{


    this.currentMonth =
    new Date(
      this.currentMonth.setMonth(
        this.currentMonth.getMonth()-1
      )
    );


    this.buildCalendar();


  }






  nextMonth():void{


    this.currentMonth =
    new Date(
      this.currentMonth.setMonth(
        this.currentMonth.getMonth()+1
      )
    );


    this.buildCalendar();


  }






  isSameDay(
    d1:Date,
    d2:Date
  ):boolean{


    return (

      d1.getFullYear()
      ===
      d2.getFullYear()

      &&

      d1.getMonth()
      ===
      d2.getMonth()

      &&

      d1.getDate()
      ===
      d2.getDate()

    );


  }




  // ======================================================
// ACTIVITES DU JOUR (MATCH + SEANCE)
// ======================================================

getActivitesByDate(date:Date){


  const seances = this.getSeancesByDate(date).map(seance => ({

    ...seance,

    type:'seance',

    heureTri:seance.heure

  }));





  const matchs = this.getMatchesByDate(date).map(match => ({

    ...match,

    type:'match',

    heureTri:match.heureMatch || '23:59'

  }));






  return [

    ...seances,

    ...matchs

  ].sort((a:any,b:any)=>{


    return a.heureTri.localeCompare(b.heureTri);


  });



}



  getMatchesByDate(date:Date):Match2[]{


    return this.filteredMatches.filter(m=>{


      if(!m.dateMatch)
        return false;



      return this.isSameDay(

        new Date(m.dateMatch),

        date

      );



    });


  }






  // ======================================================
  // SEANCES CALENDRIER
  // ======================================================


  getSeancesByDate(date:Date):Seance[]{


    return this.filteredSeances.filter(s=>{


      if(!s.date)
        return false;



      return this.isSameDay(

        new Date(s.date),

        date

      );



    });


  }



  // ===================================
// OUVRIR UNE SEANCE
// ===================================
openSeance(seance: any): void {

  if (!seance?._id) return;

  this.router.navigate(['/seance', seance._id]);

}

// ===================================
// OUVRIR UN MATCH
// ===================================
openMatch(match: any): void {

  if (!match?._id) return;

  this.router.navigate(['/match', match._id]);

}

}