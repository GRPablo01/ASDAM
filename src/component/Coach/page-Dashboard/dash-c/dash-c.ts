import { Component, OnInit, ViewChild, ElementRef, Renderer2, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { MatchService, Match } from '../../../../../services/match.service';
import { CommuniqueService, Communique } from '../../../../../services/communique.service';
import { CreerConvocationsC } from "../../../Coach/Bouton/creer-convocations-c/creer-convocations-c";
import { CreerEventC } from "../../../Coach/Bouton/creer-event-c/creer-event-c";
import { CreerMatchC } from "../../../Coach/Bouton/creer-match-c/creer-match-c";
import { ActusC } from "../../../Coach/Bouton/creer-post-c/creer-post-c";
import { ListJoueur } from "../list-joueur/list-joueur";

// ====== Interfaces ======
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
  equipe?: string;
}

interface Joueur {
  _id?: string;
  prenom?: string;
  nom?: string;
  numero?: string;
  categorie?: string;
  poste?: string;
  initiales?: string;
}

// ====== Interfaces Classement ======
interface Equipe {
  equipe: string;
  pts: number;
  jo: number;
  g: number;
  n: number;
  p: number;
  f: number;
  bp: number;
  bc: number;
  pe: number;
  dif: number;
  position: number;
}

interface ClassementCategorie {
  _id?: string;
  categorie: string;
  equipes: Equipe[];
}

@Component({
  selector: 'app-dash-c',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    CreerConvocationsC,
    CreerEventC,
    CreerMatchC,
    ActusC,
    ListJoueur
  ],
  templateUrl: './dash-c.html',
  styleUrls: ['./dash-c.css']
})
export class DashC implements OnInit {

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
  searchQuery = '';
  @Input() joueurs: any[] = [];

  // ===== UTILISATEUR =====
  currentUser: LocalUser | null = null;
  userRole: string | null = null;

  // ===== JOUEURS =====
  loadingJoueurs = false;

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

  // ===== CLASSEMENT =====
  equipes: string[] = ['U11', 'U13', 'U15', 'U18', 'U23', 'Senior A', 'Senior B', 'Senior D'];
  selectedEquipe: string | null = 'Senior A';
  classement: ClassementCategorie[] = [];
  loadingClassement = false;

  private apiClassementUrl = 'http://localhost:3000/api/classements';

  private equipeMapping: { [key: string]: string[] } = {
    U11: ['U11 Automne POULE 04', 'U11 Automne CRIT U10 POULE 1'],
    U13: ['U13 Automne POULE N3A', 'U13 Automne POULE N3B', 'U13 Automne POULE N2C', 'U13 FEMININES A 8 BRASSAGE PHASE AUT POULE D'],
    U15: ['U15 D1 Automne POULE D'],
    U18: ['U18 Excellence POULE UNIQUE', 'U18 D2 Automne POULE D'],
    U23: ['Départemental 3 - Poule B'],
    'Senior A': ['REGIONAL 2 - Poule D'],
    'Senior B': ['Départemental 1 - Poule A'],
    'Senior D': ['Départemental 4 - Poule A'],
  };

  // ===== NAVIGATION =====
  navItems: any[] = [];

  notification: { type: 'success' | 'error', message: string } | null = null;
  animatingLike: string | null = null;

  @ViewChild('mediaInput') mediaInput!: ElementRef<HTMLInputElement>;
  @ViewChild('editMediaInput') editMediaInput!: ElementRef<HTMLInputElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private matchService: MatchService,
    private communiqueService: CommuniqueService,
    private http: HttpClient,
    private renderer: Renderer2,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 🔹 Récupération de l'utilisateur depuis le localStorage
    const storedUser = localStorage.getItem('utilisateur');
    console.log('🔹 localStorage utilisateur:', storedUser);
  
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('🔹 Utilisateur parsé:', parsedUser);
        if (parsedUser && typeof parsedUser === 'object') {
          this.currentUser = parsedUser as LocalUser;
          this.userRole = this.currentUser.role ?? null;
        }
      } catch (error) {
        console.error('Erreur lors de la lecture du localStorage utilisateur :', error);
        this.currentUser = null;
        this.userRole = null;
      }
    } else {
      console.log('🔹 Aucun utilisateur trouvé dans le localStorage');
      this.currentUser = null;
      this.userRole = null;
    }
  
    console.log('🔹 Rôle utilisateur après init:', this.userRole);
  
    // ✅ Restaurer la dernière section cliquée
    const lastSection = localStorage.getItem('lastSection');
    if (lastSection) {
      console.log('🔹 Dernière section:', lastSection);
      this.selectedSection = lastSection;
    }
  
    // 🔹 Configurer le menu en fonction du rôle
    this.setupNavItems();
  
    // 🔹 Charger la section initiale en toute sécurité
    this.setSection(this.selectedSection);
  }
  

 // ===================== CONFIG NAV ITEMS SELON RÔLE =====================
