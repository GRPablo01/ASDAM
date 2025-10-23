import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError, throwError, interval, Subscription } from 'rxjs';

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
  selector: 'app-actus',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './actus.html',
  styleUrls: ['./actus.css']
})
export class Actus implements OnInit, OnDestroy {
  refreshSub?: Subscription;
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
  animatingLike: string | null = null;

  notification: { type: 'success' | 'error' | 'delete'; message: string } | null = null;

  @ViewChild('mediaInput') mediaInput!: ElementRef<HTMLInputElement>;
  @ViewChild('editMediaInput') editMediaInput!: ElementRef<HTMLInputElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(private http: HttpClient, private renderer: Renderer2) {}

  ngOnInit() {
    const storedUser = localStorage.getItem('utilisateur');
    if (storedUser) this.currentUser = JSON.parse(storedUser);
    this.loadPosts();
    this.refreshSub = interval(10000).subscribe(() => this.loadPosts());
  }

  ngOnDestroy() {
    this.refreshSub?.unsubscribe();
  }

  private showNotificationFn(type: 'success' | 'error' | 'delete', message: string) {
    this.notification = { type, message };
    setTimeout(() => this.notification = null, 3000);
  }

  blockScroll() { this.renderer.setStyle(document.body, 'overflow', 'hidden'); }
  unblockScroll() { this.renderer.setStyle(document.body, 'overflow', 'auto'); }

  get currentInitiales(): string {
    if (!this.currentUser) return 'UU';
    return this.currentUser.initiale ?? ((this.currentUser.prenom?.[0] ?? '') + (this.currentUser.nom?.[0] ?? '')).toUpperCase();
  }

  get currentFullName(): string {
    if (!this.currentUser) return 'Utilisateur';
    return `${this.currentUser.prenom ?? ''} ${this.currentUser.nom ?? ''}`.trim();
  }

  canCreatePost(): boolean {
    return !!this.currentUser?.role && ['coach', 'admin', 'super admin'].includes(this.currentUser.role.toLowerCase());
  }

  canDeletePost(): boolean { return this.canCreatePost(); }

  filterPosts() {
    const query = this.searchQuery.toLowerCase();
    this.filteredPosts = this.posts.filter(p => p.content.toLowerCase().includes(query));
  }

