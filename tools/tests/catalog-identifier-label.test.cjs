const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");

const catalog = readFileSync(resolve(__dirname, "../../catalog.php"), "utf8");

describe("catalog identifier labels", () => {
  it("does not pretend a missing identifier is an ISBN", () => {
    assert.doesNotMatch(catalog, /ISBN:\s*N\/A/);
    assert.match(catalog, /No ISBN \/ ASIN/);
  });
});
