'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '../lib/store';
import { ImageStatus } from '../types';

function StatusIcon({ status }: { status: ImageStatus }) {
  if (status === 'valid')
    return (
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-500 text-white text-xs font-bold">
        ✓
      </span>
    );
  if (status === 'broken')
    return (
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold">
        ✕
      </span>
    );
  return (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-300 text-white text-xs">
      …
    </span>
  );
}

export function ImageGalleryModal() {
  const { state, dispatch } = useApp();
  const { galleryState, items, urlCache } = state;

  const item = galleryState ? items.find(i => i.id === galleryState.itemId) : null;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (galleryState) setCurrent(galleryState.startIndex);
  }, [galleryState]);

  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dispatch({ type: 'SET_GALLERY', payload: null });
      if (e.key === 'ArrowRight')
        setCurrent(c => Math.min(c + 1, item.imageUrls.length - 1));
      if (e.key === 'ArrowLeft') setCurrent(c => Math.max(c - 1, 0));
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [item, dispatch]);

  if (!item) return null;

  const url = item.imageUrls[current];
  const status: ImageStatus = urlCache[url] ?? 'pending';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
      onClick={() => dispatch({ type: 'SET_GALLERY', payload: null })}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <StatusIcon status={status} />
            <span className="text-sm text-gray-600">
              {current + 1} / {item.imageUrls.length}
            </span>
          </div>
          <button
            onClick={() => dispatch({ type: 'SET_GALLERY', payload: null })}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 text-lg"
          >
            ×
          </button>
        </div>

        {/* Image */}
        <div className="relative bg-gray-50 flex items-center justify-center min-h-[320px] max-h-[60vh] overflow-hidden">
          {status === 'valid' ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt=""
              className="max-w-full max-h-[60vh] object-contain"
            />
          ) : status === 'broken' ? (
            <div className="flex flex-col items-center gap-2 text-red-400 py-16">
              <span className="text-4xl">✕</span>
              <span className="text-sm">Image failed to load</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-400 py-16">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-teal-500 rounded-full animate-spin" />
              <span className="text-sm">Loading…</span>
            </div>
          )}

          {/* Prev / Next */}
          {item.imageUrls.length > 1 && (
            <>
              <button
                onClick={() => setCurrent(c => Math.max(c - 1, 0))}
                disabled={current === 0}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full shadow flex items-center justify-center text-gray-600 hover:bg-white disabled:opacity-30"
              >
                ‹
              </button>
              <button
                onClick={() => setCurrent(c => Math.min(c + 1, item.imageUrls.length - 1))}
                disabled={current === item.imageUrls.length - 1}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full shadow flex items-center justify-center text-gray-600 hover:bg-white disabled:opacity-30"
              >
                ›
              </button>
            </>
          )}
        </div>

        {/* URL */}
        <div className="px-5 py-3 border-t border-gray-100">
          <p className="text-xs font-mono text-gray-400 truncate">{url}</p>
        </div>

        {/* Thumbnails strip */}
        {item.imageUrls.length > 1 && (
          <div className="flex gap-2 px-5 pb-4 overflow-x-auto">
            {item.imageUrls.map((imgUrl, i) => {
              const s: ImageStatus = urlCache[imgUrl] ?? 'pending';
              return (
                <button
                  key={imgUrl}
                  onClick={() => setCurrent(i)}
                  className={`flex-shrink-0 w-14 h-14 rounded overflow-hidden border-2 transition-colors ${
                    i === current ? 'border-teal-500' : 'border-transparent'
                  }`}
                >
                  <div className="relative w-full h-full bg-gray-100">
                    {s === 'valid' ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imgUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className={`w-full h-full flex items-center justify-center text-xs ${
                          s === 'broken' ? 'text-red-400' : 'text-gray-300'
                        }`}
                      >
                        {s === 'broken' ? '✕' : '…'}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
