const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");

const root = resolve(__dirname, "../..");
const footer = readFileSync(resolve(root, "includes/footer.php"), "utf8");
const about = readFileSync(resolve(root, "about.php"), "utf8");
const header = readFileSync(resolve(root, "includes/header.php"), "utf8");
const index = readFileSync(resolve(root, "index.php"), "utf8");

describe("footer legal links", () => {
  it("marks Privacy and Terms with aria-current when those pages are active", () => {
    assert.match(
      footer,
      /href="\/privacy"[^>]*<\?php echo \(\$currentScript \?\? ''\) === 'privacy\.php' \? ' aria-current="page"' : ''; \?>/,
    );
    assert.match(
      footer,
      /href="\/terms"[^>]*<\?php echo \(\$currentScript \?\? ''\) === 'terms\.php' \? ' aria-current="page"' : ''; \?>/,
    );
  });

  it("underlines footer and about text links so they are not color-only", () => {
    assert.match(
      footer,
      /href="\/privacy"[^>]*class="[^"]*underline/,
    );
    assert.match(footer, /href="\/terms"[^>]*class="[^"]*underline/);
    assert.match(
      footer,
      /href="\/privacy#legal-disclaimer"[^>]*class="[^"]*underline/,
    );
    assert.match(
      about,
      /href="https:\/\/polascin\.net"[^>]*class="[^"]*underline/,
    );
    assert.match(
      about,
      /href="https:\/\/polascin\.com"[^>]*class="[^"]*underline/,
    );
  });
});

describe("header and home text links", () => {
  it("underlines main nav and homepage about link so they are not color-only", () => {
    assert.match(
      header,
      /href="\/"[^>]*class="[^"]*font-playfair[^"]*underline/,
    );
    assert.match(
      header,
      /href="\/catalog"[^>]*class="[^"]*underline/,
    );
    assert.match(
      header,
      /href="\/about"[^>]*class="[^"]*underline/,
    );
    assert.match(
      index,
      /href="\/about"[^>]*class="[^"]*underline/,
    );
  });

  it("underlines the site brand link so it is not color-only", () => {
    assert.match(
      header,
      /href="\/"[^>]*class="[^"]*font-cinzel[^"]*\bunderline\b/,
    );
  });
});
