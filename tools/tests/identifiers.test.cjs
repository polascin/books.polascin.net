const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const { resolve } = require("node:path");
const { test } = require("node:test");

test("catalog distinguishes ISBNs, ASINs, other IDs and missing identifiers", () => {
  const result = execFileSync(
    "php",
    [
      "-r",
      `
    require $argv[1];
    $values = ['9798243848893', '1090110758', 'B0GGJXHQDH', '323586471', 'N/A', '', ' n/a '];
    echo json_encode(array_map('getBookIdentifier', $values));
  `,
      resolve(__dirname, "../../includes/functions.php"),
    ],
    { encoding: "utf8" },
  );
  assert.deepEqual(JSON.parse(result), [
    { label: "ISBN", value: "9798243848893" },
    { label: "ISBN", value: "1090110758" },
    { label: "ASIN", value: "B0GGJXHQDH" },
    { label: "ID", value: "323586471" },
    null,
    null,
    null,
  ]);
});
