import { Component } from '@angular/core';
import { CreerMatchC } from "../../Bouton/creer-match-c/creer-match-c";
import { CreerConvocationsC } from "../../Bouton/creer-convocations-c/creer-convocations-c";
import { ActusC } from "../../Bouton/creer-post-c/creer-post-c";
import { CreerEventC } from '../../Bouton/creer-event-c/creer-event-c';

@Component({
  selector: 'app-acces-rapide-c',
  imports: [CreerMatchC, CreerConvocationsC, ActusC,CreerEventC],
  templateUrl: './acces-rapide-c.html',
  styleUrl: './acces-rapide-c.css'
})
export class AccesRapideC {

}
