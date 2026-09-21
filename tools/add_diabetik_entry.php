<?php

/**
 * One-time script: adds 'Cukrovka ničí obličky čoraz viac' (Diabetik, 2019) to data/books.json.
 * Run from CLI: php tools/add_diabetik_entry.php
 * Created by Littlebird on 2026-09-21.
 */

if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    exit('Forbidden');
}

$jsonPath = __DIR__ . '/../data/books.json';
$json = file_get_contents($jsonPath);
$books = json_decode($json, true);

if (!$books) {
    die("Failed to parse books.json\n");
}

// Check if entry already exists
foreach ($books as $book) {
    if (isset($book['isbn']) && $book['isbn'] === 'DIA-2054968') {
        echo "Entry already exists (isbn DIA-2054968). Aborting.\n";
        exit(0);
    }
}

$newEntry = [
    'id' => count($books) + 1,
    'title' => 'Cukrovka ničí obličky čoraz viac',
    'author' => 'MUDr. Ľubomír Polaščín (rozhovor - Zlatica Beňová)',
    'year' => 2019,
    'isbn' => 'DIA-2054968',
    'description' => 'Rozhovor s nefrológom MUDr. Ľubomírom Polaščínom uverejnený v časopise Diabetik (08.12.2019) na portáli Dia.hnonline.sk. Rozprúva sa o diabetickej nefropatii - ako cukrovka poškodzuje obličky, prečo vzrástol počet diabetikov na dialýze na tretinu všetkých pacientov, aké sú príznaky poškodenia obličiek, kedy nastupuje dialýza, možnosti transplantácie a ako si diabetik môže chrániť obličky. Autorom rozhovoru je Zlatica Beňová (Mafra Slovakia). Publikované v spolupráci s B. Braun Avitum, dialyzačné stredisko.',
    'cover_image' => 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%221200%22%20viewBox%3D%220%200%20800%201200%22%20role%3D%22img%22%20aria-label%3D%22Cover%20for%20Cukrovka%20ni%C4%8D%C3%AD%20obli%C4%8Dky%20%C4%8Doraz%20viac%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22bg%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22hsl(349%2055%25%2026%25)%22%2F%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22hsl(19%2065%25%2016%25)%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%221200%22%20fill%3D%22url(%23bg)%22%2F%3E%3Crect%20x%3D%2244%22%20y%3D%2244%22%20width%3D%22712%22%20height%3D%221112%22%20rx%3D%2220%22%20fill%3D%22none%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.28)%22%20stroke-width%3D%222%22%2F%3E%3Ctext%20x%3D%2280%22%20y%3D%22140%22%20font-size%3D%2224%22%20font-family%3D%22Georgia%2Cserif%22%20letter-spacing%3D%223%22%20fill%3D%22rgba(255%2C255%2C255%2C0.85)%22%3EMEDIA%20MENTION%3C%2Ftext%3E%3Ctext%20x%3D%2280%22%20y%3D%22270%22%20font-size%3D%2256%22%20font-weight%3D%22700%22%20font-family%3D%22Georgia%2Cserif%22%20fill%3D%22%23ffffff%22%3E%3Ctspan%20x%3D%2280%22%20dy%3D%220%22%3ECukrovka%20ni%C4%8D%C3%AD%3C%2Ftspan%3E%3Ctspan%20x%3D%2280%22%20dy%3D%2262%22%3Eobli%C4%8Dky%3C%2Ftspan%3E%3Ctspan%20x%3D%2280%22%20dy%3D%2262%22%3E%C4%8Doraz%20viac%3C%2Ftspan%3E%3C%2Ftext%3E%3Ctext%20x%3D%2280%22%20y%3D%221080%22%20font-size%3D%2230%22%20font-family%3D%22Georgia%2Cserif%22%20fill%3D%22rgba(255%2C255%2C255%2C0.95)%22%3EMUDr.%20%C4%BDubom%C3%ADr%20Pola%C5%A1%C4%8D%C3%ADn%3C%2Ftext%3E%3Ctext%20x%3D%22720%22%20y%3D%221080%22%20text-anchor%3D%22end%22%20font-size%3D%2226%22%20font-family%3D%22Georgia%2Cserif%22%20fill%3D%22rgba(255%2C255%2C255%2C0.9)%22%3E2019%3C%2Ftext%3E%3C%2Fsvg%3E',
    'url' => 'https://dia.hnonline.sk/dia/zdravie/2054968-cukrovka-nici-oblicky-coraz-viac',
    'web_url' => 'https://dia.hnonline.sk/dia/autor/zlatica-benova-24563',
    'language' => 'Slovak',
    'category' => 'Media Mention',
];

$books[] = $newEntry;

$output = json_encode($books, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
file_put_contents($jsonPath, $output);

echo "Added entry: " . $newEntry['title'] . " (id " . $newEntry['id'] . ")\n";
echo "Total entries: " . count($books) . "\n";
echo "books.json updated.\n";
echo "\nNext steps:\n";
echo "1. Run the SQL migration: Get-Content tools/sql/2026-09-21_cukrovka_nici_oblicky.sql | mysql -u <user> -p<db>\n";
echo "2. Commit: git add data/books.json && git commit -m 'feat: add Cukrovka ničí obličky čoraz viac (Diabetik 2019) to books.json'\n";
echo "3. Push: git push origin main\n";
echo "4. Delete this script: rm tools/add_diabetik_entry.php\n";
