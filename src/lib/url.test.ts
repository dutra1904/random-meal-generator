import { describe, expect, it } from "vitest";
import { isSafeHttpUrl } from "./url";

describe("isSafeHttpUrl", () => {
  it("aceita http e https", () => {
    expect(isSafeHttpUrl("https://www.themealdb.com")).toBe(true);
    expect(isSafeHttpUrl("http://example.com")).toBe(true);
  });

  it("rejeita o resto", () => {
    expect(isSafeHttpUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeHttpUrl("not-a-url")).toBe(false);
    expect(isSafeHttpUrl(null)).toBe(false);
  });
});
