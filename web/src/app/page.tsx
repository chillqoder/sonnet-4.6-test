'use client';

import React from 'react';
import { AppProvider, useApp } from '../lib/store';
import { UploadPanel } from '../components/UploadPanel';
import { MetricsPanel } from '../components/MetricsPanel';
import { TabsBar } from '../components/TabsBar';
import { ActionBar } from '../components/ActionBar';
import { CardsGrid } from '../components/CardsGrid';
import { ModalViewer } from '../components/ModalViewer';
import { ImageGalleryModal } from '../components/ImageGalleryModal';

function AppContent() {
  const { state } = useApp();
  const hasItems = state.items.length > 0;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xl">🖼️</span>
          <h1 className="font-semibold text-gray-800 text-base">JSON Image Cleaner</h1>
        </div>
        {hasItems && (
          <span className="text-xs text-gray-400 font-mono">
            {state.items.length} items loaded
          </span>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">
        {!hasItems ? (
          <UploadPanel />
        ) : (
          <>
            <MetricsPanel />
            <TabsBar />
            <ActionBar />
            <CardsGrid />
          </>
        )}
      </main>

      {/* Modals */}
      <ModalViewer />
      <ImageGalleryModal />
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
