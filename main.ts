// Entry program for make.fun bounty:
// "The Funniest Office Joke, Judged Head to Head"
// slug: u-kevin-the-funniest-office-joke-judged-head-to-head-3dc3233c
//
// The whole entry is a single one-line joke about office life,
// written verbatim to /output/entry.txt, where the sealed gate
// scorer checks it is UTF-8 text of 1 to 200 characters.
//
// How the joke is built (setup + turn, punchline last):
//   SETUP  — a labelled sandwich abandoned in the office fridge,
//            a sight anyone who has worked in an office knows.
//   TURN   — the owner left years ago, yet the sandwich outlasted
//            him and earned the one thing no employee ever gets.
//   PUNCH  — tenure. The sandwich, not the worker, got promoted
//            to permanent. One line, every word earning its place.
//
// Why this angle: the brief rewards a joke that feels new rather
// than one already going round the office. The field is full of
// printer jams, reply-alls, meetings that could have been emails
// and "we are a family" lines, so this entry turns on the office
// fridge instead — just as universal, far less told.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// Joke parts, joined in order so the punchline lands last.
const SETUP =
  "The office fridge still holds a sandwich labelled 'Dave's — do not touch';";
const TURN = "Dave left in 2020, but the sandwich got tenure.";

// The entry text. Single line, no trailing newline: the file must
// hold exactly this text, byte for byte.
const ENTRY = `${SETUP} ${TURN}`;

// Gate limits from the published brief: 1 to 200 UTF-8 characters.
const MIN_CHARS = 1;
const MAX_CHARS = 200;

// A one-liner should stay tight: this entry is 22 words.
const MAX_WORDS = 30;

function charCount(text: string): number {
  // Count Unicode code points, not UTF-16 code units.
  return [...text].length;
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).length;
}

function validate(text: string): void {
  const chars = charCount(text);
  if (chars < MIN_CHARS || chars > MAX_CHARS) {
    throw new Error(`entry is ${chars} chars, must be ${MIN_CHARS}-${MAX_CHARS}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (wordCount(text) > MAX_WORDS) {
    throw new Error(`entry is ${wordCount(text)} words, over the ${MAX_WORDS}-word cap`);
  }
  if (!text.endsWith("tenure.")) {
    throw new Error("punchline must land last");
  }
}

function main(): void {
  const outPath = "/output/entry.txt";
  validate(ENTRY);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, ENTRY, "utf8");

  // Read it back and confirm the file holds exactly the entry text.
  const back = readFileSync(outPath, "utf8");
  if (back !== ENTRY) {
    throw new Error("round-trip mismatch: /output/entry.txt differs from entry");
  }
  console.log(
    `entry OK: ${charCount(ENTRY)} chars, ${wordCount(ENTRY)} words, single line`,
  );
  console.log(ENTRY);
}

main();
