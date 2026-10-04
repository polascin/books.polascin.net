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
  const primary =
    "https://nefro.polascin.net/publikacia.php?slug=sk-nefro-baza-1";
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
  assert.match(
    book.description,
    /7 EUR za jeden formát, 12 EUR za všetky formáty/u,
  );

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
  assert.match(
    paper.description,
    /Via practica 3-4\/2026.*V skratke.*ISSN 1339-424X/,
  );
  assert.match(paper.description, /len pre predplatiteľov/);
  assert.doesNotMatch(JSON.stringify(paper), /Ã|Ä|Å/);
});

test("ID 15: Polaščín 2014 CNNA presentation is correctly titled and attributed", () => {
  const cnnaUrl =
    "https://www.cnna.cz/docs/akce/nefrologie_2014_1_program-1eb3a.pdf";
  const matches = books.filter(
    (b) => b.url === cnnaUrl || b.title.includes("Dialyzačné roztoky"),
  );
  assert.equal(matches.length, 1, "ID 15 must exist exactly once");

  const [entry] = matches;
  assert.equal(entry.title, "Dialyzačné roztoky a dialyzačné koncentráty");
  assert.equal(entry.author, "L. Polaščín");
  assert.equal(entry.year, 2014);
  assert.equal(entry.language, "Slovak");
  assert.equal(entry.category, "Academic Paper");
  assert.equal(entry.url, cnnaUrl);

  // Must not carry the misattributed authors from adjacent lecture #7
  assert.doesNotMatch(entry.title, /citrátovou/i);
  assert.doesNotMatch(entry.description, /Dušek|Švarcová|Marková/i);

  // Must not claim to be full abstract text
  assert.match(entry.description, /programový záznam/i);
  assert.match(entry.description, /neoznačuje sa za plný text abstraktu/i);
});

test("ID 12 and ID 13: verified historical conference programs and authorship", () => {
  // ID 12: Tigis 2016 program
  const tigisUrl =
    "https://www.tigis.cz/images/stories/Aktuality_nefro/2016/03/AVN_program_3_2016.pdf";
  const b12 = books.find((b) => b.url === tigisUrl);
  assert.ok(b12, "ID 12 must link to verified Tigis program PDF");
  assert.match(b12.title, /PONTICELLIHO SCHÉMY/i);
  assert.match(b12.description, /programový záznam/i);
  assert.match(b12.description, /nejde o dostupný plný abstrakt/i);

  // ID 13: KNS 2013 program
  const knsUrl =
    "https://www.nefro.sk/fileadmin/Nefro/Odborne_akcie/program_KNS_2013_marec.pdf";
  const b13 = books.find((b) => b.url === knsUrl);
  assert.ok(b13, "ID 13 must link to verified KNS 2013 program PDF");
  assert.equal(b13.author, "MUDr. Ľubomír Polaščín");
  assert.equal(
    b13.web_url,
    "https://www.nefro.sk/aktuality/detail-novinky/wkd-svetovy-den-obliciek-bratislava-14/?tx_ttnews%5Bpointer%5D=12",
  );
  assert.match(b13.description, /programový záznam/i);
});

test("New editions (A, B, C, D) are held with verified metadata and channels", () => {
  // A. SK Nefro Báza 1 - English edition
  const a = books.find((b) => b.isbn === "NEFRO-SKNB-1-EN");
  assert.ok(a, "Candidate A must exist");
  assert.equal(a.language, "English");
  assert.equal(a.category, "Digital Product");
  assert.equal(a.author, "Ľubomír Polaščín, MD");
  assert.match(a.description, /387 articles, 1,782 pages, 393 illustrations/);
  assert.equal(a.web_url, "https://polascin.gumroad.com/l/sk-nefro-baza-1-en");

  // B. SK Nefro Báza 1 Kompendium
  const b = books.find((b) => b.isbn === "NEFRO-SKNB-1-KOMP");
  assert.ok(b, "Candidate B must exist");
  assert.equal(b.language, "Slovak");
  assert.equal(b.category, "Digital Product");
  assert.equal(b.author, "MUDr. Ľubomír Polaščín");
  assert.match(b.description, /387 odborných článkov/);
  assert.match(b.description, /261 strán/);
  assert.equal(
    b.web_url,
    "https://polascin.gumroad.com/l/sk-nefro-baza-1-kompendium",
  );

  // C. SK Nefro Báza 1 Compendium - English edition
  const c = books.find((b) => b.isbn === "NEFRO-SKNB-1-K-EN");
  assert.ok(c, "Candidate C must exist");
  assert.equal(c.language, "English");
  assert.equal(c.category, "Digital Product");
  assert.equal(c.author, "Ľubomír Polaščín, MD");
  assert.match(c.description, /387 articles/);
  assert.match(c.description, /386 article summaries/);
  assert.match(c.description, /275 pages/);
  assert.equal(
    c.web_url,
    "https://polascin.gumroad.com/l/sk-nefro-baza-1-kompendium-en",
  );

  // D. Metafyzika 2
  const d = books.find((b) => b.isbn === "METAFYZIKA-2");
  assert.ok(d, "Candidate D must exist");
  assert.equal(d.language, "Slovak");
  assert.equal(d.category, "Philosophy");
  assert.equal(d.author, "MUDr. Ľubomír Polaščín");
  assert.match(d.description, /23 strán/);
  assert.match(d.description, /Bezplatný digitálny text/);
  assert.equal(
    d.url,
    "https://polascin.net/library.php?slug=metafyzika-2&lang=sk",
  );
  assert.equal(
    d.web_url,
    "https://polascin.net/library_file.php?slug=metafyzika-2",
  );
});
