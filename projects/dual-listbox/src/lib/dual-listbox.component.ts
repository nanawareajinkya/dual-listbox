
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  HostListener,
  OnInit,
  TemplateRef
} from '@angular/core';
import { DualListItem } from './dual-listbox.types';

/**
 * dlb-dual-listbox
 * - Neutral UI by default (minimal CSS shipped)
 * - Optional PrimeNG integration: consumers can style buttons/icons via CSS or provide templates
 */
@Component({
  selector: 'dlb-dual-listbox',
  templateUrl: './dual-listbox.component.html',
  styleUrls: ['./dual-listbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class DualListboxComponent<T = any> implements OnInit {
  @Input() leftTitle = 'Available';
  @Input() rightTitle = 'Selected';
  @Input() placeholderLeft = 'Search...';
  @Input() placeholderRight = 'Search...';
  @Input() enableSearch = true;
  @Input() height = '240px';
  @Input() preserveOrder = false;
  @Input() trackBy: (item: DualListItem<T>) => any = (i) => i.value;
  @Input() itemTemplate?: TemplateRef<any>; // optional custom template (ng-template)

  @Input() leftItems: DualListItem<T>[] = [];
  @Input() rightItems: DualListItem<T>[] = [];

  @Output() itemsChange = new EventEmitter<{ left: DualListItem<T>[]; right: DualListItem<T>[] }>();
  @Output() moved = new EventEmitter<{ direction: 'left' | 'right' | 'all-left' | 'all-right'; items: DualListItem<T>[] }>();
  @Output() selectionChange = new EventEmitter<{ left: DualListItem<T>[]; right: DualListItem<T>[] }>();

  leftSearch = '';
  rightSearch = '';

  selectedLeft: DualListItem<T>[] = [];
  selectedRight: DualListItem<T>[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

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
    this.rightItems = this.mergeInto(this.rightItems, movers, this.preserveOrder);
    this.clearSelection();
    this.emitChange('right', movers);
  }

  moveAllRight(): void {
    const movers = this.leftItems.filter((i) => !i.disabled);
    if (!movers.length) return;
    this.leftItems = this.leftItems.filter((i) => i.disabled);
    this.rightItems = this.mergeInto(this.rightItems, movers, this.preserveOrder);
    this.clearSelection();
    this.emitChange('all-right', movers);
  }

  moveLeft(): void {
    const movers = this.selectedRight.filter((i) => !i.disabled);
    if (!movers.length) return;
    this.rightItems = this.rightItems.filter((i) => !movers.some((m) => this.trackBy(m) === this.trackBy(i)));
    this.leftItems = this.mergeInto(this.leftItems, movers, this.preserveOrder);
    this.clearSelection();
    this.emitChange('left', movers);
  }

  moveAllLeft(): void {
    const movers = this.rightItems.filter((i) => !i.disabled);
    if (!movers.length) return;
    this.rightItems = this.rightItems.filter((i) => i.disabled);
    this.leftItems = this.mergeInto(this.leftItems, movers, this.preserveOrder);
    this.clearSelection();
    this.emitChange('all-left', movers);
  }

  onDblClickLeft(item: DualListItem<T>): void {
    if (item.disabled) return;
    this.leftItems = this.leftItems.filter((i) => this.trackBy(i) !== this.trackBy(item));
    this.rightItems = this.mergeInto(this.rightItems, [item], this.preserveOrder);
    this.emitChange('right', [item]);
  }

  onDblClickRight(item: DualListItem<T>): void {
    if (item.disabled) return;
    this.rightItems = this.rightItems.filter((i) => this.trackBy(i) !== this.trackBy(item));
    this.leftItems = this.mergeInto(this.leftItems, [item], this.preserveOrder);
    this.emitChange('left', [item]);
  }

  private mergeInto(base: DualListItem<T>[], toAdd: DualListItem<T>[], preserveOrder = false) {
    if (!preserveOrder) return [...base, ...toAdd];
    const existingKeys = new Set(base.map((i) => this.trackBy(i)));
    const additions = toAdd.filter((i) => !existingKeys.has(this.trackBy(i)));
    return [...base, ...additions];
  }

  private emitChange(direction: any, items: DualListItem<T>[]) {
    this.itemsChange.emit({ left: this.leftItems, right: this.rightItems });
    this.moved.emit({ direction, items });
    this.selectionChange.emit({ left: this.selectedLeft, right: this.selectedRight });
    this.cdr.markForCheck();
  }

  clearSelection() {
    this.selectedLeft = [];
    this.selectedRight = [];
    this.selectionChange.emit({ left: this.selectedLeft, right: this.selectedRight });
  }

  @HostListener('keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'ArrowRight') {
      this.moveAllRight();
      event.preventDefault();
    } else if (event.ctrlKey && event.key === 'ArrowLeft') {
      this.moveAllLeft();
      event.preventDefault();
    }
  }

  // External setters
  public setLeftItems(items: DualListItem<T>[]) { this.leftItems = items || []; this.cdr.markForCheck(); }
  public setRightItems(items: DualListItem<T>[]) { this.rightItems = items || []; this.cdr.markForCheck(); }
}
