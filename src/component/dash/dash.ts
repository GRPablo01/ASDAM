import { Component, OnInit, ViewChild, ElementRef, Renderer2, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError, throwError, interval, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { UtilisateurService, User } from '../../../services/userService/utilisateur.Service';
import { MatchService, Match } from '../../../services/match.service';
import { CommuniqueService, Communique } from '../../../services/communique.service';
import { CreerConvoque } from '../Bouton/creer-convoque/creer-convoque';
import { CreerEvent } from '../Bouton/creer-event/creer-event';
import { CreerMatch } from '../Bouton/creer-match/creer-match';
import { CreerPost } from '../Bouton/creer-post/creer-post';

// ===================== Interfaces =====================
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
  equipe: string;
}

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

// ===================== Composant =====================
@Component({
  selector: 'app-dash',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    CreerConvoque,
    CreerEvent,
    CreerMatch,
    CreerPost
  ],
  templateUrl: './dash.html',
  styleUrls: ['./dash.css']
})
export class Dash implements OnInit {
  // ===== Navigation =====
  selectedSection: string = 'match';
  navItems: any[] = [];
  notification: { type: 'success' | 'error'; message: string } | null = null;

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

  // ===== POSTS =====
  posts: (Post & { newComment?: string; showMenu?: boolean })[] = [];
  filteredPosts: typeof this.posts = [];
  loadingPosts = false;
  errorPosts = '';
  successPosts = '';
  searchQuery = '';
  private postsRefreshSub?: Subscription;

  // ===== JOUEURS =====
  @Input() joueurs: Joueur[] = [];
  loadingJoueurs = false;

  // ===== UTILISATEUR =====
  currentUser: LocalUser | null = null;
  userRole: string | null = null;

  // ===== MODALS POST =====
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
  equipes: string[] = ['U11','U13','U15','U18','U23','Senior A','Senior B','Senior D'];
  selectedEquipe: string | null = 'Senior A';
  classement: ClassementCategorie[] = [];
  loadingClassement = false;
  categories: string[] = ['U11','U13','U15','U18','U23','Senior B'];
  selectedCategorie: string | null = null;
  isSaving = false;
  private apiClassementUrl = 'http://localhost:3000/api/classements';
  private classementRefreshSub?: Subscription;

  private equipeMapping: { [key: string]: string[] } = {
    U11: ['U11 Automne POULE 04','U11 Automne CRIT U10 POULE 1'],
    U13: ['U13 Automne POULE N3A','U13 Automne POULE N3B','U13 Automne POULE N2C','U13 FEMININES A 8 BRASSAGE PHASE AUT POULE D'],
    U15: ['U15 D1 Automne POULE D'],
    U18: ['U18 Excellence POULE UNIQUE','U18 D2 Automne POULE D'],
    U23: ['Départemental 3 - Poule B'],
    'Senior A': ['REGIONAL 2 - Poule D'],
    'Senior B': ['Départemental 1 - Poule A'],
    'Senior D': ['Départemental 4 - Poule A'],
  };

  // ===== REF pour INPUTS =====
  @ViewChild('mediaInput') mediaInput!: ElementRef<HTMLInputElement>;
  @ViewChild('editMediaInput') editMediaInput!: ElementRef<HTMLInputElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private matchService: MatchService,
    private communiqueService: CommuniqueService,
    private http: HttpClient,
    private renderer: Renderer2,
    private router: Router,
    private utilisateurService: UtilisateurService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.setupNavItems();

    const lastSection = localStorage.getItem('lastSection');
    if (lastSection) this.selectedSection = lastSection;

