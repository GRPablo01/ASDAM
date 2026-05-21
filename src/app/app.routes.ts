import { Routes } from '@angular/router';
import { Connexion } from '../Page/auth/connexion/connexion';
import { Inscription } from '../Page/auth/inscription/inscription';
import { Accueil } from '../Page/Public/accueil/accueil';




/* ---- TOUT --- */
export const routes: Routes = [
    { path: '', component: Connexion },
    { path: 'connexion', component: Connexion },
    { path: 'inscription', component: Inscription },
    { path: 'accueil', component: Accueil },

];
