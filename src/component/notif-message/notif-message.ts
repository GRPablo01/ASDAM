import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from '../../../services/notifications.Service';
import { Notification } from '../../Model/Notif';
import { Subscription, interval } from 'rxjs';
import { animate, animateChild, group, query, stagger, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-notif-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notif-message.html',
  styleUrls: ['./notif-message.css']
})
export class NotifMessage implements OnInit, OnDestroy {
  visibleNotifications: Notification[] = [];
  currentUserId: string = '';
  private lastMessageId: string | null = null;
  private pollingSubscription!: Subscription;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    const utilisateur = localStorage.getItem('utilisateur');
    if (!utilisateur) return;

    try {
      const user = JSON.parse(utilisateur);
      this.currentUserId = user._id || user.id || '';
    } catch {
      this.currentUserId = utilisateur;
    }

    if (this.currentUserId) {
      // Polling toutes les 5 secondes
      this.pollingSubscription = interval(5000).subscribe(() => {
        this.checkNewNotifications();
      });

      // Vérification initiale
      this.checkNewNotifications();
    }
  }

  ngOnDestroy(): void {
    if (this.pollingSubscription) this.pollingSubscription.unsubscribe();
  }

  checkNewNotifications(): void {
    this.notificationService.getUserMessages(this.currentUserId).subscribe({
      next: (data) => {
        const now = Date.now();
        const oneDayMs = 24 * 60 * 60 * 1000;

        const recentMessages = data
          .filter(msg =>
            msg.receiverId === this.currentUserId &&
            (now - new Date(msg.createdAt).getTime()) <= oneDayMs
          )
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        if (recentMessages.length === 0) return;

        const latest = recentMessages[0];

        if (latest._id !== this.lastMessageId) {
          this.lastMessageId = latest._id;
          this.showNotification(latest);
        }
      },
      error: (err) => console.error('❌ Erreur lors du chargement des notifications', err)
    });
  }

  showNotification(notif: Notification): void {
    this.visibleNotifications.push(notif);
    setTimeout(() => {
      this.visibleNotifications = this.visibleNotifications.filter(n => n._id !== notif._id);
    }, 10000);
  }

  remove(id: string): void {
    this.visibleNotifications = this.visibleNotifications.filter(n => n._id !== id);
  }

  // Générer les initiales d'un utilisateur
  getInitials(sender: { nom?: string; prenom?: string }): string {
    const nom = sender?.nom?.charAt(0).toUpperCase() || '';
    const prenom = sender?.prenom?.charAt(0).toUpperCase() || '';
    return prenom + nom; // exemple: JP pour Jean Pierre
  }

  trackById(index: number, item: Notification): string {
    return item._id;
  }

  animateAndRemove(id: string) {
    const notif = this.visibleNotifications.find(n => n._id === id);
    if (!notif) return;
  
    notif.removing = true;               // déclenche l’animation de sortie
    setTimeout(() => this.remove(id), 300); // même durée que le CSS
  }

}
