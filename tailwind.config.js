plugins: [
  function({ addUtilities }) {
    addUtilities({ 
      '.safe-area-pb': {
        'padding-bottom': 'env(safe-area-inset-bottom)',
      }
    })
  }
]