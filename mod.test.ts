import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";
import { BigDenary } from "./mod.ts";

/** 
 * Constructors
 */

Deno.test("Instantiate with integer (number)", () => {
  const bd = new BigDenary(1234);
  assertEquals(bd.base, 1234n);
  assertEquals(bd.decimals, 0);
});

Deno.test("Instantiate with decimal/float", () => {
  let bd = new BigDenary(12.34);
  assertEquals(bd.base, 1234n);
  assertEquals(bd.decimals, 2);

  bd = new BigDenary(12.345678);
  assertEquals(bd.base, 12345678n);
  assertEquals(bd.decimals, 6);

  bd = new BigDenary(1234567890.12345678901234);
  assertEquals(bd.base, 12345678901234568n); // Due to float inaccuracy
  assertEquals(bd.decimals, 7);
});

Deno.test("Instantiate with BigDenary", () => {
  const source = new BigDenary(1234.56);
  const bd = new BigDenary(source);
  assertEquals(bd, source);
  assertEquals(bd.decimals, 2);
});

Deno.test("Instantiate with number string", () => {
  let bd = new BigDenary("1234");
  assertEquals(bd.base, 1234n);
  assertEquals(bd.decimals, 0);

  bd = new BigDenary("1234.56");
  assertEquals(bd.base, 123456n);
  assertEquals(bd.decimals, 2);

  bd = new BigDenary("0.12345678901234");
  assertEquals(bd.base, 12345678901234n);
  assertEquals(bd.decimals, 14);

  bd = new BigDenary("12345678901234567890123456789012345678901234567890123");
  assertEquals(
    bd.base,
    12345678901234567890123456789012345678901234567890123n,
  );
  assertEquals(bd.decimals, 0);

  bd = new BigDenary(
    "12345678901234567890123456789.06589426959512345678901234567890123",
  );
  assertEquals(
    bd.base,
    1234567890123456789012345678906589426959512345678901234567890123n,
  );
  assertEquals(bd.decimals, 35);
});

Deno.test("Instantiate with bigint", () => {
  let bd = new BigDenary(BigInt("1234"));
  assertEquals(bd.base, 1234n);
  assertEquals(bd.decimals, 0);

  bd = new BigDenary(12345678901234567890123456789012345678901234567890123n);
  assertEquals(
    bd.base,
    12345678901234567890123456789012345678901234567890123n,
  );
  assertEquals(bd.decimals, 0);
});

Deno.test("Instantiate with BigDenaryRaw", () => {
  let bd = new BigDenary({
    base: 2342034809823948929384234n,
    decimals: 15,
  });
  assertEquals(bd.base, 2342034809823948929384234n);
  assertEquals(bd.decimals, 15);
  assertEquals(bd.toString(), "2342034809.823948929384234");
});

/**
 * Decimal scaling
 */
Deno.test("Decimals - scale up", () => {
  let bd = new BigDenary("12345678");
  assertEquals(bd.base, 12345678n);
  assertEquals(bd.decimals, 0);

  bd.scaleDecimalsTo(12);
  assertEquals(bd.base, 12345678000000000000n);
  assertEquals(bd.decimals, 12);
});

Deno.test("Decimals - scale down", () => {
  let bd = new BigDenary("12345678.1468");
  assertEquals(bd.base, 123456781468n);
  assertEquals(bd.decimals, 4);
  assertEquals(bd.toString(), "12345678.1468");

  bd.scaleDecimalsTo(4);
  assertEquals(bd.base, 123456781468n);
  assertEquals(bd.decimals, 4);
  assertEquals(bd.toString(), "12345678.1468");

  bd.scaleDecimalsTo(3);
  assertEquals(bd.base, 12345678146n);
  assertEquals(bd.decimals, 3);
  assertEquals(bd.toString(), "12345678.146");

  bd.scaleDecimalsTo(1);
  assertEquals(bd.base, 123456781n);
  assertEquals(bd.decimals, 1);
  assertEquals(bd.toString(), "12345678.1");

  bd.scaleDecimalsTo(0);
  assertEquals(bd.base, 12345678n);
  assertEquals(bd.decimals, 0);
  assertEquals(bd.toString(), "12345678");
});

/**
 * toString() and valudOf()
 */
Deno.test("toString()", () => {
  assertEquals(
    (new BigDenary("12345678.1468")).toString(),
    "12345678.1468",
  );
  assertEquals(
    (new BigDenary("12345678.146865819819462135498494214984")).toString(),
    "12345678.146865819819462135498494214984",
  );
  assertEquals(
    (new BigDenary("0.123")).toString(),
    "0.123",
  );
  assertEquals(
    (new BigDenary("123984654")).toString(),
    "123984654",
  );
  assertEquals(
    (new BigDenary("0")).toString(),
    "0",
  );
});

/**
 * Operations
 */
Deno.test("add()", () => {
  const start = new BigDenary("123456.789");

  assertEquals(start.plus("0"), start);
  assertEquals(start.plus("345.959443211"), new BigDenary("123802.748443211"));
  assertEquals(
    start.plus(
      new BigDenary("1"),
    ),
    new BigDenary("123457.789"),
  );

  const second = new BigDenary("345.959443211");
  assertEquals(start.plus(second), new BigDenary("123802.748443211"));
  second.scaleDecimalsTo(42);
  assertEquals(
    start.plus(second).toString(),
    "123802.748443211000000000000000000000000000000000",
  );
  second.scaleDecimalsTo(1);
  assertEquals(start.plus(second).toString(), "123802.689");

  // Number input
  assertEquals(start.plus(2.5).toString(), "123459.289");
});

Deno.test("minus()", () => {
  const start = new BigDenary("123456.789");
  assertEquals(start.minus(0).toString(), "123456.789");
  assertEquals(start.minus(1).toString(), "123455.789");
  assertEquals(start.minus(2).toString(), "123454.789");
  assertEquals(start.minus(-1).toString(), "123457.789");
});

Deno.test("multipliedBy()", () => {
  const start = new BigDenary("123456.789");
  assertEquals(start.multipliedBy(0).toString(), "0");
  assertEquals(start.multipliedBy(1).toString(), "123456.789");
  assertEquals(start.multipliedBy(2).toString(), "246913.578");
  assertEquals(start.multipliedBy(-1).toString(), "-123456.789");
  assertEquals(start.multipliedBy("1.49").toString(), "183950.61561");
});

Deno.test("dividedBy()", () => {
  const start = new BigDenary("123456.789");
  assertThrows(() => start.dividedBy(0), RangeError, "Division by zero");
  assertEquals(start.dividedBy(1).toString(), "123456.78900000000000000000");
  assertEquals(start.dividedBy(2).toString(), "61728.39450000000000000000");
  assertEquals(start.dividedBy(-1).toString(), "-123456.78900000000000000000");
  assertEquals(start.dividedBy("1.49").toString(), "828.56905369127516778523");
});

Deno.test("negated()", () => {
  assertEquals(
    (new BigDenary("123456.789")).negated().toString(),
    "-123456.789",
  );
  assertEquals(
    (new BigDenary("-123456.789")).negated().toString(),
    "123456.789",
  );
});
