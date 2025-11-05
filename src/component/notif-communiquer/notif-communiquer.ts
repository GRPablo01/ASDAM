import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { CommuniqueService } from '../../../services/communique.service';

export interface Communique {
  _id: string;
  receiverId: string;
  text: string;
  date?: string | Date;
  createdAt?: string | Date;
  removing?: boolean;
}

@Component({
  selector: 'app-notif-communiquer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notif-communiquer.html',
  styleUrls: ['./notif-communiquer.css']
})
export class NotifCommunique implements OnInit, OnDestroy {
  visibleCommuniques: Communique[] = [];
  currentUserId: string = '';
  private displayedCommuniqueIds: Set<string> = new Set(); // IDs déjà affichés
  private pollingSubscription!: Subscription;

  constructor(private communiqueService: CommuniqueService) {}
  ngOnDestroy(): void {
    if (this.pollingSubscription) this.pollingSubscription.unsubscribe();
  }
  ngOnInit(): void {
    const utilisateur = localStorage.getItem('utilisateur');
    if (!utilisateur) return;
  
    try {
      const user = JSON.parse(utilisateur);
      this.currentUserId = user._id || user.id || '';
    } catch {
      this.currentUserId = utilisateur;
    }
  
    // Charger les IDs déjà affichés depuis localStorage
    const storedIds = localStorage.getItem('displayedCommuniqueIds');
    if (storedIds) {
      this.displayedCommuniqueIds = new Set(JSON.parse(storedIds));
    }
  
    if (this.currentUserId) {
      // Polling toutes les 5 secondes
      this.pollingSubscription = interval(5000).subscribe(() => this.checkNewCommuniques());
      // Vérification immédiate
      this.checkNewCommuniques();
    }
  }
  
  checkNewCommuniques(): void {
    if (!this.currentUserId) return;
  
    this.communiqueService.getCommuniques().subscribe(
      (data) => {
        if (!data || !data.length) return;
  
        // Trouver le plus récent communiqué
        const latestRaw = data.reduce((prev, curr) => {
          const prevDate = new Date(prev.date || new Date()).getTime();
          const currDate = new Date(curr.date || new Date()).getTime();
          return currDate > prevDate ? curr : prev;
        });
  
        if (!latestRaw._id) return;
  
        const storedData = JSON.parse(localStorage.getItem('displayedCommuniqueData') || '{}');
        const lastDisplayedId = storedData.id;
        const lastDisplayedTime = storedData.timestamp;
  
        const now = Date.now();
  
        // Si c’est le même communiqué et qu’il est encore dans les 10s → afficher la notif à nouveau
        if (lastDisplayedId === latestRaw._id && lastDisplayedTime && now - lastDisplayedTime < 10000) {
          this.showCommunique(latestRaw, 10000 - (now - lastDisplayedTime));
          return;
        }
  
        // Si le communiqué est nouveau
        if (lastDisplayedId !== latestRaw._id) {
          localStorage.setItem(
            'displayedCommuniqueData',
            JSON.stringify({ id: latestRaw._id, timestamp: now })
          );
          this.showCommunique(latestRaw, 10000);
        }
      },
      (err) => console.error('❌ Erreur lors du chargement des communiqués', err)
    );
  }
  
  private showCommunique(latestRaw: any, remainingTime: number): void {
    this.visibleCommuniques = [{
      _id: latestRaw._id,
      receiverId: this.currentUserId,
      text: '📢 Nouveau communiqué disponible !',
      createdAt: latestRaw.date || new Date(),
      removing: false
    }];
  
    // Supprimer la notif après le temps restant
    setTimeout(() => {
      this.visibleCommuniques = [];
    }, remainingTime);
  }
  
  

  remove(id: string): void {
    this.visibleCommuniques = this.visibleCommuniques.filter(c => c._id !== id);
  }

  animateAndRemove(id: string): void {
    const comm = this.visibleCommuniques.find(c => c._id === id);
    if (!comm) return;
    comm.removing = true;
    setTimeout(() => this.remove(id), 300);
  }

  trackById(index: number, item: Communique): string {
    return item._id;
  }
}
