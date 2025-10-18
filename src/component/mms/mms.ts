import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ChatService, Contact, Message } from '../../../services/chat.service';
import { debounceTime, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-mms',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './mms.html',
  styleUrls: ['./mms.css']
})
export class MMS implements OnInit, OnDestroy {
  userId = '';
  userNom = '';
  userPrenom = '';
  userInitiales = '';

  isSending = false;
  searchText = '';
  newMessage = '';
  selectedContact: Contact | null = null;
  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];
  messages: Message[] = [];
  pageContacts = 0;
  showSearch = false;
  showSuggestions = false;

  private searchSubject = new Subject<string>();
  private subscriptions: Subscription[] = [];
  isMobileScreen = window.innerWidth < 768; // < md

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.loadUser();
    this.loadContacts();
    this.restoreLastContact(); // ✅ Restaurer la dernière conversation ouverte
    this.setupSearch();
    this.listenNewMessages();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  @HostListener('window:resize')
  onResize() {
    this.isMobileScreen = window.innerWidth < 768;
  }

  private loadUser() {
    const raw = localStorage.getItem('utilisateur');
    if (!raw) return;
    const u = JSON.parse(raw);
    this.userId = u._id;
    this.userPrenom = u.prenom || '';
    this.userNom = u.nom || '';
    this.userInitiales = (this.userPrenom[0] || '') + (this.userNom[0] || '');
  }

  private loadContacts() {
    const raw = localStorage.getItem(`contacts_${this.userId}`);
    this.contacts = raw ? JSON.parse(raw) : [];
  }

  private saveContacts() {
    localStorage.setItem(`contacts_${this.userId}`, JSON.stringify(this.contacts));
  }

  private restoreLastContact() {
    const lastContactId = localStorage.getItem(`lastContact_${this.userId}`);
    if (lastContactId) {
      const contact = this.contacts.find(c => c._id === lastContactId);
      if (contact) this.selectContact(contact);
    }
  }

  filterContacts(text: string) {
    if (!text.trim()) { this.filteredContacts = []; return; }
    this.chatService.getContacts().subscribe({
      next: data => {
        this.filteredContacts = data.filter(
          c => c._id !== this.userId && `${c.firstName} ${c.lastName}`.toLowerCase().includes(text.toLowerCase())
        );
      }
    });
  }

  selectSuggestion(contact: Contact) {
    this.showSuggestions = false;
    this.searchText = `${contact.firstName} ${contact.lastName}`;
    this.selectContact(contact);
    if (!this.contacts.find(c => c._id === contact._id)) {
      this.contacts.unshift(contact);
      this.saveContacts();
    }
  }

  selectContact(contact: Contact) {
    this.selectedContact = contact;
    localStorage.setItem(`lastContact_${this.userId}`, contact._id); // ✅ Sauvegarder la conversation
    this.loadConversation(contact);
  }

  deleteContact(contact: Contact) {
    if (!confirm(`Supprimer ${contact.firstName} ${contact.lastName} ?`)) return;
    this.contacts = this.contacts.filter(c => c._id !== contact._id);
    this.saveContacts();
    if (this.selectedContact?._id === contact._id) {
      this.selectedContact = null;
      this.messages = [];
      localStorage.removeItem(`lastContact_${this.userId}`);
    }
  }

  private setupSearch() {
    this.subscriptions.push(this.searchSubject.pipe(debounceTime(200)).subscribe(t => this.filterContacts(t)));
  }

  onSearchChange(text: string) {
    this.showSuggestions = true;
    this.searchSubject.next(text);
  }

  getFilteredContacts() {
    if (!this.searchText) return this.filteredContacts;
    const first = this.searchText[0].toUpperCase();
    return this.filteredContacts.filter(c => c.firstName.toUpperCase().startsWith(first));
  }

  private listenNewMessages() {
    this.subscriptions.push(this.chatService.onNewMessage().subscribe(m => this.handleIncoming(m)));
  }

  private loadConversation(contact: Contact) {
    this.chatService.getConversation(this.userId, contact._id).subscribe({
      next: msgs => {
        this.messages = msgs.map(m => ({
          ...m,
          senderName: m.senderId === this.userId ? `${this.userPrenom} ${this.userNom}` : `${contact.firstName} ${contact.lastName}`,
          timestamp: m.timestamp ? new Date(m.timestamp) : new Date()
        }));
        this.removeOldMessages(); // ✅ Supprimer les messages > 48h
      }
    });
  }

  sendMessage() {
    if (!this.newMessage?.trim() || !this.selectedContact || this.isSending) return;
    this.isSending = true;
    const msg: Message = {
      senderId: this.userId,
      receiverId: this.selectedContact._id,
      text: this.newMessage.trim(),
      senderName: `${this.userPrenom} ${this.userNom}`,
      timestamp: new Date()
    };
    this.chatService.sendMessage(msg).subscribe({
      next: sent => {
        this.newMessage = '';
        this.messages.push(sent);
        this.chatService.emitNewMessage(sent);
        this.isSending = false;
        this.removeOldMessages(); // ✅ Toujours nettoyer les anciens messages
      },
      error: () => { this.isSending = false; alert("Erreur d'envoi"); }
    });
  }

  private handleIncoming(msg: Message) {
    const exists = this.messages.some(m =>
      m.senderId === msg.senderId && m.receiverId === msg.receiverId && m.text === msg.text &&
      new Date(m.timestamp ?? 0).getTime() === new Date(msg.timestamp ?? 0).getTime()
    );
    if (!exists &&
        ((msg.senderId === this.selectedContact?._id && msg.receiverId === this.userId) ||
         (msg.senderId === this.userId && msg.receiverId === this.selectedContact?._id))) {
      if (!msg.timestamp) msg.timestamp = new Date();
      this.messages.push(msg);
      this.removeOldMessages(); // ✅ Nettoyage des messages > 48h
    }
  }

  private removeOldMessages() {
    const now = new Date().getTime();
    const limit = 48 * 60 * 60 * 1000; // 48h en ms
    this.messages = this.messages.filter(m => {
      const ts = new Date(m.timestamp ?? 0).getTime();
      return now - ts <= limit;
    });
  }

  getInitiales(n?: string) {
    if (!n) return '';
    const p = n.split(' ');
    return (p[0]?.[0] || '') + (p[1]?.[0] || '');
  }

  trackByMsgId(_: number, m: Message) { return m.timestamp?.toString() + m.text; }
  trackByContactId(_: number, c: Contact) { return c._id; }

  loadOlder() {}
}
