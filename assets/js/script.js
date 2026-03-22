document.addEventListener('DOMContentLoaded', () => {
    // Search and filter logic
    const searchInput = document.getElementById('search-books');
    const categorySelect = document.getElementById('category-filter');
    const bookCards = document.querySelectorAll('.book-item');

    function filterBooks() {
        if(!searchInput) return;
        
        const searchTerm = searchInput.value.toLowerCase();
        const categoryTerm = categorySelect ? categorySelect.value.toLowerCase() : '';

        bookCards.forEach(card => {
            const title = card.getAttribute('data-title').toLowerCase();
            const author = card.getAttribute('data-author').toLowerCase();
            const category = card.getAttribute('data-category')?.toLowerCase() || '';

            const matchesSearch = title.includes(searchTerm) || author.includes(searchTerm);
            const matchesCategory = categoryTerm === '' || category === categoryTerm;

            if (matchesSearch && matchesCategory) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300); // Wait for transition
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterBooks);
    }
    if (categorySelect) {
        categorySelect.addEventListener('change', filterBooks);
    }

    // Cookie Consent Logic
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const rejectBtn = document.getElementById('reject-cookies');

    if (cookieBanner && acceptBtn && rejectBtn) {
        if (!localStorage.getItem('cookieConsent')) {
            // Slight delay to animate banner upwards
            setTimeout(() => {
                cookieBanner.classList.remove('translate-y-full');
            }, 1000);
        }

        const setConsent = (status) => {
            localStorage.setItem('cookieConsent', status);
            cookieBanner.classList.add('translate-y-full');
            // If strictly enforcing cookies, initialize scripts conditionally here based on 'status'
            if (status === 'accepted') {
                console.log("Consent granted via banner.");
                // Initialize analytics trackers here if implemented
            }
        };

        acceptBtn.addEventListener('click', () => setConsent('accepted'));
        rejectBtn.addEventListener('click', () => setConsent('rejected'));
    }
});
