const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");

const root = resolve(__dirname, "../..");
const header = readFileSync(resolve(root, "includes/header.php"), "utf8");
const style = readFileSync(resolve(root, "assets/css/style.css"), "utf8");
const about = readFileSync(resolve(root, "about.php"), "utf8");

describe("social preview and skip-target meta", () => {
  it("declares square OG image dimensions for the author portrait", () => {
    assert.match(header, /og:image:width" content="256"/);
    assert.match(header, /og:image:height" content="256"/);
    assert.match(header, /twitter:card" content="summary"/);
    assert.doesNotMatch(header, /summary_large_image/);
  });

  it("keeps skip-link and in-page anchors clear of the sticky header", () => {
    assert.match(
      style,
      /#main-content,\s*#legal-disclaimer,\s*#about,\s*#catalog,\s*\[id\^="book-"\]\s*\{[^}]*scroll-margin-top:\s*7rem/s,
    );
  });

  it("matches about portrait HTML size to the rendered 192px frame", () => {
    assert.match(about, /width="192" height="192"/);
  });
});
