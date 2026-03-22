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
            // Remove potential quotes from the value
            $value = trim($value, "\"'");
            $_ENV[trim($name)] = $value;
        }
    }
    return true;
}

/**
 * Get PDO Database Connection
 */
function getDbConnection() {
    // Load .env if not loaded
    if (!isset($_ENV['DB_HOST'])) {
        loadEnv(__DIR__ . '/../.env');
    }
    
    $host = $_ENV['DB_HOST'] ?? 'localhost';
    $port = $_ENV['DB_PORT'] ?? '3306';
    $db   = $_ENV['DB_NAME'] ?? '';
    $user = $_ENV['DB_USER'] ?? '';
    $pass = $_ENV['DB_PASS'] ?? '';
    $charset = 'utf8mb4';

    $dsn = "mysql:host=$host;port=$port;dbname=$db;charset=$charset";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    try {
        return new PDO($dsn, $user, $pass, $options);
    } catch (\PDOException $e) {
        error_log('DB connection failed: ' . $e->getMessage());
        return null;
    }
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
    if (!isset($_ENV['SITE_URL'])) {
        loadEnv(__DIR__ . '/../.env');
    }

    return rtrim($_ENV['SITE_URL'] ?? 'https://books.polascin.net', '/');
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
 * Sanitize output for HTML
 */
function esc_html($string) {
    return htmlspecialchars($string ?? '', ENT_QUOTES, 'UTF-8');

/**
 * Return a safe URL for use in href/src attributes.
 * Rejects anything that is not a plain http(s) URL or relative path.
 */
function safeUrl(string $url): string {
    $url = trim($url);
    if ($url === '') {
        return '#';
    }
    // Allow root-relative paths and plain https/http URLs only
    if (str_starts_with($url, '/') || preg_match('#^https?://#i', $url)) {
        return esc_html($url);
    }
    return '#';
}
}
?>
