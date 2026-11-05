document.addEventListener("DOMContentLoaded", () => {
  // Search and filter logic
  const searchInput = document.getElementById("search-books");
  const categorySelect = document.getElementById("category-filter");
  const languageSelect = document.getElementById("language-filter");
  const bookCards = document.querySelectorAll(".book-item");
  const resultsCount = document.getElementById("results-count");
  const noResults = document.getElementById("no-results");

  function filterBooks() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";
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
      const category = card.getAttribute("data-category")?.toLowerCase() || "";
      const language = card.getAttribute("data-language")?.toLowerCase() || "";

      const matchesSearch =
        title.includes(searchTerm) || author.includes(searchTerm);
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

    if (noResults) {
      noResults.classList.toggle("hidden", visibleCount !== 0);
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
  if (searchInput || categorySelect || languageSelect) {
    filterBooks();
  }
});
