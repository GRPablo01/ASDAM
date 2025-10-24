export interface Match {
  equipeA: string;
  equipeB: string;
  date: Date;
  lieu: string;
  categorie: string;     // ✅ nouveau champ
  scoreA?: number;
  scoreB?: number;
  heureDebut?: string;   // format "HH:mm"
  heureFin?: string;     // format "HH:mm"
}
