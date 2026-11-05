const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");

const footer = readFileSync(
  resolve(__dirname, "../../includes/footer.php"),
  "utf8",
);

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
});
