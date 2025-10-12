import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

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
  likedBy?: string[]; // tableau des IDs utilisateurs ayant liké
}

interface LocalUser { 
  _id?: string; 
  prenom?: string; 
  nom?: string; 
  role?: string; 
  initiale?: string; 
}

@Component({
  selector: 'app-creer-post-c',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './creer-post-c.html',
  styleUrls: ['./creer-post-c.css']
})
export class ActusC implements OnInit {

  currentUser: LocalUser | null = null;

  posts: (Post & { newComment?: string; showMenu?: boolean })[] = [];
  filteredPosts: typeof this.posts = [];

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

  @ViewChild('mediaInput') mediaInput!: ElementRef<HTMLInputElement>;
  @ViewChild('editMediaInput') editMediaInput!: ElementRef<HTMLInputElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const storedUser = localStorage.getItem('utilisateur');
    if (storedUser) this.currentUser = JSON.parse(storedUser);
    this.loadPosts();
  }

  // --- Infos utilisateur ---
  get currentInitiales(): string {
    if (!this.currentUser) return 'UU';
    return this.currentUser.initiale ?? ((this.currentUser.prenom?.[0] ?? '') + (this.currentUser.nom?.[0] ?? '')).toUpperCase();
  }

  get currentFullName(): string {
    if (!this.currentUser) return 'Utilisateur';
    return `${this.currentUser.prenom ?? ''} ${this.currentUser.nom ?? ''}`.trim();
  }

  canCreatePost(): boolean {
    if (!this.currentUser?.role) return false;
    const role = this.currentUser.role.toLowerCase();
    return ['coach','admin','super admin'].includes(role);
  }

  // --- Filtrage ---
  filterPosts() {
    const query = this.searchQuery.toLowerCase();
    this.filteredPosts = this.posts.filter(p => p.content.toLowerCase().includes(query));
  }

  // --- Chargement des posts ---
  loadPosts() {
    this.http.get<Post[]>('http://localhost:3000/api/posts').pipe(
      catchError(err => { console.error(err); return throwError(() => err); })
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
    });
  }

  // --- Modal commentaires ---
  openCommentsModal(post: Post) {
    this.selectedPost = post;
    this.selectedPostComments = post.comments || [];
    this.commentsPage = 1;
    this.totalCommentPages = Math.ceil(this.selectedPostComments.length / this.commentsPerPage);
    this.showCommentsModal = true;
  }

  closeCommentsModal() {
    this.showCommentsModal = false;
    this.selectedPost = null;
    this.selectedPostComments = [];
  }

  get paginatedComments() {
    const start = (this.commentsPage - 1) * this.commentsPerPage;
    return this.selectedPostComments.slice(start, start + this.commentsPerPage);
  }

  nextCommentsPage() { if(this.commentsPage < this.totalCommentPages) this.commentsPage++; }
  prevCommentsPage() { if(this.commentsPage > 1) this.commentsPage--; }

  // --- Création post ---
  openCreatePostModal() { if(this.canCreatePost()) this.showCreateModal = true; }
  closeCreatePostModal() { this.showCreateModal = false; this.newPostContent = ''; this.removeMedia(); }

  openMediaSelector() { this.mediaInput.nativeElement.click(); }
  openFilePicker() { this.fileInput.nativeElement.click(); }

  onMediaSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0]; 
    if(!file) return;
    this.newPostMedia = file;

    if(file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => this.newPostMediaPreview = reader.result as string;
      reader.readAsDataURL(file);
    } else if(file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      const video = document.createElement('video');
      video.src = url;
      video.onloadedmetadata = () => {
        if(video.duration > 15){ alert("La vidéo doit durer moins de 15 secondes !"); this.removeMedia(); } 
        else this.newPostMediaPreview = url;
      }
    } else { alert("Type de fichier non supporté !"); this.removeMedia(); }
  }

  removeMedia() {
    if(this.newPostMediaPreview && this.newPostMedia?.type.startsWith('video/')) URL.revokeObjectURL(this.newPostMediaPreview);
    this.newPostMedia = null;
    this.newPostMediaPreview = null;
    this.mediaInput.nativeElement.value = '';
  }

  createPost() {
    if(!this.canCreatePost() || !this.currentUser){ alert('Action non autorisée !'); return; }
    if(!this.newPostContent.trim() && !this.newPostMedia) return;

    this.loading = true;
    const newPost: Partial<Post> = { 
      content: this.newPostContent, 
      user: this.currentFullName, 
      initials: this.currentInitiales, 
      likes:0, isLiked:false, isBookmarked:false, comments:[], shares:0,
      likedBy: []
    };
    const url = this.newPostMedia ? 'http://localhost:3000/api/posts/media' : 'http://localhost:3000/api/posts';

    if(!this.newPostMedia) {
      this.http.post<Post>(url,newPost).subscribe({
        next: p => this.addPostToList(p),
        error: err => { console.error(err); this.loading=false; alert('Erreur serveur'); }
      });
    } else {
      const formData = new FormData();
      formData.append('content', newPost.content || '');
      formData.append('user', newPost.user || '');
      formData.append('initials', newPost.initials || '');
      formData.append('media', this.newPostMedia, this.newPostMedia.name);
      this.http.post<Post>(url, formData).subscribe({
        next: p => this.addPostToList(p),
        error: err => { console.error(err); this.loading=false; alert('Erreur serveur'); }
      });
    }
  }

  private addPostToList(post: Post) {
    this.posts.unshift({...post, newComment:'', showMenu:false, mediaType:post.media?.endsWith('.mp4')?'video':post.media?'image':undefined, mediaUrl:post.media?this.formatMediaUrl(post.media):undefined, likedBy: post.likedBy ?? [], isLiked: post.likedBy?.includes(this.currentUser?._id || '') ?? false});
    this.newPostContent = '';
    this.removeMedia();
    this.loading = false;
    this.showCreateModal = false;
    this.filterPosts();
  }

  // --- Commentaires ---
  addComment(post: Post & { newComment?: string }) {
    if(!this.currentUser || !post._id) return;
    const text = post.newComment?.trim(); if(!text) return;
    const comment: Comment = { user: this.currentFullName, initials: this.currentInitiales, text, time: new Date().toISOString() };
    this.http.post<Post>(`http://localhost:3000/api/posts/${post._id}/comment`, comment)
      .pipe(catchError(err => { console.error(err); alert('Impossible d’ajouter le commentaire.'); return throwError(() => err); }))
      .subscribe(updated => { post.comments = updated.comments || []; post.newComment=''; });
  }
  
  // --- Likes globaux ---
  toggleLike(post: Post) {
    if(!post._id || !this.currentUser?._id) return;
    this.http.post<{likes:number, isLiked:boolean}>(`http://localhost:3000/api/posts/${post._id}/like`, { userId: this.currentUser._id }).subscribe({
      next: u => {
        post.isLiked = u.isLiked;
        post.likes = u.likes;
      },
      error: err => console.error(err)
    });
  }

  // --- Bookmarks ---
  bookmarkPost(post: Post) {
    post.isBookmarked = !post.isBookmarked;
    if(!post._id) return;
    this.http.put<Post>(`http://localhost:3000/api/posts/${post._id}`, { isBookmarked: post.isBookmarked }).subscribe({ error: err => { console.error(err); post.isBookmarked = !post.isBookmarked; }});
  }

  // --- Partage ---
  sharePost(post: Post) {
    if(!post._id) return;
    this.http.post<Post>(`http://localhost:3000/api/posts/${post._id}/share`, {}).subscribe({
      next: u => {
        post.shares = u.shares;
        navigator.clipboard.writeText(`${window.location.origin}/posts/${post._id}`).then(() => alert('Lien copié !'));
      },
      error: err => console.error(err)
    });
  }

  // --- Suppression post ---
  deletePost(post: Post, index: number) {
    if(!post._id || !confirm('Voulez-vous supprimer ce post ?')) return;
    this.http.delete<void>(`http://localhost:3000/api/posts/${post._id}`).subscribe({
      next: () => { this.posts.splice(index,1); this.filterPosts(); },
      error: err => console.error(err)
    });
  }

  togglePostMenu(i:number) { this.posts[i].showMenu = !this.posts[i].showMenu; }

  // --- Édition post ---
  openEditModal(post: Post) {
    this.editingPost = post;
    this.editingContent = post.content;
    this.editingMedia = null;
    this.editingMediaPreview = post.mediaUrl || null;
    this.showEditModal = true;
  }

  onEditMediaSelected(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0]; if(!f) return;
    this.editingMedia = f;
    if(f.type.startsWith('image/')) {
      const r = new FileReader(); r.onload = () => this.editingMediaPreview = r.result as string; r.readAsDataURL(f);
    } else if(f.type.startsWith('video/')) {
      const url = URL.createObjectURL(f);
      const v = document.createElement('video'); v.src = url;
      v.onloadedmetadata = () => {
        if(v.duration>30){ alert("La vidéo doit durer moins de 30 secondes !"); this.removeEditMedia(); }
        else this.editingMediaPreview = url;
      }
    } else { alert("Type de fichier non supporté !"); this.removeEditMedia(); }
  }

  removeEditMedia() {
    if(this.editingMediaPreview && this.editingMedia?.type.startsWith('video/')) URL.revokeObjectURL(this.editingMediaPreview);
    this.editingMedia = null;
    this.editingMediaPreview = this.editingPost?.mediaUrl || null;
    this.editMediaInput.nativeElement.value='';
  }

  saveEdit() {
    if(!this.editingPost || !this.editingPost._id) return;
    const content = this.editingContent.trim();
    if(!content && !this.editingMedia) return;
    const formData = new FormData();
    formData.append('content', content);
    formData.append('initials', this.currentInitiales);
    if(this.editingMedia) formData.append('media', this.editingMedia, this.editingMedia.name);

    this.http.put<Post>(`http://localhost:3000/api/posts/${this.editingPost._id}`, formData)
      .subscribe({
        next: updated => {
          const idx = this.posts.findIndex(p => p._id === updated._id);
          if(idx>-1) this.posts[idx] = { ...updated, newComment:'', showMenu:false, mediaType: updated.media?.endsWith('.mp4')?'video':updated.media?'image':undefined, mediaUrl: updated.media?this.formatMediaUrl(updated.media):undefined, likedBy: updated.likedBy ?? [], isLiked: updated.likedBy?.includes(this.currentUser?._id || '') ?? false };
          this.showEditModal = false;
          this.editingPost = null;
          this.filterPosts();
        },
        error: err => console.error(err)
      });
  }

  cancelEdit() {
    this.showEditModal = false;
    this.editingPost = null;
    this.editingMedia = null;
    this.editingMediaPreview = null;
    this.editingContent = '';
    this.editMediaInput.nativeElement.value = '';
  }

  deleteComment(post: Post & { comments: Comment[] }, comment: Comment) {
    if (!post._id || !comment._id || !this.canDeleteComment()) return;
    if (!confirm('Voulez-vous vraiment supprimer ce commentaire ?')) return;
    this.http.delete<Post>(`http://localhost:3000/api/posts/${post._id}/comment/${comment._id}`).subscribe({
      next: updatedPost => { post.comments = updatedPost.comments || []; },
      error: err => console.error('Erreur lors de la suppression du commentaire :', err)
    });
  }

  canDeleteComment(): boolean {
    const role = this.currentUser?.role?.toLowerCase() ?? '';
    return ['coach','admin','super admin'].includes(role);
  }

  
  // --- Helpers ---
  formatMediaUrl(url?: string) { return url?.startsWith('http') ? url : `http://localhost:3000/uploads/${url}`; }



  // Ajoutez cette propriété
isDragging = false;

// Ajoutez ces méthodes
onDragOver(event: DragEvent): void {
  event.preventDefault();
  this.isDragging = true;
}

onDragLeave(event: DragEvent): void {
  event.preventDefault();
  this.isDragging = false;
}

onDrop(event: DragEvent): void {
  event.preventDefault();
  this.isDragging = false;
  // Votre logique existante pour gérer le drop
}
}
