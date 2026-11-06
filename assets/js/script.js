document.addEventListener("DOMContentLoaded", () => {
  // Search and filter logic
  const searchInput = document.getElementById("search-books");
  const categorySelect = document.getElementById("category-filter");
  const languageSelect = document.getElementById("language-filter");
  const bookCards = document.querySelectorAll(".book-item");
  const resultsCount = document.getElementById("results-count");
  const noResults = document.getElementById("no-results");
  const emptyStatus = document.getElementById("catalog-empty-status");
  const clearFilters = document.getElementById("clear-catalog-filters");
  let wasEmpty = false;

  function normalizeIdentifier(value) {
    // Allow ISBN/ID queries without matching hyphen or space placement.
    return String(value || "")
      .toLowerCase()
      .replace(/[\s-]+/g, "");
  }

  function filterBooks(event) {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";
    const searchIdentifier = normalizeIdentifier(searchTerm);
    const categoryTerm = categorySelect
      ? categorySelect.value.toLowerCase()
      : "";
    const languageTerm = languageSelect
      ? languageSelect.value.toLowerCase()
      : "";
    let visibleCount = 0;

    bookCards.forEach((card) => {
      const title = (card.getAttribute("data-title") || "").toLowerCase();
      const author = (card.getAttribute("data-author") || "").toLowerCase();
      const identifier = normalizeIdentifier(
        card.getAttribute("data-identifier"),
      );
      const category = card.getAttribute("data-category")?.toLowerCase() || "";
      const language = card.getAttribute("data-language")?.toLowerCase() || "";

      const matchesSearch =
        title.includes(searchTerm) ||
        author.includes(searchTerm) ||
        (searchIdentifier !== "" && identifier.includes(searchIdentifier));
      const matchesCategory = categoryTerm === "" || category === categoryTerm;
      const matchesLanguage = languageTerm === "" || language === languageTerm;

      const visible = matchesSearch && matchesCategory && matchesLanguage;
      // Apply each result immediately. Delayed hiding from an older query
      // must never override the current query or leave hidden links focusable.
      card.hidden = !visible;
      if (visible) {
        visibleCount += 1;
      }
    });

    if (resultsCount) {
      resultsCount.textContent = String(visibleCount);
    }

    const showEmpty = visibleCount === 0;
    if (noResults) {
      // Prefer the HTML hidden attribute (same as .book-item cards) over a
      // utility class, so empty-state visibility cannot diverge from CSS.
      noResults.hidden = !showEmpty;
    }
    if (emptyStatus) {
      // Mirror the visual empty panel into the live status region (WCAG 4.1.3).
      emptyStatus.hidden = !showEmpty;
    }
    // When a long grid collapses to zero matches, bring the empty panel into
    // view once (not on every keystroke while already empty).
    if (showEmpty && !wasEmpty && noResults) {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      noResults.scrollIntoView({
        block: "nearest",
        behavior: reduceMotion ? "auto" : "smooth",
      });
    }
    wasEmpty = showEmpty;

    // If filtering hid the card that still holds keyboard focus, restore
    // focus to the control that triggered the filter (select or search)
    // so Tab order is not yanked to search after a category/language change.
    const trapped = document.activeElement?.closest?.(".book-item");
    if (trapped?.hidden) {
      const source = event?.currentTarget;
      const restore =
        source === categorySelect || source === languageSelect
          ? source
          : searchInput;
      restore?.focus({ preventScroll: true });
    }
  }

  function clearCatalogFilters() {
    if (searchInput) {
      searchInput.value = "";
    }
    if (categorySelect) {
      categorySelect.value = "";
    }
    if (languageSelect) {
      languageSelect.value = "";
    }
    filterBooks();
    if (searchInput) {
      searchInput.focus({ preventScroll: true });
    }
  }

  if (searchInput) {
    searchInput.addEventListener("input", filterBooks);
  }
  if (categorySelect) {
    categorySelect.addEventListener("change", filterBooks);
  }
  if (languageSelect) {
    languageSelect.addEventListener("change", filterBooks);
  }
  if (clearFilters) {
    clearFilters.addEventListener("click", clearCatalogFilters);
  }
  if (searchInput || categorySelect || languageSelect) {
    filterBooks();
  }
});
