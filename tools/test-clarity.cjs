const vm = require("node:vm");
const fs = require("node:fs");
const assert = require("node:assert/strict");
const code = fs.readFileSync(
  __dirname + "/../assets/js/clarity-consent.js",
  "utf8",
);

function run({ path = "/", query = "", stored = null, external = false } = {}) {
  const elements = [];
  const events = {};
  const docEvents = {};
  const cookies = [];
  let activeElement = null;
  const make = (tag) => ({
    tag,
    focused: false,
    focus() {
      if (activeElement && activeElement !== this) {
        activeElement.focused = false;
      }
      this.focused = true;
      activeElement = this;
    },
    children: [],
    dataset: {},
    attrs: {},
    setAttribute(k, v) {
      this.attrs[k] = v;
      this[k] = v;
    },
    removeAttribute(k) {
      delete this.attrs[k];
      delete this[k];
    },

    appendChild(e) {
      this.children.push(e);
      e.parent = this;
      elements.push(e);
    },
    append(...es) {
      es.forEach((e) => this.appendChild(e));
    },
    addEventListener(k, fn) {
      this[k] = fn;
    },
    remove() {
      this.removed = true;
    },
    contains(node) {
      let cur = node;
      while (cur) {
        if (cur === this) return true;
        cur = cur.parent;
      }
      return false;
    },
    querySelector() {
      return this.children.find((c) => c.tag === "button") || { focus() {} };
    },
    querySelectorAll(sel) {
      const wantLink = String(sel).includes("a[href]");
      const wantButton = String(sel).includes("button");
      return this.children.filter((c) => {
        if (wantLink && c.tag === "a") return true;
        if (wantButton && c.tag === "button") return true;
        return false;
      });
    },
  });
  const head = make("head");
  const body = make("body");
  let value = stored;
  let reloads = 0;
  const document = {
    currentScript: {
      dataset: {
        project: "abc123",
        consent: external ? "external" : "",
        paths: "/,/index.php",
        css: "https://example.com/js/clarity-consent.css?v=42",
      },
      src: "https://example.com/js/clarity-consent.js?v=99",
    },
    head,
    body,
    documentElement: { lang: "sk" },
    createElement: make,
    querySelector() {
      return null;
    },
    addEventListener(k, fn) {
      docEvents[k] = fn;
    },
    removeEventListener(k) {
      delete docEvents[k];
    },
    get cookie() {
      return "";
    },
    set cookie(c) {
      cookies.push(c);
    },
    get activeElement() {
      return activeElement;
    },
  };
  const window = {
    addEventListener(k, fn) {
      events[k] = fn;
    },
  };
  const location = {
    pathname: path,
    search: query,
    hostname: "sub.example.com",
    reload() {
      reloads++;
    },
  };
  vm.runInNewContext(code, {
    document,
    window,
    location,
    localStorage: {
      getItem() {
        return value;
      },
      setItem(k, v) {
        value = v;
      },
    },
    URL,
    URLSearchParams,
    Date,
  });
  return {
    elements,
    events,
    docEvents,
    window,
    body,
    cookies,
    get reloads() {
      return reloads;
    },
    get value() {
      return value;
    },
    scripts: () => elements.filter((e) => e.tag === "script"),
    dialog: () =>
      elements.find((e) => e.tag === "section" && !e.removed) || null,
  };
}

