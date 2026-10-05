const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { test } = require("node:test");

// Companion to catalog-links.test.cjs, which only guards Amazon `url` values.
// Added 2026-10-03 after a Google-search placeholder was found surviving in
// `web_url` on record B07PKJBJJ7: the 2026-10-02 sweep had fixed `url` only,
// because the only guard in place read `url` only. Every field the catalog
// renders as a link or an image source is checked here.
//
// catalog.php renders: `url` (card title + "View Online"), `web_url` ("Author"
// / secondary channel) and `cover_image` (<img src>).
const URL_FIELDS = ["url", "web_url", "cover_image"];

const books = () =>
  JSON.parse(readFileSync(resolve(__dirname, "../../data/books.json"), "utf8"));

const value = (book, field) => String(book[field] ?? "").trim();

const DB_QUERY =
  'require $argv[1]; $pdo = getDbConnection(); if (!$pdo) { fwrite(STDERR, "no db"); exit(1); } ' +
  'echo json_encode($pdo->query("SELECT id, isbn, title, url, web_url, cover_image FROM books ORDER BY id")' +
  "->fetchAll(PDO::FETCH_ASSOC), JSON_UNESCAPED_UNICODE);";

/** Rows straight from MariaDB, which is what production actually serves. */
const dbRows = () =>
  JSON.parse(
    execFileSync(
      "php",
      ["-r", DB_QUERY, resolve(__dirname, "../../includes/functions.php")],
      {
        encoding: "utf8",
      },
    ),
  );

// ---------------------------------------------------------------------------
// Search-engine placeholders
// ---------------------------------------------------------------------------

// All three historical Google-search placeholders were replaced on 2026-10-04
// with verified primary sources (CNNA 2014 program PDF for ID 15, Tigis AVN
// 2016 congress program PDF for ID 12, and KNS 2013 program PDF for ID 13).
// The allowlist is now empty so that any future search-engine placeholder will
// fail immediately.
const SEARCH_URL_ALLOWED = new Set([]);

const SEARCH_URL =
  /^https?:\/\/(?:[a-z0-9-]+\.)*(?:google|bing|duckduckgo|yandex|ecosia|startpage)\.[a-z.]+\/(?:search|url)\b/iu;

function assertNoSearchPlaceholders(rows, source) {
  let allowed = 0;

  for (const book of rows) {
    for (const field of URL_FIELDS) {
      const url = value(book, field);
      if (!SEARCH_URL.test(url)) {
        continue;
      }

      const key = `${field}::${book.title}`;
      assert.ok(
        SEARCH_URL_ALLOWED.has(key),
        `${source}: ${field} of id ${book.id} ("${book.title}") is a search-engine ` +
          `results page, which is not a source: ${url}`,
      );
      allowed += 1;
    }
  }

  // Pin the count too: when a placeholder is finally replaced by a real
  // source, this fails and forces the stale allowlist entry to be deleted,
  // instead of leaving it behind to permit a future regression.
  assert.equal(
    allowed,
    SEARCH_URL_ALLOWED.size,
    `${source}: SEARCH_URL_ALLOWED lists ${SEARCH_URL_ALLOWED.size} placeholders but ` +
      `${allowed} are present — delete the entries whose primary source has since been found`,
  );
}

test("books.json: no URL field holds a search-engine results page", () => {
  assertNoSearchPlaceholders(books(), "books.json");
});

// ---------------------------------------------------------------------------
// Shape
// ---------------------------------------------------------------------------

test("books.json: every URL field is a well-formed absolute https URL", () => {
  for (const book of books()) {
    for (const field of URL_FIELDS) {
      const raw = String(book[field] ?? "");
      if (raw === "") {
        continue;
      }

      assert.equal(
        raw,
        raw.trim(),
        `id ${book.id}: ${field} has surrounding whitespace`,
      );
      assert.doesNotMatch(
        raw,
        /\s/u,
        `id ${book.id}: ${field} contains whitespace and must be percent-encoded: ${raw}`,
      );

      // Generated placeholder covers are inline SVG data URIs, not links.
      if (field === "cover_image" && raw.startsWith("data:image/svg+xml")) {
        continue;
      }

      assert.match(
        raw,
        /^https:\/\//u,
        `id ${book.id}: ${field} must be absolute https — no http, no protocol-relative ` +
          `"//host", no bare path: ${raw}`,
      );
      assert.doesNotThrow(
        () => new URL(raw),
        `id ${book.id}: ${field} is not a parseable URL: ${raw}`,
      );
    }
  }
});

test("books.json: no URL field carries mojibake", () => {
  for (const book of books()) {
    for (const field of URL_FIELDS) {
      assert.doesNotMatch(
        value(book, field),
        /Ã.|Ä.|Å./u,
        `id ${book.id}: ${field} looks double-encoded`,
      );
    }
  }
});

// ---------------------------------------------------------------------------
// Hosts
// ---------------------------------------------------------------------------

