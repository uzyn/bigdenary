import { countTrailingZeros, extractExp, getDecimals } from "./util.ts";

interface BigDenaryRaw {
  base: bigint;
  decimals: number;
}

type NumberInput = number | string | bigint | BigDenary | BigDenaryRaw;

enum CommparisonResult {
  Greater = 1,
  Less = -1,
  Equal = 0,
}

function isBigDenaryRaw(input: BigDenaryRaw): input is BigDenaryRaw {
  return true;
}

export default class BigDenary {
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
    } else if (isBigDenaryRaw(n)) {
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

    const baseStr = this.base.toString();
    const position = baseStr.length - this._decimals;
    const pre = baseStr.substr(0, position);
    const post = baseStr.substr(position);

    if (pre.length === 0) {
      return `0.${post}`;
    } else if (post.length === 0) {
      return `${pre}`;
    }
    return `${pre}.${post}`;
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
  scaleDecimalsTo(_decimals: number): void {
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

  trimTrailingZeros(): void {
    const trailingZerosCount = countTrailingZeros(this.base);
    this.scaleDecimalsTo(Math.max(this.decimals - trailingZerosCount, 0));
  }

  /**
   * Operations
   */
  plus(operand: NumberInput): BigDenary {
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

  minus(operand: NumberInput): BigDenary {
    return this.plus((new BigDenary(operand)).negated());
  }

  multipliedBy(operand: NumberInput): BigDenary {
    const curr = new BigDenary(this);
    const oper = new BigDenary(operand);
    const targetDecs = curr.decimals + oper.decimals;

    return new BigDenary({
      base: curr.base * oper.base,
      decimals: targetDecs,
    });
  }

  dividedBy(operand: NumberInput): BigDenary {
    const MIN_DIVIDE_DECIMALS = 20;
    const curr = new BigDenary(this);
    const oper = new BigDenary(operand);
    const targetDecs = Math.max((curr.decimals) * 2, MIN_DIVIDE_DECIMALS);
    curr.scaleDecimalsTo(targetDecs);

    return new BigDenary({
      base: curr.base / oper.base,
      decimals: targetDecs,
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

  comparedTo(comparator: NumberInput): CommparisonResult {
    const curr = new BigDenary(this);
    const comp = new BigDenary(comparator);
    const targetDecs = Math.max(curr.decimals, comp.decimals);
    curr.scaleDecimalsTo(targetDecs);
    comp.scaleDecimalsTo(targetDecs);

    if (curr.base > comp.base) {
      return CommparisonResult.Greater;
    } else if (curr.base < comp.base) {
      return CommparisonResult.Less;
    }
    return CommparisonResult.Equal;
  }

  equals(comparator: NumberInput): boolean {
    return (this.comparedTo(comparator) === CommparisonResult.Equal);
  }

  greaterThan(comparator: NumberInput): boolean {
    return (this.comparedTo(comparator) === CommparisonResult.Greater);
  }

  greaterThanOrEqualTo(comparator: NumberInput): boolean {
    return (
      (this.comparedTo(comparator) === CommparisonResult.Greater) ||
      (this.comparedTo(comparator) === CommparisonResult.Equal)
    );
  }

  lessThan(comparator: NumberInput): boolean {
    return (this.comparedTo(comparator) === CommparisonResult.Less);
  }

  lessThanOrEqualTo(comparator: NumberInput): boolean {
    return (
      (this.comparedTo(comparator) === CommparisonResult.Less) ||
      (this.comparedTo(comparator) === CommparisonResult.Equal)
    );
  }

  /**
   * Shortforms
   */
  add(operand: NumberInput): BigDenary {
    return this.plus(operand);
  }

  sub(operand: NumberInput): BigDenary {
    return this.minus(operand);
  }

  mul(operand: NumberInput): BigDenary {
    return this.multipliedBy(operand);
  }

  div(operand: NumberInput): BigDenary {
    return this.dividedBy(operand);
  }

  neg(): BigDenary {
    return this.negated();
  }

  abs(): BigDenary {
    return this.absoluteValue();
  }

  cmp(comparator: NumberInput): CommparisonResult {
    return this.comparedTo(comparator);
  }

  eq(comparator: NumberInput): boolean {
    return this.equals(comparator);
  }

  gt(comparator: NumberInput): boolean {
    return this.greaterThan(comparator);
  }

  gte(comparator: NumberInput): boolean {
    return this.greaterThanOrEqualTo(comparator);
  }

  lt(comparator: NumberInput): boolean {
    return this.lessThan(comparator);
  }

  lte(comparator: NumberInput): boolean {
    return this.lessThanOrEqualTo(comparator);
  }
}
