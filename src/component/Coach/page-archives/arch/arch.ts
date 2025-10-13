import { Component, OnInit } from '@angular/core';
import { ArchService, Archive } from '../../../../../services/arch.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-arch',
  templateUrl: './arch.html',
  styleUrls: ['./arch.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class Arch implements OnInit {
  archives: Archive[] = [];
  currentIndex = 0;

  title = '';
  description = '';
  date = '';
  selectedFile: File | null = null;
  showPopup = false;

  constructor(private archService: ArchService) {}

  ngOnInit(): void {
    console.log('💡 Arch component initialized');
    // this.loadArchives();

    setInterval(() => {
      if (this.archives.length > 0) {
        this.currentIndex = (this.currentIndex + 1) % this.archives.length;
      }
    }, 5000);
  }

  // loadArchives(): void {
  //   console.log('🔄 Chargement des archives...');
  //   this.archService.getArchives().subscribe({
  //     next: (data) => {
  //       console.log('✅ Archives récupérées:', data);
  //       this.archives = data;
  //     },
  //     error: (err) => console.error('❌ Erreur API:', err)
  //   });
  // }

  // onFileSelected(event: any): void {
  //   this.selectedFile = event.target.files[0];
  //   console.log('📂 Fichier sélectionné:', this.selectedFile);
  // }

  // addArchive(): void {
  //   if (!this.selectedFile || !this.title || !this.date) {
  //     return alert('Tous les champs sont requis !');
  //   }

  //   const formData = new FormData();
  //   formData.append('file', this.selectedFile);
  //   formData.append('title', this.title);
  //   formData.append('description', this.description);
  //   formData.append('date', this.date);

  //   this.archService.addArchive(formData).subscribe({
  //     next: (res) => {
  //       console.log('✅ Archive ajoutée en DB:', res);
  //       this.selectedFile = null;
  //       this.title = '';
  //       this.description = '';
  //       this.date = '';
  //       this.showPopup = false;
  //       this.loadArchives();
  //     },
  //     error: (err) => console.error('❌ Erreur ajout archive:', err)
  //   });
  // }
}
