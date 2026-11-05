<?php

/**
 * Served as /robots.txt via rewrite so sticky edge caches on the static
 * file path cannot keep an obsolete crawl policy after deploy.
 */
header('Content-Type: text/plain; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('X-Robots-Tag: noindex');
// Cache-Control comes only from .htaccess <Files "robots.php"> so clients
// do not receive a duplicated Cache-Control header line.

$path = __DIR__ . '/robots.txt';
if (!is_readable($path)) {
    http_response_code(500);
    echo "# robots.txt unavailable\n";
    exit;
}

readfile($path);
