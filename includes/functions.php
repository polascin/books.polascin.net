<?php

// functions.php - Helper functions and database connection for the application

/**
 * Basic .env loader since we aren't using composer packages yet
 */
function loadEnv($path) {
    if (!file_exists($path)) {
        return false;
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (strpos($line, '=') !== false) {
            list($name, $value) = explode('=', $line, 2);
            // Trim surrounding whitespace first: a trailing space or a stray
            // CR from a CRLF file would otherwise become part of the password.
            $value = trim($value);
            // Remove one matching pair of quotes, not any quote character —
            // a password that legitimately ends in " must survive intact.
            if (strlen($value) >= 2 && $value[0] === $value[strlen($value) - 1] && ($value[0] === '"' || $value[0] === "'")) {
                $value = substr($value, 1, -1);
            }
            $_ENV[trim($name)] = $value;
        }
    }
    return true;
}

/**
 * Loads .env at most once per request.
 */
function loadEnvOnce() {
    static $loaded = false;
    if (!$loaded) {
        $loaded = true;
        loadEnv(__DIR__ . '/../.env');
    }
}

/**
 * Reads a configuration value from .env, falling back to $default.
 */
function envValue($key, $default = '') {
    loadEnvOnce();
    return $_ENV[$key] ?? $default;
}

/**
 * Decides whether PHP errors are rendered to the visitor.
 *
 * Displayed errors leak absolute server paths and stack traces, so display is
 * off unless APP_DEBUG is explicitly enabled in .env. Errors are always
 * written to the server log regardless.
 */
function configureErrorReporting() {
    $debug = filter_var(envValue('APP_DEBUG', 'false'), FILTER_VALIDATE_BOOLEAN);
    ini_set('display_errors', $debug ? '1' : '0');
    ini_set('display_startup_errors', $debug ? '1' : '0');
    ini_set('log_errors', '1');
    error_reporting(E_ALL);
}

configureErrorReporting();

/**
 * Get PDO Database Connection
 */
function getDbConnection() {
    // One attempt per request: when the host is down, retrying would multiply
    // the connect timeout for every caller.
    static $pdo = null;
    static $attempted = false;
    if ($attempted) {
        return $pdo;
    }
    $attempted = true;

    $host    = envValue('DB_HOST', 'localhost');
    $port    = envValue('DB_PORT', '3306');
    $db      = envValue('DB_NAME');
    $user    = envValue('DB_USER');
    $pass    = envValue('DB_PASS');
    $charset = 'utf8mb4';

    $dsn = "mysql:host=$host;port=$port;dbname=$db;charset=$charset";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
        // Fail fast when the database host is unreachable. Without this the
        // driver blocks until PHP's max_execution_time kills the request, so
        // the JSON fallback in getBooks() never runs and the page dies with a
        // fatal error instead of degrading gracefully.
        PDO::ATTR_TIMEOUT            => 3,
    ];

    try {
        $pdo = new PDO($dsn, $user, $pass, $options);
    } catch (\Throwable $e) {
        error_log('DB connection failed: ' . $e->getMessage());
        $pdo = null;
    }

    return $pdo;
}

/**
 * Load books from MariaDB database.
 * Falls back to JSON if database connection fails or table doesn't exist.
 *
 * @return array Array of books
 */
function getBooks() {
    $pdo = getDbConnection();

    if ($pdo) {
        try {
            $stmt = $pdo->query('SELECT * FROM books ORDER BY id ASC');
            return $stmt->fetchAll();
        } catch (\PDOException $e) {
            // Table might not exist yet, fallback to JSON
        }
    }

    // Fallback to JSON file if db query fails
    $filepath = __DIR__ . '/../data/books.json';
    if (!file_exists($filepath)) {
        return [];
    }

    $jsonData = file_get_contents($filepath);
    $data = json_decode($jsonData, true);

    return $data ? $data : [];
}

/**
 * Return the canonical site URL.
 */
function getSiteUrl() {
    return rtrim(envValue('SITE_URL', 'https://books.polascin.net'), '/');
}

/**
 * Build an absolute URL from a relative site path.
 */
function buildAbsoluteUrl($path = '/') {
    if (is_string($path) && preg_match('#^https?://#i', $path)) {
        return $path;
    }

    $normalizedPath = '/' . ltrim((string) $path, '/');

    if ($normalizedPath === '/index.php') {
        $normalizedPath = '/';
    }

    return getSiteUrl() . $normalizedPath;
}

/**
 * Trim text to a search-friendly description length.
 */
function excerptText($text, $limit = 160) {
    $text = trim(preg_replace('/\s+/u', ' ', strip_tags((string) $text)));

    if ($text === '') {
        return '';
    }

    if (function_exists('mb_strlen') && function_exists('mb_substr')) {
        if (mb_strlen($text) <= $limit) {
            return $text;
        }

        return rtrim(mb_substr($text, 0, $limit - 1)) . '…';
    }

    if (strlen($text) <= $limit) {
        return $text;
    }

    return rtrim(substr($text, 0, $limit - 1)) . '…';
}

/**
 * Return the default social preview image.
 */
function getDefaultSeoImage() {
    return buildAbsoluteUrl('assets/images/author.png');
}

/**
 * Version a static asset URL with the file's modification time.
 *
 * Lets the server hand out long-lived cache headers for /assets/ while a
 * rebuilt stylesheet or script still reaches returning visitors immediately.
 */
function assetUrl($path) {
    $normalizedPath = '/' . ltrim((string) $path, '/');
    $filesystemPath = __DIR__ . '/..' . $normalizedPath;
    $modifiedAt = @filemtime($filesystemPath);

    if ($modifiedAt === false) {
        return esc_html($normalizedPath);
    }

    return esc_html($normalizedPath . '?v=' . $modifiedAt);
}

/**
 * Sanitize output for HTML
 */
function esc_html($string) {
    return htmlspecialchars($string ?? '', ENT_QUOTES, 'UTF-8');
}

/**
 * Sanitize URLs for href/src attributes.
 */
function safeUrl($url) {
    $url = trim((string)$url);

    if ($url === '') {
        return '#';
    }

    // A site-relative path, but never a protocol-relative one: "//evil.test"
    // also starts with a slash and would silently become an external link.
    if (str_starts_with($url, '/') && !str_starts_with($url, '//')) {
        return esc_html($url);
    }

    if (filter_var($url, FILTER_VALIDATE_URL)) {
        $scheme = strtolower((string)parse_url($url, PHP_URL_SCHEME));
        if ($scheme === 'http' || $scheme === 'https') {
            return esc_html($url);
        }
    }

    return '#';
}
