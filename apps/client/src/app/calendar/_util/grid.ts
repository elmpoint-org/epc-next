export function gridCols(days: number) {
  const gridTemplateColumns = `repeat(${days * 2}, minmax(0, 1fr))`;
  return gridTemplateColumns;
}
