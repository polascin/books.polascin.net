const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { existsSync, readFileSync } = require("node:fs");
const { resolve } = require("node:path");

const root = resolve(__dirname, "../..");
const htaccess = readFileSync(resolve(root, ".htaccess"), "utf8");
const notFound = readFileSync(resolve(root, "404.php"), "utf8");
const header = readFileSync(resolve(root, "includes/header.php"), "utf8");

describe("custom 404 page", () => {
  it("routes missing URLs through ErrorDocument 404.php", () => {
    assert.ok(existsSync(resolve(root, "404.php")));
    assert.match(htaccess, /ErrorDocument\s+404\s+\/404\.php/);
  });

  it("returns 404 with noindex and recovery links inside the site layout", () => {
    assert.match(notFound, /http_response_code\s*\(\s*404\s*\)/);
    assert.match(notFound, /\$pageRobots\s*=\s*'noindex,\s*follow'/);
    assert.match(notFound, /includes\/header\.php/);
    assert.match(notFound, /includes\/footer\.php/);
    assert.match(notFound, /href="\/catalog"/);
    assert.match(notFound, /href="\/"/);
    assert.match(notFound, /Page Not Found/);
  });

  it("does not advertise a homepage canonical on missing URLs", () => {
    assert.match(notFound, /\$omitCanonicalUrls\s*=\s*true/);
    assert.doesNotMatch(notFound, /\$pageCanonical\s*=\s*buildAbsoluteUrl\('\/'\)/);
    assert.match(
      header,
      /\$omitCanonicalUrls\s*=\s*!empty\(\$omitCanonicalUrls\)/,
    );
    assert.match(
      header,
      /if\s*\(\s*!\$omitCanonicalUrls\s*\):\s*\?>\s*<link rel="canonical"/s,
    );
    assert.match(
      header,
      /if\s*\(\s*!\$omitCanonicalUrls\s*\):\s*\?>\s*<meta property="og:url"/s,
    );
    assert.match(
      header,
      /if\s*\(\s*!\$omitCanonicalUrls\s*\):\s*\?>\s*<meta name="twitter:url"/s,
    );
  });
});
