const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");

const privacy = readFileSync(resolve(__dirname, "../../privacy.php"), "utf8");

describe("privacy policy aligns with Clarity consent UI", () => {
  it("describes the analytics consent prompt, not the removed cookie banner", () => {
    assert.match(privacy, /analytics consent prompt/i);
    assert.doesNotMatch(privacy, /cookie consent banner/i);
  });

  it("documents Clarity gating, masking and withdrawal", () => {
    assert.match(privacy, /Microsoft Clarity/);
    assert.match(privacy, /Allow analytics/);
    assert.match(privacy, /Analytics settings/);
    assert.match(privacy, /masked text/i);
    assert.match(privacy, /_clck/);
    assert.match(privacy, /_clsk/);
  });

  it("styles Microsoft Clarity external references like other policy links", () => {
    assert.match(
      privacy,
      /href="https:\/\/privacy\.microsoft\.com\/privacystatement"[^>]*class="[^"]*focus:ring-2/,
    );
    assert.match(
      privacy,
      /href="https:\/\/learn\.microsoft\.com\/en-us\/clarity\/setup-and-installation\/clarity-cookies"[^>]*class="[^"]*focus:ring-2/,
    );
    assert.match(privacy, /Last Updated:<\/strong> November 5, 2026/);
  });
});
