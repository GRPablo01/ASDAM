import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import {
  Seance,
  SeanceService,
} from '../../../../../Backend/Services/seance.service';
import { Icon } from '../../icon/icon';
import { ThemeService } from '../../../../../Backend/Services/theme.service';



// ======================================================
// INTERFACE JOUEUR (pour le typage des données populées)
// ======================================================
interface JoueurPopule {
  _id: string;
  nom?: string;
  prenom?: string;
  email?: string;
}


@Component({
  selector: 'app-detail-seance',
  standalone: true,
  imports: [
    CommonModule,
    Icon
  ],
  templateUrl: './detail-seance.html',
  styleUrl: './detail-seance.css',
})
export class DetailSeance implements OnInit {


  // ======================================================
  // VARIABLES
  // ======================================================

  seanceId: string = '';

  seance: Seance | null = null;

  loading: boolean = true;


  role: string = '';

  user: any = null;


  // ✅ ID MongoDB de l'utilisateur connecté (pour l'envoi au backend)
  monId: string = '';

 

  monStatut: 'present' | 'absent' | null = null;



  // ======================================================
  // CONSTRUCTOR
  // ======================================================

  constructor(
    private route: ActivatedRoute,
    private seanceService: SeanceService,
    public themeService: ThemeService,
    private router: Router
  ) {}




// ======================================================
// INIT
// ======================================================
ngOnInit(): void {

  // console.log('🚀 === ngOnInit() démarré ===');

  this.loadUser();

  // console.log('🆔 monId JUSTE APRÈS loadUser():', JSON.stringify(this.monId));

  this.route.paramMap.subscribe(params => {

    const id = params.get('id');

    // console.log('📡 Paramètre route ID:', id);
    // console.log('🆔 monId DANS route.subscribe:', JSON.stringify(this.monId));

    if (!id) {
      console.log('❌ Pas d\'ID dans les paramètres de route');
      this.loading = false;
      return;
    }

    this.seanceId = id;

    // console.log('✅ ID séance enregistré :', this.seanceId);
    // console.log('🏷️ Mon nom affiché : PabloVIP Garcia');
    // console.log('🆔 this.monId AVANT loadSeance:', JSON.stringify(this.monId), '| truthy:', !!this.monId);

    this.loadSeance();

    // console.log('🆔 this.monId APRÈS loadSeance:', JSON.stringify(this.monId), '| truthy:', !!this.monId);

  });

  // console.log('🏁 === ngOnInit() terminé ===');

}

// ======================================================
// UTILISATEUR CONNECTÉ
// ======================================================

loadUser(): void {

  const roleStorage = localStorage.getItem('utilisateur');

  if (roleStorage) {
    this.role = roleStorage;
  }

  const userStorage = localStorage.getItem('utilisateur');

  // console.log('📦 raw localStorage utilisateur:', userStorage);

  if (userStorage) {

    try {

      this.user = JSON.parse(userStorage);

      // console.log('👤 user parsé:', this.user);
      // console.log('🔍 this.user._id:', this.user?._id);
      // console.log('🔍 this.user.id:', this.user?.id);
      // console.log('🔍 this.user.userId:', this.user?.userId);
      // console.log('🔍 this.user.sub:', this.user?.sub);
      // console.log('🔍 Object.keys(this.user):', Object.keys(this.user || {}));

      // ✅ Récupérer l'ID MongoDB de l'utilisateur
      this.monId = this.user._id || this.user.id || this.user.userId || this.user.sub || '';

      // console.log('🆔 monId APRÈS extraction:', JSON.stringify(this.monId));

      // ✅ Récupérer le nom/prénom pour l'affichage
      this.monId = this.user.prenom
        ? `${this.user.prenom} ${this.user.nom || ''}`.trim()
        : (this.user.nom || 'Moi');

      // console.log('🏷️ Mon nom affiché :', this.monId);

      if (this.user.role) {
        this.role = this.user.role;
      }

    }
    catch (error) {
      console.error('❌ Erreur parsing utilisateur', error);
    }

  }

  // console.log('🔐 Rôle final :', this.role);
  // console.log('🆔 monId final:', JSON.stringify(this.monId));

}



  // ======================================================
  // CHARGEMENT SEANCE
  // ======================================================


  loadSeance(): void {

    // console.log(
    //   '📡 Chargement séance ID :',
    //   this.seanceId
    // );

    this.loading = true;

    this.seanceService
      .getSeanceById(this.seanceId)
      .subscribe({

        next: (data: Seance) => {

          this.seance = data;
          this.loading = false;
          this.verifierMonStatut();

        },

        error: (err) => {
          console.error('❌ Erreur récupération séance :', err);
          this.loading = false;
        }

      });

  }




  // ======================================================
  // VERIFIER STATUT JOUEUR
  // ======================================================
  verifierMonStatut() {

    if (!this.seance) return;
    if (!this.monId) return;

    // ✅ Vérifier avec l'ID MongoDB (les données sont populées = objets)
    const presentIds = this.extraireIds(this.seance.joueursPresent ?? []);
    const absentIds = this.extraireIds(this.seance.joueursNonPresent ?? []);

    if (presentIds.includes(this.monId)) {
      this.monStatut = 'present';
    }
    else if (absentIds.includes(this.monId)) {
      this.monStatut = 'absent';
    }
    else {
      this.monStatut = null;
    }

  }




