import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { EventService, Evenement } from '../../../../../Backend/Services/event.Service';
import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { Icon } from '../../icon/icon';

@Component({
  selector: 'app-detail-event',
  standalone: true,
  imports: [
    CommonModule,
    Icon
  ],
  templateUrl: './detail-event.html',
  styleUrl: './detail-event.css',
})
export class DetailEvent implements OnInit {


  // ID récupéré depuis l'URL
  eventId: string | null = null;


  // Event affiché
  event: Evenement | null = null;


  // Chargement
  loading: boolean = true;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    public themeService: ThemeService,
  ) {}



  ngOnInit(): void {


    // Récupération ID URL
    this.route.paramMap.subscribe(params => {


      this.eventId = params.get('id');


      console.log(
        'ID événement récupéré :',
        this.eventId
      );


      if(this.eventId){
        this.loadEvent();
      }


    });


  }





  // =====================================================
  // 🔎 Récupération event
  // =====================================================

  loadEvent(){

    this.loading = true;


    this.eventService.getEvents()
    .subscribe({

      next:(events)=>{


        console.log(
          "Tous les événements :",
          events
        );


        this.event = events.find(
          e => e._id === this.eventId
        ) || null;



        console.log(
          "Événement trouvé :",
          this.event
        );


        this.loading = false;


      },


      error:(err)=>{

        console.error(
          "Erreur récupération events :",
          err
        );


        this.loading = false;

      }

    });


  }





  // =====================================================
  // 🖼️ Image
  // =====================================================

  getImage(){

    if(
      this.event?.image
    ){

      return this.event.image;

    }


    return 'assets/default-event.png';

  }





  // =====================================================
  // 🔙 Retour
  // =====================================================

  retour(){

    this.router.navigate(['/calendrier']);

  }



}