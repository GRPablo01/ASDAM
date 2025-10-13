import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Archive {
  date: string;
  title: string;
  description: string;
  file: string;
  type: 'image' | 'video';
}

@Injectable({ providedIn: 'root' })
export class ArchService {
  private apiUrl = 'http://localhost:3000/api/archives';

  constructor(private http: HttpClient) {}

  getArchives(): Observable<Archive[]> {
    return this.http.get<Archive[]>(this.apiUrl).pipe(
      map(archives =>
        archives.map(a => ({
          ...a,
          file: `http://localhost:3000${a.file}`
        }))
      )
    );
  }

  addArchive(formData: FormData): Observable<Archive> {
    return this.http.post<Archive>(this.apiUrl, formData);
  }
}
