export interface ThemeColors {
  primary: string;
  background: string;
  secondary: string;
  text: string;
  card: string;
  border: string;
}

export interface Theme {
  id: string;
  name: string;
  emoji: string;
  colors: ThemeColors;
}

export const THEMES: Theme[] = [
  {
    id: 'vanilla',
    name: 'Vanilla Cream',
    emoji: '🍦',
    colors: {
      primary: '#D2B48C',
      background: '#FDFBF7',
      secondary: '#F5F5DC',
      text: '#4A3B3E',
      card: 'rgba(255, 255, 255, 0.9)',
      border: 'rgba(210, 180, 140, 0.15)'
    }
  },
  {
    id: 'strawberry',
    name: 'Strawberry Milk',
    emoji: '🍓',
    colors: {
      primary: '#FFB7C5',
      background: '#FFF9FA',
      secondary: '#FFF0F3',
      text: '#5D4037',
      card: 'rgba(255, 255, 255, 0.9)',
      border: 'rgba(255, 183, 197, 0.15)'
    }
  },
  {
    id: 'matcha',
    name: 'Matcha Latte',
    emoji: '🍵',
    colors: {
      primary: '#A8B99E',
      background: '#F7F9F7',
      secondary: '#E8EFE8',
      text: '#2F362F',
      card: 'rgba(255, 255, 255, 0.9)',
      border: 'rgba(168, 185, 158, 0.15)'
    }
  },
  {
    id: 'linen',
    name: 'Soft Linen',
    emoji: '☁️',
    colors: {
      primary: '#B0BEC5',
      background: '#F8F9FA',
      secondary: '#ECEFF1',
      text: '#37474F',
      card: 'rgba(255, 255, 255, 0.9)',
      border: 'rgba(176, 190, 197, 0.15)'
    }
  },
  {
    id: 'latte',
    name: 'Iced Latte',
    emoji: '☕',
    colors: {
      primary: '#A1887F',
      background: '#FAF9F8',
      secondary: '#EFEBE9',
      text: '#3E2723',
      card: 'rgba(255, 255, 255, 0.9)',
      border: 'rgba(161, 136, 127, 0.15)'
    }
  }
];
