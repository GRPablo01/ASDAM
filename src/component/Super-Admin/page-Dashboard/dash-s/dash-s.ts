import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

import { MatchService, Match } from '../../../../../services/match.service';
import { CommuniqueService, Communique } from '../../../../../services/communique.service';
import { CreerConvocationsC } from "../../../Coach/Bouton/creer-convocations-c/creer-convocations-c";
import { CreerEventC } from "../../../Coach/Bouton/creer-event-c/creer-event-c";
import { CreerMatchC } from "../../../Coach/Bouton/creer-match-c/creer-match-c";
import { ActusC } from "../../../Coach/Bouton/creer-post-c/creer-post-c";

interface Comment { 
  _id?: string;
  user: string; 
  text: string; 
  time?: string; 
  initials?: string; 
}

interface Post {
  _id?: string;
  content: string;
  user?: string;
  initials?: string;
  likes: number;
  isLiked: boolean;
  isBookmarked: boolean;
  comments: Comment[];
  shares: number;
  media?: string;
  createdAt?: string;
  mediaType?: 'image' | 'video';
  mediaUrl?: string;
  likedBy?: string[];
  showAllComments?: boolean;
  newComment?: string;
  showMenu?: boolean;
}

interface LocalUser { 
  _id?: string; 
  prenom?: string; 
  nom?: string; 
  role?: string; 
  initiale?: string; 
}

@Component({
  selector: 'app-dash-s',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, CreerConvocationsC, CreerEventC, CreerMatchC, ActusC],
  templateUrl: './dash-s.html',
  styleUrls: ['./dash-s.css']
})
export class DashS implements OnInit {

  selectedSection: string = 'match';

  // ===== MATCHS =====
  matches: Match[] = [];
  loadingMatches = false;
  errorMatches = '';
  successMatches = '';

  // ===== COMMUNIQUÉS =====
  communiques: Communique[] = [];
  loadingCommuniques = false;
  errorCommuniques = '';
  successCommuniques = '';

  // ===== ACTUS / POSTS =====
  posts: (Post & { newComment?: string; showMenu?: boolean })[] = [];
  filteredPosts: typeof this.posts = [];
  loadingPosts = false;
  errorPosts = '';
  successPosts = '';

  // ===== UTILISATEUR =====
  currentUser: LocalUser | null = null;

  // ===== POST MODAL =====
  newPostContent = '';
  newPostMedia: File | null = null;
  newPostMediaPreview: string | null = null;
  loading = false;
  showCreateModal = false;

  editingPost: Post | null = null;
  editingContent = '';
  editingMedia: File | null = null;
  editingMediaPreview: string | null = null;
  showEditModal = false;

  selectedPost: Post | null = null;
  selectedPostComments: Comment[] = [];
  showCommentsModal = false;
  commentsPage = 1;
  commentsPerPage = 4;
  totalCommentPages = 1;

  searchQuery = '';
  notification: { type: 'success'|'error', message: string } | null = null;
  animatingLike: string | null = null;

  @ViewChild('mediaInput') mediaInput!: ElementRef<HTMLInputElement>;
  @ViewChild('editMediaInput') editMediaInput!: ElementRef<HTMLInputElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private matchService: MatchService,
    private communiqueService: CommuniqueService,
    private http: HttpClient,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('utilisateur');
    if (storedUser) this.currentUser = JSON.parse(storedUser);

