import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";
import { getDecimals, countTrailingZeroes } from "./util.ts";

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

Deno.test("countTrailingZeroes()", () => {
  assertEquals(countTrailingZeroes(0n), 0);
  assertEquals(countTrailingZeroes(5213522323n), 0);
  assertEquals(countTrailingZeroes(52113500000n), 5);
  assertEquals(countTrailingZeroes(-9846515000000000000000n), 15);
});
