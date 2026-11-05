const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");

const css = readFileSync(
  resolve(__dirname, "../../assets/js/clarity-consent.css"),
  "utf8",
);

describe("Clarity consent dialog chrome", () => {
  it("ships a full-viewport backdrop under the dialog", () => {
    assert.match(css, /\.clarity-consent-backdrop\s*\{[^}]*inset:\s*0/s);
    assert.match(
      css,
      /\.clarity-consent-backdrop\s*\{[^}]*z-index:\s*2147482999/s,
    );
  });

  it("gives the privacy link the same focus ring as dialog buttons", () => {
    assert.match(
      css,
      /\.clarity-consent a:focus-visible,\s*\.clarity-consent button:focus-visible/s,
    );
  });

  it("underlines the privacy link so it is not color-only", () => {
    assert.match(
      css,
      /\.clarity-consent a\s*\{[^}]*text-decoration:\s*underline/s,
    );
  });

  it("respects safe-area insets for the dialog and settings control", () => {
    assert.match(css, /\.clarity-consent\s*\{[^}]*safe-area-inset-bottom/s);
    assert.match(css, /\.clarity-settings\s*\{[^}]*safe-area-inset-bottom/s);
  });
});
