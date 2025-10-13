import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
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
  selector: 'app-actus-c',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './actus-c.html',
  styleUrls: ['./actus-c.css']
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
  notification: { type: 'success'|'error', message: string } | null = null;

  animatingLike: string | null = null;

  @ViewChild('mediaInput') mediaInput!: ElementRef<HTMLInputElement>;
  @ViewChild('editMediaInput') editMediaInput!: ElementRef<HTMLInputElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(private http: HttpClient, private renderer: Renderer2) {}

  ngOnInit() {
    const storedUser = localStorage.getItem('utilisateur');
    if (storedUser) this.currentUser = JSON.parse(storedUser);
    this.loadPosts();
  }

  // --- Scroll ---
  blockScroll() { this.renderer.setStyle(document.body, 'overflow', 'hidden'); }
  unblockScroll() { this.renderer.setStyle(document.body, 'overflow', 'auto'); }

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
    return ['coach','admin','super admin'].includes(this.currentUser.role.toLowerCase());
  }

  // --- Filtrage ---
  filterPosts() {
    const query = this.searchQuery.toLowerCase();
    this.filteredPosts = this.posts.filter(p => p.content.toLowerCase().includes(query));
  }

  // --- Chargement posts ---
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

  // --- Modals ---
  openCreatePostModal() { 
    if(this.canCreatePost()) { 
      this.showCreateModal = true; 
      this.blockScroll(); 
    }
  }
  closeCreatePostModal() { 
    this.showCreateModal = false; 
    this.newPostContent = ''; 
    this.removeMedia(); 
    this.unblockScroll(); 
  }

  openEditModal(post: Post) { 
    this.editingPost = post;
    this.editingContent = post.content;
    this.editingMedia = null;
    this.editingMediaPreview = post.mediaUrl || null;
    this.showEditModal = true;
    this.blockScroll();
  }
  cancelEdit() {
    this.showEditModal = false;
    this.editingPost = null;
    this.editingMedia = null;
    this.editingMediaPreview = null;
    this.editingContent = '';
    this.editMediaInput.nativeElement.value = '';
    this.unblockScroll();
  }

  openCommentsModal(post: Post) {
    this.selectedPost = post;
    this.selectedPostComments = post.comments || [];
    this.commentsPage = 1;
    this.totalCommentPages = Math.ceil(this.selectedPostComments.length / this.commentsPerPage);
    this.showCommentsModal = true;
    this.blockScroll();
  }

  toggleComments(post: any): void {
    post.showAllComments = !post.showAllComments;
  }
  
  closeCommentsModal() { 
    this.showCommentsModal = false; 
    this.selectedPost = null; 
    this.selectedPostComments = [];
    this.unblockScroll();
  }

  get paginatedComments() {
    const start = (this.commentsPage - 1) * this.commentsPerPage;
    return this.selectedPostComments.slice(start, start + this.commentsPerPage);
  }
  nextCommentsPage() { if(this.commentsPage < this.totalCommentPages) this.commentsPage++; }
  prevCommentsPage() { if(this.commentsPage > 1) this.commentsPage--; }

  // --- Création Post ---
  openMediaSelector() { this.mediaInput.nativeElement.click(); }
  openFilePicker() { this.fileInput.nativeElement.click(); }

  onMediaSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
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
        if(video.duration > 15) { 
          this.showNotification('error', 'La vidéo doit durer moins de 15 secondes ❌');
          this.removeMedia();
        } else this.newPostMediaPreview = url;
      }
    } else { 
      this.showNotification('error', 'Type de fichier non supporté ❌');
      this.removeMedia();
    }
  }

  removeMedia() {
    if(this.newPostMediaPreview && this.newPostMedia?.type.startsWith('video/')) URL.revokeObjectURL(this.newPostMediaPreview);
    this.newPostMedia = null;
    this.newPostMediaPreview = null;
    this.mediaInput.nativeElement.value = '';
  }

  createPost() {
    if (!this.canCreatePost() || !this.currentUser) { 
      this.showNotification('error', 'Action non autorisée ❌'); 
      return; 
    }
    if (!this.newPostContent.trim() && !this.newPostMedia) return;

    this.loading = true;

    const newPost: Partial<Post> = { 
      content: this.newPostContent, 
      user: this.currentFullName, 
      initials: this.currentInitiales, 
      likes: 0, 
      isLiked: false, 
      isBookmarked: false, 
      comments: [], 
      shares: 0,
      likedBy: []
    };

    const url = this.newPostMedia ? 'http://localhost:3000/api/posts/media' : 'http://localhost:3000/api/posts';

    const handleSuccess = (p: Post) => {
      const formattedPost: Post & { newComment?: string; showMenu?: boolean } = {
        ...p,
        newComment: '',
        showMenu: false,
        mediaType: p.media?.endsWith('.mp4') ? 'video' : p.media ? 'image' : undefined,
        mediaUrl: p.media ? this.formatMediaUrl(p.media) : undefined,
        likedBy: p.likedBy ?? [],
        isLiked: p.likedBy?.includes(this.currentUser?._id || '') ?? false
      };
      this.posts.unshift(formattedPost);
      this.filterPosts();
      this.newPostContent = '';
      this.removeMedia();
      this.showCreateModal = false;
      this.loading = false;
      this.unblockScroll();
      this.showNotification('success', 'Publication créée avec succès 🎉');
    };

    if (!this.newPostMedia) {
      this.http.post<Post>(url, newPost).subscribe({
        next: handleSuccess,
        error: err => { console.error(err); this.loading = false; this.showNotification('error', 'Erreur lors de la création du post ❌'); }
      });
    } else {
      const formData = new FormData();
      formData.append('content', newPost.content || '');
      formData.append('user', newPost.user || '');
      formData.append('initials', newPost.initials || '');
      formData.append('media', this.newPostMedia, this.newPostMedia.name);

      this.http.post<Post>(url, formData).subscribe({
        next: handleSuccess,
        error: err => { console.error(err); this.loading = false; this.showNotification('error', 'Erreur lors de la création du post ❌'); }
      });
    }
  }

  // --- Commentaires ---
  addComment(post: Post & { newComment?: string }) {
    if(!this.currentUser || !post._id) return;
    const text = post.newComment?.trim(); if(!text) return;
    const comment: Comment = { user: this.currentFullName, initials: this.currentInitiales, text, time: new Date().toISOString() };
    this.http.post<Post>(`http://localhost:3000/api/posts/${post._id}/comment`, comment)
      .pipe(catchError(err => { console.error(err); this.showNotification('error','Impossible d’ajouter le commentaire ❌'); return throwError(() => err); }))
      .subscribe(updated => { post.comments = updated.comments || []; post.newComment=''; this.showNotification('success','Commentaire ajouté ✅'); });
  }

  deleteComment(post: Post & { comments: Comment[] }, comment: Comment) {
    if (!post._id || !comment._id || !this.canDeleteComment()) return;
    if (!confirm('Voulez-vous vraiment supprimer ce commentaire ?')) return;
    this.http.delete<Post>(`http://localhost:3000/api/posts/${post._id}/comment/${comment._id}`).subscribe({
      next: updatedPost => { post.comments = updatedPost.comments || []; this.showNotification('success','Commentaire supprimé 🗑️'); },
      error: err => { console.error(err); this.showNotification('error','Erreur suppression commentaire ❌'); }
    });
  }

  canDeleteComment(): boolean {
    const role = this.currentUser?.role?.toLowerCase() ?? '';
    return ['coach','admin','super admin'].includes(role);
  }

  toggleLike(post: Post): void {
    if (!post._id || !this.currentUser?._id) return;
    this.animatingLike = post._id;
    this.http.post<{ likes: number; isLiked: boolean }>(
      `http://localhost:3000/api/posts/${post._id}/like`,
      { userId: this.currentUser._id }
    ).subscribe({
      next: (res) => { post.isLiked = res.isLiked; post.likes = res.likes; },
      error: (err) => console.error('Erreur lors du like :', err),
      complete: () => setTimeout(() => this.animatingLike = null, 1000)
    });
  }

  bookmarkPost(post: Post) {
    post.isBookmarked = !post.isBookmarked;
    if(!post._id) return;
    this.http.put<Post>(`http://localhost:3000/api/posts/${post._id}`, { isBookmarked: post.isBookmarked })
      .subscribe({ error: err => { console.error(err); post.isBookmarked = !post.isBookmarked; }});
  }

  sharePost(post: Post) {
    if(!post._id) return;
    this.http.post<Post>(`http://localhost:3000/api/posts/${post._id}/share`, {}).subscribe({
      next: u => {
        post.shares = u.shares;
        navigator.clipboard.writeText(`${window.location.origin}/posts/${post._id}`).then(() => this.showNotification('success','Lien copié ✅'));
      },
      error: err => console.error(err)
    });
  }

  deletePost(post: Post, index: number) {
    if(!post._id || !confirm('Voulez-vous supprimer ce post ?')) return;
    this.http.delete<void>(`http://localhost:3000/api/posts/${post._id}`).subscribe({
      next: () => { this.posts.splice(index,1); this.filterPosts(); this.showNotification('success','Post supprimé 🗑️'); },
      error: err => { console.error(err); this.showNotification('error','Erreur lors de la suppression ❌'); }
    });
  }

  togglePostMenu(i:number) { this.posts[i].showMenu = !this.posts[i].showMenu; }

  formatMediaUrl(url?: string) { return url?.startsWith('http') ? url : `http://localhost:3000/uploads/${url}`; }

  private showNotification(type: 'success'|'error', text: string) {
    this.notification = {type, message: text};
    setTimeout(() => this.notification = null, 3000);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

}
