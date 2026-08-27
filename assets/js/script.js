document.addEventListener("DOMContentLoaded", () => {
  // Visitors who asked their OS to reduce motion get the same states without
  // the transitions, so nothing animates and nothing waits for an animation.
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const motionDelay = (ms) => (reduceMotion ? 0 : ms);

  // localStorage throws instead of returning null in some privacy modes, so
  // every access is guarded - a failure must not break search and filtering.
  const storage = {
    get(key) {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch {
        /* storage unavailable - the banner simply reappears next visit */
      }
    },
  };

  // Search and filter logic
  const searchInput = document.getElementById("search-books");
  const categorySelect = document.getElementById("category-filter");
  const bookCards = document.querySelectorAll(".book-item");
  const resultsCount = document.getElementById("results-count");
  const noResults = document.getElementById("no-results");

  function filterBooks() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";
    const categoryTerm = categorySelect
      ? categorySelect.value.toLowerCase()
      : "";
    let visibleCount = 0;

    bookCards.forEach((card) => {
      const title = (card.getAttribute("data-title") || "").toLowerCase();
      const author = (card.getAttribute("data-author") || "").toLowerCase();
      const category = card.getAttribute("data-category")?.toLowerCase() || "";

      const matchesSearch =
        title.includes(searchTerm) || author.includes(searchTerm);
      const matchesCategory = categoryTerm === "" || category === categoryTerm;

      if (matchesSearch && matchesCategory) {
        visibleCount += 1;
        card.style.display = "";
        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, motionDelay(50));
      } else {
        card.style.opacity = "0";
        card.style.transform = "translateY(10px)";
        setTimeout(() => {
          card.style.display = "none";
        }, motionDelay(300)); // Wait for transition
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
  if (searchInput || categorySelect) {
    filterBooks();
  }

  // Cookie Consent Logic
  const cookieBanner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("accept-cookies");
  const rejectBtn = document.getElementById("reject-cookies");

  if (cookieBanner && acceptBtn && rejectBtn) {
    if (!storage.get("cookieConsent")) {
      // Slight delay to animate banner upwards. The hidden attribute has to go
      // first, then the transform on the next frame, or there is nothing
      // rendered for the transition to start from.
      setTimeout(() => {
        cookieBanner.hidden = false;
        requestAnimationFrame(() => {
          cookieBanner.classList.remove("translate-y-full");
        });
      }, motionDelay(1000));
    }

    const setConsent = (status) => {
      storage.set("cookieConsent", status);
      cookieBanner.classList.add("translate-y-full");
      // Back to hidden once it has slid away: an off-screen banner that is
      // still in the DOM keeps its buttons in the tab order and in the
      // screen-reader tree.
      setTimeout(() => {
        cookieBanner.hidden = true;
      }, motionDelay(500));
      // If strictly enforcing cookies, initialize scripts conditionally here based on 'status'
      if (status === "accepted") {
        // Initialize analytics trackers here if implemented
      }
    };

    acceptBtn.addEventListener("click", () => setConsent("accepted"));
    rejectBtn.addEventListener("click", () => setConsent("rejected"));
  }
});
