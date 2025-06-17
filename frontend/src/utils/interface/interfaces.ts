export interface ItemFormData {
  name: string;
  group: string;
}

export interface Item {
  id: number;
  name: string;
  group: string;
  created_at: string;
  updated_at: string;
}

export interface Group {
  id: number;
  name: string;
  description: string;
  color: string;
  created_at: string;
  updated_at: string;
  item_count: number;
}

export interface GroupFormData {
  name: string;
  description: string;
  color: string;
}

export interface CreateItemPageState {
  loading: boolean;
  error: string | null;
}

export interface EditItemPageState {
  item: Item | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

export interface RouteParams {
  id: string;
}

export interface ItemDetailPageState {
  item: Item | null;
  loading: boolean;
  error: string | null;
}

export interface ItemsListPageState {
  items: Item[];
  filteredItems: Item[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  selectedGroup: string;
  selectedItems: number[];
  isMultiSelectMode: boolean;
}

export interface BulkDeleteResponse {
  deleted: number;
  message?: string;
}

export interface ValidationErrors {
  name?: string;
  group?: string;
}
