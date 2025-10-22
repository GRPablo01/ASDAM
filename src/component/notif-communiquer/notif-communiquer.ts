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
  
        const latestRaw = data.reduce((prev, curr) => {
          const prevDate = new Date(prev.date || new Date()).getTime();
          const currDate = new Date(curr.date || new Date()).getTime();
          return currDate > prevDate ? curr : prev;
        });
  
        if (!latestRaw._id) return;
  
        // Vérifier si la notif a déjà été affichée
        if (!this.displayedCommuniqueIds.has(latestRaw._id)) {
          this.displayedCommuniqueIds.add(latestRaw._id);
          // Sauvegarder dans localStorage
          localStorage.setItem('displayedCommuniqueIds', JSON.stringify([...this.displayedCommuniqueIds]));
  
          this.visibleCommuniques = [{
            _id: latestRaw._id,
            receiverId: this.currentUserId,
            text: '📢 Nouveau communiqué disponible !',
            createdAt: latestRaw.date || new Date(),
            removing: false
          }];
  
          setTimeout(() => this.visibleCommuniques = [], 10000);
        }
      },
      (err) => console.error('❌ Erreur lors du chargement des communiqués', err)
    );
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
