const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");

const catalog = readFileSync(resolve(__dirname, "../../catalog.php"), "utf8");

describe("catalog live result summary", () => {
  it("announces the full status text when the visible count changes", () => {
    assert.match(
      catalog,
      /role="status"[^>]*aria-atomic="true"[^>]*>\s*<span id="results-count"/s,
    );
  });
});
