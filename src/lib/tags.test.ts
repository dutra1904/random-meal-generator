import { describe, expect, it } from "vitest";
import { parseTags } from "./tags";

describe("parseTags", () => {
  it("separa e limpa tags", () => {
    expect(parseTags("Spicy, Pasta, ")).toEqual(["Spicy", "Pasta"]);
  });

  it("ignora vazio", () => {
    expect(parseTags(null)).toEqual([]);
    expect(parseTags("")).toEqual([]);
  });
});
