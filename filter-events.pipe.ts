import { Pipe, PipeTransform } from '@angular/core';
import { EventItem } from './src/Model/Event';

@Pipe({
  name: 'filterEvents',
  standalone: true
})
export class FilterEventsPipe implements PipeTransform {
  transform(events: EventItem[], searchTerm: string, category: string, coach: string): EventItem[] {
    if (!events) return [];
    
    return events.filter(event => {
      const matchesSearch = !searchTerm || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.coach.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !category || event.category === category;
      const matchesCoach = !coach || event.coach === coach;
      
      return matchesSearch && matchesCategory && matchesCoach;
    });
  }
}