// Hosts the catalog is known to cite, per field. Not a security boundary — a
// review prompt: pointing a record somewhere new should be a deliberate edit
// here, not a silent change in a data file.
const ALLOWED_HOSTS = {
  url: new Set([
    "amzn.to",
    "www.amazon.com",
    "polascin.gumroad.com",
    "nefro.polascin.net",
    "polascin.net",
    "dia.hnonline.sk",
    "mediweb.hnonline.sk",
    "www.pravda.sk",
    "www.prolekare.cz",
    "www.researchgate.net",
    "www.solen.sk",
    "zona.fmed.uniba.sk",
    "www.cnna.cz",
    "www.tigis.cz",
    "www.nefro.sk",
  ]),
  web_url: new Set([
    "www.amazon.com",
    "polascin.gumroad.com",
    "www.polascin.net",
    "polascin.net",
    "dia.hnonline.sk",
    "mediweb.hnonline.sk",
    "www.forumdiabetologicum.sk",
    "www.researchgate.net",
    "www.solen.sk",
    "www.sllk.sk",
    "www.nefro.sk",
  ]),
  cover_image: new Set([
    "m.media-amazon.com",
    "public-files.gumroad.com",
    "nefro.polascin.net",
    "www.sllk.sk",
  ]),
};

test("books.json: every URL field points at a known host", () => {
  for (const book of books()) {
    for (const field of URL_FIELDS) {
      const raw = value(book, field);
      if (raw === "" || raw.startsWith("data:")) {
        continue;
      }

      const { host } = new URL(raw);
      assert.ok(
        ALLOWED_HOSTS[field].has(host),
        `id ${book.id} ("${book.title}"): ${field} points at ${host}, which is not in ` +
          `ALLOWED_HOSTS.${field} — verify the source, then add the host deliberately`,
      );
    }
  }
});

// ---------------------------------------------------------------------------
// Non-Amazon links
// ---------------------------------------------------------------------------

// catalog-links.test.cjs proves an Amazon link belongs to its own record by
// comparing the ASIN/ISBN in the URL. Non-Amazon links carry no identifier, so
// the equivalent guard is that a source link is not shared between records —
// which is exactly how both the 2026-10-02 shortlink shift and the
// double-held Forum diabetologicum record presented themselves.

// Same exception as catalog-parity.test.cjs: one AVN 2016 program PDF is the
// primary source of the page-80 poster and of talks AVN-2016-MEMB (p. 81) and
// AVN-2016-AMB (p. 82). There is no separate page to cite.
const SHARED_PRIMARY_URL = new Map([
  [
    "https://www.tigis.cz/images/stories/Aktuality_nefro/2016/03/AVN_program_3_2016.pdf",
    3,
  ],
]);

test("books.json: no two records share a primary url", () => {
  const counts = new Map();

  for (const book of books()) {
    const url = value(book, "url");
    counts.set(url, (counts.get(url) ?? 0) + 1);
  }

  for (const [url, count] of counts) {
    if (count === 1) {
      continue;
    }

    const expected = SHARED_PRIMARY_URL.get(url);
    assert.ok(
      expected !== undefined,
      `url ${url} is the primary source of ${count} records — a source link ` +
        `must belong to one record unless it is a known shared congress program`,
    );
    assert.equal(
      count,
      expected,
      `url ${url} is now on ${count} records, recorded as ${expected}`,
    );
  }

  for (const [url, expected] of SHARED_PRIMARY_URL) {
    assert.equal(counts.get(url), expected);
  }
});

// Author and landing pages legitimately shared by several records.
const SHARED_WEB_URL = new Map([
  ["https://www.amazon.com/stores/author/B0G2TCCJZZ", 11],
  ["https://mediweb.hnonline.sk/zdn/tag/lubomir-polascin", 2],
  ["https://polascin.gumroad.com", 2],
]);

test("books.json: a shared web_url is a known landing page, not a stray copy", () => {
  const counts = new Map();

  for (const book of books()) {
    const url = value(book, "web_url");
    if (url === "") {
      continue;
    }
    counts.set(url, (counts.get(url) ?? 0) + 1);
  }

  for (const [url, count] of counts) {
    if (count === 1) {
      continue;
    }

    const expected = SHARED_WEB_URL.get(url);
    assert.ok(
      expected !== undefined,
      `web_url ${url} is reused by ${count} records but is not a known shared landing ` +
        `page — a product or article link must belong to one record only`,
    );
    assert.equal(
      count,
      expected,
      `web_url ${url} is now on ${count} records, recorded as ${expected}`,
    );
  }
});

const GUMROAD_PRODUCT =
  /^https:\/\/polascin\.gumroad\.com\/l\/([A-Za-z0-9-]+)/u;

// Each Gumroad product belongs to exactly one catalog record, but it is not
// always that record's primary `url`:
//   * ids 18 and 19 are sold on Gumroad only, so Gumroad is their `url`;
//   * id 31 (SK Nefro Báza 1) is published on nefro.polascin.net, which is the
//     primary source, with Gumroad as the secondary channel in `web_url`.
// Ownership is therefore "referenced in url or web_url", and the storefront
// record is exempt: it deliberately features another record's product.
const STOREFRONT_CATEGORY = "Digital Storefront";

