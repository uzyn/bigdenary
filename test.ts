import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";
import { BigDenary } from "./mod.ts";

Deno.test("Initialize with integer (number)", () => {
  const bd1 = new BigDenary(1234);
  assertEquals(bd1.base, 123400000000n);
  assertEquals(bd1.decimals, 8);

  const bd2 = new BigDenary(1234, 18);
  assertEquals(bd2.base, 1234000000000000000000n);
  assertEquals(bd2.decimals, 18);
});

Deno.test("Initialize with decimal/float", () => {
  const bd1 = new BigDenary(12.34);
  assertEquals(bd1.base, 1234000000n);
  assertEquals(bd1.decimals, 8);

  const bd2 = new BigDenary(12.34, 18);
  assertEquals(bd2.base, 12340000000000000000n);
  assertEquals(bd2.decimals, 18);
});

Deno.test("Round down when initializing with float", () => {
  const bd1 = new BigDenary(12.34, 1);
  assertEquals(bd1.base, 123n);
  assertEquals(bd1.decimals, 1);

  const bd2 = new BigDenary(0.12345678901234, 8);
  assertEquals(bd2.base, 12345678n);
  assertEquals(bd2.decimals, 8);

  const bd3 = new BigDenary(12345678901234567890.12345678901234, 10);
  assertEquals(bd3.base, 123456789012345677877719597056n); // it is not accurate when input with float
  assertEquals(bd3.decimals, 10);
});

Deno.test("Initialize with BigDenary", () => {
  const source = new BigDenary(1234.56);
  const bd = new BigDenary(source);
  assertEquals(bd, source);

  // When input is BigDenary, unable to override decimals
  assertThrows(() => new BigDenary(source, 1), Error, "UnexpectedParameter");
});

Deno.test("Initialize with number string", () => {
  let bd = new BigDenary("1234");
  assertEquals(bd.base, 123400000000n);
  assertEquals(bd.decimals, 8);

  bd = new BigDenary("1234", 18);
  assertEquals(bd.base, 1234000000000000000000n);
  assertEquals(bd.decimals, 18);

  bd = new BigDenary("0.12345678901234", 8);
  assertEquals(bd.base, 12345678n);
  assertEquals(bd.decimals, 8);

  bd = new BigDenary("12345678901234567890123456789012345678901234567890123", 6);
  assertEquals(bd.base, 12345678901234567890123456789012345678901234567890123000000n);
  assertEquals(bd.decimals, 6);
});
