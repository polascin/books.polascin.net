<?php
require_once __DIR__ . '/includes/functions.php';

http_response_code(404);

$pageTitle = 'Page Not Found | Bibliotheca Polascini';
$pageDescription = 'The requested page was not found in Bibliotheca Polascini. Return to the home page or browse the catalog.';
$pageCanonical = buildAbsoluteUrl('/');
$pageType = 'website';
$pageImage = getDefaultSeoImage();
$pageRobots = 'noindex, follow';

include __DIR__ . '/includes/header.php';
?>

<section class="w-full max-w-4xl mx-auto px-4 py-16 bg-white my-10 rounded shadow-md border border-gray-200 text-center" aria-labelledby="not-found-heading">
    <p class="font-cinzel text-sm tracking-[0.2em] text-slate-500 uppercase mb-4">Error 404</p>
    <h1 id="not-found-heading" class="font-cinzel text-3xl font-bold text-slate-800 mb-6">Page Not Found</h1>
    <p class="font-playfair italic text-slate-600 text-lg mb-10 max-w-2xl mx-auto">The page you requested is not in this library. It may have moved, or the address may be incomplete.</p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <a href="/" class="inline-block border border-slate-800 text-slate-800 px-8 py-3 font-cinzel tracking-widest text-sm hover:bg-slate-800 hover:text-white transition-all duration-300">Home</a>
        <a href="/catalog" class="inline-block border border-slate-800 text-slate-800 px-8 py-3 font-cinzel tracking-widest text-sm hover:bg-slate-800 hover:text-white transition-all duration-300">Catalog</a>
    </div>
</section>

<?php
include __DIR__ . '/includes/footer.php';
