BigDenary
----
Arbitrary-length decimal implementation using JavaScript's native [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) with no dependencies.

- Supported on Node >= 10.4 and Deno.
- Check [caniuse.com](https://caniuse.com/#search=bigint) for browser support.

### Features

- [Deno](https://deno.land) module first. Also soon to be available as ES Module (ESM) and CommonJS (Node) module.

- Compute methods are largely implemented through native BigInt, without much string manipulation required.

- Standalone & lightweight. Zero dependencies.

- Intuitive data structure – base amount and decimals.

- _Should be_ faster than existing bignumber, bigdecimal today. _(Untested, yet)_

- API is similar with popular bignumber, big.js, decimal.js, decimal.js-light, though not all methods are supported, yet.

## Usage

```ts
import BigDenary from "https://raw.githubusercontent.com/uzyn/bigdenary/master/mod.ts";

const bd = new BigDenary("123.4512");
const sum = bd.add(56.1e2));

console.log(sum.toString()); // 5733.4512
console.log(sum); // BigDenary { base: 57334512n, _decimals: 4 }
```

API is largely inspired by [`decimal.js-light`](https://github.com/MikeMcl/decimal.js-light).

### Available API

#### Core
- `constructor()`: supports `number | string | bigint | BigDenary | BigDenaryRaw`.
- `toString()`: Returns string representation
- `valueOf()`: Returns number approximation

#### Operations
- `plus()` or `add()`: Addition
- `minus()` or `sub()`: Subtraction
- `multipliedBy()` or `mul()`: Multiplication
- `dividedBy()` or `div()`: Division
- `negated()` or `neg()`: Negation
- `absoluteValue()` or `abs()`: Absolute value

#### Comparisons
- `comparedTo()` or `cmp()`
- `equals()` or `eq()`
- `greaterThan()` or `gt()`
- `greaterThanOrEqualTo()` or `gte()`
- `lessThan()` or `lt()`
- `lessThanOrEqualTo()` or `lte()`

## Develop and running of tests

1. Install [Deno](http://deno.land)

2. Run unit tests

  ```bash
  deno test
  ```
