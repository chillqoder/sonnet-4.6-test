'use client';

import React, { useState } from 'react';
import { useApp } from '../lib/store';
import { JsonItem, ImageStatus, ItemStatus } from '../types';
import { computeItemStatus } from '../lib/utils';

// ── Status helpers ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  ItemStatus,
  { label: string; className: string }
> = {
  loading: { label: 'Checking…', className: 'bg-blue-50 text-blue-600 border-blue-100' },
  all_valid: { label: 'All valid', className: 'bg-green-50 text-green-700 border-green-100' },
  all_broken: { label: 'All broken', className: 'bg-red-50 text-red-600 border-red-100' },
  some_broken: { label: 'Some broken', className: 'bg-orange-50 text-orange-600 border-orange-100' },
  no_images: { label: 'No images', className: 'bg-gray-50 text-gray-400 border-gray-100' },
};

function ImageStatusIcon({ status }: { status: ImageStatus }) {
  if (status === 'valid')
    return (
      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500 text-white text-xs font-bold shadow-sm">
        ✓
      </span>
    );
  if (status === 'broken')
    return (
      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold shadow-sm">
        ✕
      </span>
    );
  return (
    <span className="flex items-center justify-center w-5 h-5">
      <span className="w-3 h-3 border-2 border-gray-300 border-t-teal-400 rounded-full animate-spin" />
    </span>
  );
}

// ── Thumbnail ─────────────────────────────────────────────────────────────────

interface ThumbnailProps {
  url: string;
  status: ImageStatus;
  extraCount?: number;
  onClick: () => void;
}

function Thumbnail({ url, status, extraCount, onClick }: ThumbnailProps) {
  return (
    <button
      onClick={onClick}
      className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 hover:border-teal-400 transition-colors"
    >
      {status === 'valid' ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="w-full h-full object-cover" />
      ) : status === 'broken' ? (
        <div className="w-full h-full flex items-center justify-center text-red-400 text-2xl">
          ✕
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-gray-200 border-t-teal-400 rounded-full animate-spin" />
        </div>
      )}

      {/* Status indicator */}
      <div className="absolute top-1 right-1">
        <ImageStatusIcon status={status} />
      </div>

      {/* Extra count overlay */}
      {extraCount !== undefined && extraCount > 0 && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <span className="text-white text-sm font-semibold">+{extraCount}</span>
        </div>
      )}
    </button>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────

export function CardItem({ item }: { item: JsonItem }) {
  const { state, dispatch } = useApp();
  const { urlCache } = state;
  const [jsonExpanded, setJsonExpanded] = useState(false);

  const itemStatus = computeItemStatus(item.imageUrls, urlCache);
  const statusConfig = STATUS_CONFIG[itemStatus];

  const json = JSON.stringify(item.original, null, 2);
  const jsonPreview = json.split('\n').slice(0, 5).join('\n');
  const hasMore = json.split('\n').length > 5;

  const THUMB_LIMIT = 3;
  const visibleUrls = item.imageUrls.slice(0, THUMB_LIMIT);
  const extraCount = item.imageUrls.length - THUMB_LIMIT;

  const openGallery = (startIndex: number) => {
    dispatch({ type: 'SET_GALLERY', payload: { itemId: item.id, startIndex } });
  };

  // Progress bar for loading state
  const loadedCount = item.imageUrls.filter(
    url => urlCache[url] === 'valid' || urlCache[url] === 'broken'
  ).length;
  const loadProgress =
    item.imageUrls.length > 0 ? loadedCount / item.imageUrls.length : 1;

  return (
    <div
      className={`bg-white rounded-xl border shadow-sm flex flex-col overflow-hidden transition-all ${
        item.selected ? 'border-teal-400 ring-2 ring-teal-100' : 'border-gray-200'
      }`}
      style={{ height: '100%', minHeight: 240, maxHeight: 320 }}
    >
      {/* Loading progress bar */}
      {itemStatus === 'loading' && (
        <div className="h-0.5 bg-gray-100">
          <div
            className="h-full bg-teal-400 transition-all duration-300"
            style={{ width: `${loadProgress * 100}%` }}
          />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-2 px-3 pt-3 pb-2 flex-shrink-0">
        <input
          type="checkbox"
          checked={item.selected}
          onChange={() => dispatch({ type: 'TOGGLE_ITEM_SELECTION', payload: item.id })}
          className="mt-0.5 flex-shrink-0 w-4 h-4 rounded border-gray-300 text-teal-600 cursor-pointer accent-teal-600"
        />
        <h3 className="flex-1 text-sm font-semibold text-gray-800 leading-tight line-clamp-2 min-w-0">
          {item.title}
        </h3>
        <span
          className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full border font-medium ${statusConfig.className}`}
        >
          {statusConfig.label}
        </span>
      </div>

      {/* Images */}
      {item.imageUrls.length > 0 && (
        <div className="flex gap-2 px-3 pb-2 flex-shrink-0">
          {visibleUrls.map((url, i) => {
            const status: ImageStatus = urlCache[url] ?? 'pending';
            const isLast = i === visibleUrls.length - 1;
            const extra = isLast && extraCount > 0 ? extraCount : undefined;
            return (
              <Thumbnail
                key={url}
                url={url}
                status={status}
                extraCount={extra}
                onClick={() => openGallery(i)}
              />
            );
          })}
        </div>
      )}

      {/* Image count summary */}
      {item.imageUrls.length > 0 && (
        <div className="px-3 pb-1 flex-shrink-0">
          <span className="text-xs text-gray-400">
            {item.imageUrls.filter(u => urlCache[u] === 'valid').length} valid ·{' '}
            {item.imageUrls.filter(u => urlCache[u] === 'broken').length} broken ·{' '}
            {item.imageUrls.length} total
          </span>
        </div>
      )}

      {/* JSON preview */}
      <div className="flex-1 px-3 pb-1 overflow-hidden min-h-0">
        <pre
          className={`text-xs font-mono text-gray-500 whitespace-pre-wrap break-words leading-4 ${
            jsonExpanded ? 'overflow-y-auto h-full' : 'line-clamp-4'
          }`}
        >
          {jsonExpanded ? json : jsonPreview}
        </pre>
      </div>

      {/* Footer actions */}
      <div className="flex items-center gap-2 px-3 py-2 border-t border-gray-50 flex-shrink-0">
        {hasMore && (
          <button
            onClick={() => setJsonExpanded(v => !v)}
            className="text-xs text-teal-600 hover:text-teal-700 transition-colors"
          >
            {jsonExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
        <div className="flex-1" />
        <button
          onClick={() => dispatch({ type: 'SET_MODAL_ITEM', payload: item.id })}
          className="text-xs text-gray-500 hover:text-gray-700 transition-colors font-medium"
        >
          View JSON
        </button>
      </div>
    </div>
  );
}
