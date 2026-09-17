const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { test } = require("node:test");

const books = JSON.parse(
  readFileSync(resolve(__dirname, "../../data/books.json"), "utf8"),
);

test("Vital Algorithm descriptions use the correct Slovak diacritics", () => {
  for (const asin of ["B0FFGG4K4D", "B0GGQGWGQY", "B0GGQL6LTT"]) {
    const book = books.find((entry) => entry.url.endsWith(`/${asin}`));

    assert.ok(book);
    assert.match(book.description, /Dr\. Jana Bravcová/);
    assert.match(book.description, /Dr\. Ľubomír Polaščín/);
    assert.doesNotMatch(book.description, /Ã|Ä|Å/);
  }
});
