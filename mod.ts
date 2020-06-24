import {
  bigIntAbs,
  countTrailingZeros,
  extractExp,
  getDecimals,
} from "./util.ts";

export interface BigDenaryRaw {
  base: bigint;
  decimals: number;
}

export type BDNumberInput = number | string | bigint | BigDenary | BigDenaryRaw;

export enum BDCompare {
  Greater = 1,
  Less = -1,
  Equal = 0,
}

export class BigDenary {
  base: bigint;
  private _decimals: number;

  constructor(n: BDNumberInput) {
    if (n instanceof BigDenary) {
      this.base = n.base;
      this._decimals = n.decimals;
    } else if (typeof n === "number") {
      this._decimals = getDecimals(n);
      this.base = BigInt(n * Math.pow(10, this._decimals));
    } else if (typeof n === "string") {
      const [mul, exp] = extractExp(n);
      const mulDec = getDecimals(mul);
      if (exp > mulDec) {
        this.base = BigInt(mul.replace(".", "")) *
          BigInt(Math.pow(10, (exp - mulDec)));
        this._decimals = 0;
      } else {
        this.base = BigInt(mul.replace(".", ""));
        this._decimals = mulDec - exp;
      }
    } else if (typeof n === "bigint") {
      this.base = n * this.decimalMultiplier;
      this._decimals = 0;
    } else if (_isBigDenaryRaw(n)) {
      if (n.decimals < 0) {
        throw new Error("InvalidBigDenaryRaw");
      }
      this.base = n.base;
      this._decimals = n.decimals;
    } else {
      throw new Error("UnsupportedInput");
    }
    this.trimTrailingZeros();
  }

  toString(): string {
    if (this.base === 0n) {
      return "0";
    }
    const negative: boolean = (this.base < 0);
    let base = this.base;
    if (negative) {
      base = base * -1n;
    }

    const baseStr = base.toString();
    const position = baseStr.length - this._decimals;
    let pre: string;
    let post: string;
    if (position < 0) {
      pre = "";
      post = `${_strOfZeros(position * -1)}${baseStr}`;
    } else {
      pre = baseStr.substr(0, position);
      post = baseStr.substr(position);
    }

    let result: string;
    if (pre.length === 0) {
      result = `0.${post}`;
    } else if (post.length === 0) {
      result = `${pre}`;
    } else {
      result = `${pre}.${post}`;
    }

    if (negative) {
      return `-${result}`;
    }
    return result;
  }

  valueOf(): number {
    return Number.parseFloat(this.toString());
  }

  toFixed(digits?: number): string {
    if (!digits) {
      return this.toString();
    }
    const temp = new BigDenary(this);
    temp.scaleDecimalsTo(digits);
    return temp.toString();
  }

  get decimals(): number {
    return this._decimals;
  }

