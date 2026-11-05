const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");

const htaccess = readFileSync(resolve(__dirname, "../../.htaccess"), "utf8");
const footer = readFileSync(resolve(__dirname, "../../includes/footer.php"), "utf8");

describe("clean public URLs", () => {
  it("301-aliases catalog and about like privacy and terms", () => {
    assert.match(
      htaccess,
      /RewriteRule \^\(privacy\|terms\|catalog\|about\)\/\?\$ \/\$1\.php \[R=301,L,NE\]/,
    );
  });

  it("canonicalizes index.php to /", () => {
    assert.match(htaccess, /RewriteRule \^index\\\.php\$ \/ \[R=301,L\]/);
  });

  it("Clarity consent paths include the clean catalog and about aliases", () => {
    assert.match(footer, /data-paths="[^"]*\/catalog[^"]*\/about/);
  });
});
