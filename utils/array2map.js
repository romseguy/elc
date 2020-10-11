export function array2map(array, key) {
  const map = {};
  array.forEach((row) => (map[row[key]] = row));
  return map;
}
