const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");

const catalog = readFileSync(resolve(__dirname, "../../catalog.php"), "utf8");

describe("catalog search field", () => {
  it("uses a search input with autocomplete off and enterkeyhint", () => {
    assert.match(catalog, /id="search-books"/);
    assert.match(catalog, /type="search"/);
    assert.match(catalog, /autocomplete="off"/);
    assert.match(catalog, /enterkeyhint="search"/);
    assert.doesNotMatch(
      catalog,
      /<input[^>]*id="search-books"[^>]*type="text"/s,
    );
  });
});
