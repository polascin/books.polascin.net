const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { test } = require("node:test");

// Regression guard for the off-by-one shortlink shift fixed on 2026-10-02:
// rows 2-5 each carried the previous row's amzn.to link, so the card title and
// the "View Online" button opened a different title/edition than the record
// described. Both links in catalog.php come from the `url` column, so checking
// `url` covers both.

// amzn.to slug -> identifier the 301 lands on. Resolved with
// `curl -I https://amzn.to/<slug>` on 2026-10-02; re-check with
// RESOLVE_SHORTLINKS=1 (see the opt-in test at the bottom).
const SHORTLINK_TARGETS = {
  "4rLFwe8": "B0GGJXHQDH",
  "4uLOhrl": "B0GGJXHQDH",
  "4lO2EHJ": "B0FFGG4K4D",
  "4d3XxRj": "B0G3MLQ1PN",
  "4d3eQC8": "B0DHQY58C8",
  "47hdmk5": "1090110758",
  "4skC8bk": "B07PKJBJJ7",
  "4suICVh": "B07PQ4RW5Z",
  "4bnmTsc": "B07PQ4RW5Z",
  "3PBrlei": "1090779291",
};

// Print editions are stored with their ISBN-13 while the Amazon URL uses the
// edition's ASIN. These pairings come from the 2026-09-02 edition import; the
// tests below treat them as the record's own identifier rather than a mismatch.
const PRINT_EDITION_ASIN = {
  9798243848893: "B0GGQGWGQY",
  9798243857475: "B0GGQL6LTT",
  9798275766110: "B0G3PZ47C1",
  9798275768503: "B0G3NXZCNF",
  9798275086690: "B0G2WW1CKG",
  9798275098167: "B0G2XC7PZ8",
  9798276693088: "B0G4JLDMWG",
};

/** Identifier an Amazon link points at, or null for non-Amazon links. */
function linkTarget(url) {
  const value = String(url ?? "");

  const shortlink = value.match(/^https:\/\/amzn\.to\/([A-Za-z0-9]+)$/);
  if (shortlink) {
    const target = SHORTLINK_TARGETS[shortlink[1]];
    assert.ok(
      target,
      `Shortlink https://amzn.to/${shortlink[1]} has no verified target in SHORTLINK_TARGETS — resolve it with curl -I and add it`,
    );
    return target;
  }

  const direct = value.match(/^https:\/\/www\.amazon\.[a-z.]+\/.*\/?dp\/([0-9A-Z]{10})(?:[/?]|$)/);
  return direct ? direct[1] : null;
}

/** Identifiers that legitimately identify this record. */
function ownIdentifiers(book) {
  const isbn = String(book.isbn ?? "").trim();
  const identifiers = [isbn];

  if (PRINT_EDITION_ASIN[isbn]) {
    identifiers.push(PRINT_EDITION_ASIN[isbn]);
  }

  return identifiers;
}

function checkCatalog(books, source) {
  const targets = new Map();

  for (const book of books) {
    const target = linkTarget(book.url);
    if (target === null) {
      continue;
    }

    const own = ownIdentifiers(book);
    assert.ok(
      own.includes(target),
      `${source}: entry ${book.isbn} ("${book.title}") links to ${target}, ` +
        `which is not its own identifier (${own.join(", ")}) — url: ${book.url}`,
    );

    // The 2026-10-02 bug was one record's link pointing at its neighbour's
    // title, so a target claimed by two different records is also a failure.
    const previous = targets.get(target);
    assert.equal(
      previous,
      undefined,
      `${source}: ${target} is linked by both ${previous} and ${book.isbn}`,
    );
    targets.set(target, book.isbn);
  }

  return targets.size;
}

test("books.json: every Amazon link resolves to its own record", () => {
  const books = JSON.parse(
    readFileSync(resolve(__dirname, "../../data/books.json"), "utf8"),
  );

  const checked = checkCatalog(books, "books.json");
  assert.ok(checked >= 14, `expected at least 14 Amazon links, checked ${checked}`);
});

test("books.json: Blood Purification Print keeps its ISBN and its own link", () => {
  const books = JSON.parse(
    readFileSync(resolve(__dirname, "../../data/books.json"), "utf8"),
  );
  const book = books.find((entry) => entry.isbn === "1090110758");

  assert.ok(book, "Blood Purification Print (ISBN 1090110758) must exist");
  assert.equal(book.url, "https://amzn.to/47hdmk5");
  assert.equal(linkTarget(book.url), "1090110758");
});

test("books.json: Vital Algorithm 1st ed. Kindle links to the 1st edition", () => {
  const books = JSON.parse(
    readFileSync(resolve(__dirname, "../../data/books.json"), "utf8"),
  );
  const book = books.find((entry) => entry.isbn === "B0FFGG4K4D");

  assert.ok(book, "Vital Algorithm Kindle 1st ed. (ASIN B0FFGG4K4D) must exist");
  assert.match(book.title, /Kindle Edition, 1st ed\.\)$/);
  assert.equal(linkTarget(book.url), "B0FFGG4K4D");
  assert.notEqual(linkTarget(book.url), "B0GGJXHQDH");
});

// Opt-in: production is served from MariaDB and only falls back to books.json,
// so the live `url` values need the same guard. Needs .env credentials.
test("database: every Amazon link resolves to its own record", { skip: !process.env.CATALOG_CHECK_DB }, () => {
  const json = execFileSync(
    "php",
    [
      "-r",
      'require $argv[1]; $pdo = getDbConnection(); if (!$pdo) { fwrite(STDERR, "no db"); exit(1); } echo json_encode($pdo->query("SELECT id, isbn, title, url FROM books ORDER BY id")->fetchAll(), JSON_UNESCAPED_UNICODE);',
      resolve(__dirname, "../../includes/functions.php"),
    ],
    { encoding: "utf8" },
  );

  checkCatalog(JSON.parse(json), "database");
});

// Opt-in: hits amzn.to. Confirms SHORTLINK_TARGETS still describes reality —
// a shortlink can be re-pointed in the Amazon affiliate console at any time.
test("shortlinks still resolve to their recorded targets", { skip: !process.env.RESOLVE_SHORTLINKS }, () => {
  for (const [slug, expected] of Object.entries(SHORTLINK_TARGETS)) {
    const location = execFileSync(
      "curl",
      ["-s", "-o", process.platform === "win32" ? "NUL" : "/dev/null", "-I", "--max-time", "20", "-w", "%{redirect_url}", `https://amzn.to/${slug}`],
      { encoding: "utf8" },
    );

    const match = location.match(/\/dp\/([0-9A-Z]{10})/);
    assert.ok(match, `https://amzn.to/${slug} did not redirect to a /dp/ URL: ${location}`);
    assert.equal(
      match[1],
      expected,
      `https://amzn.to/${slug} now resolves to ${match[1]}, recorded as ${expected}`,
    );
  }
});
