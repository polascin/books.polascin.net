const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");

const root = resolve(__dirname, "../..");
const htaccess = readFileSync(resolve(root, ".htaccess"), "utf8");
const footer = readFileSync(resolve(root, "includes/footer.php"), "utf8");
const functions = readFileSync(resolve(root, "includes/functions.php"), "utf8");
const sitemap = readFileSync(resolve(root, "sitemap.xml"), "utf8");
const catalog = readFileSync(resolve(root, "catalog.php"), "utf8");

describe("clean public URLs", () => {
  it("301-redirects .php bookmarks to extensionless paths", () => {
    assert.match(
      htaccess,
      /RewriteRule \^\(privacy\|terms\|catalog\|about\)\\\.php\$ \/\$1 \[R=301,L,QSA,NE\]/,
    );
  });

  it("internally rewrites extensionless paths to the PHP files", () => {
    assert.match(
      htaccess,
      /RewriteRule \^\(privacy\|terms\|catalog\|about\)\/\?\$ \$1\.php \[L,QSA\]/,
    );
    assert.doesNotMatch(
      htaccess,
      /RewriteRule \^\(privacy\|terms\|catalog\|about\)\/\?\$ \/\$1\.php \[R=301/,
    );
  });

  it("canonicalizes index.php to /", () => {
    assert.match(htaccess, /RewriteRule \^index\\\.php\$ \/ \[R=301,L\]/);
  });

  it("Clarity consent paths include the clean catalog and about aliases", () => {
    assert.match(footer, /data-paths="[^"]*\/catalog[^"]*\/about/);
  });

  it("maps public .php paths to clean absolute URLs", () => {
    assert.match(functions, /'\/catalog\.php'\s*=>\s*'\/catalog'/);
    assert.match(functions, /'\/about\.php'\s*=>\s*'\/about'/);
    assert.match(catalog, /buildAbsoluteUrl\('catalog\.php/);
  });

  it("lists extensionless catalog and about locs in the sitemap", () => {
    assert.match(
      sitemap,
      /<loc>https:\/\/books\.polascin\.net\/catalog<\/loc>/,
    );
    assert.match(sitemap, /<loc>https:\/\/books\.polascin\.net\/about<\/loc>/);
    assert.doesNotMatch(sitemap, /books\.polascin\.net\/catalog\.php/);
    assert.doesNotMatch(sitemap, /books\.polascin\.net\/about\.php/);
  });
});
