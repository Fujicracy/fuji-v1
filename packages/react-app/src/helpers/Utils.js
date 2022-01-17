export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function fixDecimal(num, decimalCount) {
  const temp = Number(num);
  if (!temp) return 0;

  const fixedString = temp.toFixed(decimalCount);

  return parseFloat(fixedString);
}
