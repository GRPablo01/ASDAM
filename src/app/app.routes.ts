import { Routes } from '@angular/router';

/* ---- TOUT LE MONDE ----*/
import { Inscription } from '../page/inscription/inscription';
import { Connexion } from '../page/connexion/connexion';

import { Accueil } from '../page/accueil/accueil';
import { Actualite } from '../page/actualite/actualite';
import { Communiquer } from '../page/communiquer/communiquer';
import { Match } from '../page/match/match';
import { Planning } from '../page/planning/planning';
import { Dashboard } from '../page/dashboard/dashboard';
import { Messages } from '../page/messages/messages';
import { Classement } from '../page/classement/classement';
import { Utilisateur } from '../page/utilisateur/utilisateur';
import { Convocation } from '../page/convocation/convocation';


/* ---- TOUT --- */
export const routes: Routes = [
    { path: '', component: Connexion },
    { path: 'connexion', component: Connexion },
    { path: 'inscription', component: Inscription },
    { path: 'accueil', component: Accueil},
    { path: 'actualite', component: Actualite},
    { path: 'communiques', component: Communiquer},
    { path: 'match', component: Match},
    { path: 'planning', component: Planning},
    { path: 'dashboard', component: Dashboard},
    { path: 'messages', component: Messages},
    { path: 'classement', component: Classement},
    { path: 'utilisateur', component: Utilisateur},
    { path: 'convocations', component: Convocation},


];
