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

test("Via practica KDIGO 2024 paper has a unique, correctly encoded record", () => {
  const source =
    "https://www.solen.sk/sk/casopisy/via-practica/chronicka-choroba-obliciek-v-ambulancii-vld-kdigo-2024-v-klinickej-praxi";
  const matches = books.filter(
    (entry) =>
      entry.isbn === "VP-2026-3-4-KDIGO" ||
      entry.url === source ||
      entry.title ===
        "Chronická choroba obličiek v ambulancii VLD: KDIGO 2024 v klinickej praxi",
  );
  assert.equal(matches.length, 1);
  const [paper] = matches;
  // Deliberately no assertion on books.length or paper.id: the catalog length
  // is whatever the number of unique publications happens to be (the 2012
  // Forum diabetologicum article was held twice and merged on 2026-10-02), and
  // a record's id follows its position, not its identity. Uniqueness of the
  // record is asserted above and in catalog-parity.test.cjs.
  assert.equal(paper.author, "MUDr. Ľubomír Polaščín");
  assert.equal(paper.url, source);
  assert.equal(paper.category, "Academic Paper");
  assert.equal(paper.language, "Slovak");
  assert.match(paper.description, /Via practica 3-4\/2026.*V skratke.*ISSN 1339-424X/);
  assert.match(paper.description, /len pre predplatiteľov/);
  assert.doesNotMatch(JSON.stringify(paper), /Ã|Ä|Å/);
});