let s = run();
assert.equal(s.scripts().length, 0);
assert.equal(
  s.elements.find((e) => e.tag === "link").href,
  "https://example.com/js/clarity-consent.css?v=42",
);
assert.equal(s.dialog().attrs["aria-modal"], "true");
assert.equal(
  s.elements.find((e) => e.textContent === "Nastavenia analytiky").attrs[
    "aria-haspopup"
  ],
  "dialog",
);
assert.equal(
  s.elements.find((e) => e.textContent === "Nastavenia analytiky").attrs[
    "aria-expanded"
  ],
  "true",
);
let accept = s.elements.find((e) => e.textContent === "Povoliť analytiku");
accept.click();
const settingsBtn = s.elements.find(
  (e) => e.textContent === "Nastavenia analytiky",
);
assert.equal(settingsBtn.attrs["aria-expanded"], "false");
assert.equal(settingsBtn.attrs["aria-controls"], undefined);
assert.equal(s.scripts().length, 1);
assert.equal(s.scripts()[0].src, "https://www.clarity.ms/tag/abc123");
assert.equal(s.body["data-clarity-mask"], "true");
assert.equal(s.window.clarity.q[0][1].ad_Storage, "denied");

s.elements.find((e) => e.textContent === "Nastavenia analytiky").click();
s.elements
  .filter((e) => e.textContent === "Odmietnuť")
  .at(-1)
  .click();
assert.equal(s.reloads, 1);
assert.equal(JSON.parse(s.value).granted, false);
assert.ok(s.cookies.some((c) => c.includes("Domain=.example.com")));

s = run();
s.elements.find((e) => e.textContent === "Odmietnuť").click();
assert.equal(s.scripts().length, 0);

s = run();
s.docEvents.keydown({ key: "Escape", preventDefault() {} });
assert.equal(JSON.parse(s.value).granted, false);
assert.equal(s.scripts().length, 0);

s = run({
  stored: JSON.stringify({ granted: true, expires: Date.now() + 10000 }),
});
assert.equal(s.scripts().length, 1);
s.elements.find((e) => e.textContent === "Nastavenia analytiky").click();
assert.ok(s.dialog());
s.docEvents.keydown({ key: "Escape", preventDefault() {} });
assert.equal(s.dialog(), null);
assert.equal(JSON.parse(s.value).granted, true);
assert.equal(s.reloads, 0);

s = run({
  stored: JSON.stringify({ granted: true, expires: Date.now() + 10000 }),
});
s.elements.find((e) => e.textContent === "Nastavenia analytiky").click();
{
  const dialog = s.dialog();
  const link = dialog.children.find((c) => c.tag === "a");
  const decline = dialog.children.find(
    (c) => c.tag === "button" && c.textContent === "Odmietnuť",
  );
  const allow = dialog.children.find(
    (c) => c.tag === "button" && c.textContent === "Povoliť analytiku",
  );
  let prevented = 0;
  const tab = (shiftKey) =>
    s.docEvents.keydown({
      key: "Tab",
      shiftKey,
      preventDefault() {
        prevented += 1;
      },
    });
  tab(false);
  assert.equal(link.focused, true);
  assert.equal(prevented, 1);
  allow.focus();
  tab(false);
  assert.equal(link.focused, true);
  link.focus();
  tab(true);
  assert.equal(allow.focused, true);
  decline.focus();
  prevented = 0;
  tab(false);
  assert.equal(prevented, 0);
}

for (const path of ["/login.php", "/calculator.php", "/admin.php"])
  assert.equal(run({ path }).elements.length, 0);
assert.equal(run({ query: "?token=private" }).elements.length, 0);
s = run({
  stored: JSON.stringify({ granted: true, expires: Date.now() - 1 }),
});
assert.equal(s.scripts().length, 0);
s = run({
  stored: JSON.stringify({ granted: true, expires: Date.now() + 10000 }),
});
assert.equal(s.scripts().length, 1);
s = run({ external: true });
assert.equal(s.scripts().length, 0);
s.events["site:analytics-consent"]({ detail: true });
s.events["site:analytics-consent"]({ detail: true });
assert.equal(s.scripts().length, 1);
s.events["site:analytics-consent"]({ detail: false });
assert.equal(s.reloads, 1);

console.log(
  "PASS: consent gating, Escape/a11y, project ID, masking, revocation, cookies, expiry, duplicate prevention, private paths and tokens.",
);
