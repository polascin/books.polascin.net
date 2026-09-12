const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { test } = require("node:test");
const vm = require("node:vm");

const source = readFileSync(
  resolve(__dirname, "../../assets/js/script.js"),
  "utf8",
);

function catalog(reducedMotion) {
  const timers = [];
  const cards = [
    {
      title: "Vital Algorithm",
      author: "Walter",
      category: "Medical Thriller",
    },
    {
      title: "Pulse Of The Body",
      author: "Walter",
      category: "Medical Fiction",
    },
  ].map((data) => ({
    hidden: false,
    style: {},
    getAttribute: (key) => data[key.replace("data-", "")],
  }));
  const input = () => ({
    value: "",
    addEventListener(event, listener) {
      this[event] = listener;
    },
  });
  const elements = {
    "search-books": input(),
    "category-filter": input(),
    "results-count": { textContent: "" },
    "no-results": {
      classList: {
        toggle(name, hidden) {
          this.hidden = hidden;
        },
      },
    },
  };
  vm.runInNewContext(source, {
    document: {
      addEventListener: (event, listener) => listener(),
      getElementById: (id) => elements[id] || null,
      querySelectorAll: () => cards,
    },
    window: { matchMedia: () => ({ matches: reducedMotion }) },
    setTimeout: (callback, delay) => timers.push({ callback, delay }),
  });
  return {
    cards,
    elements,
    search(value) {
      elements["search-books"].value = value;
      elements["search-books"].input();
    },
    category(value) {
      elements["category-filter"].value = value;
      elements["category-filter"].change();
    },
    flush() {
      timers
        .splice(0)
        .sort((a, b) => a.delay - b.delay)
        .forEach((t) => t.callback());
    },
  };
}

for (const reducedMotion of [false, true]) {
  test(`rapid reset cannot hide current results (reduced motion: ${reducedMotion})`, () => {
    const c = catalog(reducedMotion);
    c.flush();
    c.search("missing");
    c.search("");
    c.flush();
    assert.equal(c.elements["results-count"].textContent, "2");
    assert.equal(
      c.cards.filter((card) => !card.hidden && card.style.display !== "none")
        .length,
      2,
    );
  });
}

test("combined filters hide unmatched cards immediately and update empty state", () => {
  const c = catalog(false);
  c.search("VITAL");
  c.category("Medical Fiction");
  assert.ok(c.cards.every((card) => card.hidden));
  assert.equal(c.elements["results-count"].textContent, "0");
  assert.equal(c.elements["no-results"].classList.hidden, false);
  c.search("walter");
  assert.deepEqual(
    c.cards.map((card) => card.hidden),
    [true, false],
  );
  assert.equal(c.elements["results-count"].textContent, "1");
  assert.equal(c.elements["no-results"].classList.hidden, true);
});
