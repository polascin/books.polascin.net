const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");

const root = resolve(__dirname, "../..");
const catalog = readFileSync(resolve(root, "catalog.php"), "utf8");
const css = readFileSync(resolve(root, "assets/css/style.css"), "utf8");

describe("catalog book title links", () => {
  it("underlines title links in the resting state (not hover-only)", () => {
    assert.match(catalog, /class="book-title-link[^"]*\bunderline\b/);
    assert.doesNotMatch(catalog, /class="book-title-link[^"]*hover:underline/);
    assert.match(
      css,
      /\.book-title-link\s*\{[^}]*text-decoration:\s*underline/s,
    );
  });
});
