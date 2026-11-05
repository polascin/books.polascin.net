const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");

const audit = readFileSync(resolve(__dirname, "../../.audit.md"), "utf8");

describe("audit instructions stay readable", () => {
  it("keeps Recursive self-improvement only once", () => {
    const matches = audit.match(/^## Recursive self-improvement/gm) || [];
    assert.equal(matches.length, 1);
  });

  it("still retains the Beh history through #12", () => {
    for (const n of [1, 6, 10, 12]) {
      assert.match(audit, new RegExp(`^## Beh #${n}\\b`, "m"));
    }
  });
});
