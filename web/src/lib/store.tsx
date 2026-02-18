'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useRef,
  useCallback,
  ReactNode,
} from 'react';
import { AppState, JsonItem, TabFilter, ImageStatus, ItemStatus } from '../types';
import { validateImageConcurrently } from './imageValidator';
import { findAllStrings, isLikelyImageUrl, getItemTitle, computeItemStatus } from './utils';

// ── Actions ──────────────────────────────────────────────────────────────────

type Action =
  | { type: 'SET_ITEMS'; payload: JsonItem[] }
  | { type: 'UPDATE_IMAGE_STATUS'; payload: { url: string; status: ImageStatus } }
  | { type: 'SET_ACTIVE_TAB'; payload: TabFilter }
  | { type: 'TOGGLE_ITEM_SELECTION'; payload: string }
  | { type: 'SET_SELECTED'; payload: { ids: string[]; selected: boolean } }
  | { type: 'INVERT_SELECTION' }
  | { type: 'SET_VALIDATION_PROGRESS'; payload: { done: number; total: number } }
  | { type: 'SET_VALIDATING'; payload: boolean }
  | { type: 'SET_UPLOAD_ERROR'; payload: string | null }
  | { type: 'SET_MODAL_ITEM'; payload: string | null }
  | { type: 'SET_GALLERY'; payload: { itemId: string; startIndex: number } | null }
  | { type: 'CLEAR_URL_CACHE' }
  | { type: 'CLEAR' };

// ── Reducer ───────────────────────────────────────────────────────────────────

const initialState: AppState = {
  items: [],
  activeTab: 'all',
  validationProgress: { done: 0, total: 0 },
  isValidating: false,
  uploadError: null,
  modalItemId: null,
  galleryState: null,
  urlCache: {},
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_ITEMS':
      return {
        ...state,
        items: action.payload,
        urlCache: {},
        uploadError: null,
        activeTab: 'all',
      };

    case 'UPDATE_IMAGE_STATUS':
      return {
        ...state,
        urlCache: { ...state.urlCache, [action.payload.url]: action.payload.status },
      };

    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };

    case 'TOGGLE_ITEM_SELECTION':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload ? { ...item, selected: !item.selected } : item
        ),
      };

    case 'SET_SELECTED': {
      const { ids, selected } = action.payload;
      const idSet = new Set(ids);
      return {
        ...state,
        items: state.items.map(item =>
          idSet.has(item.id) ? { ...item, selected } : item
        ),
      };
    }

    case 'INVERT_SELECTION':
      return {
        ...state,
        items: state.items.map(item => ({ ...item, selected: !item.selected })),
      };

    case 'SET_VALIDATION_PROGRESS':
      return { ...state, validationProgress: action.payload };

    case 'SET_VALIDATING':
      return { ...state, isValidating: action.payload };

    case 'SET_UPLOAD_ERROR':
      return { ...state, uploadError: action.payload };

    case 'SET_MODAL_ITEM':
      return { ...state, modalItemId: action.payload };

    case 'SET_GALLERY':
      return { ...state, galleryState: action.payload };

    case 'CLEAR_URL_CACHE':
      return { ...state, urlCache: {} };

    case 'CLEAR':
      return { ...initialState };

    default:
      return state;
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildItems(rawItems: unknown[]): JsonItem[] {
  return rawItems.map((raw, idx) => {
    const strings = findAllStrings(raw);
    const seen = new Set<string>();
    const imageUrls: string[] = [];
    for (const { value } of strings) {
      if (isLikelyImageUrl(value) && !seen.has(value)) {
        seen.add(value);
        imageUrls.push(value);
      }
    }
    return {
      id: `item-${idx}`,
      index: idx,
      original: raw,
      title: getItemTitle(raw, idx),
      imageUrls,
      selected: false,
    };
  });
}