setupNavItems() {
  const allItems = [
    { key: 'match', label: 'Matchs', icon: 'fas fa-futbol' },
    { key: 'actus', label: 'Actus', icon: 'fas fa-newspaper' },
    { key: 'joueurs', label: 'Mes Joueurs', icon: 'fas fa-users' },
    { key: 'communiquer', label: 'Communiquer', icon: 'fas fa-bullhorn' },
    { key: 'bouton', label: 'Création', icon: 'fas fa-plus' },
    { key: 'classement', label: 'Classement', icon: 'fas fa-trophy' },
    { key: 'profil', label: 'Profil', icon: 'fas fa-user' },
    { key: 'logout', label: 'Déconnexion', icon: 'fas fa-sign-out-alt' },
  ];

  console.log('🔹 Configuration navItems pour rôle:', this.userRole);

  if (!this.userRole) {
    this.navItems = allItems.filter(item => ['profil', 'logout'].includes(item.key));
  } else if (this.userRole === 'joueur' || this.userRole === 'Invité') {
    this.navItems = allItems.filter(item => ['profil', 'logout'].includes(item.key));
  } else if (this.userRole === 'coach') {
    this.navItems = allItems.filter(item => !['profil', 'logout'].includes(item.key) ? true : true);
  } else if (this.userRole === 'admin' || this.userRole === 'super admin') {
    this.navItems = allItems;
  } else {
    this.navItems = allItems.filter(item => ['profil', 'logout'].includes(item.key));
  }

  console.log('🔹 NavItems après filtrage:', this.navItems.map(i => i.key));
}


  // ===================== MATCHS =====================
  loadMatches(): void {
    this.loadingMatches = true;
    this.matchService.getAllMatches().subscribe({
      next: (data) => {
        if (this.currentUser && this.currentUser.equipe && this.userRole !== 'Admin' && this.userRole !== 'Super Admin') {
          this.matches = data.filter(match => match.categorie === this.currentUser!.equipe);
        } else {
          this.matches = data; // Admin/Super Admin voit tous
        }
        this.loadingMatches = false;
      },
      error: (err) => {
        this.errorMatches = 'Erreur lors du chargement des matchs.';
        console.error(err);
        this.loadingMatches = false;
      }
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
      error: (err) => {
        this.errorMatches = 'Erreur lors de la suppression du match.';
        console.error(err);
        setTimeout(() => this.errorMatches = '', 3000);
      }
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
      next: () => {
        this.successCommuniques = 'Communiqué supprimé avec succès.';
        this.communiques = this.communiques.filter(c => c._id !== id);
        setTimeout(() => this.successCommuniques = '', 3000);
      },
      error: (err) => {
        this.errorCommuniques = 'Erreur lors de la suppression du communiqué.';
        console.error(err);
        setTimeout(() => this.errorCommuniques = '', 3000);
      }
    });
  }

  // ===================== POSTS =====================
  loadPosts() {
    this.loadingPosts = true;
    this.http.get<Post[]>('http://localhost:3000/api/posts').pipe(
      catchError(err => { console.error(err); this.errorPosts = 'Erreur lors du chargement des posts'; return throwError(() => err); })
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
    if (!post._id || !confirm('Voulez-vous vraiment supprimer ce post ?')) return;

    this.http.delete<void>(`http://localhost:3000/api/posts/${post._id}`).subscribe({
      next: () => {
        this.posts.splice(index, 1);
        this.filterPosts();
        this.showNotification('success', 'Post supprimé 🗑️');
      },
      error: (err) => {
        console.error(err);
        this.showNotification('error', 'Erreur lors de la suppression du post ❌');
      }
    });
  }

  private showNotification(type: 'success' | 'error', message: string) {
    this.notification = { type, message };
    setTimeout(() => this.notification = null, 3000);
  }

  // ===================== JOUEURS =====================
  loadJoueurs() {
    this.loadingJoueurs = true;
    if (this.userRole === 'Admin' || this.userRole === 'Super Admin') {
      // Charger tous les joueurs pour Admin/Super Admin
      this.http.get<Joueur[]>('http://localhost:3000/api/joueurs').subscribe({
        next: data => { this.joueurs = data; this.loadingJoueurs = false; },
        error: err => { console.error(err); this.loadingJoueurs = false; }
      });
    } else {
      // Placeholder pour Joueur/Coach
      setTimeout(() => { this.joueurs = []; this.loadingJoueurs = false; }, 500);
    }
  }

  // ===================== CLASSEMENT =====================
  loadClassements() {
    this.loadingClassement = true;
    this.http.get<ClassementCategorie[]>(this.apiClassementUrl).subscribe({
      next: (data) => {
        this.classement = data;
        if (this.userRole === 'Admin' || this.userRole === 'Super Admin') {
          this.selectedEquipe = null; // Admin voit tout
        } else if (this.currentUser?.equipe) {
          this.selectedEquipe = this.currentUser.equipe;
        }
        this.loadingClassement = false;
      },
      error: (err) => {
        console.error('Erreur chargement classement :', err);
        this.loadingClassement = false;
      }
    });
  }

  isHighlightedEquipe(equipe: Equipe): boolean {
    return equipe.equipe === 'DANJOUTIN ANDELNANS';
  }

  get classementFiltre(): ClassementCategorie[] {
    if (!this.selectedEquipe) return this.classement; // Admin voit tout
    const categories = this.equipeMapping[this.selectedEquipe] || [];
    return this.classement.filter(c => categories.includes(c.categorie));
  }

  saveCategorie(categorie: ClassementCategorie) {
    if (!categorie._id) return;
  
    categorie.equipes.sort((a, b) => b.pts - a.pts || b.dif - a.dif || b.bp - a.bp);
    categorie.equipes.forEach((equipe, index) => { equipe.position = index + 1; });
  
    this.http.put(`${this.apiClassementUrl}/${categorie._id}`, { equipes: categorie.equipes })
      .subscribe({
        next: () => this.showNotification('success', `Classement de ${categorie.categorie} mis à jour !`),
        error: (err) => { console.error(err); this.showNotification('error', `Erreur lors de la mise à jour de ${categorie.categorie}`); }
      });
  }

  selectEquipe(equipe: string): void {
    this.selectedEquipe = equipe;
    localStorage.setItem('lastEquipe', equipe);
  }

  // ===================== PROFIL =====================
  updateProfile() {
    if (!this.currentUser?._id) return;
    this.http.put(`http://localhost:3000/api/users/${this.currentUser._id}`, this.currentUser)
      .subscribe({
        next: () => this.showNotification('success', 'Profil mis à jour ✅'),
        error: (err) => { console.error(err); this.showNotification('error', 'Erreur lors de la mise à jour du profil ❌'); }
      });
  }

  deleteAccount() {
    if (!this.currentUser?._id) return;
    if (!confirm('Voulez-vous vraiment supprimer votre compte ? Cette action est irréversible.')) return;

    this.http.delete(`http://localhost:3000/api/users/${this.currentUser._id}`)
      .subscribe({
        next: () => {
          this.showNotification('success', 'Compte supprimé ✅');
          this.logout();
        },
        error: (err) => { console.error(err); this.showNotification('error', 'Erreur lors de la suppression du compte ❌'); }
      });
  }

  // ===================== DÉCONNEXION =====================
  logout() {
    localStorage.removeItem('utilisateur');
    localStorage.removeItem('lastSection');
    this.router.navigate(['/connexion']); 
  }

  // ===================== CHANGEMENT DE SECTION =====================
setSection(section: string) {
  this.selectedSection = section;
  localStorage.setItem('lastSection', section);
  console.log('🔹 Section sélectionnée:', section);

  if (section === 'match') this.loadMatches();
  else if (section === 'communiquer') this.loadCommuniques();
  else if (section === 'actus') this.loadPosts();
  else if (section === 'joueurs') this.loadJoueurs();
  else if (section === 'classement') this.loadClassements();
}

  // ===================== UTILS =====================
  formatMediaUrl(url?: string) {
    return url?.startsWith('http') ? url : `http://localhost:3000/uploads/${url}`;
  }

}
