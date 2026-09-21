<?php

/**
 * One-time script: adds 'Dialýza kedysi, dnes a v budúcnosti' (ZdN 2026) to data/books.json.
 * Run from CLI: php tools/add_dialyza_entry.php
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
    if (isset($book['isbn']) && $book['isbn'] === 'ZDN-96291978') {
        echo "Entry already exists (isbn ZDN-96291978). Aborting.\n";
        exit(0);
    }
}

$newEntry = [
    'id' => count($books) + 1,
    'title' => 'Dialýza kedysi, dnes a v budúcnosti',
    'author' => 'MUDr. Ľubomír Polaščín',
    'year' => 2026,
    'isbn' => 'ZDN-96291978',
    'description' => 'Odborný článok uverejnený v Zdravotníckych novinách č. 28 (15.07.2026, web) a č. 29 (print, júl 2026) na Mediweb.sk. Autor: MUDr. Ľubomír Polaščín, nefrológ. Článok mapuje historický vývoj dialýzy od prvých experimentálnych metód cez Kolffovu rotujúcu obličku (1943) až po moderné modality (HD, PD, transplantácia). Analyzuje ekonomiku dialýzy na Slovensku (4 458 pacientov v 2021, náklady 63 mil. € v 2023) a budúce smery: domácu dialýzu, nositeľné a implantovateľné systémy, bio-umelé obličky, regeneratívnu medicínu a personalizovanú dialýzu s využitím AI. Publikované v spolupráci so šéfredaktorom Mgr. Rastislavom Borisom (Mafra Slovakia).',
    'cover_image' => 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%221200%22%20viewBox%3D%220%200%20800%201200%22%20role%3D%22img%22%20aria-label%3D%22Cover%20for%20Dial%C3%BDza%20kedysi%2C%20dnes%20a%20v%20bud%C3%BAcnosti%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22bg%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22hsl(187%2055%25%2026%25)%22%2F%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22hsl(136%2065%25%2016%25)%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%221200%22%20fill%3D%22url(%23bg)%22%2F%3E%3Crect%20x%3D%2244%22%20y%3D%2244%22%20width%3D%22712%22%20height%3D%221112%22%20rx%3D%2220%22%20fill%3D%22none%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.28)%22%20stroke-width%3D%222%22%2F%3E%3Ctext%20x%3D%2280%22%20y%3D%22140%22%20font-size%3D%2224%22%20font-family%3D%22Georgia%2Cserif%22%20letter-spacing%3D%223%22%20fill%3D%22rgba(255%2C255%2C255%2C0.85)%22%3EMEDIA%20MENTION%3C%2Ftext%3E%3Ctext%20x%3D%2280%22%20y%3D%22270%22%20font-size%3D%2256%22%20font-weight%3D%22700%22%20font-family%3D%22Georgia%2Cserif%22%20fill%3D%22%23ffffff%22%3E%3Ctspan%20x%3D%2280%22%20dy%3D%220%22%3EDial%C3%BDza%20kedysi%2C%3C%2Ftspan%3E%3Ctspan%20x%3D%2280%22%20dy%3D%2262%22%3Ednes%20a%20v%3C%2Ftspan%3E%3Ctspan%20x%3D%2280%22%20dy%3D%2262%22%3Ebud%C3%BAcnosti%3C%2Ftspan%3E%3C%2Ftext%3E%3Ctext%20x%3D%2280%22%20y%3D%221080%22%20font-size%3D%2230%22%20font-family%3D%22Georgia%2Cserif%22%20fill%3D%22rgba(255%2C255%2C255%2C0.95)%22%3EMUDr.%20%C4%BDubom%C3%ADr%20Pola%C5%A1%C4%8D%C3%ADn%3C%2Ftext%3E%3Ctext%20x%3D%22720%22%20y%3D%221080%22%20text-anchor%3D%22end%22%20font-size%3D%2226%22%20font-family%3D%22Georgia%2Cserif%22%20fill%3D%22rgba(255%2C255%2C255%2C0.9)%22%3E2026%3C%2Ftext%3E%3C%2Fsvg%3E',
    'url' => 'https://mediweb.hnonline.sk/zdn/zdravie/96291978-dialyza-kedysi-dnes-a-v-buducnosti',
    'web_url' => 'https://mediweb.hnonline.sk/zdn/tag/lubomir-polascin',
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
echo "1. Run the SQL migration: mysql -u <user> -p <db> < tools/sql/2026-09-21_dialyza_kedysi_dnes_buducnost.sql\n";
echo "2. Commit: git add data/books.json && git commit -m 'feat: add Dialýza kedysi, dnes a v budúcnosti to books.json'\n";
echo "3. Push: git push origin main\n";
echo "4. Delete this script: rm tools/add_dialyza_entry.php\n";
