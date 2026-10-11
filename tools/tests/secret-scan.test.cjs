const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { test } = require("node:test");

const workflow = readFileSync(
  resolve(__dirname, "../../.github/workflows/secret-scan.yml"),
  "utf8",
);
const patterns = workflow.match(/          PATTERNS=\([\s\S]*?\n          \)/u)?.[0];
const scan = workflow.slice(workflow.indexOf("          SCAN_DIFF="));
assert.ok(patterns && scan.startsWith("          SCAN_DIFF="));
const script = [
  "set +e",
  'DIFF=$(cat)',
  patterns,
  scan,
].join("\n").replace(/^          /gmu, "");
const bash = process.platform === "win32"
  ? resolve(process.env.ProgramFiles || "C:\\Program Files", "Git", "bin", "bash.exe")
  : "bash";

function check(input, expected, source = script) {
  const result = spawnSync(bash, ["-c", source], {
    input,
    encoding: "utf8",
  });
  assert.ifError(result.error);
  assert.equal(result.status, expected, result.stdout + result.stderr);
}

test("secret scan accepts the historical empty-assignment documentation only", () => {
  const line = readFileSync(resolve(__dirname, "../../README.md"), "utf8")
    .split(/\r?\n/u)
    .find((value) => value.includes("Staged content containing credential patterns"));
  assert.ok(line);
  const originalScanner = script.replace(
    /^SCAN_DIFF=.*$/mu,
    'SCAN_DIFF="$DIFF"',
  );
  check(`+${line}\n`, 1, originalScanner);
  check(`+${line}\n`, 0);
});

test("secret scan still rejects real assignments beside or inside Markdown", () => {
  for (const key of [
    "DB_PASS", "DB_PASSWORD", "DB_USER", "API_KEY", "API_SECRET",
    "SECRET_KEY", "APP_SECRET", "AUTH_TOKEN", "ACCESS_TOKEN", "PRIVATE_KEY",
  ]) {
    const credential = `${key}=synthetic-fixture-value`;
    for (const input of [
      `+${credential}\n`,
      `+\`${credential}\`\n`,
      `+${key}=\`synthetic-fixture-value\`\n`,
      `+\`${key}=\` and ${credential}\n`,
    ]) {
      check(input, 1);
    }
    check(`+\`${key}=\`\n`, 0);
  }
});

test("secret scan preserves provider-key and private-key detection", () => {
  for (const credential of [
    ["BEGIN", "RSA", "PRIVATE KEY"].join(" "),
    "AKIA" + "A".repeat(16),
    "AIza" + "A".repeat(35),
    "ghp_" + "a".repeat(36),
    "github_pat_" + "a".repeat(82),
    "sk_live_" + "a".repeat(20),
    "xoxb-" + "a".repeat(10),
  ]) {
    check(`+${credential}\n`, 1);
  }
});
