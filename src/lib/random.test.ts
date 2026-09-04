import { describe, expect, it } from "vitest";
import { pickRandom, shuffle } from "./random";

describe("pickRandom", () => {
  it("devolve o único item", () => {
    expect(pickRandom(["só"])).toBe("só");
  });

  it("falha em lista vazia", () => {
    expect(() => pickRandom([])).toThrow("Lista vazia");
  });
});

describe("shuffle", () => {
  it("mantém os mesmos itens", () => {
    expect(shuffle([1, 2, 3]).sort()).toEqual([1, 2, 3]);
  });
});
