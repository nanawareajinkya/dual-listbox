
import { DualListboxComponent } from './dual-listbox.component';

describe('DualListboxComponent', () => {
  it('moves selected left->right', () => {
    const comp = new DualListboxComponent();
    comp.leftItems = [{ label: 'A', value: 1 }, { label: 'B', value: 2 }];
    comp.selectedLeft = [comp.leftItems[0]];
    comp.moveRight();
    expect(comp.rightItems.length).toBe(1);
    expect(comp.leftItems.length).toBe(1);
  });
});
