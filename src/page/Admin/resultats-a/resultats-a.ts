import { Component } from '@angular/core';
import { HeaderA } from '../../../component/Admin/header-a/header-a';
import { FooterA } from '../../../component/Admin/footer-a/footer-a';
import { Classement } from '../../../component/classement/classement';

@Component({
  selector: 'app-resultats-a',
  imports: [HeaderA,FooterA,Classement],
  templateUrl: './resultats-a.html',
  styleUrl: './resultats-a.css'
})
export class ResultatsA {

}
