'use client';

import React from 'react';
import { useApp } from '../lib/store';
import { computeItemStatus } from '../lib/utils';
import { TabFilter } from '../types';

interface MetricProps {
  label: string;
  value: number;
  color: string;
  tab?: TabFilter;
  onClick?: () => void;
}

function Metric({ label, value, color, onClick }: MetricProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center px-4 py-3 rounded-lg border transition-all hover:shadow-sm ${color}`}
    >
      <span className="text-2xl font-bold leading-none">{value}</span>
      <span className="text-xs mt-1 font-medium opacity-80">{label}</span>
    </button>
  );
}

export function MetricsPanel() {
  const { state, dispatch } = useApp();
  const { items, urlCache } = state;

  const noImages = items.filter(item => item.imageUrls.length === 0).length;
  const anyValid = items.filter(item =>
    item.imageUrls.some(url => urlCache[url] === 'valid')
  ).length;
  const allValid = items.filter(
    item => computeItemStatus(item.imageUrls, urlCache) === 'all_valid'
  ).length;
  const anyBroken = items.filter(item =>
    item.imageUrls.some(url => urlCache[url] === 'broken')
  ).length;
  const selected = items.filter(item => item.selected).length;

  const go = (tab: TabFilter) => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab });

  return (
    <div className="flex flex-wrap gap-2 px-4 pt-4">
      <Metric
        label="Total"
        value={items.length}
        color="bg-gray-50 border-gray-200 text-gray-700"
        onClick={() => go('all')}
      />
      <Metric
        label="No images"
        value={noImages}
        color="bg-gray-50 border-gray-200 text-gray-500"
        onClick={() => go('no_images')}
      />
      <Metric
        label="Any valid"
        value={anyValid}
        color="bg-green-50 border-green-200 text-green-700"
        onClick={() => go('any_valid')}
      />
      <Metric
        label="All valid"
        value={allValid}
        color="bg-emerald-50 border-emerald-200 text-emerald-700"
        onClick={() => go('all_valid')}
      />
      <Metric
        label="Any broken"
        value={anyBroken}
        color="bg-red-50 border-red-200 text-red-600"
        onClick={() => go('some_broken')}
      />
      <Metric
        label="Selected"
        value={selected}
        color="bg-teal-50 border-teal-200 text-teal-700"
        onClick={() => go('selected')}
      />
    </div>
  );
}
