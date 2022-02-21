export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function calcResponsiveSize(ratio, size) {
  return Math.min(ratio.xAxios * size, ratio.yAxios * size, size);
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

/**
 * Format a number to string appending suffix 'k', 'M', 'B' and so on...
 * Example: 1.250.000 -> 1.25M
 */
export function intToString(num) {
  if (num < 1000) {
    return num.toFixed(2);
  }

  const strNum = num.toString().replace(/[^0-9.]/g, '');
  const si = [
    { v: 1e3, s: 'K' },
    { v: 1e6, s: 'M' },
    { v: 1e9, s: 'B' },
    { v: 1e12, s: 'T' },
    { v: 1e15, s: 'P' },
    { v: 1e18, s: 'E' },
  ];
  let index;
  /* eslint-disable no-plusplus */
  for (index = si.length - 1; index > 0; index--) {
    if (strNum >= si[index].v) {
      break;
    }
  }
  return (strNum / si[index].v).toFixed(2) + si[index].s;
}
