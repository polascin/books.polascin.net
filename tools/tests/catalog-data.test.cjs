const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { test } = require("node:test");

const books = JSON.parse(
  readFileSync(resolve(__dirname, "../../data/books.json"), "utf8"),
);

test("Vital Algorithm descriptions use the correct Slovak diacritics", () => {
  for (const asin of [
    "B0FFGG4K4D",
    "B0GGJXHQDH",
    "B0GGQGWGQY",
    "B0GGQL6LTT",
    "B0G4JLDMWG",
  ]) {
    const book = books.find((entry) => entry.url.endsWith(`/${asin}`));

    assert.ok(book, `Book with ASIN ${asin} must exist`);
    assert.match(book.description, /Dr\. Jana Bravcová/);
    assert.match(book.description, /Dr\. Ľubomír Polaščín/);
    assert.doesNotMatch(book.description, /Ã|Ä|Å/);
  }
});

test("Vital Algorithm 1st edition print is labeled as Hardcover", () => {
  const book = books.find((entry) => entry.url.endsWith("/B0G4JLDMWG"));
  assert.ok(book, "Book with ASIN B0G4JLDMWG must exist");
  assert.match(book.title, /\(Hardcover\)$/);
  assert.match(book.description, /^Hardcover - November 29, 2025/);
});
