<?php

/**
 * Served as /robots.txt via rewrite so sticky edge caches on the static
 * file path cannot keep an obsolete crawl policy after deploy.
 */
header('Content-Type: text/plain; charset=UTF-8');
header('Cache-Control: no-store, max-age=0');
header('X-Content-Type-Options: nosniff');
header('X-Robots-Tag: noindex');

$path = __DIR__ . '/robots.txt';
if (!is_readable($path)) {
    http_response_code(500);
    echo "# robots.txt unavailable\n";
    exit;
}

readfile($path);
