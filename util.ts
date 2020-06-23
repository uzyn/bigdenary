export function getDecimals(n: number | string): number {
  if (isNaN(n as any)) {
    throw new Error("InvalidNumber");
  }
  const [preDec, postDec] = _splitString(n.toString(), ".");
  return postDec.length;
}

export function extractExp(n: string): [string, number] {
  const [mul, expStr] = _splitString(n, "e");
  if (expStr === "") {
    return [n, 0];
  }

  const exp = parseInt(expStr, 10);
  if (isNaN(exp)) {
    throw new Error("InvalidNumber");
  }
  return [mul, exp];
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

function _splitString(input: string, char: string): [string, string] {
  const pos = input.indexOf(char);
  if (pos === -1) {
    return [input, ""];
  }
  const after = input.substr(pos + 1);
  if (after.indexOf(char) !== -1) {
    throw new Error("InvalidNumber"); // Multiple occurences
  }
  return [input.substr(0, pos), after];
}
