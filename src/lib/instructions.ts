export function splitInstructions(instructions: string | null | undefined): string[] {
  if (!instructions) return [];

  return instructions
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}
