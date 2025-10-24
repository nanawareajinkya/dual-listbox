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
  selector: 'dlb-dual-listbox',
  templateUrl: './dual-listbox.component.html',
  styleUrls: ['./dual-listbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class DualListboxComponent<T = any> {
  /** Titles and placeholders */
  @Input() leftTitle = 'Available';
  @Input() rightTitle = 'Selected';
  @Input() placeholderLeft = 'Search...';
  @Input() placeholderRight = 'Search...';
  @Input() enableSearch = true;
  @Input() height = '240px';
  @Input() preserveOrder = false;

  /** Track and template configuration */
  @Input() trackBy: (item: DualListItem<T>) => any = (i) => i.value;
  @Input() itemTemplate?: TemplateRef<any>;

  /** Source data */
  @Input() leftItems: DualListItem<T>[] = [];
  @Input() rightItems: DualListItem<T>[] = [];

  /** Output events */
  @Output() itemsChange = new EventEmitter<DualListChange<T>>();
  @Output() moved = new EventEmitter<{ direction: string; items: DualListItem<T>[] }>();
  @Output() selectionChange = new EventEmitter<{ left: DualListItem<T>[]; right: DualListItem<T>[] }>();

  /** Internal states */
  leftSearch = '';
  rightSearch = '';
  selectedLeft: DualListItem<T>[] = [];
  selectedRight: DualListItem<T>[] = [];

  /** Filtered getters */
  get filteredLeft(): DualListItem<T>[] {
    return this.filter(this.leftItems, this.leftSearch);
  }

  get filteredRight(): DualListItem<T>[] {
    return this.filter(this.rightItems, this.rightSearch);
  }

  /** Helpers */
  private filter(list: DualListItem<T>[], search: string): DualListItem<T>[] {
    const term = (search || '').trim().toLowerCase();
    if (!term) return list;
    return list.filter((i) => (i.label || '').toLowerCase().includes(term));
  }

  /** Movement operations */
  moveRight(): void {
    const movers = this.selectedLeft.filter((i) => !i.disabled);
    if (!movers.length) return;
    this.leftItems = this.leftItems.filter((i) => !movers.some((m) => this.trackBy(m) === this.trackBy(i)));
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
    this.rightItems = this.rightItems.filter((i) => !movers.some((m) => this.trackBy(m) === this.trackBy(i)));
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

  /** Double click shortcuts */
  onDblClickLeft(item: DualListItem<T>): void {
    if (item.disabled) return;
    this.leftItems = this.leftItems.filter((i) => this.trackBy(i) !== this.trackBy(item));
    this.rightItems = [...this.rightItems, item];
    this.emitChange('right', [item]);
  }

  onDblClickRight(item: DualListItem<T>): void {
    if (item.disabled) return;
    this.rightItems = this.rightItems.filter((i) => this.trackBy(i) !== this.trackBy(item));
    this.leftItems = [...this.leftItems, item];
    this.emitChange('left', [item]);
  }

  /** Clear all selection states */
  clearSelection(): void {
    this.selectedLeft = [];
    this.selectedRight = [];
    this.selectionChange.emit({ left: this.selectedLeft, right: this.selectedRight });
  }

  /** Centralized event emit */
  private emitChange(direction: string, items: DualListItem<T>[]): void {
    this.itemsChange.emit({ left: this.leftItems, right: this.rightItems });
    this.moved.emit({ direction, items });
    this.selectionChange.emit({ left: this.selectedLeft, right: this.selectedRight });
  }

  /** Keyboard shortcuts for moving items */
  @HostListener('keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent): void {
    // Example: Ctrl + ArrowRight → move selected left items to right
    if (event.ctrlKey && event.key === 'ArrowRight') {
      this.moveRight();
      event.preventDefault();
    }

    // Example: Ctrl + ArrowLeft → move selected right items to left
    if (event.ctrlKey && event.key === 'ArrowLeft') {
      this.moveLeft();
      event.preventDefault();
    }
  }

  /** External API methods */
  public setLeftItems(items: DualListItem<T>[]): void {
    this.leftItems = items || [];
  }

  public setRightItems(items: DualListItem<T>[]): void {
    this.rightItems = items || [];
  }
}
