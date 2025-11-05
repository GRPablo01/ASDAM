export interface Match {
  equipeA: string;
  equipeB: string;
  date: Date;
  lieu: string;
  categorie: string;      // ✅ nouveau champ
  typeMatch?: 'Championnat' | 'Tournoi' | 'Amical' | 'Coup'; // type de match
  scoreA?: number;
  scoreB?: number;
  logoA?: string;
  logoB?: string;
  arbitre?: string;
  stade?: string;
  status?: 'A venir' | 'En directe' | 'Terminer';  // enum status en français
  duree?: number;
  minute?: number;
  heureDebut?: string;    // format "HH:mm"
  heureFin?: string;      // format "HH:mm"
  domicile?: boolean;     // true = domicile, false = extérieur
}
