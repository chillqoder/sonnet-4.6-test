'use client';

import React from 'react';
import { useApp } from '../lib/store';
import { CardItem } from './CardItem';

export function CardsGrid() {
  const { filteredItems, state } = useApp();

  if (filteredItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <p className="text-lg">No items match this filter</p>
        <p className="text-sm mt-1">
          {state.activeTab === 'selected'
            ? 'Select some cards to see them here'
            : 'Try a different tab'}
        </p>
      </div>
    );
  }

  return (
    <div
      className="grid gap-4 p-4"
      style={{
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        // content-visibility for performance with large lists
      }}
    >
      {filteredItems.map(item => (
        <div
          key={item.id}
          style={{ contentVisibility: 'auto', containIntrinsicSize: '0 280px' }}
        >
          <CardItem item={item} />
        </div>
      ))}
    </div>
  );
}
