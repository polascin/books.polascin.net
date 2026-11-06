const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");

const root = resolve(__dirname, "../..");
const catalog = readFileSync(resolve(root, "catalog.php"), "utf8");
const style = readFileSync(resolve(root, "assets/css/style.css"), "utf8");
const header = readFileSync(resolve(root, "includes/header.php"), "utf8");

describe("catalog search field", () => {
  it("uses a search input with autocomplete off and enterkeyhint", () => {
    assert.match(catalog, /id="search-books"/);
    assert.match(catalog, /type="search"/);
    assert.match(catalog, /autocomplete="off"/);
    assert.match(catalog, /enterkeyhint="search"/);
    assert.match(
      catalog,
      /aria-label="Search catalog by title, author, or ISBN\/ID"/,
    );
    assert.match(catalog, /placeholder="Search by title, author, or ISBN\/ID"/);
    assert.match(catalog, /data-identifier="/);
    assert.doesNotMatch(
      catalog,
      /<input[^>]*id="search-books"[^>]*type="text"/s,
    );
  });

  it("keeps the native clear control after neutralizing WebKit search chrome", () => {
    assert.match(
      style,
      /\.catalog-search-input\[type="search"\]\s*\{[^}]*padding-right:\s*2\.5rem/s,
    );
    assert.match(
      style,
      /\.catalog-search-input\[type="search"\]::-webkit-search-cancel-button/,
    );
    assert.match(header, /viewport-fit=cover/);
  });
});
