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

export function countTrailingZeros(n: bigint): number {
  if (n === 0n) {
    return 0;
  }

  const nStr = n.toString();
  let count = 0;
  while (nStr.substr(nStr.length - 1 - count, 1) === "0") {
    count += 1;
  }
  return count;
}
