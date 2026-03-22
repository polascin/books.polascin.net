<?php
// Block direct web access — this script must only run from CLI.
if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    exit('Forbidden');
}

require_once __DIR__ . '/includes/functions.php';

echo "Connecting to database...\n";
$pdo = getDbConnection();

if (!$pdo) {
    die("Failed to connect to the database. Please check your .env credentials.\n");
}

try {
    // Determine if table exists before trying to create it
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS books (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            author VARCHAR(255) NOT NULL,
            year INT(4),
            isbn VARCHAR(20),
            description TEXT,
            cover_image VARCHAR(255),
            url VARCHAR(512),
            web_url VARCHAR(512),
            language VARCHAR(50),
            category VARCHAR(100)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");
    echo "Table 'books' created or verified successfully.\n";

    // Add url column for existing installations created before this field existed.
    $urlColumnCheck = $pdo->query("SHOW COLUMNS FROM books LIKE 'url'");
    if (!$urlColumnCheck->fetch()) {
        $pdo->exec("ALTER TABLE books ADD COLUMN url VARCHAR(512) NULL AFTER cover_image");
        echo "Added missing 'url' column to 'books' table.\n";
    }

    $webUrlColumnCheck = $pdo->query("SHOW COLUMNS FROM books LIKE 'web_url'");
    if (!$webUrlColumnCheck->fetch()) {
        $pdo->exec("ALTER TABLE books ADD COLUMN web_url VARCHAR(512) NULL AFTER url");
        echo "Added missing 'web_url' column to 'books' table.\n";
    }

    $stmt = $pdo->query("SELECT COUNT(*) FROM books");
    $count = $stmt->fetchColumn();

    if ($count == 0) {
        $jsonPath = __DIR__ . '/data/books.json';
        if (file_exists($jsonPath)) {
            $json = file_get_contents($jsonPath);
            $books = json_decode($json, true);
            
            if ($books) {
                $insert = $pdo->prepare("
                    INSERT INTO books (title, author, year, isbn, description, cover_image, url, web_url, language, category)
                    VALUES (:title, :author, :year, :isbn, :description, :cover_image, :url, :web_url, :language, :category)
                ");
                
                $insertedCount = 0;
                foreach ($books as $book) {
                    $insert->execute([
                        ':title' => $book['title'] ?? '',
                        ':author' => $book['author'] ?? '',
                        ':year' => $book['year'] ?? null,
                        ':isbn' => $book['isbn'] ?? '',
                        ':description' => $book['description'] ?? '',
                        ':cover_image' => $book['cover_image'] ?? '',
                        ':url' => $book['url'] ?? '',
                        ':web_url' => $book['web_url'] ?? '',
                        ':language' => $book['language'] ?? '',
                        ':category' => $book['category'] ?? ''
                    ]);
                    $insertedCount++;
                }
                echo "Successfully seeded database with $insertedCount books from books.json.\n";
            } else {
                echo "JSON file found but could not be parsed.\n";
            }
        } else {
            echo "books.json not found for initial seeding.\n";
        }
    } else {
        echo "Table 'books' already contains $count records. Skipping JSON seeding.\n";
    }
} catch (\PDOException $e) {
    error_log('setup_db.php failed: ' . $e->getMessage());
    die("Setup failed during execution. Check server error logs.\n");
}
?>
