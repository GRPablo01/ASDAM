import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { ActuService } from '../../../services/Actu.Service';

export interface Actu {
  _id: string;
  receiverId: string;
  text: string;
  date?: string | Date;
  createdAt?: string | Date;
  removing?: boolean;
}

@Component({
  selector: 'app-notif-actus',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notif-actus.html',
  styleUrls: ['./notif-actus.css']
})
export class NotifActus implements OnInit, OnDestroy {
  visibleActus: Actu[] = [];
  currentUserId: string = '';
  private pollingSubscription!: Subscription;

  constructor(private actuService: ActuService) {}

  ngOnInit(): void {
    const utilisateur = localStorage.getItem('utilisateur');
    if (!utilisateur) return;

    try {
      const user = JSON.parse(utilisateur);
      this.currentUserId = user._id || user.id || '';
    } catch {
      this.currentUserId = utilisateur;
    }

    // Restaurer notif visible après refresh si encore dans les 10s
    this.restoreVisibleActu();

    if (this.currentUserId) {
      this.pollingSubscription = interval(5000).subscribe(() => this.checkNewActus());
      this.checkNewActus();
    }
  }

  ngOnDestroy(): void {
    if (this.pollingSubscription) this.pollingSubscription.unsubscribe();
  }
  checkNewActus(): void {
    if (!this.currentUserId) return;
  
    this.actuService.getActus().subscribe(
      (data) => {
        if (!data || !data.length) return;
  
        // Liste des actus supprimées
        const removedActus: string[] = JSON.parse(localStorage.getItem('removedActus') || '[]');
  
        // Filtrer les actus supprimées
        const filteredData = data.filter(a => !removedActus.includes(a._id));
        if (!filteredData.length) return; // aucune actu à afficher
  
        // Prendre la plus récente après filtrage
        const latestRaw = filteredData.reduce((prev, curr) => {
          const prevDate = new Date(prev.date || new Date()).getTime();
          const currDate = new Date(curr.date || new Date()).getTime();
          return currDate > prevDate ? curr : prev;
        });
  
        if (!latestRaw?._id) return;
  
        const storedData = JSON.parse(localStorage.getItem('displayedActuData') || '{}');
        const lastDisplayedId = storedData.id;
  
        // Si on a déjà affiché ce dernier → ne rien faire
        if (lastDisplayedId === latestRaw._id) return;
  
        // Sinon, afficher le dernier
        localStorage.setItem('displayedActuData', JSON.stringify({ id: latestRaw._id, timestamp: Date.now() }));
        this.showActu(latestRaw, 10000);
      },
      (err) => console.error('❌ Erreur lors du chargement des actus', err)
    );
  }
  
  // Supprimer notif
  remove(id: string): void {
    this.visibleActus = this.visibleActus.filter(a => a._id !== id);
    localStorage.removeItem('visibleActu');
  
    // Marquer comme supprimée pour ne plus l'afficher
    const removedActus: string[] = JSON.parse(localStorage.getItem('removedActus') || '[]');
    if (!removedActus.includes(id)) {
      removedActus.push(id);
      localStorage.setItem('removedActus', JSON.stringify(removedActus));
    }
  }
  


  // Affiche la notification pour l’actu
  private showActu(actuRaw: any, duration: number): void {
    this.visibleActus = [{
      _id: actuRaw._id,
      receiverId: this.currentUserId,
      text: '📰 Nouvelle actu disponible !',
      createdAt: actuRaw.date || new Date(),
      removing: false
    }];

    // Sauvegarde pour persistance après refresh
    localStorage.setItem(
      'visibleActu',
      JSON.stringify({ actu: this.visibleActus[0], expiresAt: Date.now() + duration })
    );

    // Supprimer après durée
    setTimeout(() => {
      this.remove(this.visibleActus[0]._id);
    }, duration);
  }

  // Restaurer notif visible après refresh
  private restoreVisibleActu(): void {
    const saved = localStorage.getItem('visibleActu');
    if (!saved) return;

    try {
      const { actu, expiresAt } = JSON.parse(saved);
      const remaining = expiresAt - Date.now();
      if (remaining > 0) {
        this.visibleActus = [actu];
        setTimeout(() => this.remove(actu._id), remaining);
      } else {
        localStorage.removeItem('visibleActu');
      }
    } catch {
      localStorage.removeItem('visibleActu');
    }
  }

  // Animation de sortie
  animateAndRemove(id: string): void {
    const actu = this.visibleActus.find(a => a._id === id);
    if (!actu) return;
    actu.removing = true;
    setTimeout(() => this.remove(id), 300);
  }

  trackById(index: number, item: Actu): string {
    return item._id;
  }
}
