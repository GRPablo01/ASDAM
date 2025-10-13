import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstLetter'
})
export class FirstLetterPipe implements PipeTransform {
  transform(contacts: any[], letter: string): any[] {
    if (!contacts || !letter) return contacts;
    return contacts.filter(c => 
      c.firstName.toUpperCase().startsWith(letter.toUpperCase())
    );
  }
}
