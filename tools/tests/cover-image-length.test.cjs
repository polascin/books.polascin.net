const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");

const root = resolve(__dirname, "../..");
const books = JSON.parse(readFileSync(resolve(root, "data/books.json"), "utf8"));
const setupDb = readFileSync(resolve(root, "setup_db.php"), "utf8");

describe("cover_image column vs JSON payloads", () => {
  it("documents how many JSON covers exceed VARCHAR(255)", () => {
    const oversized = books.filter(
      (book) => String(book.cover_image || "").length > 255,
    );
    // Current catalog keeps long SVG data-URIs in JSON. Until the live column
    // is widened to TEXT (manual migration), this count must stay visible.
    assert.equal(oversized.length, 11);
  });

  it("keeps setup_db.php on VARCHAR(255) until the approved TEXT migration runs", () => {
    assert.match(setupDb, /cover_image VARCHAR\(255\)/);
    assert.doesNotMatch(setupDb, /cover_image TEXT/);
  });
});