  // ======================================================
  // HELPER : Extraire les IDs d'un tableau de joueurs
  // (gère à la fois les ObjectId strings et les objets populés)
  // ======================================================

  extraireIds(joueurs: any[]): string[] {
    if (!Array.isArray(joueurs)) return [];

    return joueurs.map(j => {
      // Si c'est un objet populé (avec _id)
      if (j && typeof j === 'object' && j._id) {
        return String(j._id);
      }
      // Si c'est déjà un string (ObjectId)
      if (typeof j === 'string') {
        return j;
      }
      return '';
    }).filter(id => id !== '');
  }




  // ======================================================
  // HELPER : Vérifier si je suis dans une liste
  // ======================================================

  suisDansListe(liste: any[]): boolean {
    if (!this.monId || !Array.isArray(liste)) return false;
    const ids = this.extraireIds(liste);
    return ids.includes(this.monId);
  }




  // ======================================================
  // ROLES
  // ======================================================


  get isAdmin() {
    return this.role === 'admin';
  }


  get isCoach() {
    return this.role === 'coach';
  }


  get isSuperAdmin() {
    return this.role === 'superadmin';
  }


  get isJoueur() {
    return this.role === 'joueur';
  }





  // ======================================================
  // RETOUR
  // ======================================================


  goBack() {
    this.router.navigate(['/mesmatch']);
  }


  // ======================================================
  // DISPONIBLE
  // ======================================================
  marquerDisponible(): void {

    // console.log('🟢 === marquerDisponible() appelé ===');

    if (!this.seance || !this.seance._id || !this.monId) {
      // console.log('❌ Sortie précoce — seance, _id ou monId manquant');
      // console.log('   this.seance:', this.seance);
      // console.log('   this.seance?._id:', this.seance?._id);
      // console.log('   this.monId:', this.monId);
      return;
    }

    this.seance.joueursNonPresent ??= [];
    this.seance.joueursPresent ??= [];

    // ✅ Retirer mon ID de la liste des absents
    this.seance.joueursNonPresent =
      this.seance.joueursNonPresent
        .filter(j => {
          const id = this.extraireId(j);
          return id !== this.monId;
        });

    // ✅ Ajouter mon ID à la liste des présents (uniquement l'ID string)
    const presentIds = this.extraireIds(this.seance.joueursPresent);
    if (!presentIds.includes(this.monId)) {
      this.seance.joueursPresent.push(this.monId as any);
    }

    this.monStatut = 'present';

    // console.log('🏷️ Mon nom affiché : PabloVIP Garcia → 🟢 TABLEAU VERT (Présents)');

    this.sauvegarderSeance();

  }

  // ======================================================
  // INDISPONIBLE
  // ======================================================
  marquerIndisponible(): void {

    // console.log('🔴 === marquerIndisponible() appelé ===');

    if (!this.seance || !this.seance._id || !this.monId) {
      // console.log('❌ Sortie précoce — seance, _id ou monId manquant');
      // console.log('   this.seance:', this.seance);
      // console.log('   this.seance?._id:', this.seance?._id);
      // console.log('   this.monId:', this.monId);
      return;
    }

    this.seance.joueursPresent ??= [];
    this.seance.joueursNonPresent ??= [];

    // ✅ Retirer mon ID de la liste des présents
    this.seance.joueursPresent =
      this.seance.joueursPresent
        .filter(j => {
          const id = this.extraireId(j);
          return id !== this.monId;
        });

    // ✅ Ajouter mon ID à la liste des absents (uniquement l'ID string)
    const absentIds = this.extraireIds(this.seance.joueursNonPresent);
    if (!absentIds.includes(this.monId)) {
      this.seance.joueursNonPresent.push(this.monId as any);
    }

    this.monStatut = 'absent';

    // console.log('🏷️ Mon nom affiché : PabloVIP Garcia → 🔴 TABLEAU ROUGE (Absents)');

    this.sauvegarderSeance();

  }




  // ======================================================
  // HELPER : Extraire un ID unique
  // ======================================================

  extraireId(joueur: any): string {
    if (!joueur) return '';
    if (typeof joueur === 'string') return joueur;
    if (typeof joueur === 'object' && joueur._id) return String(joueur._id);
    return '';
  }



    // ======================================================
  // SAUVEGARDE
  // ======================================================

  sauvegarderSeance() {

    if (!this.seance?._id) return;

    // ✅ Préparer les données à envoyer (uniquement les IDs, pas les objets populés)
    const dataToSend = {
      ...this.seance,
      // S'assurer qu'on envoie uniquement des strings d'ObjectId
      joueursPresent: this.extraireIds(this.seance.joueursPresent ?? []),
      joueursNonPresent: this.extraireIds(this.seance.joueursNonPresent ?? []),
    };

    this.seanceService
      .updateSeance(this.seance._id, dataToSend)
      .subscribe({

        next: (response) => {
          // Recharger la séance pour récupérer les données populées à jour
          this.loadSeance();
        },

        error: (err) => {
          console.error('❌ Erreur update MongoDB :', err);
        }

      });

  }


}