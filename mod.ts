import { getDecimals } from "./util.ts";

const DEFAULT_DECIMALS = 20;

export class BigDenary {
  base: bigint;
  private _decimals: number;

  constructor(n: number | string | bigint | BigDenary, decimals?: number) {
    if (decimals && decimals < 0) {
      throw new Error("DecimalsMustBePositive");
    }

    if (n instanceof BigDenary) {
      this.base = n.base;
      this._decimals = n.decimals;
      if (decimals) {
        this.decimals = decimals; // scale
      }
    } else if (typeof n === "number") {
      this._decimals = getDecimals(n);
      this.base = BigInt(n * Math.pow(10, this._decimals));
      this.decimals = decimals ? decimals : DEFAULT_DECIMALS;
    } else if (typeof n === "string") {
      this._decimals = getDecimals(n);
      this.base = BigInt(n.replace(".", ""));
      this.decimals = decimals ? decimals : DEFAULT_DECIMALS;
    } else if (typeof n === "bigint") {
      this._decimals = decimals ? decimals : DEFAULT_DECIMALS;
      this.base = n * this.decimalMultiplier;
    } else {
      throw new Error("UnsupportedInput");
    }
  }

  toString(): string {
    const baseStr = this.base.toString();
    const position = baseStr.length - this._decimals;
    return `${baseStr.substr(0, position)}.${baseStr.substr(position)}`;
  }

  valueOf(): number {
    return Number.parseFloat(this.toString());
  }

  get decimals(): number {
    return this._decimals;
  }

  set decimals(_decimals: number) {
    if (_decimals > this._decimals) {
      this.base = this.base *
        BigDenary.getDecimalMultiplier(_decimals - this._decimals);
    } else if (_decimals < this._decimals) {
      this.base = this.base /
        BigDenary.getDecimalMultiplier(this._decimals - _decimals);
    }
    this._decimals = _decimals;
  }

  get decimalMultiplier(): bigint {
    4;
    return BigDenary.getDecimalMultiplier(this._decimals);
  }

  static getDecimalMultiplier(decimals: number): bigint {
    let multiplierStr: string = "1";
    for (let i = 0; i < decimals; i += 1) {
      multiplierStr += "0";
    }
    return BigInt(multiplierStr);
  }
}