test("books.json: every Gumroad product belongs to exactly one record", () => {
  const owners = new Map();

  for (const book of books()) {
    if (value(book, "category") === STOREFRONT_CATEGORY) {
      continue;
    }

    const permalinks = new Set(
      ["url", "web_url"]
        .map((field) => value(book, field).match(GUMROAD_PRODUCT))
        .filter(Boolean)
        .map((match) => match[1]),
    );

    for (const permalink of permalinks) {
      const previous = owners.get(permalink);
      assert.equal(
        previous,
        undefined,
        `Gumroad product ${permalink} is claimed by both id ${previous} and id ${book.id}`,
      );
      owners.set(permalink, book.id);
    }
  }

  // veszhk (id 18), hcilux (id 19), sk-nefro-baza-1 (id 31), sk-nefro-baza-1-en (id 32),
  // sk-nefro-baza-1-kompendium (id 33) and sk-nefro-baza-1-kompendium-en (id 34).
  assert.equal(
    owners.size,
    6,
    `expected 6 distinct Gumroad products, found ${owners.size}`,
  );
});

// A product cited by the storefront record must be one the catalog actually
// holds — that is what catches a stale or typo'd permalink on a secondary
// channel, which the host allowlist alone cannot see.
test("books.json: the storefront only features products the catalog holds", () => {
  const catalog = books();
  const owned = new Set(
    catalog
      .filter((book) => value(book, "category") !== STOREFRONT_CATEGORY)
      .flatMap((book) =>
        ["url", "web_url"]
          .map((field) => value(book, field).match(GUMROAD_PRODUCT))
          .filter(Boolean)
          .map((match) => match[1]),
      ),
  );

  for (const book of catalog) {
    if (value(book, "category") !== STOREFRONT_CATEGORY) {
      continue;
    }

    for (const field of ["url", "web_url"]) {
      const match = value(book, field).match(GUMROAD_PRODUCT);
      if (!match) {
        continue;
      }

      assert.ok(
        owned.has(match[1]),
        `id ${book.id} ("${book.title}"): ${field} features Gumroad product ${match[1]}, ` +
          `which no catalog record holds`,
      );
    }
  }
});

// ---------------------------------------------------------------------------
// Database
// ---------------------------------------------------------------------------

// Opt-in: production is served from MariaDB and only falls back to
// data/books.json, so the live rows need the same guards. Needs .env.
test(
  "database: no URL field holds a search-engine results page",
  { skip: !process.env.CATALOG_CHECK_DB },
  () => {
    assertNoSearchPlaceholders(dbRows(), "database");
  },
);

test(
  "database: every URL field points at a known host",
  { skip: !process.env.CATALOG_CHECK_DB },
  () => {
    for (const row of dbRows()) {
      for (const field of URL_FIELDS) {
        const raw = value(row, field);
        if (raw === "" || raw.startsWith("data:")) {
          continue;
        }

        assert.doesNotThrow(
          () => new URL(raw),
          `database id ${row.id}: ${field} is unparseable: ${raw}`,
        );
        const { host } = new URL(raw);
        assert.ok(
          ALLOWED_HOSTS[field].has(host),
          `database id ${row.id} ("${row.title}"): ${field} points at ${host}, ` +
            `not in ALLOWED_HOSTS.${field}`,
        );
      }
    }
  },
);

// Opt-in: hits the network. Non-Amazon sources only — Amazon answers bots with
// 403/503 whether or not the link is good, and the amzn.to shortlinks have
// their own resolver test in catalog-links.test.cjs.
test(
  "non-Amazon source links still resolve",
  { skip: !process.env.CATALOG_CHECK_URLS },
  () => {
    const AMAZON = /(?:^|\.)(?:amazon\.[a-z.]+|amzn\.to|media-amazon\.com)$/u;
    // These answer any non-browser request with 403 (bot wall, not a dead link);
    // noted for ResearchGate in 2026-10-02_catalog_source_url_sync.sql.
    const BOT_WALLED = new Set(["www.researchgate.net", "www.prolekare.cz"]);
    const failures = [];

    for (const book of books()) {
      for (const field of URL_FIELDS) {
        const raw = value(book, field);
        if (raw === "" || raw.startsWith("data:") || SEARCH_URL.test(raw)) {
          continue;
        }

        const { host } = new URL(raw);
        if (AMAZON.test(host)) {
          continue;
        }

        const status = execFileSync(
          "curl",
          [
            "-s",
            "-L",
            "-o",
            process.platform === "win32" ? "NUL" : "/dev/null",
            "--max-time",
            "30",
            "-A",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0 Safari/537.36",
            "-w",
            "%{http_code}",
            raw,
          ],
          { encoding: "utf8" },
        ).trim();

        if (status !== "200" && !(BOT_WALLED.has(host) && status === "403")) {
          failures.push(`id ${book.id} ${field} -> HTTP ${status}: ${raw}`);
        }
      }
    }

    assert.deepEqual(
      failures,
      [],
      `unreachable source links:\n${failures.join("\n")}`,
    );
  },
);
