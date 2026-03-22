<?php
require_once __DIR__ . '/includes/functions.php';

// Load metadata
$books = getBooks();

$categories = [];
$languages = [];
foreach ($books as $book) {
    $category = trim((string)($book['category'] ?? ''));
    $language = trim((string)($book['language'] ?? ''));

    if ($category !== '') {
        $categories[$category] = true;
    }

    if ($language !== '') {
        $languages[$language] = true;
    }
}

$categoryList = array_keys($categories);
sort($categoryList, SORT_NATURAL | SORT_FLAG_CASE);

$languageCount = count($languages);
$featuredCategory = $categoryList[0] ?? 'Curated Collection';

$pageTitle = 'Catalog of Books and Publications | Bibliotheca Polascini';
$pageDescription = 'Browse the complete catalog of books, chapters, interviews, academic articles, and literary works by Lubomir Polascin and Walter Kyo Csoelle.';
$pageCanonical = buildAbsoluteUrl('catalog.php');
$pageType = 'website';
$pageImage = getDefaultSeoImage();

$itemListElements = [];
foreach ($books as $index => $book) {
    $bookTitle = trim((string)($book['title'] ?? ''));

    if ($bookTitle === '') {
        continue;
    }

    $bookId = (int)($book['id'] ?? ($index + 1));
    $bookUrl = buildAbsoluteUrl('catalog.php#book-' . $bookId);
    $bookAuthor = trim((string)($book['author'] ?? 'Lubomir Polascin'));
    $bookDescription = excerptText((string)($book['description'] ?? ''), 220);

    $bookEntity = [
        '@type' => 'Book',
        'name' => $bookTitle,
        'url' => $bookUrl,
        'author' => [
            '@type' => 'Person',
            'name' => $bookAuthor,
        ],
    ];

    if ($bookDescription !== '') {
        $bookEntity['description'] = $bookDescription;
    }

    if (!empty($book['isbn'])) {
        $bookEntity['isbn'] = (string)$book['isbn'];
    }

    if (!empty($book['language'])) {
        $bookEntity['inLanguage'] = (string)$book['language'];
    }

    if (!empty($book['year'])) {
        $bookEntity['datePublished'] = (string)$book['year'];
    }

    $itemListElements[] = [
        '@type' => 'ListItem',
        'position' => $index + 1,
        'url' => $bookUrl,
        'item' => $bookEntity,
    ];
}

$pageStructuredData = [
    [
        '@context' => 'https://schema.org',
        '@type' => 'CollectionPage',
        'name' => 'Catalog of Books and Publications',
        'url' => $pageCanonical,
        'description' => $pageDescription,
        'about' => [
            '@type' => 'Person',
            'name' => 'Lubomir Polascin',
            'alternateName' => 'Walter Kyo Csoelle',
            'url' => buildAbsoluteUrl('about.php'),
        ],
        'mainEntity' => [
            '@type' => 'ItemList',
            'numberOfItems' => count($itemListElements),
            'itemListElement' => $itemListElements,
        ],
    ],
];

// Include common header
include __DIR__ . '/includes/header.php';
?>

