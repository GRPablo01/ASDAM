import { Component } from '@angular/core';
import { HeaderC } from "../../../component/Coach/header-c/header-c";
import { FooterC } from "../../../component/Coach/footer-c/footer-c";
import { ConvoqueJ } from '../../../component/Joueur/page-Convocation/convoque-j/convoque-j';

@Component({
  selector: 'app-convocation-c',
  imports: [HeaderC, FooterC, ConvoqueJ],
  templateUrl: './convocation-c.html',
  styleUrl: './convocation-c.css'
})
export class ConvocationC {

}
