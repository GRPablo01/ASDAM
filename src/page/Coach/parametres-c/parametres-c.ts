import { Component } from '@angular/core';
import { HeaderC } from '../../../component/Coach/header-c/header-c';
import { ParamC } from "../../../component/Coach/page-param/param-c/param-c";


@Component({
  selector: 'app-parametres-c',
  imports: [HeaderC, ParamC],
  templateUrl: './parametres-c.html',
  styleUrl: './parametres-c.css'
})
export class ParametresC {

}
