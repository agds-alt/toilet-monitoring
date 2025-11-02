'use client';

/**
 * Skip Navigation Links
 * Allows keyboard users to skip to main content
 * WCAG 2.4.1 - Bypass Blocks
 */

export function SkipNavigation() {
  return (
    <div className="skip-navigation">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <a href="#main-navigation" className="skip-link">
        Skip to navigation
      </a>
      <style jsx>{`
        .skip-navigation {
          position: relative;
          z-index: 9999;
        }

        .skip-link {
          position: absolute;
          top: -40px;
          left: 0;
          background: #000;
          color: #fff;
          padding: 8px 16px;
          text-decoration: none;
          border-radius: 0 0 4px 0;
          font-weight: 600;
          z-index: 100;
          transition: top 0.2s;
        }

        .skip-link:focus {
          top: 0;
        }

        .skip-link:focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}
