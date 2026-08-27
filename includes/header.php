<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php
    require_once __DIR__ . '/functions.php';

    $defaultTitle = 'Books by Dr. Lubomir Polascin | Bibliotheca Polascini';
    $defaultDescription = 'Discover books, chapters, academic publications, and literary works by Dr. Lubomir Polascin, including titles published as Walter Kyo Csoelle.';
    // SCRIPT_NAME, not PHP_SELF: with PATH_INFO enabled, a request for
    // /index.php/anything makes PHP_SELF carry the visitor's own string, which
    // would end up inside <link rel="canonical"> and og:url.
    $currentScript = basename($_SERVER['SCRIPT_NAME'] ?? 'index.php');

    $pageTitle = $pageTitle ?? $defaultTitle;
    $pageDescription = $pageDescription ?? $defaultDescription;
    $pageCanonical = $pageCanonical ?? buildAbsoluteUrl($currentScript === 'index.php' ? '/' : $currentScript);
    $pageImage = $pageImage ?? getDefaultSeoImage();
    $pageRobots = $pageRobots ?? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
    $pageType = $pageType ?? 'website';
    $pageStructuredData = $pageStructuredData ?? [];

    if (!empty($pageStructuredData) && (!is_array($pageStructuredData) || array_keys($pageStructuredData) !== range(0, count($pageStructuredData) - 1))) {
        $pageStructuredData = [$pageStructuredData];
    }
    ?>
    <title><?php echo esc_html($pageTitle); ?></title>
    <meta name="description" content="<?php echo esc_html($pageDescription); ?>">
    <meta name="robots" content="<?php echo esc_html($pageRobots); ?>">
    <meta name="author" content="Lubomir Polascin">
    <meta name="theme-color" content="#0f172a">
    <link rel="icon" type="image/svg+xml" href="/assets/images/favicon.svg">
    <link rel="icon" type="image/png" sizes="32x32" href="/assets/images/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/assets/images/favicon-16x16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/assets/images/apple-touch-icon.png">
    <link rel="shortcut icon" href="/favicon.ico">
    <link rel="manifest" href="/site.webmanifest">
    <link rel="canonical" href="<?php echo esc_html($pageCanonical); ?>">

    <meta property="og:site_name" content="Bibliotheca Polascini">
    <meta property="og:type" content="<?php echo esc_html($pageType); ?>">
    <meta property="og:title" content="<?php echo esc_html($pageTitle); ?>">
    <meta property="og:description" content="<?php echo esc_html($pageDescription); ?>">
    <meta property="og:url" content="<?php echo esc_html($pageCanonical); ?>">
    <meta property="og:image" content="<?php echo esc_html($pageImage); ?>">
    <meta property="og:locale" content="en_US">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?php echo esc_html($pageTitle); ?>">
    <meta name="twitter:description" content="<?php echo esc_html($pageDescription); ?>">
    <meta name="twitter:image" content="<?php echo esc_html($pageImage); ?>">
    <meta name="twitter:url" content="<?php echo esc_html($pageCanonical); ?>">
    
    <!-- Styles: self-hosted fonts and a locally built Tailwind bundle.
         No third-party CDN is contacted, so no visitor IP is disclosed to
         Google Fonts or cdn.tailwindcss.com. Order matters: Tailwind's
         preflight/utilities first, then fonts, then our own overrides.
         Rebuild with: npm run build:css  (fonts: npm run fonts) -->
    <link rel="stylesheet" href="<?php echo assetUrl('assets/css/tailwind.css'); ?>">
    <link rel="stylesheet" href="<?php echo assetUrl('assets/css/fonts.css'); ?>">
    <link rel="stylesheet" href="<?php echo assetUrl('assets/css/style.css'); ?>">

    <?php foreach ($pageStructuredData as $structuredData): ?>
        <?php if (!empty($structuredData)): ?>
            <?php // JSON_HEX_TAG escapes < and >, so a book title containing
                  // "</script>" cannot close this element and inject markup. ?>
            <script type="application/ld+json"><?php echo json_encode($structuredData, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_PRETTY_PRINT); ?></script>
        <?php endif; ?>
    <?php endforeach; ?>
</head>
<body class="bg-gray-200 min-h-screen text-slate-800 antialiased flex flex-col font-sans">

    <a href="#main-content" class="skip-link">Skip to main content</a>

    <!-- Main Header Area - Could contain navigation if needed later -->
    <header class="w-full bg-slate-900 text-paper py-4 shadow-md sticky top-0 z-50">
        <div class="container mx-auto px-4 flex justify-between items-center">
            <a href="index.php" class="text-xl font-cinzel tracking-widest hover:text-white transition-colors">Bibliotheca Polascini</a>
            <nav aria-label="Main Navigation">
                <ul class="flex space-x-6">
                    <li><a href="index.php" class="hover:text-gray-300 transition-colors font-playfair italic">Home</a></li>
                    <li><a href="catalog.php" class="hover:text-gray-300 transition-colors font-playfair italic">Catalog</a></li>
                    <li><a href="about.php" class="hover:text-gray-300 transition-colors font-playfair italic">About</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main id="main-content" tabindex="-1" class="flex-grow flex flex-col items-center pt-10 pb-20 w-full relative">
