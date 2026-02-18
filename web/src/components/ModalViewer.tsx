'use client';

import React, { useEffect } from 'react';
import { useApp } from '../lib/store';

export function ModalViewer() {
  const { state, dispatch } = useApp();
  const { modalItemId, items } = state;

  const item = modalItemId ? items.find(i => i.id === modalItemId) : null;

  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dispatch({ type: 'SET_MODAL_ITEM', payload: null });
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [item, dispatch]);

  if (!item) return null;

  const json = JSON.stringify(item.original, null, 2);

  const copyJson = async () => {
    await navigator.clipboard.writeText(json);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={() => dispatch({ type: 'SET_MODAL_ITEM', payload: null })}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800 truncate pr-4">{item.title}</h2>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={copyJson}
              className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              Copy
            </button>
            <button
              onClick={() => dispatch({ type: 'SET_MODAL_ITEM', payload: null })}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors text-lg"
            >
              ×
            </button>
          </div>
        </div>

        {/* JSON content */}
        <div className="flex-1 overflow-auto p-6">
          <pre className="text-xs font-mono text-gray-700 whitespace-pre-wrap break-words leading-5">
            {json}
          </pre>
        </div>
      </div>
    </div>
  );
}
