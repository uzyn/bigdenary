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
