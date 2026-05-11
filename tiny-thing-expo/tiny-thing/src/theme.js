// src/theme.js
export const colors = {
  bg:        '#f5f0e8',
  bgCard:    '#fdf9f3',
  ink:       '#1a1a1a',
  inkLight:  'rgba(26,26,26,0.38)',
  inkFaint:  'rgba(26,26,26,0.15)',
  accent:    '#1a1a1a',
  accentFg:  '#f5f0e8',
  border:    'rgba(26,26,26,0.1)',

  // Card palette — warm naturals
  cardColors: [
    '#c8dfc8', '#f0d4a0', '#d4c8f0',
    '#f0c8c8', '#c8e4f0', '#f0e4c8',
    '#d4e8d4', '#e8d4f0', '#f0d4e8',
    '#d4f0e8', '#f0e8d4', '#e4d4c8',
  ],
};

export const type = {
  serif:      'serif',   // fallback — swap for custom font via expo-font
  sans:       'System',  // San Francisco on iOS, Roboto on Android
};

export const radius = {
  sm:  10,
  md:  16,
  lg:  20,
  xl:  28,
};

export const space = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  40,
};
