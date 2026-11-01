<?php
// includes/footer.php
?>
</main>

<footer class="bg-slate-900 text-slate-400 py-8 text-center mt-auto border-t-4 border-slate-800" role="contentinfo">
    <div class="container mx-auto px-4">
        <p class="font-cinzel text-sm tracking-widest mb-2">EX BIBLIOTHECA Dr. Lubomiri Polascini</p>
        <div class="flex flex-wrap justify-center gap-4 text-xs mt-4 mb-2">
            <a href="/privacy" class="hover:text-white transition-colors">Privacy Policy</a>
            <span>&bull;</span>
            <a href="/terms" class="hover:text-white transition-colors">Terms of Use</a>
            <span>&bull;</span>
            <a href="/privacy#legal-disclaimer" class="hover:text-white transition-colors">Disclaimer</a>
            <span>&bull;</span>
            <span>&copy; 1971-<?php echo date('Y'); ?> MUDr. Ľubomír Polaščín. All rights reserved.</span>
        </div>
        <p class="text-xs mt-2">Site operator: MUDr. Ľubomír Polaščín &middot; IČO: 57646856 &middot; <a href="mailto:lubomir@polascin.net"
                class="hover:text-white transition-colors underline">lubomir@polascin.net</a></p>
    </div>
</footer>

<script src="/assets/js/clarity-consent.js?v=20261101" data-project="z6sxbeabon" data-paths="/,/index.php,/catalog,/catalog.php,/about,/about.php,/privacy,/privacy.php,/terms,/terms.php" data-privacy="/privacy"></script>

<!-- Custom Scripts -->
<script src="<?php echo assetUrl('assets/js/script.js'); ?>"></script>
</body>

</html>