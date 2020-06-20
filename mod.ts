import { getDecimals } from "./util.ts";

interface BigDenaryRaw {
  base: bigint;
  decimals: number;
}

type NumberInput = number | string | bigint | BigDenary | BigDenaryRaw;

function isBigDenaryRaw(input: BigDenaryRaw): input is BigDenaryRaw {
  return true;
}

export class BigDenary {
  base: bigint;
  private _decimals: number;

  constructor(n: NumberInput) {
    if (n instanceof BigDenary) {
      this.base = n.base;
      this._decimals = n.decimals;
    } else if (typeof n === "number") {
      this._decimals = getDecimals(n);
      this.base = BigInt(n * Math.pow(10, this._decimals));
    } else if (typeof n === "string") {
      this._decimals = getDecimals(n);
      this.base = BigInt(n.replace(".", ""));
    } else if (typeof n === "bigint") {
      this.base = n * this.decimalMultiplier;
      this._decimals = 0;
    } else if (isBigDenaryRaw(n)) {
      this.base = n.base;
      this._decimals = n.decimals;
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

  /**
   * Alters the decimal places, actual underlying value does not change
   */
  scaleDecimalsTo(_decimals: number) {
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
    return BigDenary.getDecimalMultiplier(this._decimals);
  }

  static getDecimalMultiplier(decimals: number): bigint {
    let multiplierStr: string = "1";
    for (let i = 0; i < decimals; i += 1) {
      multiplierStr += "0";
    }
    return BigInt(multiplierStr);
  }

  /**
   * Operations
   */
  add(operand: NumberInput): BigDenary {
    const curr = new BigDenary(this);
    const oper = new BigDenary(operand);
    const targetDecs = Math.max(curr.decimals, oper.decimals);
    curr.scaleDecimalsTo(targetDecs);
    oper.scaleDecimalsTo(targetDecs);

    return new BigDenary({
      base: curr.base + oper.base,
      decimals: targetDecs,
    });
  }
}
