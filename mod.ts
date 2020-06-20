const DEFAULT_DECIMALS = 8;

export class BigDenary {
  base: bigint;
  private _decimals: number;

  constructor(n: number | string | bigint | BigDenary, decimals?: number) {
    if (decimals && decimals < 0) {
      throw new Error("DecimalsMustBePositive");
    }

    if (n instanceof BigDenary) {
      // TODO: Support scaling
      if (decimals) {
        throw new Error("UnexpectedParameter");
      }
      this.base = n.base;
      this._decimals = n.decimals;
    } else if (typeof n === "number") {
      this._decimals = decimals ? decimals : DEFAULT_DECIMALS;
      this.base = BigInt(Math.floor(n * Math.pow(10, this._decimals)));
    } else if (typeof n === "bigint") {
      this._decimals = decimals ? decimals : DEFAULT_DECIMALS;
      this.base = n * this.decimalMultiplier;
    } else if (typeof n === "string") {
      this._decimals = decimals ? decimals : DEFAULT_DECIMALS;
      try {
        this.base = BigInt(n) * this.decimalMultiplier;
      } catch {
        this.base = BigInt(
          Math.floor(Number.parseFloat(n) * Math.pow(10, this._decimals)),
        );
      }
    } else {
      throw new Error("UnsupportedInput");
    }
  }

  get decimals(): number {
    return this._decimals;
  }

  set decimals(_decimals: number) {
    if (_decimals > this._decimals) {
      this.base = this.base * BigDenary.getDecimalMultiplier(_decimals - this._decimals);
    } else if (_decimals < this._decimals) {
      this.base = this.base / BigDenary.getDecimalMultiplier(this._decimals - _decimals);
    }
    this._decimals = _decimals;
  }

  get decimalMultiplier(): bigint {4
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
