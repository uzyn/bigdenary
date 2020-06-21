BigDenary
----
Arbitrary-length decimal implementation using JavaScript's native [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) with no dependencies.

- Supported on Node >= 10.4 and Deno.
- Check [caniuse.com](https://caniuse.com/#search=bigint) for browser support.

### Features

- [Deno](https://deno.land) module first. Soon to be available as ES Module (ESM) and CommonJS (Node) module.

- Compute methods are largely implemented through native BigInt, without much string manipulation required.

- Standalone & lightweight. Zero dependencies.

- Intuitive data structure – base amount and decimal places, similar to that of cryptocurrency esp. Bitcoin.

- API is similar with the popular BigNumber libraries such as bignumber.js, big.js, decimal.js. Not all methods are supported, yet.

## Usage

```ts
import BigDenary from "https://raw.githubusercontent.com/uzyn/bigdenary/master/mod.ts";

const bd = new BigDenary("123.4512");
const sum = bd.add(56.1e2));

console.log(sum.toString()); // 5733.4512
console.log(sum); // BigDenary { base: 57334512n, _decimals: 4 }
```

API is largely inspired by and attempts to be compatible with [`decimal.js-light`](https://github.com/MikeMcl/decimal.js-light).

### Available API

#### Core
- `constructor()`: supports `number | string | bigint | BigDenary | BigDenaryRaw`.
- `toString()`: Returns `string` representation
- `valueOf()`: Returns `number` approximation

#### Operations
- `plus()` or `add()`
- `minus()` or `sub()`
- `multipliedBy()` or `mul()`
- `dividedBy()` or `div()`
- `negated()` or `neg()`
- `absoluteValue()` or `abs()`

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

## Notes

JavaScript native decimal support is currently [being proposed](https://github.com/tc39/proposal-decimal) (Stage 1) to ECMA.

## License

MIT

Contributions are welcomed. 
