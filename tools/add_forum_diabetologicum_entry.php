<?php

/**
 * One-time script: adds 'Novšie aspekty antihypertenzívnej liečby u pacientov s diabetickou nefropatiou' 
 * (Forum Diabetologicum, 2012) to data/books.json.
 * Run from CLI: php tools/add_forum_diabetologicum_entry.php
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
    if (isset($book['isbn']) && $book['isbn'] === 'FD-40671') {
        echo "Entry already exists (isbn FD-40671). Aborting.\n";
        exit(0);
    }
}

$newEntry = [
    'id' => count($books) + 1,
    'title' => 'Novšie aspekty antihypertenzívnej liečby u pacientov s diabetickou nefropatiou',
    'author' => 'Silvester Krčméry, Ľubomír Polaščín, Rastislav Tahotný, Zuzana Gábrišová',
    'year' => 2012,
    'isbn' => 'FD-40671',
    'description' => 'Odborný recenzovaný článok uverejnený v časopise Forum Diabetologicum (2012, roč. 11, č. 1, ISSN 1805-9279) na portáli proLékaře.cz. Autori: prof. MUDr. Silvester Krčméry, CSc. (Milosrdní bratislava), MUDr. Ľubomír Polaščín (B. Braun Avitum), MUDr. Rastislav Tahotný, Zuzana Gábrišová. Článok analyzuje novšie aspekty antihypertenzívnej liečby u pacientov s diabetickou nefropatiou - hlavné terapeutické intervencie zahŕňajú konzistentnú metabolickú kontrolu DM a kontrolu krvného tlaku. Cieľom liečby manifestnej diabetickej nefropatie je spomalenie progresie ochorenia obličiek a zníženie kardiovaskulárneho rizika. Diskutuje sa o blokáde RAAS (ACE inhibítory, sartany), kombinovanej liečbe, ako aj o novších skupinách antihypertenzív.',
    'cover_image' => 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%221200%22%20viewBox%3D%220%200%20800%201200%22%20role%3D%22img%22%20aria-label%3D%22Cover%20for%20Nov%C5%A1ie%20aspekty%20antihypertenz%C3%ADvnej%20lie%C4%8Dby%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22bg%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22hsl(210%2055%25%2026%25)%22%2F%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22hsl(260%2065%25%2016%25)%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%221200%22%20fill%3D%22url(%23bg)%22%2F%3E%3Crect%20x%3D%2244%22%20y%3D%2244%22%20width%3D%22712%22%20height%3D%221112%22%20rx%3D%2220%22%20fill%3D%22none%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.28)%22%20stroke-width%3D%222%22%2F%3E%3Ctext%20x%3D%2280%22%20y%3D%22140%22%20font-size%3D%2224%22%20font-family%3D%22Georgia%2Cserif%22%20letter-spacing%3D%223%22%20fill%3D%22rgba(255%2C255%2C255%2C0.85)%22%3EMEDICAL%20WRITING%3C%2Ftext%3E%3Ctext%20x%3D%2280%22%20y%3D%22260%22%20font-size%3D%2248%22%20font-weight%3D%22700%22%20font-family%3D%22Georgia%2Cserif%22%20fill%3D%22%23ffffff%22%3E%3Ctspan%20x%3D%2280%22%20dy%3D%220%22%3ENov%C5%A1ie%20aspekty%3C%2Ftspan%3E%3Ctspan%20x%3D%2280%22%20dy%3D%2256%22%3Eantihypertenz%C3%ADvnej%3C%2Ftspan%3E%3Ctspan%20x%3D%2280%22%20dy%3D%2256%22%3Elie%C4%8Dby%20u%20pacientov%3C%2Ftspan%3E%3Ctspan%20x%3D%2280%22%20dy%3D%2256%22%3Es%20diabetickou%3C%2Ftspan%3E%3Ctspan%20x%3D%2280%22%20dy%3D%2256%22%3Enefropatiou%3C%2Ftspan%3E%3C%2Ftext%3E%3Ctext%20x%3D%2280%22%20y%3D%221080%22%20font-size%3D%2226%22%20font-family%3D%22Georgia%2Cserif%22%20fill%3D%22rgba(255%2C255%2C255%2C0.95)%22%3EKr%C4%8Dm%C3%A9ry%2C%20Pola%C5%A1%C4%8D%C3%ADn%2C%20Tahotn%C3%BD%2C%20G%C3%A1bri%C5%A1ov%C3%A1%3C%2Ftext%3E%3Ctext%20x%3D%22720%22%20y%3D%221080%22%20text-anchor%3D%22end%22%20font-size%3D%2226%22%20font-family%3D%22Georgia%2Cserif%22%20fill%3D%22rgba(255%2C255%2C255%2C0.9)%22%3E2012%3C%2Ftext%3E%3C%2Fsvg%3E',
    'url' => 'https://www.prolekare.cz/casopisy/forum-diabetologicum/2012-1-11/novsie-aspekty-antihypertenzivnej-liecby-u-pacientov-s-diabetickou-nefropatiou-40671',
    'web_url' => 'https://www.forumdiabetologicum.sk/',
    'language' => 'Slovak',
    'category' => 'Medical Writing',
];

$books[] = $newEntry;

$output = json_encode($books, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
file_put_contents($jsonPath, $output);

echo "Added entry: " . $newEntry['title'] . " (id " . $newEntry['id'] . ")\n";
echo "Total entries: " . count($books) . "\n";
echo "books.json updated.\n";
echo "\nNext steps:\n";
echo "1. Run the SQL migration: Get-Content tools/sql/2026-09-21_forum_diabetologicum_2012.sql | mysql -u <user> -p<db>\n";
echo "2. Commit: git add data/books.json && git commit -m 'feat: add Forum Diabetologicum 2012 article to books.json'\n";
echo "3. Push: git push origin main\n";
echo "4. Delete this script: rm tools/add_forum_diabetologicum_entry.php\n";
