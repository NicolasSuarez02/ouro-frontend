/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // -------------------------------------------------
      // BREAKPOINTS
      // Solo override 2xl a 1440 (default Tailwind = 1536).
      // Side-rail del design system se activa a partir de 2xl.
      // -------------------------------------------------
      screens: {
        '2xl': '1440px',
      },

      // -------------------------------------------------
      // COLORES — Sistema OURO v2
      // -------------------------------------------------
      colors: {
        navy: {
          DEFAULT: '#0B1C2D',
          deep:    '#061320',
          soft:    '#142940',
          card:    '#0F2236',
        },
        gold: {
          DEFAULT: '#C6A75E',
          soft:    '#D4B76A',
          bright:  '#E0C780',
          deep:    '#A8842C',
          close:   '#B8943F',
          dim:     'rgba(198, 167, 94, 0.4)',
          faint:   'rgba(198, 167, 94, 0.15)',
          ghost:   'rgba(198, 167, 94, 0.06)',
        },
        white: {
          DEFAULT: '#F2F2F2',
          dim:     'rgba(242, 242, 242, 0.7)',
          faint:   'rgba(242, 242, 242, 0.4)',
          ghost:   'rgba(242, 242, 242, 0.1)',
        },

        // -------------------------------------------------
        // LEGACY — colores del sistema anterior.
        // Coexisten temporalmente con los del nuevo sistema
        // para no romper componentes aún no migrados.
        // Se removerán cuando todas las páginas hayan pasado
        // por la migración visual.
        // -------------------------------------------------
        primary: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        mystic: {
          50:  '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
      },

      // -------------------------------------------------
      // TIPOGRAFÍA
      // -------------------------------------------------
      fontFamily: {
        sans:  ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['"Cormorant Garamond"', '"Times New Roman"', 'serif'],
      },

      // Letter-spacing semánticos
      letterSpacing: {
        'eyebrow':      '0.3em',
        'eyebrow-wide': '0.4em',
        'brand':        '0.45em',
        'dropdown':     '0.15em',
        'suffix':       '0.2em',
      },

      // -------------------------------------------------
      // ANIMACIÓN
      // -------------------------------------------------
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        '400':  '400ms',
        '600':  '600ms',
        '800':  '800ms',
        '1200': '1200ms',
      },

      // -------------------------------------------------
      // SOMBRAS
      // -------------------------------------------------
      boxShadow: {
        'card-hover':     '0 30px 80px rgba(0, 0, 0, 0.4)',
        'gold-glow':      '0 12px 40px rgba(198, 167, 94, 0.25)',
        'gold-glow-soft': '0 0 12px rgba(198, 167, 94, 0.6)',
      },

      // -------------------------------------------------
      // CONTENEDOR / LAYOUT
      // -------------------------------------------------
      maxWidth: {
        'container': '1200px',
      },

      // -------------------------------------------------
      // GRADIENTE METÁLICO OFICIAL
      // Disponible como `bg-gold-gradient`.
      // -------------------------------------------------
      backgroundImage: {
        'gold-gradient':
          'linear-gradient(135deg, #A8842C 0%, #C6A75E 40%, #E0C780 60%, #B8943F 100%)',
      },
    },
  },
  plugins: [],
};
