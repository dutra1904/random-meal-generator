import { describe, expect, it } from "vitest";
import { splitInstructions } from "./instructions";

describe("splitInstructions", () => {
  it("quebra por linha e remove vazios", () => {
    expect(splitInstructions("Aqueça o forno.\r\n\nAsse por 20 min.\n")).toEqual([
      "Aqueça o forno.",
      "Asse por 20 min.",
    ]);
  });

  it("retorna lista vazia sem texto", () => {
    expect(splitInstructions("")).toEqual([]);
    expect(splitInstructions(null)).toEqual([]);
  });
});
