import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";
import { getDecimals, countTrailingZeros } from "./util.ts";

Deno.test("getDecimals() with string input", () => {
  assertEquals(getDecimals("0.52135"), 5);
  assertEquals(getDecimals("0.521135"), 6);
  assertEquals(getDecimals("9846515.521135"), 6);
  assertEquals(getDecimals("9846515.52113500"), 8);
  assertEquals(getDecimals("9846515.0"), 1);
  assertEquals(getDecimals("9846515"), 0);
  assertThrows(() => getDecimals("woiejoif23423"), Error, "InvalidNumber");
  assertThrows(() => getDecimals("2.5.626"), Error, "InvalidNumber");
});

Deno.test("getDecimals() with number input", () => {
  assertEquals(getDecimals(0.52135), 5);
  assertEquals(getDecimals(0.521135), 6);
  assertEquals(getDecimals(9846515.521135), 6);
  assertEquals(getDecimals(9846515.52113500), 6);
  assertEquals(getDecimals(9846515.521135006), 9);
  assertEquals(getDecimals(9846515), 0);
});

Deno.test("countTrailingZeros()", () => {
  assertEquals(countTrailingZeros(0n, 100), 0);
  assertEquals(countTrailingZeros(5213522323n, 100), 0);
  assertEquals(countTrailingZeros(52113500000n, 100), 5);
  assertEquals(countTrailingZeros(-9846515000000000000000n, 100), 15);
  assertEquals(countTrailingZeros(-9846515000000000000000n, 10), 10);
});
