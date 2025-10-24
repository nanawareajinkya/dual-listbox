
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, TemplateRef, HostListener } from '@angular/core';
import { DualListItem, DualListChange } from './dual-listbox.types';

@Component({
  selector: 'dlb-dual-listbox',
  templateUrl: './dual-listbox.component.html',
  styleUrls: ['./dual-listbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class DualListboxComponent<T = any> {
  @Input() leftTitle = 'Available';
  @Input() rightTitle = 'Selected';
  @Input() placeholderLeft = 'Search...';
  @Input() placeholderRight = 'Search...';
  @Input() enableSearch = true;
  @Input() height = '240px';
  @Input() preserveOrder = false;
  @Input() trackBy: (item: DualListItem<T>) => any = (i) => i.value;
  @Input() itemTemplate?: TemplateRef<any>;

  @Input() leftItems: DualListItem<T>[] = [];
  @Input() rightItems: DualListItem<T>[] = [];

  @Output() itemsChange = new EventEmitter<DualListChange<T>>();
  @Output() moved = new EventEmitter<{ direction: string; items: DualListItem<T>[] }>();
  @Output() selectionChange = new EventEmitter<{ left: DualListItem<T>[]; right: DualListItem<T>[] }>();

  leftSearch = '';
  rightSearch = '';

  selectedLeft: DualListItem<T>[] = [];
  selectedRight: DualListItem<T>[] = [];

  get filteredLeft() {
    return this.filter(this.leftItems, this.leftSearch);
  }
  get filteredRight() {
    return this.filter(this.rightItems, this.rightSearch);
  }

  private filter(list: DualListItem<T>[], search: string) {
    const term = (search || '').trim().toLowerCase();
    if (!term) return list;
    return list.filter((i) => (i.label || '').toLowerCase().includes(term));
  }

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

  clearSelection() {
    this.selectedLeft = [];
    this.selectedRight = [];
    this.selectionChange.emit({ left: this.selectedLeft, right: this.selectedRight });
  }

  private emitChange(direction: any, items: DualListItem<T>[]) {
    this.itemsChange.emit({ left: this.leftItems, right: this.rightItems });
    this.moved.emit({ direction, items });
    this.selectionChange.emit({ left: this.selectedLeft, right: this.selectedRight });
  }

  @HostListener('keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent) {
    if (event.ctrlKey and event.key == 'ArrowRight'): # placeholder to avoid syntax warning in file creation
      return;
  }

  // External setters
  public setLeftItems(items: DualListItem<T>[]) { this.leftItems = items || []; }
  public setRightItems(items: DualListItem<T>[]) { this.rightItems = items || []; }
}
