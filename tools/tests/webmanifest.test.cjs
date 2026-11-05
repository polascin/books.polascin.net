const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");

const root = resolve(__dirname, "../..");
const manifest = JSON.parse(
  readFileSync(resolve(root, "site.webmanifest"), "utf8"),
);
const htaccess = readFileSync(resolve(root, ".htaccess"), "utf8");

describe("site.webmanifest install icons", () => {
  it("ships 192/512 icons with separate any and maskable purposes", () => {
    const purposes = manifest.icons.map((icon) => [
      icon.sizes,
      icon.purpose,
      icon.src,
    ]);
    assert.deepEqual(purposes, [
      ["192x192", "any", "/assets/images/pwa-192x192.png"],
      ["512x512", "any", "/assets/images/pwa-512x512.png"],
      ["512x512", "maskable", "/assets/images/pwa-512x512.png"],
    ]);
  });

  it("does not advertise favicon-sized icons as PWA install icons", () => {
    for (const icon of manifest.icons) {
      assert.doesNotMatch(icon.src, /favicon-/);
      assert.match(icon.sizes, /^(192|512)x\1$/);
    }
  });

  it("declares a stable application id independent of cache-busted manifest URLs", () => {
    assert.equal(manifest.id, "/");
    assert.equal(manifest.start_url, "/");
  });

  it("forces application/manifest+json for .webmanifest responses", () => {
    assert.match(htaccess, /AddType application\/manifest\+json \.webmanifest/);
    assert.match(
      htaccess,
      /<Files "site\.webmanifest">[\s\S]*Content-Type "application\/manifest\+json"/,
    );
  });
});
