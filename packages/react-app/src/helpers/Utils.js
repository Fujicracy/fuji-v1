export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function calcResponsiveSize(ratio, size) {
  return Math.min(ratio.xAxios * size, ratio.yAxios * size, size);
}
