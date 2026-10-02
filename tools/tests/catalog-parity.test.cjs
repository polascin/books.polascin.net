const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { test } = require("node:test");

// Regression guard for the 2026-10-02 catalog reconciliation:
//   * the Forum diabetologicum article was held twice (library record with
//     isbn 'N/A' + proLékaře import with isbn 'FD-40671'),
//   * the KDIGO article existed only in the database, so it would have
//     disappeared whenever getBooks() fell back to data/books.json.
// Counting rows hid both: the totals looked plausible either way.

const books = () =>
  JSON.parse(readFileSync(resolve(__dirname, "../../data/books.json"), "utf8"));

/** Identifier for records whose isbn column is the placeholder 'N/A'. */
const keyOf = (book) => {
  const isbn = String(book.isbn ?? "").trim();
  return isbn === "" || isbn === "N/A" ? `title:${book.title}` : `isbn:${isbn}`;
};

const normalizeTitle = (title) =>
  String(title ?? "")
    .toLocaleLowerCase("sk")
    .replace(/^mudr\.\s+[^:]+:\s*/u, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();

test("books.json: every record is unique by identifier, URL and title", () => {
  const seen = { key: new Map(), url: new Map(), title: new Map() };

  for (const book of books()) {
    for (const [field, value] of [
      ["key", keyOf(book)],
      ["url", String(book.url ?? "")],
      ["title", normalizeTitle(book.title)],
    ]) {
      const previous = seen[field].get(value);
      assert.equal(
        previous,
        undefined,
        `duplicate ${field} "${value}": id ${previous} and id ${book.id}`,
      );
      seen[field].set(value, book.id);
    }
  }
});

test("books.json: ids are unique", () => {
  const ids = books().map((book) => book.id);
  assert.equal(new Set(ids).size, ids.length, "book ids must be unique");
});

// Conference abstracts and presentations with no verified online source yet.
// They still carry a Google-search URL; the guard below allows exactly these
// three so a NEW placeholder, or a regression on a record whose real source is
// known, still fails. Remove an entry here once its source URL is found.
const SEARCH_URL_WITHOUT_KNOWN_SOURCE = new Set([
  "DLHODOBÁ ÚSPEŠNÁ REMISIA IDIOPATICKEJ MEMBRÁNOVEJ NEFROPATIE APLIKÁCIOU PONTICELLIHO SCHÉMY IMUNOSUPRESÍVNEJ LIEČBY",
  "Kontinuálna renálna nahrádzajúca terapia (KRNT, CRRT) pri AOP (AKI)",
  "Vliv použití dialyzačního roztoku s citrátovou složkou v kyselém koncentrátu na množství použitého heparinu při dialyzačním ošetření",
]);

test("books.json: no record links to a search-engine results page", () => {
  for (const book of books()) {
    if (SEARCH_URL_WITHOUT_KNOWN_SOURCE.has(book.title)) {
      continue;
    }

    assert.doesNotMatch(
      String(book.url ?? ""),
      /^https?:\/\/(www\.)?(google|bing|duckduckgo)\.[a-z.]+\/search/i,
      `id ${book.id} ("${book.title}") still links to a search page instead of the source`,
    );
  }
});

test("books.json: Forum diabetologicum is a single merged record", () => {
  const matches = books().filter((book) =>
    /Novšie aspekty antihypertenzívnej/u.test(book.title),
  );

  assert.equal(matches.length, 1, "the 2012 Forum diabetologicum article must appear once");
  const [article] = matches;
  assert.equal(article.isbn, "FD-40671");
  assert.equal(article.year, 2012);
  // The journal has been published since 2012, so the 2012 issue is roč. 1.
  assert.match(article.description, /roč\. 1, č\. 1 \(2012\), s\. 24-31/u);
  assert.match(article.description, /ISSN 1805-3807/u);
  assert.doesNotMatch(article.description, /roč\. 11/u);
});

test("books.json: the 2026 additions are present exactly once", () => {
  const catalog = books();

  for (const [isbn, url] of [
    ["ZDN-96291978", "https://mediweb.hnonline.sk/zdn/zdravie/96291978-dialyza-kedysi-dnes-a-v-buducnosti"],
    ["DIA-2054968", "https://dia.hnonline.sk/dia/zdravie/2054968-cukrovka-nici-oblicky-coraz-viac"],
    ["VP-2026-3-4-KDIGO", "https://www.solen.sk/sk/casopisy/via-practica/chronicka-choroba-obliciek-v-ambulancii-vld-kdigo-2024-v-klinickej-praxi"],
  ]) {
    const matches = catalog.filter((book) => book.isbn === isbn);
    assert.equal(matches.length, 1, `${isbn} must appear exactly once`);
    assert.equal(matches[0].url, url);
  }
});

// Opt-in: production is served from MariaDB and only falls back to
// books.json, so the two sources must describe the same publications.
// Needs .env credentials.
test("database and books.json hold the same publications", { skip: !process.env.CATALOG_CHECK_DB }, () => {
  const rows = JSON.parse(
    execFileSync(
      "php",
      [
        "-r",
        'require $argv[1]; $pdo = getDbConnection(); if (!$pdo) { fwrite(STDERR, "no db"); exit(1); } echo json_encode($pdo->query("SELECT id, isbn, title, url FROM books ORDER BY id")->fetchAll(), JSON_UNESCAPED_UNICODE);',
        resolve(__dirname, "../../includes/functions.php"),
      ],
      { encoding: "utf8" },
    ),
  );

  const dbKeys = rows.map(keyOf).sort();
  const jsonKeys = books().map(keyOf).sort();

  assert.deepEqual(
    dbKeys,
    jsonKeys,
    "database and books.json must contain the same records (compared by identifier, not by count)",
  );
  assert.equal(new Set(dbKeys).size, dbKeys.length, "database must not hold duplicates");
});
