export interface EventItem {
  _id?: string;
  day: string;
  hour: string;      // heure de début
  endHour: string;   // heure de fin
  title: string;
  coach: string;
  category: string;
  level: string;
  duration: number;  // optionnel si on calcule depuis hour → endHour
  color?: string;
}
