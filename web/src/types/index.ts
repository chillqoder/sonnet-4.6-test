export type ImageStatus = 'pending' | 'loading' | 'valid' | 'broken';

export type ItemStatus = 'loading' | 'all_valid' | 'all_broken' | 'some_broken' | 'no_images';

export interface JsonItem {
  id: string;
  index: number;
  original: unknown;
  title: string;
  imageUrls: string[];
  selected: boolean;
}

export type TabFilter =
  | 'all'
  | 'all_valid'
  | 'any_valid'
  | 'some_broken'
  | 'all_broken'
  | 'no_images'
  | 'selected';

export interface AppState {
  items: JsonItem[];
  activeTab: TabFilter;
  validationProgress: { done: number; total: number };
  isValidating: boolean;
  uploadError: string | null;
  modalItemId: string | null;
  galleryState: { itemId: string; startIndex: number } | null;
  urlCache: Record<string, ImageStatus>;
}
