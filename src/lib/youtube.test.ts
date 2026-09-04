import { describe, expect, it } from "vitest";
import { extractYoutubeVideoId } from "./youtube";

describe("extractYoutubeVideoId", () => {
  it("lê watch, short e embed", () => {
    expect(extractYoutubeVideoId("https://www.youtube.com/watch?v=abcdefghijk")).toBe(
      "abcdefghijk",
    );
    expect(extractYoutubeVideoId("https://youtu.be/abcdefghijk")).toBe("abcdefghijk");
    expect(extractYoutubeVideoId("https://www.youtube.com/embed/abcdefghijk")).toBe(
      "abcdefghijk",
    );
  });

  it("aceita o ID solto", () => {
    expect(extractYoutubeVideoId("abcdefghijk")).toBe("abcdefghijk");
  });

  it("ignora vazio e URL inválida", () => {
    expect(extractYoutubeVideoId("")).toBeNull();
    expect(extractYoutubeVideoId("   ")).toBeNull();
    expect(extractYoutubeVideoId(null)).toBeNull();
    expect(extractYoutubeVideoId("https://example.com/video")).toBeNull();
  });
});
