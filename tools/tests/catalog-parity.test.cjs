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

// `books.isbn` is VARCHAR(20) (see setup_db.php) and this MariaDB runs without
// STRICT_TRANS_TABLES, so an over-long identifier is silently truncated on
// INSERT rather than rejected. That happened on 2026-10-03: the key
// 'NEFRO-SK-NEFRO-BAZA-1' (21 chars) was stored as 'NEFRO-SK-NEFRO-BAZA-',
// which then failed to match anything searching for the full value. It is now
// 'NEFRO-SKNB-1'. A record whose identifier does not fit the column cannot be
// matched by SQL migrations, so the limit is asserted on the JSON side where a
// new record is written first.
const ISBN_MAX_LENGTH = 20;

test("books.json: every identifier fits the isbn column", () => {
  for (const book of books()) {
    const isbn = String(book.isbn ?? "");
    assert.ok(
      isbn.length <= ISBN_MAX_LENGTH,
      `id ${book.id} ("${book.title}"): isbn "${isbn}" is ${isbn.length} characters, ` +
        `but books.isbn is VARCHAR(${ISBN_MAX_LENGTH}) and this server truncates silently — ` +
        `shorten the catalog key`,
    );
  }
});

// The search-engine-placeholder guard used to live here, reading `url` only.
// It moved to tools/tests/catalog-urls.test.cjs on 2026-10-03 and now covers
// url, web_url and cover_image for both books.json and the database, with a
// single allowlist (SEARCH_URL_ALLOWED) so the two cannot drift apart.

test("books.json: Forum diabetologicum is a single merged record", () => {
  const matches = books().filter((book) =>
    /Novšie aspekty antihypertenzívnej/u.test(book.title),
  );

  assert.equal(
    matches.length,
    1,
    "the 2012 Forum diabetologicum article must appear once",
  );
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
    [
      "ZDN-96291978",
      "https://mediweb.hnonline.sk/zdn/zdravie/96291978-dialyza-kedysi-dnes-a-v-buducnosti",
    ],
    [
      "DIA-2054968",
      "https://dia.hnonline.sk/dia/zdravie/2054968-cukrovka-nici-oblicky-coraz-viac",
    ],
    [
      "VP-2026-3-4-KDIGO",
      "https://www.solen.sk/sk/casopisy/via-practica/chronicka-choroba-obliciek-v-ambulancii-vld-kdigo-2024-v-klinickej-praxi",
    ],
    [
      "NEFRO-SKNB-1",
      "https://nefro.polascin.net/publikacia.php?slug=sk-nefro-baza-1",
    ],
    [
      "NEFRO-SKNB-1-EN",
      "https://nefro.polascin.net/publikacia.php?slug=sk-nefro-baza-1-en",
    ],
    [
      "NEFRO-SKNB-1-KOMP",
      "https://nefro.polascin.net/publikacia.php?slug=sk-nefro-baza-1-kompendium",
    ],
    [
      "NEFRO-SKNB-1-K-EN",
      "https://nefro.polascin.net/publikacia.php?slug=sk-nefro-baza-1-kompendium-en",
    ],
    [
      "METAFYZIKA-2",
      "https://polascin.net/library.php?slug=metafyzika-2&lang=sk",
    ],
  ]) {
    const matches = catalog.filter((book) => book.isbn === isbn);
    assert.equal(matches.length, 1, `${isbn} must appear exactly once`);
    assert.equal(matches[0].url, url);
  }
});

// Titles listed as pending in AGENTS.md: they may not enter the catalog as
// published works until an official release is confirmed. Blood Margin is
// still awaiting KDP publication, so a public link or a draft listing is not
// enough. Guarded here because the cost of a wrong entry is a catalog that
// advertises something nobody can buy.
test("books.json: titles still awaiting publication are absent", () => {
  for (const book of books()) {
    assert.doesNotMatch(
      String(book.title ?? ""),
      /blood\s*margin/iu,
      `id ${book.id} ("${book.title}") — Blood Margin is unpublished (AGENTS.md); ` +
        `add it only after a confirmed public release`,
    );
  }
});

// Opt-in: production is served from MariaDB and only falls back to
// books.json, so the two sources must describe the same publications.
// Needs .env credentials.

/** Fields compared row-by-row between the two sources. */
const PARITY_FIELDS = [
  "title",
  "author",
  "year",
  "isbn",
  "url",
  "web_url",
  "cover_image",
  "language",
  "category",
];

const dbRows = () =>
  JSON.parse(
    execFileSync(
      "php",
      [
        "-r",
        'require $argv[1]; $pdo = getDbConnection(); if (!$pdo) { fwrite(STDERR, "no db"); exit(1); } ' +
          'echo json_encode($pdo->query("SELECT id, title, author, year, isbn, url, web_url, cover_image, language, category FROM books ORDER BY id")' +
          "->fetchAll(PDO::FETCH_ASSOC), JSON_UNESCAPED_UNICODE);",
        resolve(__dirname, "../../includes/functions.php"),
      ],
      { encoding: "utf8" },
    ),
  );

test(
  "database and books.json hold the same publications",
  { skip: !process.env.CATALOG_CHECK_DB },
  () => {
    const dbKeys = dbRows().map(keyOf).sort();
    const jsonKeys = books().map(keyOf).sort();

    assert.deepEqual(
      dbKeys,
      jsonKeys,
      "database and books.json must contain the same records (compared by identifier, not by count)",
    );
    assert.equal(
      new Set(dbKeys).size,
      dbKeys.length,
      "database must not hold duplicates",
    );
  },
);

