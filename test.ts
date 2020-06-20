import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { BigDenary } from "./mod.ts";

Deno.test("Initialize with integer (number)", () => {
  const bd = new BigDenary(234);
  assertEquals(bd.base, 234);
});

// Deno.test("Initialize with integer (decimal)", () => {
//   const bd = new BigDenary(234.586);
//   assertEquals(bd.base, 234);
// });
