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
      identifier: "B0HM2VHKFV",
      category: "Medical Thriller",
      language: "English",
    },
    {
      title: "Pulse Of The Body",
      author: "Walter",
      identifier: "9781234567890",
      category: "Medical Fiction",
      language: "German",
    },
    {
      title: "SK Nefro: Dimostrato, probabile, aperto",
      author: "Lubomir",
      identifier: "NEFRO-SKNB-1",
      category: "Digital Product",
      language: "Italian",
    },
  ].map((data) => ({
    hidden: false,
    style: {},
    getAttribute: (key) => data[key.replace("data-", "")],
  }));
  const input = () => ({
    value: "",
    focused: false,
    addEventListener(event, listener) {
      this[event] = listener;
    },
    focus() {
      this.focused = true;
    },
  });
  const elements = {
    "search-books": input(),
    "category-filter": input(),
    "language-filter": input(),
    "results-count": { textContent: "" },
    "no-results": {
      hidden: true,
      scrolled: null,
      scrollIntoView(opts) {
        this.scrolled = opts;
      },
    },
    "catalog-empty-status": {
      hidden: true,
    },
    "clear-catalog-filters": {
      addEventListener(event, listener) {
        this[event] = listener;
      },
    },
  };
  const document = {
    activeElement: null,
    addEventListener: (event, listener) => listener(),
    getElementById: (id) => elements[id] || null,
    querySelectorAll: () => cards,
  };
  vm.runInNewContext(source, {
    document,
    window: {
      matchMedia: (query) => ({
        matches: String(query).includes("prefers-reduced-motion")
          ? reducedMotion
          : false,
      }),
    },
    setTimeout: (callback, delay) => timers.push({ callback, delay }),
  });
  return {
    cards,
    elements,
    setActiveInCard(index) {
      document.activeElement = {
        closest(sel) {
          return sel === ".book-item" ? cards[index] : null;
        },
      };
    },
    search(value) {
      elements["search-books"].value = value;
      elements["search-books"].focused = false;
      elements["search-books"].input({
        currentTarget: elements["search-books"],
      });
    },
    category(value) {
      const el = elements["category-filter"];
      el.value = value;
      el.focused = false;
      el.change({ currentTarget: el });
    },
    language(value) {
      const el = elements["language-filter"];
      el.value = value;
      el.focused = false;
      el.change({ currentTarget: el });
    },
    clear() {
      elements["clear-catalog-filters"].click();
    },
    resetFocusFlags() {
      elements["search-books"].focused = false;
      elements["category-filter"].focused = false;
      elements["language-filter"].focused = false;
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
    assert.equal(c.elements["results-count"].textContent, "3");
    assert.equal(
      c.cards.filter((card) => !card.hidden && card.style.display !== "none")
        .length,
      3,
    );
  });
}

test("combined filters hide unmatched cards immediately and update empty state", () => {
  const c = catalog(false);
  c.search("VITAL");
  c.category("Medical Fiction");
  assert.ok(c.cards.every((card) => card.hidden));
  assert.equal(c.elements["results-count"].textContent, "0");
  assert.equal(c.elements["no-results"].hidden, false);
  assert.equal(c.elements["catalog-empty-status"].hidden, false);
  c.search("walter");
  assert.deepEqual(
    c.cards.map((card) => card.hidden),
    [true, false, true],
  );
  assert.equal(c.elements["results-count"].textContent, "1");
  assert.equal(c.elements["no-results"].hidden, true);
  assert.equal(c.elements["catalog-empty-status"].hidden, true);
});

test("language filter isolates German records and composes with search", () => {
  const c = catalog(false);
  c.language("German");
  assert.deepEqual(
    c.cards.map((card) => card.hidden),
    [true, false, true],
  );
  assert.equal(c.elements["results-count"].textContent, "1");

  c.search("vital");
  assert.ok(c.cards.every((card) => card.hidden));
  assert.equal(c.elements["results-count"].textContent, "0");
  assert.equal(c.elements["no-results"].hidden, false);
});

