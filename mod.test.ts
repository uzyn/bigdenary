import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";
import { BigDenary } from "./mod.ts";

/** 
 * Initializers
 */

Deno.test("Initialize with integer (number)", () => {
  const bd1 = new BigDenary(1234);
  assertEquals(bd1.base, 123400000000000000000000n);
  assertEquals(bd1.decimals, 20);

  const bd2 = new BigDenary(1234, 18);
  assertEquals(bd2.base, 1234000000000000000000n);
  assertEquals(bd2.decimals, 18);

  // Decimals cannot be < 0
  assertThrows(() => new BigDenary(1234, -1), Error, "DecimalsMustBePositive");
});

Deno.test("Initialize with decimal/float", () => {
  let bd = new BigDenary(12.34);
  assertEquals(bd.base, 1234000000000000000000n);
  assertEquals(bd.decimals, 20);

  bd = new BigDenary(12.34, 18);
  assertEquals(bd.base, 12340000000000000000n);
  assertEquals(bd.decimals, 18);

  bd = new BigDenary(12.345678, 3);
  assertEquals(bd.base, 12345n);
  assertEquals(bd.decimals, 3);
});

Deno.test("Round down when initializing with float", () => {
  const bd1 = new BigDenary(12.34, 1);
  assertEquals(bd1.base, 123n);
  assertEquals(bd1.decimals, 1);

  const bd2 = new BigDenary(0.12345678901234, 8);
  assertEquals(bd2.base, 12345678n);
  assertEquals(bd2.decimals, 8);

  const bd3 = new BigDenary(1234567890.12345678901234, 10);
  assertEquals(bd3.base, 12345678901234568000n); // Due to float inaccuracy
  assertEquals(bd3.decimals, 10);
});

Deno.test("Initialize with BigDenary", () => {
  const source = new BigDenary(1234.56);
  let bd = new BigDenary(source);
  assertEquals(bd, source);
  assertEquals(bd.decimals, 20);

  // Scale down
  bd = new BigDenary(source, 1);
  assertEquals(bd.base, 12345n);
  assertEquals(bd.decimals, 1);

  // Scale up
  bd = new BigDenary(source, 12);
  assertEquals(bd.base, 1234560000000000n);
  assertEquals(bd.decimals, 12);
});

Deno.test("Initialize with number string", () => {
  let bd = new BigDenary("1234");
  assertEquals(bd.base, 123400000000000000000000n);
  assertEquals(bd.decimals, 20);

  bd = new BigDenary("1234", 18);
  assertEquals(bd.base, 1234000000000000000000n);
  assertEquals(bd.decimals, 18);

  bd = new BigDenary("0.12345678901234", 8);
  assertEquals(bd.base, 12345678n);
  assertEquals(bd.decimals, 8);

  bd = new BigDenary(
    "12345678901234567890123456789012345678901234567890123",
    6,
  );
  assertEquals(
    bd.base,
    12345678901234567890123456789012345678901234567890123000000n,
  );
  assertEquals(bd.decimals, 6);
});

Deno.test("Initialize with bigint", () => {
  let bd = new BigDenary(BigInt("1234"));
  assertEquals(bd.base, 123400000000000000000000n);
  assertEquals(bd.decimals, 20);

  bd = new BigDenary(BigInt("1234"), 18);
  assertEquals(bd.base, 1234000000000000000000n);
  assertEquals(bd.decimals, 18);

  bd = new BigDenary(
    12345678901234567890123456789012345678901234567890123n,
    6,
  );
  assertEquals(
    bd.base,
    12345678901234567890123456789012345678901234567890123000000n,
  );
  assertEquals(bd.decimals, 6);
});

/**
 * Decimal scaling
 */
Deno.test("Decimals - scale up", () => {
  let bd = new BigDenary("12345678");
  assertEquals(bd.base, 1234567800000000000000000000n);
  assertEquals(bd.decimals, 20);

  bd.decimals = 12;
  assertEquals(bd.base, 12345678000000000000n);
  assertEquals(bd.decimals, 12);
});

Deno.test("Decimals - scale down", () => {
  let bd = new BigDenary("12345678.1468");
  assertEquals(bd.base, 1234567814680000000000000000n);
  assertEquals(bd.decimals, 20);

  bd.decimals = 4;
  assertEquals(bd.base, 123456781468n);
  assertEquals(bd.decimals, 4);

  bd.decimals = 3;
  assertEquals(bd.base, 12345678146n);
  assertEquals(bd.decimals, 3);

  bd.decimals = 1;
  assertEquals(bd.base, 123456781n);
  assertEquals(bd.decimals, 1);

  bd.decimals = 0;
  assertEquals(bd.base, 12345678n);
  assertEquals(bd.decimals, 0);
});

/**
 * toString() and valudOf()
 */
Deno.test("toString()", () => {
  assertEquals(
    (new BigDenary("12345678.1468")).toString(),
    "12345678.14680000000000000000",
  );
  assertEquals((new BigDenary("12345678.1468", 2)).toString(), "12345678.14");
  assertEquals(
    (new BigDenary("12345678.1468", 25)).toString(),
    "12345678.1468000000000000000000000",
  );
});