    this.setSection(this.selectedSection);
  }

  ngOnDestroy(): void {
    this.postsRefreshSub?.unsubscribe();
    this.classementRefreshSub?.unsubscribe();
  }

  // ===================== UTILISATEURS =====================
  private loadCurrentUser() {
    const storedUser = localStorage.getItem('utilisateur');
    if (!storedUser) return;

    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser && typeof parsedUser === 'object') {
        this.currentUser = parsedUser as LocalUser;
        this.userRole = this.currentUser.role ?? null;
      }
    } catch (error) {
      console.error('Erreur localStorage utilisateur :', error);
      this.currentUser = null;
      this.userRole = null;
    }
  }

  // ===================== NAVIGATION =====================
  setupNavItems() {
    const allItems = [
      { key:'match', label:'Matchs', icon:'fas fa-futbol' },
      { key:'actus', label:'Actus', icon:'fas fa-newspaper' },
      { key:'joueurs', label:'Mes Joueurs', icon:'fas fa-users' },
      { key:'communiquer', label:'Communiquer', icon:'fas fa-bullhorn' },
      { key:'bouton', label:'Création', icon:'fas fa-plus' },
      { key:'classement', label:'Classement', icon:'fas fa-trophy' },
      { key:'profil', label:'Profil', icon:'fas fa-user' },
      { key:'logout', label:'Déconnexion', icon:'fas fa-sign-out-alt' },
    ];

    if (!this.userRole || this.userRole === 'joueur' || this.userRole === 'Invité') {
      this.navItems = allItems.filter(item => ['profil','logout'].includes(item.key));
      this.selectedSection = 'profil';
    } else {
      this.navItems = allItems;
      this.selectedSection = 'match';
    }
  }

  // ===================== MATCHS =====================
  loadMatches(): void {
    this.loadingMatches = true;
    this.matchService.getAllMatches().subscribe({
      next: data => {
        if (this.currentUser?.equipe && !['Admin','Super Admin'].includes(this.userRole || '')) {
          this.matches = data.filter(m => m.categorie === this.currentUser!.equipe);
        } else this.matches = data;
        this.loadingMatches = false;
      },
      error: err => { this.errorMatches = 'Erreur chargement matchs.'; console.error(err); this.loadingMatches = false; }
    });
  }

  supprimerMatch(id?: string): void {
    if (!id || !confirm('Voulez-vous vraiment supprimer ce match ?')) return;
    this.matchService.deleteMatch(id).subscribe({
      next: () => {
        this.matches = this.matches.filter(m => m._id !== id);
        this.successMatches = 'Match supprimé avec succès.';
        setTimeout(() => this.successMatches = '',3000);
      },
      error: err => { this.errorMatches = 'Erreur suppression match.'; console.error(err); setTimeout(() => this.errorMatches='',3000); }
    });
  }

  // ===================== COMMUNIQUÉS =====================
  loadCommuniques(): void {
    this.loadingCommuniques = true;
    this.communiqueService.getCommuniques().subscribe({
      next: data => { this.communiques = data; this.loadingCommuniques = false; },
      error: err => { console.error(err); this.errorCommuniques='Erreur chargement communiqués'; this.loadingCommuniques=false; }
    });
  }

  supprimerCommunique(id?: string): void {
    if (!id || !confirm('Voulez-vous vraiment supprimer ce communiqué ?')) return;
    this.communiqueService.supprimerCommunique(id).subscribe({
      next: () => { this.communiques = this.communiques.filter(c => c._id !== id); this.successCommuniques='Communiqué supprimé'; setTimeout(()=>this.successCommuniques='',3000); },
      error: err => { console.error(err); this.errorCommuniques='Erreur suppression communiqué'; setTimeout(()=>this.errorCommuniques='',3000); }
    });
  }

  // ===================== POSTS =====================
  loadPosts() {
    this.loadingPosts = true;
    this.http.get<Post[]>('http://localhost:3000/api/posts').pipe(
      catchError(err => { console.error(err); this.errorPosts='Erreur chargement posts'; return throwError(()=>err); })
    ).subscribe(posts => {
      this.posts = posts.map(p => ({
        ...p,
        newComment: '',
        showMenu: false,
        mediaType: p.media?.endsWith('.mp4')?'video': p.media?'image':undefined,
        mediaUrl: p.media ? this.formatMediaUrl(p.media):undefined,
        likedBy: p.likedBy ?? [],
        isLiked: p.likedBy?.includes(this.currentUser?._id || '') ?? false
      }));
      this.filterPosts();
      this.loadingPosts=false;
    });
  }

  filterPosts() {
    const query = this.searchQuery.toLowerCase();
    this.filteredPosts = this.posts.filter(p => p.content.toLowerCase().includes(query));
  }

  deletePost(post: Post, index: number) {
    if (!post._id || !confirm('Voulez-vous vraiment supprimer ce post ?')) return;
    this.http.delete<void>(`http://localhost:3000/api/posts/${post._id}`).subscribe({
      next: () => { this.posts.splice(index,1); this.filterPosts(); this.showNotification('success','Post supprimé 🗑️'); },
      error: err => { console.error(err); this.showNotification('error','Erreur suppression post ❌'); }
    });
  }

  private showNotification(type:'success'|'error',message:string) {
    this.notification={type,message};
    setTimeout(()=>this.notification=null,3000);
  }

  // ===================== JOUEURS =====================
  loadJoueurs() {
    this.loadingJoueurs=true;
    this.utilisateurService.getUsers().subscribe({
      next: data => {
        const joueurs: User[] = data.filter(u=>u.role==='joueur');
        if (['admin','super admin'].includes(this.userRole || '')) this.joueurs=joueurs;
        else if (['coach','joueur'].includes(this.userRole || '') && this.currentUser?.equipe) this.joueurs=joueurs.filter(u=>u.equipe===this.currentUser!.equipe);
        else this.joueurs=[];
        this.loadingJoueurs=false;
      },
      error: err => { console.error(err); this.joueurs=[]; this.loadingJoueurs=false; }
    });
  }

  // ===================== CLASSEMENT =====================
  loadClassements() {
    this.loadingClassement=true;
    this.http.get<ClassementCategorie[]>(this.apiClassementUrl).subscribe({
      next: data => {
        this.classement=data;
        if (['Admin','Super Admin'].includes(this.userRole || '')) {
          this.selectedEquipe=null;
          this.selectedCategorie=this.categories[0];
        } else if (this.currentUser?.equipe) {
          this.selectedEquipe=this.currentUser.equipe;
        }
        this.loadingClassement=false;
      },
      error: err => { console.error(err); this.loadingClassement=false; }
    });
  }

  get classementFiltre(): ClassementCategorie[] {
    if (['admin','super admin'].includes(this.userRole || '')) {
      return this.selectedCategorie ? this.classement.filter(c=>c.categorie===this.selectedCategorie) : this.classement;
    }
    if (!this.selectedEquipe) return [];
    const categories=this.equipeMapping[this.selectedEquipe]||[];
    return this.classement.filter(c=>categories.includes(c.categorie));
  }

  selectCategorie(categorie:string) { this.selectedCategorie=categorie; }
  selectEquipe(equipe:string) { this.selectedEquipe=equipe; localStorage.setItem('lastEquipe',equipe); }

  isHighlightedEquipe(equipe:Equipe):boolean { return equipe.equipe==='DANJOUTIN ANDELNANS'; }

  saveCategorie(categorie:ClassementCategorie) {
    if(!categorie._id) return;
    this.isSaving=true;
    categorie.equipes.sort((a,b)=>b.pts-a.pts||b.dif-a.dif||b.bp-a.bp);
    categorie.equipes.forEach((e,i)=>e.position=i+1);
    const minTime=3000; const startTime=Date.now();
    this.http.put(`${this.apiClassementUrl}/${categorie._id}`,{equipes:categorie.equipes}).subscribe({
      next:()=>{
        const remaining=minTime-(Date.now()-startTime);
        setTimeout(()=>{this.isSaving=false; this.showNotification('success',`Classement de ${categorie.categorie} mis à jour !`);},remaining>0?remaining:0);
      },
      error:(err)=>{
        const remaining=minTime-(Date.now()-startTime);
        setTimeout(()=>{this.isSaving=false; console.error(err); this.showNotification('error',`Erreur mise à jour ${categorie.categorie}`);},remaining>0?remaining:0);
      }
    });
  }

  // ===================== PROFIL =====================
  updateProfile() {
    if(!this.currentUser?._id) return;
    this.http.put(`http://localhost:3000/api/users/${this.currentUser._id}`,this.currentUser)
      .subscribe({
        next:()=>this.showNotification('success','Profil mis à jour ✅'),
        error: err=>{ console.error(err); this.showNotification('error','Erreur mise à jour profil ❌'); }
      });
  }

  deleteAccount() {
    if(!this.currentUser?._id || !confirm('Voulez-vous vraiment supprimer votre compte ?')) return;
    this.http.delete(`http://localhost:3000/api/users/${this.currentUser._id}`).subscribe({
      next:()=>{ this.showNotification('success','Compte supprimé ✅'); this.logout(); },
      error: err=>{ console.error(err); this.showNotification('error','Erreur suppression compte ❌'); }
    });
  }

  logout() { localStorage.removeItem('utilisateur'); localStorage.removeItem('lastSection'); this.router.navigate(['/connexion']); }

  // ===================== SECTION =====================
  setSection(section:string) {
    this.selectedSection=section;
    localStorage.setItem('lastSection',section);
    switch(section){
      case 'match': this.loadMatches(); break;
      case 'communiquer': this.loadCommuniques(); break;
      case 'actus': this.loadPosts(); break;
      case 'joueurs': this.loadJoueurs(); break;
      case 'classement': this.loadClassements(); break;
    }
  }

  // ===================== UTILS =====================
  formatMediaUrl(url?:string){ return url?.startsWith('http')?url:`http://localhost:3000/uploads/${url}`; }
}
