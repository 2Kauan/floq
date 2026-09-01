const COVER_COLORS = [
  '#E05A2B', // Terracota vibrante FLOQ
  '#D97706', // Âmbar dourado
  '#C2410C', // Laranja tijolo queimado
  '#B45309', // Canela quente
  '#854D0E', // Caramelo outono
  '#9A3412', // Ferrugem literário
  '#7C5E48', // Marrom aveludado
  '#78350F', // Mogno rústico
];

export function hashTitle(title: string): number {
  if (!title) return 0;
  return Math.abs(
    title
      .trim()
      .split('')
      .reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
  );
}

export function getPlaceholderColor(title: string): string {
  if (!title) return COVER_COLORS[0];
  const index = hashTitle(title) % COVER_COLORS.length;
  return COVER_COLORS[index];
}

export function getInitialLetter(title: string): string {
  const clean = title ? title.trim() : '';
  return clean ? clean.charAt(0).toUpperCase() : 'F';
}
