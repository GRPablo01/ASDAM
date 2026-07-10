import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SeanceService } from '../../../../../Backend/Services/seance.service';
import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { Router } from '@angular/router';
import { Icon } from '../../icon/icon';



@Component({
  selector: 'app-add-seance',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    Icon
  ],

  templateUrl: './add-seance.html',
  styleUrl: './add-seance.css',
})


export class AddSeance {



  // ============================
  // CHAMPS FORMULAIRE
  // ============================

  titre = '';

  description = '';

  date = '';

  heure = '';

  lieu = '';

  categorie = 'Entraînement';



  // ============================
  // EQUIPE
  // ============================

  equipe:
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
    | 'ALL'
    = 'ALL';



  equipes = [
    'U6',
    'U7',
    'U8',
    'U9',
    'U10',
    'U11',
    'U12',
    'U13',
    'U13F',
    'U18',
    'U23',
    'SeniorA',
    'SeniorB',
    'SeniorD',
    'ALL'
  ];





  // ============================
  // JOUEURS
  // ============================

  // ✅ Joueurs présents
  joueursPresent: string[] = [];


  // ✅ Joueurs absents
  joueursNonPresent: string[] = [];



  // Exemple temporaire
  // A remplacer par tes joueurs venant de MongoDB
  joueurs = [
    {
      id: '1',
      nom: 'Dupont',
      prenom: 'Lucas'
    },
    {
      id: '2',
      nom: 'Martin',
      prenom: 'Paul'
    }
  ];






  // ============================
  // NOTIFICATION
  // ============================

  showNotification = false;

  notificationMessage = '';



  loading = false;





  constructor(

    private seanceService: SeanceService,

    public themeService: ThemeService,

    private router: Router

  ) {}









  // ============================
  // AJOUT / RETRAIT JOUEUR
  // ============================


  togglePresence(joueurId:string){



    // Si déjà présent
    if(this.joueursPresent.includes(joueurId)){


      this.joueursPresent =
        this.joueursPresent.filter(
          id => id !== joueurId
        );



      this.joueursNonPresent.push(joueurId);


      return;

    }




    // Sinon présent
    this.joueursNonPresent =
      this.joueursNonPresent.filter(
        id => id !== joueurId
      );



    this.joueursPresent.push(joueurId);



  }








  // ============================
  // CREATION SEANCE
  // ============================

  createSeance(){



    this.loading = true;




    const seance = {


      titre:this.titre,


      description:this.description,


      date:this.date,


      heure:this.heure,


      lieu:this.lieu,


      categorie:this.categorie,



      // ✅ Equipe
      equipe:this.equipe,



      // ✅ Joueurs envoyés au backend
      joueursPresent:this.joueursPresent,


      joueursNonPresent:this.joueursNonPresent


    };







    this.seanceService
      .createSeance(seance)

      .subscribe({



        next:(response)=>{



          console.log(
            "Séance créée :",
            response
          );



          this.showToast(
            "La séance a été créée avec succès"
          );



          this.resetForm();



          this.loading=false;



        },







        error:(error)=>{



          console.error(
            "Erreur création séance :",
            error
          );



          this.notificationMessage =
          "Erreur lors de la création de la séance";



          this.showNotification=true;



          setTimeout(()=>{


            this.showNotification=false;


          },4000);




          this.loading=false;



        }



      });



  }









  // ============================
  // RESET FORMULAIRE
  // ============================

  resetForm(){



    this.titre='';


    this.description='';


    this.date='';


    this.heure='';


    this.lieu='';


    this.categorie='Entraînement';



    this.equipe='ALL';



    // ✅ Reset joueurs
    this.joueursPresent=[];


    this.joueursNonPresent=[];



  }








  // ======================================================
  // BACK
  // ======================================================

  goBack():void{


    this.router.navigate(['/dashboard']);


  }







  // ======================================================
  // TOAST
  // ======================================================

  showToast(message:string){


    this.notificationMessage=message;


    this.showNotification=true;



    setTimeout(()=>{


      this.showNotification=false;


    },3000);


  }






  closeNotification(){


    this.showNotification=false;


  }



}