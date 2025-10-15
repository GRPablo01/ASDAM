import { Component,HostListener, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HeaderC } from "../../../component/Coach/header-c/header-c";
import { ProfilUser } from "../../../component/Coach/page-Profil/profil-user/profil-user";
import { CreerMatchC } from "../../../component/Coach/Bouton/creer-match-c/creer-match-c";
import { CreerConvocationsC } from "../../../component/Coach/Bouton/creer-convocations-c/creer-convocations-c";
import { FooterC } from "../../../component/Coach/footer-c/footer-c";

@Component({
  selector: 'app-profil-c',
  imports: [ HeaderC, ProfilUser, CreerMatchC, CreerConvocationsC, FooterC],
  templateUrl: './profil-c.html',
  styleUrl: './profil-c.css'
})
export class ProfilC implements OnInit {

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    // Si on est tout en haut, reset le scroll à 0
    if (scrollTop < 0) {
      window.scrollTo(0, 0);
    }

    // Si on est tout en bas, reset le scroll au max
    if (scrollTop + clientHeight > scrollHeight) {
      window.scrollTo(0, scrollHeight - clientHeight);
    }
  }
  

    constructor(private titleService: Title) {}
  
    ngOnInit(): void {
      // ✅ Titre dynamique
      this.titleService.setTitle('TEAM ASDAM | Profil - Coach ');
    }
  
  

}
