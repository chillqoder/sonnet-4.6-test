'use client';

import React from 'react';
import { useApp } from '../lib/store';
import { computeItemStatus, formatDateYYYYMMDD } from '../lib/utils';

export function ActionBar() {
  const { state, dispatch, filteredItems, rescanImages } = useApp();
  const { items, urlCache, isValidating, validationProgress } = state;

  const selectedCount = items.filter(i => i.selected).length;

  const selectAllOnTab = () => {
    dispatch({ type: 'SET_SELECTED', payload: { ids: filteredItems.map(i => i.id), selected: true } });
  };

  const selectAllAnyValid = () => {
    const ids = items
      .filter(item => item.imageUrls.some(url => urlCache[url] === 'valid'))
      .map(i => i.id);
    dispatch({ type: 'SET_SELECTED', payload: { ids, selected: true } });
  };

  const selectAllValid = () => {
    const ids = items
      .filter(item => computeItemStatus(item.imageUrls, urlCache) === 'all_valid')
      .map(i => i.id);
    dispatch({ type: 'SET_SELECTED', payload: { ids, selected: true } });
  };

  const deselectAll = () => {
    dispatch({ type: 'SET_SELECTED', payload: { ids: items.map(i => i.id), selected: false } });
  };

  const invertSelection = () => {
    dispatch({ type: 'INVERT_SELECTION' });
  };

  const downloadJson = () => {
    const selected = items.filter(i => i.selected);
    if (selected.length === 0) return;
    const data = selected.map(i => i.original);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `json-image-cleaner-${formatDateYYYYMMDD(new Date())}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    const selected = items.filter(i => i.selected);
    if (selected.length === 0) return;
    const data = selected.map(i => i.original);
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  };

  const resetUpload = () => {
    dispatch({ type: 'CLEAR' });
  };

  return (
    <div className="px-4 pt-3 space-y-2">
      {/* Validation progress */}
      {isValidating && (
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-lg px-4 py-2">
          <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse flex-shrink-0" />
          <span className="text-sm text-blue-700 font-medium">
            Validating images: {validationProgress.done} / {validationProgress.total}
          </span>
          <div className="flex-1 bg-blue-100 rounded-full h-1.5">
            <div
              className="bg-blue-500 h-1.5 rounded-full transition-all"
              style={{
                width:
                  validationProgress.total > 0
                    ? `${(validationProgress.done / validationProgress.total) * 100}%`
                    : '0%',
              }}
            />
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-gray-500 font-medium">Select:</span>
        <button onClick={selectAllOnTab} className="btn-secondary text-xs">
          All on tab
        </button>
        <button onClick={selectAllAnyValid} className="btn-secondary text-xs">
          Any valid
        </button>
        <button onClick={selectAllValid} className="btn-secondary text-xs">
          All valid
        </button>
        <button onClick={deselectAll} className="btn-secondary text-xs">
          None
        </button>
        <button onClick={invertSelection} className="btn-secondary text-xs">
          Invert
        </button>

        <div className="flex-1" />

        <button
          onClick={rescanImages}
          disabled={isValidating}
          className="btn-secondary text-xs disabled:opacity-50"
        >
          ↺ Re-scan
        </button>

        <button
          onClick={copyToClipboard}
          disabled={selectedCount === 0}
          className="btn-secondary text-xs disabled:opacity-50"
        >
          Copy JSON
        </button>

        <button
          onClick={downloadJson}
          disabled={selectedCount === 0}
          className="btn-primary text-xs disabled:opacity-50"
        >
          ↓ Download {selectedCount > 0 ? `(${selectedCount})` : ''}
        </button>

        <button onClick={resetUpload} className="btn-secondary text-xs text-red-500">
          Clear
        </button>
      </div>
    </div>
  );
}
