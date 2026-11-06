const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");

const root = resolve(__dirname, "../..");
const about = readFileSync(resolve(root, "about.php"), "utf8");
const catalog = readFileSync(resolve(root, "catalog.php"), "utf8");

describe("primary page landmarks", () => {
  it("names the about and catalog sections from their visible headings", () => {
    assert.match(
      about,
      /<section[^>]*id="about"[^>]*aria-labelledby="about-heading"[^>]*>[\s\S]*?<h1 id="about-heading"/,
    );
    assert.match(
      catalog,
      /<section[^>]*id="catalog"[^>]*aria-labelledby="catalog-heading"[^>]*>[\s\S]*?<h1 id="catalog-heading"/,
    );
  });
});