function runValidation(
  items: JsonItem[],
  dispatch: React.Dispatch<Action>,
  runIdRef: React.MutableRefObject<object>
): void {
  const currentRun = {};
  runIdRef.current = currentRun;

  const allUrls = [...new Set(items.flatMap(item => item.imageUrls))];
  dispatch({ type: 'SET_VALIDATING', payload: true });
  dispatch({ type: 'SET_VALIDATION_PROGRESS', payload: { done: 0, total: allUrls.length } });

  if (allUrls.length === 0) {
    dispatch({ type: 'SET_VALIDATING', payload: false });
    return;
  }

  let done = 0;
  Promise.all(
    allUrls.map(url =>
      validateImageConcurrently(url).then(status => {
        if (runIdRef.current !== currentRun) return;
        dispatch({ type: 'UPDATE_IMAGE_STATUS', payload: { url, status } });
        done++;
        dispatch({
          type: 'SET_VALIDATION_PROGRESS',
          payload: { done, total: allUrls.length },
        });
      })
    )
  ).then(() => {
    if (runIdRef.current !== currentRun) return;
    dispatch({ type: 'SET_VALIDATING', payload: false });
  });
}

// ── Context ───────────────────────────────────────────────────────────────────

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  loadJson: (rawItems: unknown[]) => void;
  rescanImages: () => void;
  /** Derived helpers */
  getItemStatus: (item: JsonItem) => ItemStatus;
  filteredItems: JsonItem[];
  tabCounts: Record<TabFilter, number>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const runIdRef = useRef<object>({});
  const itemsRef = useRef<JsonItem[]>([]);
  itemsRef.current = state.items;

  const loadJson = useCallback(
    (rawItems: unknown[]) => {
      const items = buildItems(rawItems);
      dispatch({ type: 'SET_ITEMS', payload: items });
      runValidation(items, dispatch, runIdRef);
    },
    [dispatch]
  );

  const rescanImages = useCallback(() => {
    dispatch({ type: 'CLEAR_URL_CACHE' });
    runValidation(itemsRef.current, dispatch, runIdRef);
  }, [dispatch]);

  const getItemStatus = useCallback(
    (item: JsonItem): ItemStatus => computeItemStatus(item.imageUrls, state.urlCache),
    [state.urlCache]
  );

  // Compute filtered items for current tab
  const filteredItems = React.useMemo(() => {
    const { items, activeTab, urlCache } = state;
    switch (activeTab) {
      case 'all':
        return items;
      case 'all_valid':
        return items.filter(
          item => computeItemStatus(item.imageUrls, urlCache) === 'all_valid'
        );
      case 'any_valid':
        return items.filter(item =>
          item.imageUrls.some(url => urlCache[url] === 'valid')
        );
      case 'some_broken':
        return items.filter(
          item => computeItemStatus(item.imageUrls, urlCache) === 'some_broken'
        );
      case 'all_broken':
        return items.filter(
          item => computeItemStatus(item.imageUrls, urlCache) === 'all_broken'
        );
      case 'no_images':
        return items.filter(item => item.imageUrls.length === 0);
      case 'selected':
        return items.filter(item => item.selected);
      default:
        return items;
    }
  }, [state]);

  // Compute tab counts
  const tabCounts = React.useMemo((): Record<TabFilter, number> => {
    const { items, urlCache } = state;
    return {
      all: items.length,
      all_valid: items.filter(
        item => computeItemStatus(item.imageUrls, urlCache) === 'all_valid'
      ).length,
      any_valid: items.filter(item =>
        item.imageUrls.some(url => urlCache[url] === 'valid')
      ).length,
      some_broken: items.filter(
        item => computeItemStatus(item.imageUrls, urlCache) === 'some_broken'
      ).length,
      all_broken: items.filter(
        item => computeItemStatus(item.imageUrls, urlCache) === 'all_broken'
      ).length,
      no_images: items.filter(item => item.imageUrls.length === 0).length,
      selected: items.filter(item => item.selected).length,
    };
  }, [state]);

  return (
    <AppContext.Provider
      value={{ state, dispatch, loadJson, rescanImages, getItemStatus, filteredItems, tabCounts }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
