export function getDecimals(n: number | string): number {
  if (isNaN(n as any)) {
    throw new Error("InvalidNumber");
  }
  const components = n.toString().split(".");
  if (components.length === 1) {
    return 0;
  } else if (components.length !== 2) {
    throw new Error("InvalidNumber");
  }
  return components[1].length || 0;
}

export function countTrailingZeros(n: bigint, upTo: number): number {
  if (n === 0n) {
    return 0;
  }

  let count = 0;
  let c = n < 0 ? n * -1n : n;
  while (c % 10n === 0n && count < upTo) {
    count += 1;
    c = c / 10n;
  }
  return count;
}
