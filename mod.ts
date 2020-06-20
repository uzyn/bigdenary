export class BigDenary {
  base: BigInt;
  decimals: number;

  constructor(n: number | string | BigDenary, decimals?: number) {
    if (n instanceof BigDenary) {
      // TODO: Support scaling
      if (decimals) {
        throw new Error("UnexpectedParameter");
      }
      this.base = n.base;
      this.decimals = n.decimals;
    } else if (typeof n === "number") {
      this.decimals = decimals ? decimals : 8;
      this.base = BigInt(Math.floor(n * Math.pow(10, this.decimals)));
    } else {
      this.base = 0n;
      this.decimals = 18;
    }
  }
}