    this.loadMatches();
  }

  // ===================== MATCHS =====================
  loadMatches(): void {
    this.loadingMatches = true;
    this.matchService.getAllMatches().subscribe({
      next: (data) => { this.matches = data; this.loadingMatches = false; },
      error: (err) => { this.errorMatches = 'Erreur lors du chargement des matchs.'; console.error(err); this.loadingMatches = false; }
    });
  }

  supprimerMatch(id?: string): void {
    if (!id || !confirm('Voulez-vous vraiment supprimer ce match ?')) return;
    this.matchService.deleteMatch(id).subscribe({
      next: () => {
        this.successMatches = 'Match supprimé avec succès.';
        this.matches = this.matches.filter(m => m._id !== id);
        setTimeout(() => this.successMatches = '', 3000);
      },
      error: (err) => { this.errorMatches = 'Erreur lors de la suppression du match.'; console.error(err); setTimeout(() => this.errorMatches = '', 3000); }
    });
  }

  // ===================== COMMUNIQUÉS =====================
  loadCommuniques(): void {
    this.loadingCommuniques = true;
    this.communiqueService.getCommuniques().subscribe({
      next: (data) => { this.communiques = data; this.loadingCommuniques = false; },
      error: (err) => { this.errorCommuniques = 'Erreur lors du chargement des communiqués.'; console.error(err); this.loadingCommuniques = false; }
    });
  }

  supprimerCommunique(id?: string): void {
    if (!id || !confirm('Voulez-vous vraiment supprimer ce communiqué ?')) return;
    this.communiqueService.supprimerCommunique(id).subscribe({
      next: () => { this.successCommuniques = 'Communiqué supprimé avec succès.'; this.communiques = this.communiques.filter(c => c._id !== id); setTimeout(() => this.successCommuniques = '', 3000); },
      error: (err) => { this.errorCommuniques = 'Erreur lors de la suppression du communiqué.'; console.error(err); setTimeout(() => this.errorCommuniques = '', 3000); }
    });
  }

  // ===================== POSTS =====================
  loadPosts() {
    this.loadingPosts = true;
    this.http.get<Post[]>('http://localhost:3000/api/posts').pipe(
      catchError(err => { console.error(err); this.errorPosts='Erreur lors du chargement des posts'; return throwError(() => err); })
    ).subscribe(posts => {
      this.posts = posts.map(p => ({
        ...p,
        newComment: '',
        showMenu: false,
        mediaType: p.media?.endsWith('.mp4') ? 'video' : p.media ? 'image' : undefined,
        mediaUrl: p.media ? this.formatMediaUrl(p.media) : undefined,
        likedBy: p.likedBy ?? [],
        isLiked: p.likedBy?.includes(this.currentUser?._id || '') ?? false
      }));
      this.filterPosts();
      this.loadingPosts = false;
    });
  }

  filterPosts() {
    const query = this.searchQuery.toLowerCase();
    this.filteredPosts = this.posts.filter(p => p.content.toLowerCase().includes(query));
  }

  deletePost(post: Post, index: number) {
    if (!post._id || !confirm('Voulez-vous supprimer ce post ?')) return;
    this.http.delete<void>(`http://localhost:3000/api/posts/${post._id}`).subscribe({
      next: () => { this.posts.splice(index, 1); this.filterPosts(); this.showNotification('success','Post supprimé 🗑️'); },
      error: err => { console.error(err); this.showNotification('error','Erreur suppression post ❌'); }
    });
  }

  togglePostMenu(i:number) { this.posts[i].showMenu = !this.posts[i].showMenu; }

  formatMediaUrl(url?: string) { return url?.startsWith('http') ? url : `http://localhost:3000/uploads/${url}`; }

  private showNotification(type: 'success'|'error', message: string) {
    this.notification = { type, message };
    setTimeout(() => this.notification = null, 3000);
  }

  // ===================== SECTIONS =====================
  setSection(section: string) {
    this.selectedSection = section;
    if(section==='match') this.loadMatches();
    else if(section==='communiquer') this.loadCommuniques();
    else if(section==='actus') this.loadPosts();
  }

  // ===================== SCROLL =====================
  blockScroll() { this.renderer.setStyle(document.body, 'overflow', 'hidden'); }
  unblockScroll() { this.renderer.setStyle(document.body, 'overflow', 'auto'); }

  // ===================== MEDIA =====================
  openMediaSelector() { this.mediaInput.nativeElement.click(); }
  removeMedia() { this.newPostMedia=this.newPostMediaPreview=null; this.mediaInput.nativeElement.value=''; }

  get currentFullName(): string { return this.currentUser ? `${this.currentUser.prenom ?? ''} ${this.currentUser.nom ?? ''}`.trim() : 'Utilisateur'; }
  get currentInitiales(): string { return this.currentUser?.initiale ?? ((this.currentUser?.prenom?.[0]??'')+(this.currentUser?.nom?.[0]??'')).toUpperCase(); }
}
