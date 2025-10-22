/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/presentation/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.module.css',
  ],
  theme: {
    extend: {
      'safe-area-pb': {
        'padding-bottom': 'env(safe-area-inset-bottom)',
      },
      'safe-area-pt': {
        'padding-top': 'env(safe-area-inset-top)',
      },
      'safe-area-pl': {
        'padding-left': 'env(safe-area-inset-left)',
      },
      'safe-area-pr': {
        'padding-right': 'env(safe-area-inset-right)',
      },
      'safe-area-px': {
        'padding-left': 'env(safe-area-inset-left)',
        'padding-right': 'env(safe-area-inset-right)',
      },
      'safe-area-py': {
        'padding-top': 'env(safe-area-inset-top)',
        'padding-bottom': 'env(safe-area-inset-bottom)',
      },
      'safe-area-p': {
        'padding': 'env(safe-area-inset-left) env(safe-area-inset-right) env(safe-area-inset-top) env(safe-area-inset-bottom)',
      },
      'safe-area-m': {
        'margin': 'env(safe-area-inset-left) env(safe-area-inset-right) env(safe-area-inset-top) env(safe-area-inset-bottom)',
      },
      'safe-area-mt': {
        'margin-top': 'env(safe-area-inset-top)',
      },
      'safe-area-mb': {
        'margin-bottom': 'env(safe-area-inset-bottom)',
      },
      'safe-area-ml': {
        'margin-left': 'env(safe-area-inset-left)',
      },
      'safe-area-mr': {
        'margin-right': 'env(safe-area-inset-right)',
      },
      'safe-area-mx': {
        'margin-left': 'env(safe-area-inset-left)',
        'margin-right': 'env(safe-area-inset-right)',
      },
      'safe-area-my': {
        'margin-top': 'env(safe-area-inset-top)',
        'margin-bottom': 'env(safe-area-inset-bottom)',
      },
    },
  },
  plugins: [],
};
