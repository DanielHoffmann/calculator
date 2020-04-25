export function isNumber(val: any) {
  // eslint-disable-line
  if (typeof val === 'number') {
    return true;
  } else if (val === null) {
    return false;
  } else if (typeof val === 'string') {
    return !Number.isNaN(parseInt(val, 10));
  }
  return false;
}
