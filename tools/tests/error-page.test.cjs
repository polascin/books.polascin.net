const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { existsSync, readFileSync } = require("node:fs");
const { resolve } = require("node:path");

const root = resolve(__dirname, "../..");
const htaccess = readFileSync(resolve(root, ".htaccess"), "utf8");
const notFound = readFileSync(resolve(root, "404.php"), "utf8");

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
});
