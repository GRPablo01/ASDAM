export interface User {
    _id: string;
    nom: string;
    prenom: string;
    role: string;
    equipe?: string;
    categorie?: string; 
    poste?: string;
}
  