  /**
   * Alters the decimal places, actual underlying value does not change
   */
  scaleDecimalsTo(_decimals: number): void {
    if (_decimals > this._decimals) {
      this.base = this.base *
        BigDenary.getDecimalMultiplier(_decimals - this._decimals);
    } else if (_decimals < this._decimals) {
      const adjust = this._decimals - _decimals;
      const multiplier = BigDenary.getDecimalMultiplier(adjust);
      const remainder = this.base % multiplier;
      this.base = this.base / multiplier;
      if (bigIntAbs(remainder * 2n) >= multiplier) {
        if (this.base >= 0) {
          this.base += 1n;
        } else {
          this.base -= 1n;
        }
      }
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

  trimTrailingZeros(): void {
    const trailingZerosCount = countTrailingZeros(this.base, this.decimals);
    if (trailingZerosCount > 0) {
      this.scaleDecimalsTo(this.decimals - trailingZerosCount);
    }
  }

  /**
   * Operations
   */
  plus(operand: BDNumberInput): BigDenary {
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

  minus(operand: BDNumberInput): BigDenary {
    return this.plus((new BigDenary(operand)).negated());
  }

  multipliedBy(operand: BDNumberInput): BigDenary {
    const curr = new BigDenary(this);
    const oper = new BigDenary(operand);
    const targetDecs = curr.decimals + oper.decimals;

    return new BigDenary({
      base: curr.base * oper.base,
      decimals: targetDecs,
    });
  }

  dividedBy(operand: BDNumberInput): BigDenary {
    const MIN_DIVIDE_DECIMALS = 20;
    const curr = new BigDenary(this);
    const oper = new BigDenary(operand);
    const targetDecs = Math.max(
      curr.decimals * 2,
      oper.decimals * 2,
      MIN_DIVIDE_DECIMALS,
    );
    curr.scaleDecimalsTo(targetDecs);

    return new BigDenary({
      base: curr.base / oper.base,
      decimals: curr.decimals - oper.decimals,
    });
  }

  negated(): BigDenary {
    return new BigDenary({
      base: this.base * -1n,
      decimals: this.decimals,
    });
  }

  absoluteValue(): BigDenary {
    if (this.base >= 0n) {
      return this;
    }
    return this.negated();
  }

  /**
   * Comparisons
   */

  comparedTo(comparator: BDNumberInput): BDCompare {
    const curr = new BigDenary(this);
    const comp = new BigDenary(comparator);
    const targetDecs = Math.max(curr.decimals, comp.decimals);
    curr.scaleDecimalsTo(targetDecs);
    comp.scaleDecimalsTo(targetDecs);

    if (curr.base > comp.base) {
      return BDCompare.Greater;
    } else if (curr.base < comp.base) {
      return BDCompare.Less;
    }
    return BDCompare.Equal;
  }

  equals(comparator: BDNumberInput): boolean {
    return (this.comparedTo(comparator) === BDCompare.Equal);
  }

  greaterThan(comparator: BDNumberInput): boolean {
    return (this.comparedTo(comparator) === BDCompare.Greater);
  }

  greaterThanOrEqualTo(comparator: BDNumberInput): boolean {
    return (
      (this.comparedTo(comparator) === BDCompare.Greater) ||
      (this.comparedTo(comparator) === BDCompare.Equal)
    );
  }

  lessThan(comparator: BDNumberInput): boolean {
    return (this.comparedTo(comparator) === BDCompare.Less);
  }

  lessThanOrEqualTo(comparator: BDNumberInput): boolean {
    return (
      (this.comparedTo(comparator) === BDCompare.Less) ||
      (this.comparedTo(comparator) === BDCompare.Equal)
    );
  }

  /**
   * Shortforms
   */
  add(operand: BDNumberInput): BigDenary {
    return this.plus(operand);
  }

  sub(operand: BDNumberInput): BigDenary {
    return this.minus(operand);
  }

  mul(operand: BDNumberInput): BigDenary {
    return this.multipliedBy(operand);
  }

  div(operand: BDNumberInput): BigDenary {
    return this.dividedBy(operand);
  }

  neg(): BigDenary {
    return this.negated();
  }

  abs(): BigDenary {
    return this.absoluteValue();
  }

  cmp(comparator: BDNumberInput): BDCompare {
    return this.comparedTo(comparator);
  }

  eq(comparator: BDNumberInput): boolean {
    return this.equals(comparator);
  }

  gt(comparator: BDNumberInput): boolean {
    return this.greaterThan(comparator);
  }

  gte(comparator: BDNumberInput): boolean {
    return this.greaterThanOrEqualTo(comparator);
  }

  lt(comparator: BDNumberInput): boolean {
    return this.lessThan(comparator);
  }

  lte(comparator: BDNumberInput): boolean {
    return this.lessThanOrEqualTo(comparator);
  }
}

function _isBigDenaryRaw(input: BigDenaryRaw): input is BigDenaryRaw {
  return true;
}

function _strOfZeros(count: number): string {
  let result = "";
  for (let i = 0; i < count; i += 1) {
    result += "0";
  }
  return result;
}
