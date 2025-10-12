import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConvocationService, Convocation, User } from '../../../../../services/convocation.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-convoque-j',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './convoque-j.html',
  styleUrls: ['./convoque-j.css']
})
export class ConvoqueJ implements OnInit {

  convocations: Convocation[] = [];
  userInConvocations: Convocation[] = [];
  loading = false;
  error = '';
  userConnecte: User | null = null;
  backendUrl = 'http://localhost:3000';
  notificationMessage = '';

  constructor(
    private convocationService: ConvocationService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.recupererUtilisateur();
    this.chargerConvocations();
  }

  private recupererUtilisateur(): void {
    const userJson = localStorage.getItem('utilisateur');
    if (userJson) {
      try {
        this.userConnecte = JSON.parse(userJson) as User;
      } catch (e) {
        console.error('Erreur parsing utilisateur depuis localStorage', e);
        this.userConnecte = null;
      }
    }
  }

  private chargerConvocations(): void {
    this.loading = true;
    this.convocationService.getConvocations().subscribe({
      next: (data: Convocation[]) => {
        this.convocations = data;

        if (this.userConnecte) {
          if (this.userConnecte.role === 'coach') {
            this.userInConvocations = this.convocations.filter(conv =>
              conv.equipe === this.userConnecte!.equipe
            );
          } else {
            this.userInConvocations = this.convocations.filter(conv =>
              conv.joueurs.some(j => j.nom === this.userConnecte!.nom && j.prenom === this.userConnecte!.prenom)
            );
          }
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des convocations', err);
        this.error = 'Impossible de récupérer les convocations.';
        this.loading = false;
      }
    });
  }

  // Vérifie si l'utilisateur a déjà cliqué pour une convocation donnée
  hasAlreadyClickedForDate(dateConvocation: string | Date): boolean {
    if (!this.userConnecte) return false;

    // Convertir en chaîne si c'est une Date
    const dateStr = typeof dateConvocation === 'string'
      ? dateConvocation
      : dateConvocation.toISOString().split('T')[0]; // format "YYYY-MM-DD"

    const presenceKey = `presence_${this.userConnecte.nom}_${this.userConnecte.prenom}_${dateStr}`;
    return localStorage.getItem(presenceKey) === 'true';
  }

  updatePresence(conv: Convocation, present: boolean): void {
    if (!this.userConnecte?._id) return;
  
    // Convertir la date de convocation en string (YYYY-MM-DD)
    const dateConv = typeof conv.date === 'string'
      ? conv.date
      : conv.date.toISOString().split('T')[0];
  
    // Clé unique : nom + prénom + date
    const presenceKey = `presence_${this.userConnecte.nom}_${this.userConnecte.prenom}_${dateConv}`;
  
    // Si déjà répondu, on bloque le clic
    if (localStorage.getItem(presenceKey) === 'true') {
      this.notificationMessage = "Vous avez déjà répondu pour cette convocation.";
      setTimeout(() => (this.notificationMessage = ''), 3000);
      return;
    }
  
    // ✅ Mise à jour locale immédiate
    this.userConnecte.etatPresence = present ? 'present' : 'absent';
    this.userConnecte.hasClicked = true;
  
    // Enregistrer l'état pour cette convocation spécifique
    if (!this.userConnecte.hasClickedConv) this.userConnecte.hasClickedConv = {};
    this.userConnecte.hasClickedConv[conv._id!] = true;
  
    // Sauvegarde dans le localStorage (par date)
    localStorage.setItem(presenceKey, 'true');
  
    // ✅ Mise à jour du joueur dans la convocation
    conv.joueurs = conv.joueurs.map(j =>
      j._id === this.userConnecte!._id
        ? { ...j, etatPresence: this.userConnecte!.etatPresence, hasClicked: true }
        : j
    );
  
    // ✅ Mise à jour backend
    this.convocationService.updatePresence(conv._id!, this.userConnecte._id, present).subscribe({
      next: res => console.log('Mise à jour DB réussie ✅', res),
      error: err => console.error('Erreur mise à jour DB ❌', err)
    });
  
    // ✅ Envoi d'un mail au coach
    if (conv.mailCoach) {
      this.http.post(`${this.backendUrl}/api/confirmation`, {
        prenom: this.userConnecte.prenom,
        nom: this.userConnecte.nom,
        mailCoach: conv.mailCoach,
        match: conv.match,
        date: conv.date,
        lieu: conv.lieu,
        present
      }).subscribe({
        next: () => console.log('Mail envoyé au coach ✅'),
        error: err => console.error('Erreur envoi mail :', err)
      });
    }
  
    // ✅ Notification visuelle
    this.notificationMessage = present
      ? "Vous avez confirmé votre présence ✅"
      : "Vous avez indiqué votre absence ❌";
  
    setTimeout(() => (this.notificationMessage = ''), 3000);
  }
  

  // Détermine si les boutons doivent être actifs
  canClick(conv: Convocation): boolean {
    if (!this.userConnecte) return false;
  
    const dateConv = typeof conv.date === 'string'
      ? conv.date
      : conv.date.toISOString().split('T')[0];
  
    const presenceKey = `presence_${this.userConnecte.nom}_${this.userConnecte.prenom}_${dateConv}`;
    return localStorage.getItem(presenceKey) !== 'true';
  }
  

  getInitiales(joueur: any): string {
    return ((joueur.prenom?.charAt(0) || '') + (joueur.nom?.charAt(0) || '')).toUpperCase();
  }
}
