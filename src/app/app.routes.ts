import { Routes } from '@angular/router';
import { Connexion } from '../Page/auth/connexion/connexion';
import { Inscription } from '../Page/auth/inscription/inscription';
import { Accueil } from '../Page/Public/accueil/accueil';
import { Gestion } from '../Page/Public/gestion/gestion';
import { Utilisateur } from '../Page/Public/utilisateur/utilisateur';
import { ModifierUser } from '../Page/Public/modifier-user/modifier-user';
import { SupprimerUser } from '../Page/Public/suprimer-user/suprimer-user';
import { Contenue } from '../Page/Public/contenue/contenue';
import { Evenement } from '../Page/Public/evenement/evenement';
import { SupriperEvent } from '../Page/Public/supriper-event/supriper-event';
import { ModifierEvent } from '../Page/Public/modifier-event/modifier-event';
import { Match2 } from '../Page/Public/match2/match2';
import { ModifierMatch } from '../Page/Public/modifier-match/modifier-match';
import { SuprimerMatch } from '../Page/Public/suprimer-match/suprimer-match';
import { DashBoard } from '../Page/Public/dash-board/dash-board';
import { CreationActus } from '../Page/Public/creation-actus/creation-actus';
import { CreationEvent } from '../Page/Public/creation-event/creation-event';
import { CreationConvoque } from '../Page/Public/creation-convoque/creation-convoque';
import { CreationMatch } from '../Page/Public/creation-match/creation-match';
import { CreationEquipe } from '../Page/Public/creation-equipe/creation-equipe';
import { CreationComuniquer } from '../Page/Public/creation-comuniquer/creation-comuniquer';
import { Equipe } from '../Page/Public/equipe/equipe';
import { MesMatch } from '../Page/Public/mes-match/mes-match';
import { Convocation } from '../Page/Public/convocation/convocation';




/* ---- TOUT --- */
export const routes: Routes = [
    { path: '', component: Connexion },
    { path: 'connexion', component: Connexion },
    { path: 'inscription', component: Inscription },
    { path: 'accueil', component: Accueil },
    { path: 'gestion', component: Gestion },
    { path: 'user', component: Utilisateur },
    { path: 'users/edit/:id', component: ModifierUser },
    { path: 'users/delete/:id', component: SupprimerUser },
    { path: 'cont', component: Contenue },
    { path: 'event', component: Evenement },
    { path: 'delete-event/:id', component: SupriperEvent },
    { path: 'modify-event/:id', component: ModifierEvent },
    { path: 'match2', component: Match2 },
    { path: 'delete-match/:id', component: SuprimerMatch },
    { path: 'modify-match/:id', component: ModifierMatch },
    { path: 'dashboard', component: DashBoard },
    { path: 'createactus', component: CreationActus },
    { path: 'createevent', component: CreationEvent },
    { path: 'createconvocation', component: CreationConvoque },
    { path: 'creatematch', component: CreationMatch },
    { path: 'createequipe', component: CreationEquipe },
    { path: 'createcommun', component: CreationComuniquer },
    { path: 'creatematch', component: CreationMatch },
    { path: 'equipe', component: Equipe },
    { path: 'mesmatch', component: MesMatch },
    { path: 'convocations', component: Convocation },
];
