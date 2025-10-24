/**
 * Represents a single selectable item in the Dual Listbox.
 * @template T The type of the item's value.
 */
export interface DualListItem<T = unknown, M = Record<string, unknown>> {
  /** Display label shown in the list UI. */
  label: string;

  /** Actual value associated with the item. */
  value: T;

  /** Optional flag to disable the item. */
  disabled?: boolean;

  /** Optional metadata or custom data associated with the item. */
  meta?: M;
}

/**
 * Represents the change event emitted when items move between lists.
 * @template T The type of each item's value.
 * @template M The type of each item's metadata.
 */
export interface DualListChange<T = unknown, M = Record<string, unknown>> {
  /** Items currently on the left side (available). */
  left: DualListItem<T, M>[];

  /** Items currently on the right side (selected). */
  right: DualListItem<T, M>[];
}
