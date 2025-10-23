
import { Component } from '@angular/core';
import { DualListItem } from '../../../projects/dual-listbox/src/lib/dual-listbox.types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  available: DualListItem[] = [
    { label: 'Alpha', value: 1 },
    { label: 'Bravo', value: 2 },
    { label: 'Charlie', value: 3, disabled: true }
  ];
  selected: DualListItem[] = [{ label: 'Delta', value: 4 }];

  onItemsChange(evt: any) {
    console.log('items changed', evt);
  }
}
