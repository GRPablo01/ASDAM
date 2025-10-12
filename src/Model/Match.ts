export interface Match {
  equipeA: string;
  equipeB: string;
  date: Date;
  lieu: string;
  categorie: string;   // ✅ nouveau champ
  scoreA?: number;
  scoreB?: number;
}
