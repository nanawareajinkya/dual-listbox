import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  TemplateRef,
  HostListener
} from '@angular/core';
import { DualListItem, DualListChange } from './dual-listbox.types';

@Component({
  selector: 'lib-dual-listbox',
  templateUrl: './dual-listbox.component.html',
  styleUrls: ['./dual-listbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class DualListboxComponent<T = unknown, M = Record<string, unknown>> {
  @Input() leftTitle = 'Available';
  @Input() rightTitle = 'Selected';
  @Input() placeholderLeft = 'Search...';
  @Input() placeholderRight = 'Search...';
  @Input() enableSearch = true;
  @Input() height = '240px';
  @Input() preserveOrder = false;

  /** TrackBy function — helps Angular optimize rendering */
  @Input() trackBy: (item: DualListItem<T, M>) => unknown = (i) => i.value;

  /** Custom item template for advanced UI rendering */
  @Input() itemTemplate?: TemplateRef<DualListItem<T, M>>;

  /** Input lists */
  @Input() leftItems: DualListItem<T, M>[] = [];
  @Input() rightItems: DualListItem<T, M>[] = [];

  /** Output events */
  @Output() itemsChange = new EventEmitter<DualListChange<T, M>>();
  @Output() moved = new EventEmitter<{ direction: string; items: DualListItem<T, M>[] }>();
  @Output() selectionChange = new EventEmitter<{ left: DualListItem<T, M>[]; right: DualListItem<T, M>[] }>();

  /** Internal state */
  leftSearch = '';
  rightSearch = '';
  selectedLeft: DualListItem<T, M>[] = [];
  selectedRight: DualListItem<T, M>[] = [];

  /** Filtered lists based on search text */
  get filteredLeft(): DualListItem<T, M>[] {
    return this.filter(this.leftItems, this.leftSearch);
  }
  get filteredRight(): DualListItem<T, M>[] {
    return this.filter(this.rightItems, this.rightSearch);
  }

  /** Simple filter function */
  private filter(list: DualListItem<T, M>[], search: string): DualListItem<T, M>[] {
    const term = (search || '').trim().toLowerCase();
    if (!term) return list;
    return list.filter((i) => (i.label || '').toLowerCase().includes(term));
  }

  /** Move selected items right */
  moveRight(): void {
    const movers = this.selectedLeft.filter((i) => !i.disabled);
    if (!movers.length) return;
    this.leftItems = this.leftItems.filter(
      (i) => !movers.some((m) => this.trackBy(m) === this.trackBy(i))
    );
    this.rightItems = [...this.rightItems, ...movers];
    this.clearSelection();
    this.emitChange('right', movers);
  }

  moveAllRight(): void {
    const movers = this.leftItems.filter((i) => !i.disabled);
    if (!movers.length) return;
    this.leftItems = this.leftItems.filter((i) => i.disabled);
    this.rightItems = [...this.rightItems, ...movers];
    this.clearSelection();
    this.emitChange('all-right', movers);
  }

  moveLeft(): void {
    const movers = this.selectedRight.filter((i) => !i.disabled);
    if (!movers.length) return;
    this.rightItems = this.rightItems.filter(
      (i) => !movers.some((m) => this.trackBy(m) === this.trackBy(i))
    );
    this.leftItems = [...this.leftItems, ...movers];
    this.clearSelection();
    this.emitChange('left', movers);
  }

  moveAllLeft(): void {
    const movers = this.rightItems.filter((i) => !i.disabled);
    if (!movers.length) return;
    this.rightItems = this.rightItems.filter((i) => i.disabled);
    this.leftItems = [...this.leftItems, ...movers];
    this.clearSelection();
    this.emitChange('all-left', movers);
  }

  onDblClickLeft(item: DualListItem<T, M>): void {
    if (item.disabled) return;
    this.leftItems = this.leftItems.filter((i) => this.trackBy(i) !== this.trackBy(item));
    this.rightItems = [...this.rightItems, item];
    this.emitChange('right', [item]);
  }

  onDblClickRight(item: DualListItem<T, M>): void {
    if (item.disabled) return;
    this.rightItems = this.rightItems.filter((i) => this.trackBy(i) !== this.trackBy(item));
    this.leftItems = [...this.leftItems, item];
    this.emitChange('left', [item]);
  }

  /** Clear selection and notify */
  clearSelection(): void {
    this.selectedLeft = [];
    this.selectedRight = [];
    this.selectionChange.emit({ left: this.selectedLeft, right: this.selectedRight });
  }

  /** Emit unified change event */
  private emitChange(direction: string, items: DualListItem<T, M>[]): void {
    this.itemsChange.emit({ left: this.leftItems, right: this.rightItems });
    this.moved.emit({ direction, items });
    this.selectionChange.emit({ left: this.selectedLeft, right: this.selectedRight });
  }

  @HostListener('keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent): void {
    if (event.ctrlKey && event.key === 'ArrowRight') {
      // reserved for future keyboard navigation
      event.preventDefault();
    }
  }

  /** External setters */
  public setLeftItems(items: DualListItem<T, M>[]): void {
    this.leftItems = items ?? [];
  }

  public setRightItems(items: DualListItem<T, M>[]): void {
    this.rightItems = items ?? [];
  }
}
