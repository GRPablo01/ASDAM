import { Routes } from '@angular/router';

/* ---- TOUT LE MONDE ----*/
import { Inscription } from '../page/inscription/inscription';
import { Connexion } from '../page/connexion/connexion';

/* ---- TOUT LE JOUEUR ----*/
import { AcceuilJ } from '../page/Joueur/acceuil-j/acceuil-j';
import { NotifJ } from '../page/Joueur/notif-j/notif-j';
import { MessageJ } from '../page/Joueur/message-j/message-j';
import { PlanningJ } from '../page/Joueur/planning-j/planning-j';
import { AbsentsJ } from '../page/Joueur/absents-j/absents-j';
import { ConvocationJ } from '../page/Joueur/convocation-j/convocation-j';


/* ---- TOUT LE COACH ----*/
import { AcceuilC } from '../page/Coach/acceuil-c/acceuil-c';
import { PlanningC } from '../page/Coach/planning-c/planning-c';
import { DashboardC } from '../page/Coach/dashboard-c/dashboard-c';
import { MatchC } from '../page/Coach/match-c/match-c';
import { ProfilC } from '../page/Coach/profil-c/profil-c';
import { NotifC } from '../page/Coach/notif-c/notif-c';
import { MessageC } from '../page/Coach/message-c/message-c';
import { AbsentsC } from '../page/Coach/absents-c/absents-c';
import { ActualiteC } from '../page/Coach/actualite-c/actualite-c';
import { ParametresC } from '../page/Coach/parametres-c/parametres-c';
import { ResultatsC } from '../page/Coach/resultats-c/resultats-c';
import { CommuniquerC } from '../page/Coach/communiquer-c/communiquer-c';
import { CGUC } from '../page/Coach/cguc/cguc';
import { ActualiteJ } from '../page/Joueur/actualite-j/actualite-j';
import { ConvocationC } from '../page/Coach/convocation-c/convocation-c';
import { ComnuniquerJ } from '../page/Joueur/comnuniquer-j/comnuniquer-j';
import { MatchJ } from '../page/Joueur/match-j/match-j';
import { ResultatsJ } from '../page/Joueur/resultats-j/resultats-j';
import { ProfilJ } from '../page/Joueur/profil-j/profil-j';
import { DashboardJ } from '../page/Joueur/dashboard-j/dashboard-j';
import { ParametreJ } from '../page/Joueur/parametre-j/parametre-j';


/* ---- TOUT LE INVITÉ ----*/


export const routes: Routes = [
    { path: '', component: Connexion },
    { path: 'connexion', component: Connexion },
    { path: 'inscription', component: Inscription },
    { path: 'cguc', component: CGUC},

    // ============ Joueur ============== //
    { path: 'accueilJ', component: AcceuilJ },
    { path: 'PlanningJ', component: PlanningJ },
    { path: 'dashboardJ', component: DashboardJ}, // PAGE A FAIRE 
    { path: 'matchJ', component: MatchJ },
    { path: 'dashboardJ/profileJ', component: ProfilJ},
    { path: 'dashboardJ/settingsJ', component: ParametreJ }, // PAGE A FAIRE 
    { path: 'messagesJ', component: MessageJ },
    { path: 'absentsJ', component: AbsentsJ },
    { path: 'actualiteJ', component: ActualiteJ},
    { path: 'matchJ/resultatsJ', component: ResultatsJ},
    { path: 'actualiteJ/communiquesJ', component: ComnuniquerJ},
    { path: 'matchJ/convocationsJ', component: ConvocationJ },

    
    // ============ Coach ============== //
    { path: 'accueilC', component: AcceuilC },
    { path: 'PlanningC', component: PlanningC },
    { path: 'dashboardC', component: DashboardC },
    { path: 'matchC', component: MatchC },
    { path: 'dashboardC/profileC', component: ProfilC },
    { path: 'dashboardC/settingsC', component: ParametresC },
    { path: 'messagesC', component: MessageC },
    { path: 'absentsC', component: AbsentsC },
    { path: 'actualiteC', component: ActualiteC },
    { path: 'matchC/resultatsC', component: ResultatsC},
    { path: 'actualiteC/communiquesC', component: CommuniquerC},
    { path: 'matchC/convocationsC', component: ConvocationC},
    

    // ============ Inviter ============== //

];
