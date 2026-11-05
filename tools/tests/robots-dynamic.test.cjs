const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");

const root = resolve(__dirname, "../..");
const htaccess = readFileSync(resolve(root, ".htaccess"), "utf8");
const robotsPhp = readFileSync(resolve(root, "robots.php"), "utf8");
const robotsTxt = readFileSync(resolve(root, "robots.txt"), "utf8");

describe("robots.txt is served dynamically", () => {
  it("rewrites robots.txt to robots.php", () => {
    assert.match(htaccess, /RewriteRule \^robots\\\.txt\$ \/robots\.php \[L\]/);
  });

  it("robots.php reads robots.txt with no-store headers", () => {
    assert.match(robotsPhp, /\$path = __DIR__ \. '\/robots\.txt';/);
    assert.match(robotsPhp, /readfile\(\$path\)/);
    assert.match(robotsPhp, /no-store/);
  });

  it("robots.txt lists agent and AGENTS paths", () => {
    assert.match(robotsTxt, /Disallow: \/\.codex\//);
    assert.match(robotsTxt, /Disallow: \/AGENTS\.md/);
    assert.match(robotsTxt, /Disallow: \/robots\.php/);
    assert.match(robotsTxt, /2026-11-05/);
  });
});

