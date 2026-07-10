import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import {
  MatchService,
  Match2
} from '../../../../../Backend/Services/match.service';

import {
  EquipeService,
  Equipe
} from '../../../../../Backend/Services/equipe.Service';

import { Icon } from '../../icon/icon';
import { ThemeService } from '../../../../../Backend/Services/theme.service';


@Component({
  selector: 'app-detail-match',
  standalone: true,
  imports: [
    CommonModule,
    Icon
  ],
  templateUrl: './detail-match.html',
  styleUrl: './detail-match.css',
})
export class DetailMatch implements OnInit {


  // ======================================================
  // VARIABLES
  // ======================================================

  matchId: string = '';

  match: Match2 | null = null;

  loading: boolean = true;


  /**
   * Stockage des équipes
   * clé = nom équipe normalisé
   */
  equipesMap: Map<string, Equipe> = new Map();



  /**
   * Logo affiché uniquement si aucun logo trouvé
   */
  defaultLogo: string = 'assets/ImageDefaut.jpg';



  /**
   * Chemin serveur logos
   */
  private readonly LOGO_BASE_URL =
    'http://localhost:3000/uploads/equipe';



  // ======================================================
  // CONSTRUCTOR
  // ======================================================

  constructor(
    private route: ActivatedRoute,
    private matchService: MatchService,
    private equipeService: EquipeService,
    public themeService: ThemeService,
    private router: Router
  ) {}



  // ======================================================
  // INIT
  // ======================================================

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {

      const id = params.get('id');

      if (!id) {
        return;
      }


      this.matchId = id;

      this.loadMatch();

    });

  }



  // ======================================================
  // CHARGEMENT MATCH
  // ======================================================

  loadMatch(): void {

    this.loading = true;


    this.matchService.getMatchById(this.matchId)
      .subscribe({

        next: (data: Match2) => {

          this.match = data;


          /**
           * On charge les équipes avant d'afficher
           */
          this.loadTeamsLogos();

        },


        error: (err) => {

          console.error(
            'Erreur chargement match',
            err
          );

          this.loading = false;

        }

      });

  }




  // ======================================================
  // CHARGEMENT EQUIPES
  // ======================================================

  loadTeamsLogos(): void {


    this.equipeService.getTeams()
      .subscribe({

        next: (teams: Equipe[]) => {


          this.equipesMap.clear();



          teams.forEach((team: Equipe) => {


            if(team.nom){


              const key =
                this.normalizeName(team.nom);



              this.equipesMap.set(
                key,
                team
              );


            }


          });



          



          this.loading = false;


        },


        error: (err) => {


          console.error(
            'Erreur chargement équipes',
            err
          );


          this.loading = false;


        }

      });


  }





  // ======================================================
  // NORMALISATION NOM EQUIPE
  // ======================================================

  private normalizeName(value: string): string {

    return value
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g,'');

  }




  // ======================================================
  // HELPERS EQUIPES
  // ======================================================


  getEquipeByName(
    nom?: string
  ): Equipe | undefined {


    if(!nom){
      return undefined;
    }



    const key =
      this.normalizeName(nom);



    const equipe =
      this.equipesMap.get(key);



    



    return equipe;


  }





  getEquipeName(
    nom?: string
  ): string {


    const equipe =
      this.getEquipeByName(nom);



    return equipe?.nom
      ?? nom
      ?? 'Équipe inconnue';


  }





  getEquipeLogo(
    nom?: string
  ): string {



    const equipe =
      this.getEquipeByName(nom);



    /**
     * Logo par défaut seulement si :
     * - équipe inexistante
     * - logo vide
     */
    if(
      !equipe ||
      !equipe.logo ||
      equipe.logo.trim() === ''
    ){



      return this.defaultLogo;

    }





    const logo =
      equipe.logo.trim();




    const url =
      logo.startsWith('http')
        ? logo
        : `${this.LOGO_BASE_URL}/${logo}`;



    



    return url;


  }





  // ======================================================
  // MATCH HELPERS
  // ======================================================


  getDomEquipe(): string {


    return this.getEquipeName(
      this.match?.equipeDomicile
    );


  }





  getDomLogo(): string {


    return this.getEquipeLogo(
      this.match?.equipeDomicile
    );


  }





  getExtEquipe(): string {


    return this.getEquipeName(
      this.match?.equipeExterieur
    );


  }





  getExtLogo(): string {


    return this.getEquipeLogo(
      this.match?.equipeExterieur
    );


  }





  // ======================================================
  // RETOUR
  // ======================================================


  goBack(): void {

    this.router.navigate([
      '/mesmatch'
    ]);

  }





  // ======================================================
  // ERREUR IMAGE
  // ======================================================

  onImageError(event: Event): void {

    const img = event.target as HTMLImageElement;
  
  
    // évite une boucle infinie
    if (!img.src.includes(this.defaultLogo)) {
  
      console.error(
        '❌ Logo impossible à charger :',
        img.src
      );
  
      img.src = this.defaultLogo;
  
    }
  
  }


}