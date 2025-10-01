"use client";

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface UnsavedGuardOptions {
  hasUnsavedChanges: boolean;
  message?: string;
  onSave?: () => Promise<void> | void;
  onKeepLocal?: () => void;
  onDiscard?: () => void;
}

export function useUnsavedGuard({
  hasUnsavedChanges,
  message = "You have unsaved changes. What would you like to do?",
  onSave,
  onKeepLocal,
  onDiscard
}: UnsavedGuardOptions) {
  const router = useRouter();

  // Browser back/forward guard
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
      return undefined;
    };

    const handlePopState = (e: PopStateEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        showUnsavedModal();
      }
    };

    typeof window !== 'undefined' && window.addEventListener('beforeunload', handleBeforeUnload);
    typeof window !== 'undefined' && window.addEventListener('popstate', handlePopState);

    return () => {
      typeof window !== 'undefined' && window.removeEventListener('beforeunload', handleBeforeUnload);
      typeof window !== 'undefined' && window.removeEventListener('popstate', handlePopState);
    };
  }, [hasUnsavedChanges, message]);

  const showUnsavedModal = useCallback(() => {
    // Create modal elements
    const modal = typeof window !== 'undefined' && document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-white rounded-2xl p-6 max-w-md mx-4 shadow-xl">
        <h3 class="text-lg font-semibold mb-4">Unsaved Changes</h3>
        <p class="text-gray-600 mb-6">${message}</p>
        <div class="flex gap-3">
          <button id="save-btn" class="flex-1 px-4 py-2 bg-[var(--sage)] text-white rounded-xl font-semibold hover:opacity-95">
            Save
          </button>
          <button id="keep-local-btn" class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200">
            Keep Local
          </button>
          <button id="discard-btn" class="px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl">
            Discard
          </button>
        </div>
      </div>
    `;

    typeof window !== 'undefined' && document.body.appendChild(modal);

    // Handle modal actions
    modal.querySelector('#save-btn')?.addEventListener('click', async () => {
      if (onSave) {
        try {
          await onSave();
        } catch (error) {
          console.error('Save failed:', error);
          return;
        }
      }
      typeof window !== 'undefined' && document.body.removeChild(modal);
    });

    modal.querySelector('#keep-local-btn')?.addEventListener('click', () => {
      if (onKeepLocal) {
        onKeepLocal();
      }
      typeof window !== 'undefined' && document.body.removeChild(modal);
    });

    modal.querySelector('#discard-btn')?.addEventListener('click', () => {
      if (onDiscard) {
        onDiscard();
      }
      typeof window !== 'undefined' && document.body.removeChild(modal);
    });

    // Close on background click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        typeof window !== 'undefined' && document.body.removeChild(modal);
      }
    });

    // Focus management
    const saveBtn = modal.querySelector('#save-btn') as HTMLElement;
    saveBtn?.focus();
  }, [message, onSave, onKeepLocal, onDiscard]);

  return { showUnsavedModal };
}