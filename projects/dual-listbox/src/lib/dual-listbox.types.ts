
export interface DualListItem<T = any> {
  label: string;
  value: T;
  disabled?: boolean;
  meta?: any;
}

export interface DualListChange<T = any> {
  left: DualListItem<T>[];
  right: DualListItem<T>[];
}
