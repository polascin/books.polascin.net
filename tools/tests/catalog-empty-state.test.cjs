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
    assert.match(script, /noResults\.hidden\s*=\s*visibleCount !== 0/);
    assert.doesNotMatch(script, /noResults\.classList\.toggle\("hidden"/);
  });

  it("disables automatic telephone detection so IČO stays plain text", () => {
    assert.match(header, /format-detection" content="telephone=no"/);
  });
});
