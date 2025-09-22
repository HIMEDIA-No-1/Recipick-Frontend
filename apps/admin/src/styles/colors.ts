export const colors = {
  background: {
    primary: '#FAF7F2',
    primaryDark: '#242424',
    secondary: '#FFFFFF',
    secondaryDark: '#333333',
    accent: '#E0EBF7',
    accentDark: '#404040',
  },
  text: {
    primary: '#4B4B4B',
    primaryDark: '#E0E0E0',
    secondary: '#878787',
    secondaryDark: '#A0A0A0',
    muted: '#F0EEEB',
    mutedDark: '#383838',
  },
  border: {
    primary: '#D1D1D1',
    primaryDark: '#404040',
  },
  button: {
    primary: '#6789A5',
    primaryHover: '#5A7E9D',
    secondary: '#E0EBF7',
    secondaryHover: '#D1E0F2',
  },
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
} as const;

export type Colors = typeof colors;