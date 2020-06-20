const DEFAULT_DECIMALS = 8;

export class BigDenary {
  base: bigint;
  decimals: number;

  constructor(n: number | string | bigint | BigDenary, decimals?: number) {
    if (n instanceof BigDenary) {
      // TODO: Support scaling
      if (decimals) {
        throw new Error("UnexpectedParameter");
      }
      this.base = n.base;
      this.decimals = n.decimals;
    } else if (typeof n === "number") {
      this.decimals = decimals ? decimals : DEFAULT_DECIMALS;
      this.base = BigInt(Math.floor(n * Math.pow(10, this.decimals)));
    } else if (typeof n === "bigint") {
      this.decimals = decimals ? decimals : DEFAULT_DECIMALS;
      this.base = n * this.decimalMultiplier;
    } else if (typeof n === "string") {
      this.decimals = decimals ? decimals : DEFAULT_DECIMALS;
      try {
        this.base = BigInt(n) * this.decimalMultiplier;
      } catch {
        this.base = BigInt(
          Math.floor(Number.parseFloat(n) * Math.pow(10, this.decimals)),
        );
      }
    } else {
      throw new Error("UnsupportedInput");
    }
  }

  get decimalMultiplier(): bigint {
    let multiplierStr: string = "1";
    for (let i = 0; i < this.decimals; i += 1) {
      multiplierStr += "0";
    }
    return BigInt(multiplierStr);
  }
}
