import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from '../../../services/notifications.Service';
import { Notification } from '../../Model/Notif';
import { Subscription, interval } from 'rxjs';

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
      // Vérifier s'il y a une notif en cours dans le localStorage
      this.restoreVisibleNotification();

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

  // Vérifie s'il y a un nouveau message
  checkNewNotifications(): void {
    this.notificationService.getUserMessages(this.currentUserId).subscribe({
      next: (data) => {
        if (!data || !data.length) return;

        const recentMessages = data
          .filter(msg => msg.receiverId === this.currentUserId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        if (recentMessages.length === 0) return;

        const latest = recentMessages[0];
        if (!latest._id) return;

        const storedData = JSON.parse(localStorage.getItem('displayedNotificationData') || '{}');
        const lastDisplayedId = storedData.id;
        const lastDisplayedTime = storedData.timestamp;
        const now = Date.now();

        // Si la même notif est encore dans les 10 secondes → réaffiche
        if (lastDisplayedId === latest._id && lastDisplayedTime && now - lastDisplayedTime < 10000) {
          this.showNotification(latest, 10000 - (now - lastDisplayedTime));
          return;
        }

        // Si nouvelle notif
        if (lastDisplayedId !== latest._id) {
          localStorage.setItem(
            'displayedNotificationData',
            JSON.stringify({ id: latest._id, timestamp: now })
          );
          this.showNotification(latest, 10000);
        }
      },
      error: (err) => console.error('❌ Erreur lors du chargement des notifications', err)
    });
  }

  // Affiche la notification
  showNotification(notif: Notification, duration: number): void {
    this.visibleNotifications = [notif];
    localStorage.setItem(
      'visibleNotification',
      JSON.stringify({ notif, expiresAt: Date.now() + duration })
    );

    setTimeout(() => {
      this.remove(notif._id);
    }, duration);
  }

  // Restaure une notification si elle est encore active (après un refresh)
  restoreVisibleNotification(): void {
    const saved = localStorage.getItem('visibleNotification');
    if (!saved) return;

    try {
      const { notif, expiresAt } = JSON.parse(saved);
      const remaining = expiresAt - Date.now();

      if (remaining > 0) {
        this.visibleNotifications = [notif];
        setTimeout(() => this.remove(notif._id), remaining);
      } else {
        localStorage.removeItem('visibleNotification');
      }
    } catch {
      localStorage.removeItem('visibleNotification');
    }
  }

  // Supprime la notification visible
  remove(id: string): void {
    this.visibleNotifications = this.visibleNotifications.filter(n => n._id !== id);
    localStorage.removeItem('visibleNotification');
  }

  // Générer les initiales d'un utilisateur
  getInitials(sender: { nom?: string; prenom?: string }): string {
    const nom = sender?.nom?.charAt(0).toUpperCase() || '';
    const prenom = sender?.prenom?.charAt(0).toUpperCase() || '';
    return prenom + nom; // ex: JP pour Jean Pierre
  }

  trackById(index: number, item: Notification): string {
    return item._id;
  }

  animateAndRemove(id: string) {
    const notif = this.visibleNotifications.find(n => n._id === id);
    if (!notif) return;

    notif.removing = true;
    setTimeout(() => this.remove(id), 300);
  }
}
