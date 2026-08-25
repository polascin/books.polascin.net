<?php
// includes/footer.php
?>
</main>

<footer class="bg-slate-900 text-slate-400 py-8 text-center mt-auto border-t-4 border-slate-800" role="contentinfo">
    <div class="container mx-auto px-4">
        <p class="font-cinzel text-sm tracking-widest mb-2">EX BIBLIOTHECA Dr. Lubomiri Polascini</p>
        <div class="flex flex-wrap justify-center gap-4 text-xs mt-4 mb-2">
            <a href="privacy.php" class="hover:text-white transition-colors">Privacy Policy</a>
            <span>&bull;</span>
            <a href="terms.php" class="hover:text-white transition-colors">Terms of Use</a>
            <span>&bull;</span>
            <a href="privacy.php#legal-disclaimer" class="hover:text-white transition-colors">Disclaimer</a>
            <span>&bull;</span>
            <span>&copy; 1971-<?php echo date('Y'); ?> MUDr. Ľubomír Polaščín. All rights reserved.</span>
        </div>
        <p class="text-xs mt-2">Site operator: MUDr. Ľubomír Polaščín &middot; <a href="mailto:lubomir@polascin.net"
                class="hover:text-white transition-colors underline">lubomir@polascin.net</a></p>
    </div>
</footer>

<!-- Cookie Consent Banner -->
<div id="cookie-banner"
    class="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 text-white p-4 shadow-2xl z-[100] transform transition-transform duration-500 translate-y-full"
    aria-live="polite" aria-label="Cookie consent banner" role="dialog">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="text-sm text-slate-300">
            <p>This website uses only essential browser storage to remember your cookie preference. No analytics,
                advertising or tracking cookies are set. If optional analytics are introduced in the future, they will
                load only after you choose Accept. Read our <a href="privacy.php"
                    class="text-white underline hover:text-gray-300">Privacy Policy</a>.</p>
        </div>
        <div class="flex gap-3 flex-shrink-0">
            <button id="reject-cookies"
                class="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors text-sm font-cinzel tracking-wider font-semibold"
                aria-label="Reject optional cookies">Reject</button>
            <button id="accept-cookies"
                class="px-4 py-2 bg-paper text-slate-900 rounded hover:bg-white transition-colors text-sm font-cinzel tracking-wider font-semibold"
                aria-label="Accept optional cookies">Accept</button>
        </div>
    </div>
</div>

<!-- Custom Scripts -->
<script src="/assets/js/script.js"></script>
</body>

</html>