  loadPosts() {
    this.http.get<Post[]>('http://localhost:3000/api/posts').pipe(
      catchError(err => { 
        console.error(err); 
        this.showNotificationFn('error', 'Impossible de charger les actualités <i class="fa-solid fa-circle-xmark"></i>'); 
        return throwError(() => err); 
      })
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
      // this.showNotificationFn('success', 'Actualités chargées avec succès <i class="fa-solid fa-circle-check"></i>');
    });
  }

  openCreatePostModal() { 
    if (this.canCreatePost()) { 
      this.showCreateModal = true; 
      this.blockScroll(); 
    } else {
      this.showNotificationFn('error', 'Action non autorisée <i class="fa-solid fa-circle-xmark"></i>');
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
    if (this.editMediaInput) this.editMediaInput.nativeElement.value = '';
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

  closeCommentsModal() {
    this.showCommentsModal = false;
    this.selectedPost = null;
    this.selectedPostComments = [];
    this.unblockScroll();
  }

  toggleComments(post: Post) { post.showAllComments = !post.showAllComments; }

  get paginatedComments() {
    const start = (this.commentsPage - 1) * this.commentsPerPage;
    return this.selectedPostComments.slice(start, start + this.commentsPerPage);
  }

  nextCommentsPage() { if (this.commentsPage < this.totalCommentPages) this.commentsPage++; }
  prevCommentsPage() { if (this.commentsPage > 1) this.commentsPage--; }

  openMediaSelector() { this.mediaInput.nativeElement.click(); }

  onMediaSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.newPostMedia = file;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => this.newPostMediaPreview = reader.result as string;
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      const video = document.createElement('video');
      video.src = url;
      video.onloadedmetadata = () => {
        if (video.duration > 15) {
          this.showNotificationFn('error', 'La vidéo doit durer moins de 15 secondes <i class="fa-solid fa-circle-xmark"></i>');
          this.removeMedia();
        } else this.newPostMediaPreview = url;
      };
    } else {
      this.showNotificationFn('error', 'Type de fichier non supporté <i class="fa-solid fa-circle-xmark"></i>');
      this.removeMedia();
    }
  }

  removeMedia() {
    if (this.newPostMediaPreview && this.newPostMedia?.type.startsWith('video/')) URL.revokeObjectURL(this.newPostMediaPreview);
    this.newPostMedia = null;
    this.newPostMediaPreview = null;
    if (this.mediaInput) this.mediaInput.nativeElement.value = '';
  }

  createPost() {
    if (!this.canCreatePost() || !this.currentUser) { 
      this.showNotificationFn('error', 'Action non autorisée <i class="fa-solid fa-circle-xmark"></i>'); 
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
      this.showNotificationFn('success', 'Publication créée avec succès <i class="fa-solid fa-circle-check"></i>');
    };

    if (!this.newPostMedia) {
      this.http.post<Post>(url, newPost).subscribe({ 
        next: handleSuccess, 
        error: err => { 
          console.error(err); 
          this.loading = false; 
          this.showNotificationFn('error','Erreur lors de la création du post <i class="fa-solid fa-circle-xmark"></i>'); 
        } 
      });
    } else {
      const formData = new FormData();
      formData.append('content', newPost.content || '');
      formData.append('user', newPost.user || '');
      formData.append('initials', newPost.initials || '');
      formData.append('media', this.newPostMedia, this.newPostMedia.name);
      this.http.post<Post>(url, formData).subscribe({ 
        next: handleSuccess, 
        error: err => { 
          console.error(err); 
          this.loading = false; 
          this.showNotificationFn('error','Erreur lors de la création du post <i class="fa-solid fa-circle-xmark"></i>'); 
        } 
      });
    }
  }

  deletePost(post: Post, index: number) {
    if (!post._id || !confirm('Voulez-vous supprimer ce post ?')) return;
    this.http.delete<void>(`http://localhost:3000/api/posts/${post._id}`).subscribe({
      next: () => { 
        this.posts.splice(index, 1); 
        this.filterPosts(); 
        this.showNotificationFn('delete','Post supprimé <i class="fa-solid fa-trash"></i>'); 
      },
      error: err => { 
        console.error(err); 
        this.showNotificationFn('error','Erreur lors de la suppression du post <i class="fa-solid fa-circle-xmark"></i>'); 
      }
    });
  }

  togglePostMenu(i: number) { this.posts[i].showMenu = !this.posts[i].showMenu; }

  addComment(post: Post & { newComment?: string }) {
    if (!this.currentUser || !post._id) return;
    const text = post.newComment?.trim();
    if (!text) return;
  
    const comment: Comment = { user: this.currentFullName, initials: this.currentInitiales, text, time: new Date().toISOString() };
  
    this.http.post<Post>(`http://localhost:3000/api/posts/${post._id}/comment`, comment).pipe(
      catchError(err => { 
        console.error(err); 
        this.showNotificationFn('error','Impossible d\'ajouter le commentaire <i class="fa-solid fa-circle-xmark"></i>'); 
        return throwError(() => err); 
      })
    ).subscribe(updated => {
      if (updated.comments) {
        post.comments.length = 0;
        post.comments.push(...updated.comments);
      }
      post.newComment = '';
      this.showNotificationFn('success','Commentaire ajouté <i class="fa-solid fa-circle-check"></i>');
    });
  }

  deleteComment(post: Post & { comments: Comment[] }, comment: Comment) {
    if (!post._id || !comment._id || !this.canDeleteComment(comment.user)) return;
    if (!confirm('Voulez-vous vraiment supprimer ce commentaire ?')) return;
    this.http.delete<Post>(`http://localhost:3000/api/posts/${post._id}/comment/${comment._id}`).subscribe({
      next: updatedPost => { 
        post.comments = updatedPost.comments || []; 
        this.showNotificationFn('delete','Commentaire supprimé <i class="fa-solid fa-trash"></i>'); 
      },
      error: err => { 
        console.error(err); 
        this.showNotificationFn('error','Erreur lors de la suppression du commentaire <i class="fa-solid fa-circle-xmark"></i>'); 
      }
    });
  }

  canDeleteComment(commentUser?: string): boolean {
    const role = this.currentUser?.role?.toLowerCase() ?? '';
    return ['coach', 'admin', 'super admin'].includes(role) || this.currentFullName === commentUser;
  }

  toggleLike(post: Post) {
    if (!post._id || !this.currentUser?._id) return;
    this.animatingLike = post._id;
    this.http.post<{ likes: number; isLiked: boolean }>(`http://localhost:3000/api/posts/${post._id}/like`, { userId: this.currentUser._id })
      .subscribe({ 
        next: res => { 
          post.isLiked = res.isLiked; 
          post.likes = res.likes; 
          this.showNotificationFn(res.isLiked ? 'success' : 'delete', res.isLiked ? 'Post aimé <i class="fa-solid fa-heart"></i>' : 'Like retiré');
        }, 
        error: err => {
          console.error(err);
          this.showNotificationFn('error','Erreur lors du like <i class="fa-solid fa-circle-xmark"></i>');
        }, 
        complete: () => setTimeout(() => this.animatingLike = null, 1000) 
      });
  }

  bookmarkPost(post: Post) {
    post.isBookmarked = !post.isBookmarked;
    if (!post._id) return;
    this.http.put<Post>(`http://localhost:3000/api/posts/${post._id}`, { isBookmarked: post.isBookmarked })
      .subscribe({ 
        error: err => { 
          console.error(err); 
          post.isBookmarked = !post.isBookmarked; 
          this.showNotificationFn('error','Erreur lors du bookmark <i class="fa-solid fa-circle-xmark"></i>');
        } 
      });
  }

  sharePost(post: Post) {
    if (!post._id) return;
    this.http.post<Post>(`http://localhost:3000/api/posts/${post._id}/share`, {}).subscribe({
      next: u => { 
        post.shares = u.shares; 
        navigator.clipboard.writeText(`${window.location.origin}/posts/${post._id}`).then(() => 
          this.showNotificationFn('success','Lien copié dans le presse-papiers <i class="fa-solid fa-link"></i>')
        ); 
      },
      error: err => {
        console.error(err);
        this.showNotificationFn('error','Erreur lors du partage <i class="fa-solid fa-circle-xmark"></i>');
      }
    });
  }

  formatMediaUrl(url?: string) { return url?.startsWith('http') ? url : `http://localhost:3000/uploads/${url}`; }

  timeAgo(dateString: string | undefined): string {
    if (!dateString) return '';
    const diff = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000);
    if (diff < 60) return `il y a ${diff}s`;
    if (diff < 3600) return `il y a ${Math.floor(diff / 60)}min`;
    if (diff < 86400) return `il y a ${Math.floor(diff / 3600)}h`;
    if (diff < 2592000) return `il y a ${Math.floor(diff / 86400)}j`;
    if (diff < 31536000) return `il y a ${Math.floor(diff / 2592000)} mois`;
    return `il y a ${Math.floor(diff / 31536000)} an${Math.floor(diff / 31536000) > 1 ? 's' : ''}`;
  }

  onDrop(event: DragEvent) { event.preventDefault(); }
  onDragOver(event: DragEvent) { event.preventDefault(); }
}