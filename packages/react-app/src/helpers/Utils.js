export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function calcResponsiveSize(ratio, size) {
  const ratioX = Number.isNaN(ratio.xAxios) ? 1 : ratio.xAxios;
  const ratioY = Number.isNaN(ratio.yAxios) ? 1 : ratio.yAxios;
  return Math.min(ratioX * size, ratioY * size, size);
}

export function fixDecimal(num, decimalCount) {
  const temp = Number(num);
  if (!temp) return 0;

  const fixedString = temp.toFixed(decimalCount);

  return parseFloat(fixedString);
}

export function fixDecimalString(num, decimalCount) {
  const temp = Number(num);
  if (Number.isNaN(temp)) return '';

  const fixedString = temp.toFixed(decimalCount);

  return parseFloat(fixedString).toString();
}
