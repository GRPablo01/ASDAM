import { Routes } from '@angular/router';
import { Connexion } from '../Page/auth/connexion/connexion';
import { Inscription } from '../Page/auth/inscription/inscription';
import { Accueil } from '../Page/Public/accueil/accueil';
import { Gestion } from '../Page/Public/gestion/gestion';
import { Utilisateur } from '../Page/Public/utilisateur/utilisateur';
import { ModifierUser } from '../Page/Public/modifier-user/modifier-user';
import { SupprimerUser } from '../Page/Public/suprimer-user/suprimer-user';







/* ---- TOUT --- */
export const routes: Routes = [
    { path: '', component: Connexion },
    { path: 'connexion', component: Connexion },
    { path: 'inscription', component: Inscription },
    { path: 'accueil', component: Accueil },
    { path: 'gestion', component: Gestion },
    { path: 'user', component: Utilisateur },
    { path: 'users/edit/:id', component: ModifierUser},
    { path: 'users/delete/:id', component: SupprimerUser }

];
