'use client';

import { useEffect } from 'react';

/**
 * Focus Visible Handler
 * Adds focus-visible class to document when keyboard navigation is detected
 * Improves keyboard navigation UX
 */

export function FocusVisible() {
  useEffect(() => {
    let isUsingKeyboard = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        isUsingKeyboard = true;
        document.body.classList.add('keyboard-nav');
      }
    };

    const handleMouseDown = () => {
      isUsingKeyboard = false;
      document.body.classList.remove('keyboard-nav');
    };

    const handleFocus = (e: FocusEvent) => {
      if (isUsingKeyboard && e.target instanceof HTMLElement) {
        e.target.classList.add('focus-visible');
      }
    };

    const handleBlur = (e: FocusEvent) => {
      if (e.target instanceof HTMLElement) {
        e.target.classList.remove('focus-visible');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('focus', handleFocus, true);
    document.addEventListener('blur', handleBlur, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('focus', handleFocus, true);
      document.removeEventListener('blur', handleBlur, true);
    };
  }, []);

  return (
    <style jsx global>{`
      /* Enhanced focus indicators for keyboard navigation */
      .keyboard-nav *:focus {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
      }

      .focus-visible {
        outline: 2px solid #3b82f6 !important;
        outline-offset: 2px !important;
      }

      /* Remove outline for mouse users */
      *:focus:not(.focus-visible) {
        outline: none;
      }

      /* High contrast mode support */
      @media (prefers-contrast: high) {
        .keyboard-nav *:focus,
        .focus-visible {
          outline-width: 3px !important;
          outline-color: currentColor !important;
        }
      }

      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    `}</style>
  );
}
