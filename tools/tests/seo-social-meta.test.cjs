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

  it("provides accessible alt text for the social preview image", () => {
    assert.match(
      header,
      /\$pageImageAlt = \$pageImageAlt \?\? 'Portrait of Dr\. Lubomir Polascin'/,
    );
    assert.match(
      header,
      /og:image:alt" content="<\?php echo esc_html\(\$pageImageAlt\); \?>"/,
    );
    assert.match(
      header,
      /twitter:image:alt" content="<\?php echo esc_html\(\$pageImageAlt\); \?>"/,
    );
  });

  it("keeps skip-link and in-page anchors clear of the sticky header", () => {
    assert.match(
      style,
      /#main-content,\s*#legal-disclaimer,\s*#about,\s*#catalog,\s*\[id\^="book-"\]\s*\{[^}]*scroll-margin-top:\s*7rem/s,
    );
  });

  it("keeps a visible focus ring on #main-content for keyboard skip-link use", () => {
    assert.match(
      style,
      /#main-content:focus:not\(:focus-visible\)\s*\{[^}]*outline:\s*none/s,
    );
    assert.doesNotMatch(style, /#main-content:focus\s*\{[^}]*outline:\s*none/s);
  });

  it("reveals the skip-link only under :focus-visible", () => {
    assert.match(style, /\.skip-link:focus-visible\s*\{[^}]*top:\s*0/s);
    assert.doesNotMatch(style, /\.skip-link:focus\s*\{[^}]*top:\s*0/s);
  });

  it("matches about portrait HTML size to the rendered 192px frame", () => {
    assert.match(about, /width="192" height="192"/);
  });
});