<!-- CATALOG SECTION -->
<section id="catalog" class="catalog-shell w-full max-w-7xl mx-auto px-4 py-8 md:py-12">
    <div class="catalog-hero paper-texture rounded-[2rem] overflow-hidden border border-slate-300/60 shadow-xl shadow-slate-900/10 mb-8">
        <div class="catalog-hero-grid px-6 py-8 md:px-10 md:py-10">
            <div>
                <div class="catalog-kicker">Private Library Archive</div>
                <h1 class="font-cinzel text-3xl md:text-5xl font-bold tracking-[0.18em] text-slate-900">Catalogus Librorum</h1>
                <p class="catalog-intro font-playfair italic text-slate-700 mt-4">A living shelf of medicine, nephrology, interviews, academic contributions, and fiction shaped by clinical practice and literary work.</p>
                <div class="catalog-chip-row mt-6">
                    <span class="catalog-chip"><?php echo count($books); ?> records</span>
                    <span class="catalog-chip"><?php echo count($categoryList); ?> categories</span>
                    <span class="catalog-chip"><?php echo $languageCount; ?> languages</span>
                    <span class="catalog-chip"><?php echo esc_html($featuredCategory); ?></span>
                </div>
            </div>

            <div class="catalog-stat-panel">
                <div class="catalog-stat-card">
                    <span class="catalog-stat-label">Library Scope</span>
                    <span class="catalog-stat-value"><?php echo count($books); ?></span>
                    <p class="catalog-stat-copy">Books, chapters, papers, and media references presented in one searchable archive.</p>
                </div>
                <div class="catalog-stat-card">
                    <span class="catalog-stat-label">Browse Focus</span>
                    <span class="catalog-stat-value"><?php echo count($categoryList); ?></span>
                    <p class="catalog-stat-copy">Filter by category and jump directly into medical, academic, and literary work.</p>
                </div>
            </div>
        </div>
    </div>

    <div class="catalog-toolbar mb-10">
        <div class="catalog-toolbar-main">
            <div class="relative w-full md:flex-1">
                <input type="text" id="search-books" aria-label="Search catalog by title or author" placeholder="Search by title or author" class="catalog-search-input w-full pl-11 pr-4 py-3 bg-white/90 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-800 transition-shadow">
                <svg aria-hidden="true" class="w-5 h-5 text-slate-400 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>

            <div class="w-full md:w-64">
                <label for="category-filter" class="sr-only">Filter by category</label>
                <select id="category-filter" class="catalog-select w-full px-4 py-3 bg-white/90 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-800 transition-shadow">
                    <option value="">All categories</option>
                    <?php foreach ($categoryList as $category): ?>
                        <option value="<?php echo esc_html($category); ?>"><?php echo esc_html($category); ?></option>
                    <?php endforeach; ?>
                </select>
            </div>
        </div>

        <div class="catalog-toolbar-meta mt-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p class="catalog-summary text-sm text-slate-600"><span id="results-count"><?php echo count($books); ?></span> items currently visible.</p>
            <p class="catalog-summary text-sm text-slate-500">Use the filters to narrow the archive by title, author, or subject area.</p>
        </div>
    </div>

    <?php if (empty($books)): ?>
        <div class="bg-white p-12 text-center rounded-lg shadow-sm border border-gray-200">
            <svg aria-hidden="true" class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            <h3 class="font-cinzel text-xl text-slate-700">No Books Found</h3>
            <p class="font-playfair text-slate-500 mt-2 italic">The catalog is currently empty. Please add books to the data source.</p>
        </div>
    <?php else: ?>
        <div id="no-results" class="hidden bg-white/90 p-10 text-center rounded-[1.5rem] shadow-sm border border-slate-200 mb-8">
            <h3 class="font-cinzel text-xl text-slate-800 tracking-[0.12em]">No Matching Entries</h3>
            <p class="font-playfair italic text-slate-600 mt-3">Try another author, title fragment, or reset the category filter.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8" id="book-grid">
            <?php foreach ($books as $index => $book): ?>
                <?php
                    $bookUrls = [];
                    foreach (['url', 'web_url'] as $urlKey) {
                        $candidateUrl = trim((string)($book[$urlKey] ?? ''));
                        if ($candidateUrl !== '' && !in_array($candidateUrl, $bookUrls, true)) {
                            $bookUrls[] = $candidateUrl;
                        }
                    }

                    if (count($bookUrls) === 0) {
                        $searchTerms = trim((string)(($book['title'] ?? '') . ' ' . ($book['author'] ?? '') . ' book'));
                        if ($searchTerms !== '') {
                            $bookUrls[] = 'https://www.google.com/search?q=' . rawurlencode($searchTerms);
                        }
                    }

                    $bookUrl = $bookUrls[0] ?? '';
                    $bookCategory = trim((string)($book['category'] ?? ''));
                    $bookLanguage = trim((string)($book['language'] ?? ''));
                    $bookIsbn = trim((string)($book['isbn'] ?? ''));
                    $bookYear = trim((string)($book['year'] ?? ''));
                ?>
                 <article id="book-<?php echo (int)($book['id'] ?? ($index + 1)); ?>" class="book-item book-card paper-texture rounded-[1.5rem] overflow-hidden flex flex-col transition-all duration-300 transform" 
                     data-title="<?php echo esc_html($book['title']); ?>" 
                     data-author="<?php echo esc_html($book['author']); ?>"
                     data-category="<?php echo esc_html($book['category'] ?? ''); ?>">
                    
                    <div class="book-card-inner paper-texture h-full flex flex-col border border-transparent hover:border-slate-300 rounded-[1.5rem] overflow-hidden">
                        <div class="catalog-card-header border-b border-slate-300/80 px-6 py-5 md:px-7">
                            <div class="catalog-card-kicker text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">Bibliotheca Polascini</div>
                            <p class="font-playfair italic text-slate-700 text-sm leading-relaxed">Curated record from medical, academic, and literary publications.</p>
                        </div>

                        <div class="catalog-card-content p-6 md:p-7 flex-grow flex flex-col">
                            <div class="book-meta-row mb-4">
                                <?php if ($bookCategory !== ''): ?>
                                    <span class="book-meta-pill"><?php echo esc_html($bookCategory); ?></span>
                                <?php endif; ?>
                                <?php if ($bookLanguage !== ''): ?>
                                    <span class="book-meta-pill"><?php echo esc_html($bookLanguage); ?></span>
                                <?php endif; ?>
                                <?php if ($bookYear !== ''): ?>
                                    <span class="book-meta-pill"><?php echo esc_html($bookYear); ?></span>
                                <?php endif; ?>
                            </div>

                            <div class="catalog-title-block mb-4">
                                <h3 class="font-cinzel font-bold text-xl md:text-2xl text-slate-900 mb-2 leading-tight text-balance">
                                    <?php if (!empty($bookUrl)): ?>
                                        <a href="<?php echo safeUrl($bookUrl); ?>" target="_blank" rel="noopener noreferrer" class="book-title-link hover:underline decoration-slate-600 underline-offset-4">
                                            <?php echo esc_html($book['title']); ?>
                                        </a>
                                    <?php else: ?>
                                        <?php echo esc_html($book['title']); ?>
                                    <?php endif; ?>
                                </h3>
                                <p class="book-author font-playfair italic text-slate-600 text-base"><?php echo esc_html($book['author']); ?></p>
                            </div>
                            
                            <p class="catalog-description text-slate-600 text-sm md:text-[15px] mb-6 flex-grow leading-relaxed">
                                <?php echo esc_html($book['description']); ?>
                            </p>
                            
                            <div class="book-meta-strip mt-auto pt-4 border-t border-slate-300/60 flex flex-wrap gap-3 text-xs font-mono text-slate-500 items-center justify-between">
                                <span class="catalog-isbn">ISBN: <?php echo esc_html($bookIsbn !== '' ? $bookIsbn : 'N/A'); ?></span>
                                <?php if(!empty($bookLanguage)): ?>
                                    <span class="book-lang-chip bg-slate-200/80 px-3 py-1 rounded-full text-slate-600 uppercase tracking-[0.16em] text-[10px] font-semibold"><?php echo esc_html($bookLanguage); ?></span>
                                <?php endif; ?>
                            </div>

                            <?php if (!empty($bookUrls)): ?>
                                <div class="catalog-links pt-5 flex flex-wrap gap-2">
                                    <?php foreach ($bookUrls as $linkIndex => $linkUrl): ?>
                                        <a href="<?php echo safeUrl($linkUrl); ?>" target="_blank" rel="noopener noreferrer" class="catalog-link-button inline-block px-4 py-2 text-xs font-cinzel tracking-[0.18em] border border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-white transition-colors duration-200 rounded-full">
                                            <?php echo $linkIndex === 0 ? 'View Online' : 'Source ' . ($linkIndex + 1); ?>
                                        </a>
                                    <?php endforeach; ?>
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>
                </article>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</section>

<?php
// Include common footer
include __DIR__ . '/includes/footer.php';
?>
