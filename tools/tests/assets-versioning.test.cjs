const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");

const root = resolve(__dirname, "../..");
const footer = readFileSync(resolve(root, "includes/footer.php"), "utf8");
const header = readFileSync(resolve(root, "includes/header.php"), "utf8");

describe("static asset versioning", () => {
  it("Clarity consent assets use assetUrl() instead of a hardcoded ?v=", () => {
    assert.match(footer, /assetUrl\('assets\/js\/clarity-consent\.js'\)/);
    assert.match(footer, /assetUrl\('assets\/js\/clarity-consent\.css'\)/);
    assert.doesNotMatch(footer, /clarity-consent\.js\?v=\d{8}/);
    assert.doesNotMatch(footer, /clarity-consent\.css\?v=\d{8}/);
  });

  it("header stylesheets and icons go through assetUrl()", () => {
    for (const path of [
      "assets/css/tailwind.css",
      "assets/css/fonts.css",
      "assets/css/style.css",
      "assets/images/favicon.svg",
    ]) {
      assert.match(header, new RegExp(`assetUrl\\('${path.replace(/\./g, "\\.")}'\\)`));
    }
  });

  it("main nav uses root-absolute paths, not relative *.php hrefs", () => {
    assert.match(header, /href="\/"/);
    assert.match(header, /href="\/catalog\.php"/);
    assert.match(header, /href="\/about\.php"/);
    assert.doesNotMatch(header, /href="index\.php"/);
    assert.doesNotMatch(header, /href="catalog\.php"/);
    assert.doesNotMatch(header, /href="about\.php"/);
  });

  it("catalog script is versioned through assetUrl()", () => {
    assert.match(footer, /assetUrl\('assets\/js\/script\.js'\)/);
  });
});
