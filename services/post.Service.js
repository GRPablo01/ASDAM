// src/app/services/post.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Post, Comment } from '../../Model/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:3000/api/posts';

  constructor(private http: HttpClient) {}

  /** 🔹 Récupère tous les posts */
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl).pipe(
      catchError(err => {
        console.error('Erreur récupération posts:', err);
        return throwError(() => err);
      })
    );
  }

  /** 🔹 Crée un post (avec ou sans média) */
  createPost(post: Post, media?: File): Observable<Post> {
    if (!media) {
      return this.http.post<Post>(this.apiUrl, post).pipe(
        catchError(err => {
          console.error('Erreur création post:', err);
          return throwError(() => err);
        })
      );
    }

    const formData = new FormData();
    formData.append('content', post.content);
    formData.append('user', post.user);
    formData.append('likes', post.likes?.toString() ?? '0');
    formData.append('isLiked', post.isLiked?.toString() ?? 'false');
    formData.append('isBookmarked', post.isBookmarked?.toString() ?? 'false');
    formData.append('shares', post.shares?.toString() ?? '0');
    formData.append('media', media, media.name);

    return this.http.post<Post>(`${this.apiUrl}/media`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map((event: HttpEvent<any>) => {
        if (event.type === HttpEventType.Response) {
          return event.body as Post;
        }
        return null as any;
      }),
      catchError(err => {
        console.error('Erreur upload média:', err);
        return throwError(() => err);
      })
    );
  }

  /** 🔹 Ajouter un commentaire */
  addComment(postId: string, comment: Comment): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/${postId}/comments`, comment).pipe(
      catchError(err => {
        console.error('Erreur ajout commentaire:', err);
        return throwError(() => err);
      })
    );
  }

  /** 🔹 Liker / unliker un post */
  likePost(postId: string): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/${postId}/like`, {}).pipe(
      catchError(err => {
        console.error('Erreur like post:', err);
        return throwError(() => err);
      })
    );
  }

  /** 🔹 Mise à jour d’un post */
  updatePost(postId: string, data: Partial<Post>): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/${postId}`, data).pipe(
      catchError(err => {
        console.error('Erreur mise à jour post:', err);
        return throwError(() => err);
      })
    );
  }

  /** 🔹 Partager un post */
  sharePost(postId: string): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/${postId}/share`, {}).pipe(
      catchError(err => {
        console.error('Erreur partage post:', err);
        return throwError(() => err);
      })
    );
  }

  /** 🔹 Supprimer un post */
  deletePost(postId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${postId}`).pipe(
      catchError(err => {
        console.error('Erreur suppression post:', err);
        return throwError(() => err);
      })
    );
  }
}
