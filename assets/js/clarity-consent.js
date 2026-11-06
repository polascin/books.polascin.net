/* Clarity is loaded only after explicit analytics consent on public pages. */
(() => {
  "use strict";
  const config = document.currentScript;
  if (!config || !/^[a-z0-9]+$/.test(config.dataset.project || "")) return;
  const allowed = (config.dataset.paths || "/,/index.php").split(",");
  if (!allowed.includes(location.pathname)) return;
  // Skip consent UI when the URL may carry secrets (session replay risk).
  // Allow ordinary marketing/nav params such as utm_*, gclid, lang, page.
  const blockedParam =
    /^(?:token|key|secret|password|passwd|auth|session|sid|api[_-]?key|access[_-]?token|refresh[_-]?token|id_token|client_secret)$/i;
  if (
    [...new URLSearchParams(location.search).keys()].some((k) =>
      blockedParam.test(k),
    )
  )
    return;
  const project = config.dataset.project;
  const external = config.dataset.consent === "external";
  const key = "clarity-consent-v1-" + project;
  const sk = document.documentElement.lang.startsWith("sk");
  let loaded = false;
  let banner;
  let backdrop;
  let escapeMode = null;
  const read = () => {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch {
      return null;
    }
  };
  const save = (granted) => {
    try {
      localStorage.setItem(
        key,
        JSON.stringify({ granted, expires: Date.now() + 180 * 86400000 }),
      );
    } catch {
      /* Consent still applies for this page. */
    }
  };
  function dialogFocusables() {
    return banner
      ? [...banner.querySelectorAll("a[href], button:not([disabled])")]
      : [];
  }
  function onKeydown(e) {
    if (!banner) return;
    if (e.key === "Escape") {
      e.preventDefault();
      if (escapeMode === "decline") apply(false);
      else dismiss();
      return;
    }
    if (e.key !== "Tab") return;
    const items = dialogFocusables();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    const inside = banner.contains(active);
    if (e.shiftKey) {
      if (!inside || active === first) {
        e.preventDefault();
        last.focus();
      }
    } else if (!inside || active === last) {
      e.preventDefault();
      first.focus();
    }
  }
  function setScrollLock(on) {
    // Keep the page behind the modal from scrolling on touch / wheel.
    const value = on ? "hidden" : "";
    document.documentElement.style.overflow = value;
    document.body.style.overflow = value;
  }
  function closeDialogShell() {
    if (backdrop) {
      backdrop.remove();
      backdrop = null;
    }
    if (banner) {
      banner.remove();
      banner = null;
    }
    escapeMode = null;
    setExpanded(false);
    setScrollLock(false);
    document.removeEventListener("keydown", onKeydown);
  }
  function dismiss() {
    if (!banner) return;
    closeDialogShell();
    settings.focus();
  }
  function apply(granted, persist = true) {
    if (persist && !external) save(granted);
    if (granted) {
      if (!window.clarity)
        window.clarity = function () {
          (window.clarity.q = window.clarity.q || []).push(arguments);
        };
      window.clarity("consentv2", {
        analytics_Storage: "granted",
        ad_Storage: "denied",
      });
      if (!loaded) {
        // Mask all page text, including any content entered by a visitor.
        document.body.setAttribute("data-clarity-mask", "true");
        const script = document.createElement("script");
        script.async = true;
        script.src = "https://www.clarity.ms/tag/" + project;
        document.head.appendChild(script);
        loaded = true;
      }
    } else {
      if (window.clarity)
        window.clarity("consentv2", {
          analytics_Storage: "denied",
          ad_Storage: "denied",
        });
      for (const name of ["_clck", "_clsk"]) {
        document.cookie = name + "=; Max-Age=0; Path=/; SameSite=Lax";
        const parts = location.hostname.split(".");
        while (parts.length > 1) {
          document.cookie =
            name +
            "=; Max-Age=0; Path=/; Domain=." +
            parts.join(".") +
            "; SameSite=Lax";
          parts.shift();
        }
      }
      // Stop the already loaded SDK, including its cookieless mode.
      if (loaded && persist) location.reload();
    }
    if (banner) {
      closeDialogShell();
      // Return keyboard focus to the footer control that owns the dialog.
      settings.focus();
    }
  }
  if (external) {
    window.addEventListener("site:analytics-consent", (e) =>
      apply(e.detail === true),
    );
    return;
  }
  const css = document.createElement("link");
  css.rel = "stylesheet";
  // Prefer a server-versioned CSS URL so long-lived asset caches still refresh.
  css.href =
    config.dataset.css || new URL("clarity-consent.css", config.src).href;
  document.head.appendChild(css);
  const settings = document.createElement("button");
  settings.type = "button";
  settings.className = "clarity-settings";
  settings.setAttribute("aria-haspopup", "dialog");
  settings.setAttribute("aria-expanded", "false");
  settings.textContent = sk ? "Nastavenia analytiky" : "Analytics settings";
  settings.addEventListener("click", () => show(true));
  (document.querySelector("footer") || document.body).appendChild(settings);
  function setExpanded(open) {
    settings.setAttribute("aria-expanded", open ? "true" : "false");
    if (!open) settings.removeAttribute("aria-controls");
  }
  function show(fromSettings = false) {
    if (banner) {
      if (fromSettings) banner.querySelector("button").focus();
      return;
    }
    banner = document.createElement("section");
    banner.className = "clarity-consent";
    banner.id = "clarity-consent-dialog";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-modal", "true");
    banner.setAttribute("aria-labelledby", "clarity-consent-title");
    settings.setAttribute("aria-controls", banner.id);
    setExpanded(true);
    const title = document.createElement("h2");
    title.id = "clarity-consent-title";
    title.textContent = sk ? "Voliteľná analytika" : "Optional analytics";
    const text = document.createElement("p");
    text.textContent = sk
      ? "S vaším súhlasom používame Microsoft Clarity na meranie návštevnosti, kliknutí, posúvania a záznamov používania verejných stránok. Text je maskovaný. Bez súhlasu sa Clarity nenačíta. Reklamný súhlas zostáva vypnutý. Voľbu môžete kedykoľvek zmeniť v nastaveniach analytiky."
      : "With your consent, we use Microsoft Clarity for visits, clicks, scrolling and session recordings on public pages. Text is masked. Clarity does not load without consent. Advertising consent stays denied. You can change your choice in Analytics settings at any time.";
    const link = document.createElement("a");
    link.href = config.dataset.privacy || "/privacy.php";
    link.textContent = sk ? "Ochrana súkromia" : "Privacy policy";
    const decline = document.createElement("button");
    decline.type = "button";
    decline.textContent = sk ? "Odmietnuť" : "Decline";
    decline.addEventListener("click", () => apply(false));
    const accept = document.createElement("button");
    accept.type = "button";
    accept.textContent = sk ? "Povoliť analytiku" : "Allow analytics";
    accept.addEventListener("click", () => apply(true));
    banner.append(title, text, link, decline, accept);
    backdrop = document.createElement("div");
    backdrop.className = "clarity-consent-backdrop";
    backdrop.setAttribute("aria-hidden", "true");
    backdrop.addEventListener("click", () => {
      if (escapeMode === "decline") apply(false);
      else dismiss();
    });
    document.body.append(backdrop, banner);
    setScrollLock(true);
    // Backdrop blocks the page, so keyboard focus must enter the dialog.
    // Escape still declines on first prompt and only dismisses from settings.
    escapeMode = fromSettings ? "dismiss" : "decline";
    document.addEventListener("keydown", onKeydown);
    decline.focus();
  }
  const stored = read();
  if (
    stored &&
    stored.expires > Date.now() &&
    typeof stored.granted === "boolean"
  )
    apply(stored.granted, false);
  else show();
  window.addEventListener("storage", (e) => {
    if (e.key !== key) return;
    const value = read();
    if (!value || !value.granted || value.expires <= Date.now()) {
      if (loaded) location.reload();
    } else apply(true, false);
  });
})();
