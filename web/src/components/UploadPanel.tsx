'use client';

import React, { useRef, useState, useCallback } from 'react';
import { useApp } from '../lib/store';
import { parseJson, autoDetectArray, getByPath } from '../lib/jsonParser';

export function UploadPanel() {
  const { dispatch, loadJson, state } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [ambiguousData, setAmbiguousData] = useState<{
    data: unknown;
    arrays: Array<{ path: string; length: number }>;
  } | null>(null);
  const [pathInput, setPathInput] = useState('');

  const processFile = useCallback(
    (file: File) => {
      if (!file.name.endsWith('.json')) {
        dispatch({ type: 'SET_UPLOAD_ERROR', payload: 'Please select a .json file' });
        return;
      }
      const reader = new FileReader();
      reader.onload = e => {
        const text = e.target?.result as string;
        const { data, error } = parseJson(text);
        if (error) {
          dispatch({ type: 'SET_UPLOAD_ERROR', payload: error });
          return;
        }
        const result = autoDetectArray(data);
        if (result.error && !result.ambiguous) {
          dispatch({ type: 'SET_UPLOAD_ERROR', payload: result.error });
          return;
        }
        if (result.ambiguous) {
          setAmbiguousData({ data, arrays: result.arrays });
          setPathInput(result.path ?? '');
          return;
        }
        loadJson(result.items);
      };
      reader.readAsText(file);
    },
    [dispatch, loadJson]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    // Reset so the same file can be re-uploaded
    e.target.value = '';
  };

  const handlePathConfirm = () => {
    if (!ambiguousData) return;
    const arr = getByPath(ambiguousData.data, pathInput);
    if (!Array.isArray(arr)) {
      dispatch({
        type: 'SET_UPLOAD_ERROR',
        payload: `Path "${pathInput}" is not an array`,
      });
      return;
    }
    setAmbiguousData(null);
    loadJson(arr);
  };

  if (ambiguousData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-lg w-full">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">
            Multiple arrays found
          </h2>
          <p className="text-gray-500 text-sm mb-5">
            Select which array to use as the item list:
          </p>
          <div className="flex flex-col gap-2 mb-5">
            {ambiguousData.arrays.slice(0, 6).map(arr => (
              <button
                key={arr.path}
                onClick={() => setPathInput(arr.path)}
                className={`flex justify-between items-center px-4 py-2.5 rounded-lg border text-sm transition-colors ${
                  pathInput === arr.path
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-gray-200 hover:border-teal-300 text-gray-700'
                }`}
              >
                <span className="font-mono">{arr.path}</span>
                <span className="text-gray-400 text-xs">{arr.length} items</span>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={pathInput}
              onChange={e => setPathInput(e.target.value)}
              placeholder="Or type a custom path..."
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-teal-500"
            />
            <button
              onClick={handlePathConfirm}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
            >
              Use this
            </button>
          </div>
          <button
            onClick={() => setAmbiguousData(null)}
            className="mt-4 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 gap-4">
      <div
        onDragOver={e => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-16 cursor-pointer transition-all text-center max-w-lg w-full select-none ${
          isDragging
            ? 'border-teal-500 bg-teal-50'
            : 'border-gray-300 bg-white hover:border-teal-400 hover:bg-gray-50'
        }`}
      >
        <div className="text-5xl mb-4">📂</div>
        <p className="text-gray-700 font-medium mb-1">Drop your JSON file here</p>
        <p className="text-gray-400 text-sm">or click to browse</p>
        <input
          ref={fileRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {state.uploadError && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg max-w-lg w-full">
          {state.uploadError}
        </div>
      )}

      <p className="text-gray-400 text-xs">
        All processing happens locally in your browser — no data is sent anywhere.
      </p>
    </div>
  );
}
