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

test("SK Nefro Báza 1 is held once, with both verified channels", () => {
  const primary = "https://nefro.polascin.net/publikacia.php?slug=sk-nefro-baza-1";
  const secondary = "https://polascin.gumroad.com/l/sk-nefro-baza-1";

  const matches = books.filter(
    (entry) =>
      entry.isbn === "NEFRO-SKNB-1" ||
      entry.url === primary ||
      entry.web_url === secondary ||
      entry.title === "SK Nefro Báza 1",
  );
  assert.equal(matches.length, 1, "SK Nefro Báza 1 must appear exactly once");

  const [book] = matches;
  assert.equal(book.author, "MUDr. Ľubomír Polaščín");
  assert.equal(book.year, 2026);
  assert.equal(book.language, "Slovak");
  assert.equal(book.category, "Digital Product");

  // nefro.polascin.net is the primary source: it is the publisher's own
  // publication page and the only channel that states the full metadata.
  // Gumroad is the secondary sales channel, kept in web_url.
  assert.equal(book.url, primary);
  assert.equal(book.web_url, secondary);
  assert.equal(
    book.cover_image,
    "https://nefro.polascin.net/img/publikacie/sk-nefro-baza-1-obalka.jpg",
  );

  // Figures as printed on the primary page, verified 2026-10-03.
  assert.match(book.description, /^E-kniha, 1\. vydanie - október 2026\./u);
  assert.match(book.description, /405 odborných/u);
  assert.match(book.description, /1745 strán, 476 ilustrácií/u);
  assert.match(book.description, /PDF, EPUB, AZW3, DOCX a ODT/u);
  assert.match(book.description, /7 EUR za jeden formát, 12 EUR za všetky formáty/u);

  // No ISBN and no DOI are published for this title; none may be invented.
  // The isbn column holds a catalog key derived from the primary source slug,
  // which getBookIdentifier() renders as "ID" rather than as an ISBN.
  assert.equal(book.isbn, "NEFRO-SKNB-1");
  assert.match(book.description, /Bez ISBN a DOI/u);
  assert.doesNotMatch(book.description, /\bISBN\s*[0-9]/u);
  assert.doesNotMatch(book.description, /\bdoi\.org|\bDOI\s*:/iu);

  assert.doesNotMatch(JSON.stringify(book), /Ã|Ä|Å/u);
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
