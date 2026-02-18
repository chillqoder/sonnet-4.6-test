'use client';

import React from 'react';
import { useApp } from '../lib/store';
import { TabFilter } from '../types';

const TABS: { key: TabFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'all_valid', label: 'All valid' },
  { key: 'any_valid', label: 'Any valid' },
  { key: 'some_broken', label: 'Some broken' },
  { key: 'all_broken', label: 'All broken' },
  { key: 'no_images', label: 'No images' },
  { key: 'selected', label: 'Selected' },
];

export function TabsBar() {
  const { state, dispatch, tabCounts } = useApp();
  const { activeTab } = state;

  return (
    <div className="flex items-center gap-1 px-4 pt-3 overflow-x-auto">
      {TABS.map(({ key, label }) => {
        const count = tabCounts[key];
        const isActive = activeTab === key;
        return (
          <button
            key={key}
            onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: key })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              isActive
                ? 'bg-teal-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {label}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                isActive ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