test("language filter supports Italian records", () => {
  const c = catalog(false);
  c.language("Italian");
  assert.deepEqual(
    c.cards.map((card) => card.hidden),
    [true, true, false],
  );
  assert.equal(c.elements["results-count"].textContent, "1");
});

test("moves keyboard focus out of a card that filtering just hid", () => {
  const c = catalog(false);
  c.setActiveInCard(0);
  c.search("missing-title");
  assert.equal(c.cards[0].hidden, true);
  assert.equal(c.elements["search-books"].focused, true);
});

test("returns focus to the select that hid the focused card", () => {
  const c = catalog(false);
  c.setActiveInCard(0);
  c.resetFocusFlags();
  c.category("Medical Fiction");
  assert.equal(c.cards[0].hidden, true);
  assert.equal(c.elements["category-filter"].focused, true);
  assert.equal(c.elements["search-books"].focused, false);

  c.setActiveInCard(1);
  c.resetFocusFlags();
  c.language("Italian");
  assert.equal(c.cards[1].hidden, true);
  assert.equal(c.elements["language-filter"].focused, true);
  assert.equal(c.elements["search-books"].focused, false);
});

test("keeps focus when the focused card stays visible", () => {
  const c = catalog(false);
  c.setActiveInCard(0);
  c.search("vital");
  assert.equal(c.cards[0].hidden, false);
  assert.equal(c.elements["search-books"].focused, false);
});

test("scrolls the empty panel into view when filters first yield zero", () => {
  const c = catalog(false);
  c.search("missing-title");
  assert.equal(c.elements["no-results"].scrolled.block, "nearest");
  assert.equal(c.elements["no-results"].scrolled.behavior, "smooth");
  c.elements["no-results"].scrolled = null;
  c.search("still-missing");
  assert.equal(c.elements["no-results"].scrolled, null);
});

test("uses instant empty-panel scroll when reduced motion is preferred", () => {
  const c = catalog(true);
  c.search("missing-title");
  assert.equal(c.elements["no-results"].scrolled.block, "nearest");
  assert.equal(c.elements["no-results"].scrolled.behavior, "auto");
});

test("search matches ISBN, ASIN, and catalog ID values", () => {
  const c = catalog(false);
  c.search("b0hm2vhkfv");
  assert.deepEqual(
    c.cards.map((card) => card.hidden),
    [false, true, true],
  );
  assert.equal(c.elements["results-count"].textContent, "1");

  c.search("nefro-sknb");
  assert.deepEqual(
    c.cards.map((card) => card.hidden),
    [true, true, false],
  );
  assert.equal(c.elements["results-count"].textContent, "1");
});

test("identifier search ignores hyphen and space differences", () => {
  const c = catalog(false);
  c.search("nefrosknb1");
  assert.deepEqual(
    c.cards.map((card) => card.hidden),
    [true, true, false],
  );
  assert.equal(c.elements["results-count"].textContent, "1");

  c.search("978 1234-567890");
  assert.deepEqual(
    c.cards.map((card) => card.hidden),
    [true, false, true],
  );
  assert.equal(c.elements["results-count"].textContent, "1");
});

test("clear control restores all filters and returns focus to search", () => {
  const c = catalog(false);
  c.search("missing-title");
  c.category("Medical Fiction");
  c.language("German");
  assert.equal(c.elements["results-count"].textContent, "0");
  assert.equal(c.elements["no-results"].hidden, false);

  c.clear();
  assert.equal(c.elements["search-books"].value, "");
  assert.equal(c.elements["category-filter"].value, "");
  assert.equal(c.elements["language-filter"].value, "");
  assert.equal(c.elements["results-count"].textContent, "3");
  assert.ok(c.cards.every((card) => !card.hidden));
  assert.equal(c.elements["no-results"].hidden, true);
  assert.equal(c.elements["search-books"].focused, true);
});