// Matching key sets only prove no record is missing. The 2026-10-02 defect was
// a field that differed BETWEEN the two sources — the database held a
// Google-search `url` while books.json already had the real source — so the
// catalog showed a different link depending on whether getBooks() reached
// MariaDB or fell back to the JSON. Compare the fields themselves, keyed by
// stable identifier rather than by numeric id or row order.
// Divergences found on 2026-10-03 and consciously left in place, so this test
// reports only NEW drift instead of staying permanently red.
//
// Of the 33 fields that differed that day, the six `web_url` values were the
// only ones a visitor could see — five records served a Google-search page as
// their "Author" link — and they were fixed in production the same day
// (section A of tools/sql/2026-10-03_catalog_db_json_parity.sql).
//
// These 27 were reviewed and deliberately not changed:
//   * cover_image (22) — catalog.php renders no <img> at all, so the column is
//     stored but never displayed. Nothing a reader sees depends on it.
//   * url (4) — the database keeps the amzn.to affiliate shortlinks while
//     books.json holds direct /dp/ links. SHORTLINK_TARGETS in
//     catalog-links.test.cjs records that each shortlink resolves to the very
//     ASIN the direct link names, so both forms reach the same page.
//   * author (1) — byline wording on the Pravda.sk interview.
//
// Sections B, C and D of that migration are still staged and will apply these
// if you ever want them. Delete the matching entries here when you do.
const ACCEPTED_DB_JSON_DIVERGENCE = new Set([
  "isbn:1090110758::cover_image",
  "isbn:1090779291::cover_image",
  "isbn:323586471::cover_image",
  "isbn:B07PKJBJJ7::cover_image",
  "isbn:B07PQ4RW5Z::cover_image",
  "isbn:B0DHQY58C8::cover_image",
  "isbn:B0DHQY58C8::url",
  "isbn:B0FFGG4K4D::cover_image",
  "isbn:B0FFGG4K4D::url",
  "isbn:B0G3MLQ1PN::cover_image",
  "isbn:B0G3MLQ1PN::url",
  "isbn:B0GGJXHQDH::cover_image",
  "isbn:B0GGJXHQDH::url",
  "isbn:DIA-2054968::cover_image",
  "isbn:FD-40671::cover_image",
  "isbn:ZDN-96291978::cover_image",
  "title:DLHODOBÁ ÚSPEŠNÁ REMISIA IDIOPATICKEJ MEMBRÁNOVEJ NEFROPATIE APLIKÁCIOU PONTICELLIHO SCHÉMY IMUNOSUPRESÍVNEJ LIEČBY::cover_image",
  "isbn:METAFYZIKA-2::cover_image",
  "title:Dialyzačné roztoky a dialyzačné koncentráty::cover_image",
  "title:Kontinuálna renálna nahrádzajúca terapia (KRNT, CRRT) pri AOP (AKI)::cover_image",
  "title:Lekárske listy: Interná medicína::cover_image",
  "title:Lekárske listy: Varia::cover_image",
  "title:Lubomir Polascin - Gumroad Storefront::cover_image",
  "title:Medical Fasting: How to Use the Power of Starvation and Not Damage Your Metabolism::cover_image",
  "title:Medicínsky pôst. Ako využiť silu hladovania a nezničiť si metabolizmus.::cover_image",
  "title:Nefrológ Polaščín: Na zlyhanie obličiek by pacient v dnešnej dobe nemal zomrieť::author",
  "title:Nefrológ Polaščín: Na zlyhanie obličiek by pacient v dnešnej dobe nemal zomrieť::cover_image",
  "title:Nefrológia: Ochorenia obličiek::cover_image",
]);

test(
  "database and books.json agree field by field",
  { skip: !process.env.CATALOG_CHECK_DB },
  () => {
    const index = (rows) => new Map(rows.map((row) => [keyOf(row), row]));
    const db = index(dbRows());
    const json = index(books());
    const mismatches = [];
    const accepted = [];

    for (const [key, jsonRow] of json) {
      const dbRow = db.get(key);
      if (!dbRow) {
        continue; // reported by the key-set test above
      }

      for (const field of PARITY_FIELDS) {
        // year is INT in MariaDB and a number in JSON; compare as strings so a
        // driver returning "2026" does not read as a difference.
        const a = String(dbRow[field] ?? "").trim();
        const b = String(jsonRow[field] ?? "").trim();
        if (a === b) {
          continue;
        }

        if (ACCEPTED_DB_JSON_DIVERGENCE.has(`${key}::${field}`)) {
          accepted.push(`${key}::${field}`);
          continue;
        }

        mismatches.push(
          `${key} .${field}:\n    db   = ${a || "(empty)"}\n    json = ${b || "(empty)"}`,
        );
      }
    }

    assert.deepEqual(
      mismatches,
      [],
      `database and books.json disagree on ${mismatches.length} unaccepted field(s):\n${mismatches.join("\n")}`,
    );

    // Pin the accepted set too: once a divergence is actually reconciled, this
    // fails and forces the stale entry out, so the allowlist cannot quietly grow
    // into a blanket exemption.
    assert.equal(
      accepted.length,
      ACCEPTED_DB_JSON_DIVERGENCE.size,
      `ACCEPTED_DB_JSON_DIVERGENCE lists ${ACCEPTED_DB_JSON_DIVERGENCE.size} entries but ${accepted.length} ` +
        `still diverge — remove the reconciled ones:\n` +
        [...ACCEPTED_DB_JSON_DIVERGENCE]
          .filter((e) => !accepted.includes(e))
          .join("\n"),
    );
  },
);
