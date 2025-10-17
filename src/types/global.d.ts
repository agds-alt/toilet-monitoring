// ===================================
// 📁 src/types/global.d.ts
// ===================================

declare global {
  interface Window {
    fs: {
      readFile: (path: string, options?: { encoding?: string }) => Promise<any>;
    };
  }
}

export {};