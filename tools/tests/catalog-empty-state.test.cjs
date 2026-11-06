const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");

const root = resolve(__dirname, "../..");
const catalog = readFileSync(resolve(root, "catalog.php"), "utf8");
const script = readFileSync(resolve(root, "assets/js/script.js"), "utf8");
const header = readFileSync(resolve(root, "includes/header.php"), "utf8");

describe("catalog empty state and phone detection", () => {
  it("toggles #no-results with the hidden attribute like book cards", () => {
    assert.match(catalog, /id="no-results"[^>]*\bhidden\b/);
    assert.doesNotMatch(catalog, /id="no-results"[^>]*class="hidden /);
    assert.match(script, /noResults\.hidden\s*=\s*!showEmpty/);
    assert.match(script, /emptyStatus\.hidden\s*=\s*!showEmpty/);
    assert.doesNotMatch(script, /noResults\.classList\.toggle\("hidden"/);
  });

  it("tells users to clear search and all filters, not only category", () => {
    const hint =
      /Try another author or title, or clear the search and filters\./;
    assert.match(catalog, hint);
    assert.match(
      catalog,
      /id="catalog-empty-status"[^>]*>[\s\S]*?clear the search and filters/,
    );
    assert.match(
      catalog,
      /id="no-results"[\s\S]*?clear the search and filters/,
    );
    assert.doesNotMatch(catalog, /reset the category filter/i);
  });

  it("offers a one-click clear control inside the empty panel", () => {
    assert.match(
      catalog,
      /id="no-results"[\s\S]*?<button[^>]*id="clear-catalog-filters"[^>]*>[\s\S]*?Clear search and filters/,
    );
    assert.match(script, /getElementById\("clear-catalog-filters"\)/);
    assert.match(script, /function clearCatalogFilters\(/);
    assert.match(
      script,
      /clearFilters\.addEventListener\("click", clearCatalogFilters\)/,
    );
  });

  it("disables automatic telephone detection so IČO stays plain text", () => {
    assert.match(header, /format-detection" content="telephone=no"/);
  });
});
