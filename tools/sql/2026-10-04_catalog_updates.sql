-- books.polascin.net: catalog corrections and new additions, 4 October 2026
--
-- 1. Historical conference sources and attribution corrections:
--    * ID 15: Correct misattribution. The catalog previously held presentation #7
--      ("Vliv použití dialyzačního roztoku s citrátovou složkou v kyselém
--      koncentrátu na množství použitého heparinu při dialyzačním ošetření",
--      M. Dušek, Z. Švarcová, Š. Marková) attributed to L. Polaščín. In the
--      same program (XIV. multidisciplinární nefrologický kongres, Brno,
--      20.11.2014, CNNA), lecture #6 (11:20-11:40) was "Dialyzačné roztoky
--      a dialyzačné koncentráty", L. Polaščín (B. Braun Avitum s.r.o., DS
--      Bratislava). Updated title, source URL, description and cover image.
--      Not labeled as a full abstract text, but as a conference presentation /
--      program record.
--    * ID 12: Replaced Google search placeholder with verified primary congress
--      proceedings program in Aktuality v nefrologii (AVN, roč. 22, 2016, č. 3,
--      s. 80, Tigis; 38. kongres SNS). Stated as program record, not full abstract.
--    * ID 13: Confirmed authorship in official program of Krajský nefrologický
--      seminár pri príležitosti Svetového dňa obličiek (SZU Bratislava, 21.3.2013,
--      program item #8: MUDr. Ľubomír Polaščín: Kontinuálna renálna nahrádzajúca
--      terapia (KRNT, CRRT) pri AOP (AKI)). Replaced Google search URL with primary
--      program PDF, added secondary announcement URL.
--
-- 2. New editions / standalone publications:
--    * A. SK Nefro Báza 1 - English edition (slug sk-nefro-baza-1-en, NEFRO-SKNB-1-EN)
--    * B. SK Nefro Báza 1 Kompendium (slug sk-nefro-baza-1-kompendium, NEFRO-SKNB-1-KOMP)
--    * C. SK Nefro Báza 1 Compendium - English edition (slug sk-nefro-baza-1-kompendium-en, NEFRO-SKNB-1-K-EN)
--    * D. Metafyzika 2 (slug metafyzika-2, METAFYZIKA-2)
--
-- Identifiers:
--    All keys fit VARCHAR(20) without silent truncation.
--
-- Backup runs BEFORE transaction because CREATE TABLE ... AS SELECT is DDL
-- and implicitly commits in MariaDB.
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS books_backup_2026_10_04 AS SELECT * FROM books;

START TRANSACTION;

-- ---------------------------------------------------------------------------
-- 1. Corrections to existing records (ID 15, ID 12, ID 13)
-- ---------------------------------------------------------------------------

-- ID 15: Correct presentation title and primary source
UPDATE books
   SET title = 'Dialyzačné roztoky a dialyzačné koncentráty',
       author = 'L. Polaščín',
       language = 'Slovak',
       url = 'https://www.cnna.cz/docs/akce/nefrologie_2014_1_program-1eb3a.pdf',
       web_url = NULL,
       description = 'Konferenčný príspevok (programový záznam prednášky) prezentovaný na XIV. multidisciplinárnom nefrologickom kongrese s medzinárodnou účasťou „Vývoj léčby a ošetřovatelské péče u pacientů s onemocněním ledvin“ (Brno, 20. – 21. 11. 2014, Česká asociace sester – nefrologická sekce / CNNA). Záznam v programe kongresu, s. 3 (prednáška č. 6: Dialyzačné roztoky a dialyzačné koncentráty, L. Polaščín, B. Braun Avitum s.r.o., Dialyzačné stredisko Bratislava). Oprava pôvodne chybne pripísaného názvu susednej prednášky č. 7 iných autorov; neoznačuje sa za plný text abstraktu.'
 WHERE (isbn = 'N/A' OR isbn IS NULL OR isbn = '')
   AND (title = 'Vliv použití dialyzačního roztoku s citrátovou složkou v kyselém koncentrátu na množství použitého heparinu při dialyzačním ošetření'
        OR title = 'Dialyzačné roztoky a dialyzačné koncentráty')
   AND (NOT (title <=> 'Dialyzačné roztoky a dialyzačné koncentráty')
        OR NOT (url <=> 'https://www.cnna.cz/docs/akce/nefrologie_2014_1_program-1eb3a.pdf')
        OR NOT (language <=> 'Slovak'));

-- ID 12: Replace search URL with Tigis congress program
UPDATE books
   SET url = 'https://www.tigis.cz/images/stories/Aktuality_nefro/2016/03/AVN_program_3_2016.pdf',
       description = 'Programový záznam posterovej diskusie uverejnený v časopise Aktuality v nefrologii (roč. 22, 2016, č. 3, s. 80) na 38. kongrese Slovenskej nefrologickej spoločnosti s medzinárodnou účasťou. Záznam o dlhodobej úspešnej remisii idiopatickej membranóznej nefropatie aplikáciou Ponticelliho imunosupresívnej schémy (Ľ. Polaščín, M. Alaxinová, G. Karasová, J. Kalatová); nejde o dostupný plný abstrakt.'
 WHERE (isbn = 'N/A' OR isbn IS NULL OR isbn = '')
   AND title = 'DLHODOBÁ ÚSPEŠNÁ REMISIA IDIOPATICKEJ MEMBRÁNOVEJ NEFROPATIE APLIKÁCIOU PONTICELLIHO SCHÉMY IMUNOSUPRESÍVNEJ LIEČBY'
   AND NOT (url <=> 'https://www.tigis.cz/images/stories/Aktuality_nefro/2016/03/AVN_program_3_2016.pdf');

-- ID 13: Replace search URL with confirmed KNS program and add secondary announcement URL
UPDATE books
   SET author = 'MUDr. Ľubomír Polaščín',
       url = 'https://www.nefro.sk/fileadmin/Nefro/Odborne_akcie/program_KNS_2013_marec.pdf',
       web_url = 'https://www.nefro.sk/aktuality/detail-novinky/wkd-svetovy-den-obliciek-bratislava-14/?tx_ttnews%5Bpointer%5D=12',
       description = 'Programový záznam odbornej prednášky v rámci Krajského nefrologického seminára pri príležitosti Svetového dňa obličiek (Slovenská zdravotnícka univerzita v Bratislave, 21. marca 2013). Téma: Akútne zlyhanie obličiek, prednáška č. 8: Kontinuálna renálna nahrádzajúca terapia (KRNT, CRRT) pri AOP (AKI), prednášajúci MUDr. Ľubomír Polaščín (overené v programe podujatia).'
 WHERE (isbn = 'N/A' OR isbn IS NULL OR isbn = '')
   AND title = 'Kontinuálna renálna nahrádzajúca terapia (KRNT, CRRT) pri AOP (AKI)'
   AND (NOT (author <=> 'MUDr. Ľubomír Polaščín')
        OR NOT (url <=> 'https://www.nefro.sk/fileadmin/Nefro/Odborne_akcie/program_KNS_2013_marec.pdf')
        OR NOT (web_url <=> 'https://www.nefro.sk/aktuality/detail-novinky/wkd-svetovy-den-obliciek-bratislava-14/?tx_ttnews%5Bpointer%5D=12'));

-- ---------------------------------------------------------------------------
-- 2. New Editions (A, B, C, D)
-- ---------------------------------------------------------------------------

-- A. SK Nefro Báza 1 - English edition
INSERT INTO books (title, author, year, isbn, description, cover_image, url, web_url, language, category)
  SELECT 'SK Nefro Báza 1 - English edition',
         'Ľubomír Polaščín, MD',
         2026,
         'NEFRO-SKNB-1-EN',
         'E-book, 1st edition - October 2026. English edition of collected specialist articles from the Slovak Nephro-project portal (nefro.polascin.net) on chronic kidney disease, dialysis, kidney transplantation and internal medicine. 387 articles, 1,782 pages, 393 illustrations, 661,410 words. Formats: PDF, EPUB, AZW3, DOCX, ODT; 7 EUR single format, 12 EUR all formats. Without ISBN/DOI (internal catalog ID: NEFRO-SKNB-1-EN). Primary source: nefro.polascin.net; secondary sales channel: Gumroad (permalink ptcshg).',
         'https://nefro.polascin.net/img/publikacie/sk-nefro-baza-1-en-obalka.jpg',
         'https://nefro.polascin.net/publikacia.php?slug=sk-nefro-baza-1-en',
         'https://polascin.gumroad.com/l/sk-nefro-baza-1-en',
         'English',
         'Digital Product'
  FROM DUAL
  WHERE NOT EXISTS (
    SELECT 1 FROM books
    WHERE isbn = 'NEFRO-SKNB-1-EN'
       OR url = 'https://nefro.polascin.net/publikacia.php?slug=sk-nefro-baza-1-en'
       OR web_url = 'https://polascin.gumroad.com/l/sk-nefro-baza-1-en'
  );

-- B. SK Nefro Báza 1 Kompendium
INSERT INTO books (title, author, year, isbn, description, cover_image, url, web_url, language, category)
  SELECT 'SK Nefro Báza 1 Kompendium',
         'MUDr. Ľubomír Polaščín',
         2026,
         'NEFRO-SKNB-1-KOMP',
         'E-kniha, 1. vydanie - október 2026. Zhustené vydanie prvého zväzku série SK Nefro Báza: 387 odborných článkov spracovaných do abstraktu a kľúčových bodov v 16 kapitolách so syntézou posolstiev. 261 strán, 109 029 slov. Formáty: PDF, EPUB, AZW3, DOCX, ODT; 7 EUR jeden formát, 12 EUR všetky formáty. Bez ISBN/DOI (interné ID: NEFRO-SKNB-1-KOMP). Primárny zdroj: nefro.polascin.net; sekundárny predajný kanál: Gumroad (permalink xegryo).',
         'https://nefro.polascin.net/img/publikacie/sk-nefro-baza-1-kompendium-obalka.jpg',
         'https://nefro.polascin.net/publikacia.php?slug=sk-nefro-baza-1-kompendium',
         'https://polascin.gumroad.com/l/sk-nefro-baza-1-kompendium',
         'Slovak',
         'Digital Product'
  FROM DUAL
  WHERE NOT EXISTS (
    SELECT 1 FROM books
    WHERE isbn = 'NEFRO-SKNB-1-KOMP'
       OR url = 'https://nefro.polascin.net/publikacia.php?slug=sk-nefro-baza-1-kompendium'
       OR web_url = 'https://polascin.gumroad.com/l/sk-nefro-baza-1-kompendium'
  );

-- C. SK Nefro Báza 1 Compendium - English edition
INSERT INTO books (title, author, year, isbn, description, cover_image, url, web_url, language, category)
  SELECT 'SK Nefro Báza 1 Compendium - English edition',
         'Ľubomír Polaščín, MD',
         2026,
         'NEFRO-SKNB-1-K-EN',
         'E-book, 1st edition - October 2026. English edition of the compendium: 387 articles summarized into abstracts and key points across 16 chapters with synthesis essays. 275 pages, 127,308 words. Formats: PDF, EPUB, AZW3, DOCX, ODT; 7 EUR single format, 12 EUR all formats. Without ISBN/DOI (internal catalog ID: NEFRO-SKNB-1-K-EN). Note on article count: 387 articles in work structure and imprint; 386 article summaries (article on Libyan migrant organ trafficking listed by title/number without summary). Primary source: nefro.polascin.net; secondary sales channel: Gumroad (permalink wvsksw).',
         'https://nefro.polascin.net/img/publikacie/sk-nefro-baza-1-kompendium-en-obalka.jpg',
         'https://nefro.polascin.net/publikacia.php?slug=sk-nefro-baza-1-kompendium-en',
         'https://polascin.gumroad.com/l/sk-nefro-baza-1-kompendium-en',
         'English',
         'Digital Product'
  FROM DUAL
  WHERE NOT EXISTS (
    SELECT 1 FROM books
    WHERE isbn = 'NEFRO-SKNB-1-K-EN'
       OR url = 'https://nefro.polascin.net/publikacia.php?slug=sk-nefro-baza-1-kompendium-en'
       OR web_url = 'https://polascin.gumroad.com/l/sk-nefro-baza-1-kompendium-en'
  );

-- D. Metafyzika 2
INSERT INTO books (title, author, year, isbn, description, cover_image, url, web_url, language, category)
  SELECT 'Metafyzika 2',
         'MUDr. Ľubomír Polaščín',
         2026,
         'METAFYZIKA-2',
         'Druhý diel Nedeľnej metafyziky: Filozofický a kontemplatívny sprievodca (Vedomie, skutočnosť a hranice poznania). Bezplatný digitálny text publikovaný 4. októbra 2026 na osobnom webe polascin.net. Rozsah: 23 strán (PDF, 278 kB). Rozlišuje skúsenosť, vedecké vysvetlenie a metafyzický výklad. Bez ISBN/DOI (interné katalógové ID: METAFYZIKA-2).',
         'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%221200%22%20viewBox%3D%220%200%20800%201200%22%20role%3D%22img%22%20aria-label%3D%22Cover%20for%20Metafyzika%202%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22bg%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22hsl(215%2050%25%2024%25)%22%2F%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22hsl(260%2055%25%2018%25)%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%221200%22%20fill%3D%22url(%23bg)%22%2F%3E%3Crect%20x%3D%2244%22%20y%3D%2244%22%20width%3D%22712%22%20height%3D%221112%22%20rx%3D%2220%22%20fill%3D%22none%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.28)%22%20stroke-width%3D%222%22%2F%3E%3Ctext%20x%3D%2280%22%20y%3D%22140%22%20font-size%3D%2224%22%20font-family%3D%22Georgia%2Cserif%22%20letter-spacing%3D%223%22%20fill%3D%22rgba(255%2C255%2C255%2C0.85)%22%3EPHILOSOPHY%3C%2Ftext%3E%3Ctext%20x%3D%2280%22%20y%3D%22270%22%20font-size%3D%2256%22%20font-weight%3D%22700%22%20font-family%3D%22Georgia%2Cserif%22%20fill%3D%22%23ffffff%22%3E%3Ctspan%20x%3D%2280%22%20dy%3D%220%22%3EMetafyzika%202%3C%2Ftspan%3E%3C%2Ftext%3E%3Ctext%20x%3D%2280%22%20y%3D%221080%22%20font-size%3D%2230%22%20font-family%3D%22Georgia%2Cserif%22%20fill%3D%22rgba(255%2C255%2C255%2C0.95)%22%3EMUDr.%20%C4%BDubom%C3%ADr%20Pola%C5%A1%C4%8D%C3%ADn%3C%2Ftext%3E%3Ctext%20x%3D%22720%22%20y%3D%221080%22%20text-anchor%3D%22end%22%20font-size%3D%2226%22%20font-family%3D%22Georgia%2Cserif%22%20fill%3D%22rgba(255%2C255%2C255%2C0.9)%22%3E2026%3C%2Ftext%3E%3C%2Fsvg%3E',
         'https://polascin.net/library.php?slug=metafyzika-2&lang=sk',
         'https://polascin.net/library_file.php?slug=metafyzika-2',
         'Slovak',
         'Philosophy'
  FROM DUAL
  WHERE NOT EXISTS (
    SELECT 1 FROM books
    WHERE isbn = 'METAFYZIKA-2'
       OR url = 'https://polascin.net/library.php?slug=metafyzika-2&lang=sk'
  );

COMMIT;

-- ---------------------------------------------------------------------------
-- Verification
-- ---------------------------------------------------------------------------
-- SELECT id, isbn, title, author, url, web_url, category, language
--   FROM books
--  WHERE isbn IN ('NEFRO-SKNB-1-EN', 'NEFRO-SKNB-1-KOMP', 'NEFRO-SKNB-1-K-EN', 'METAFYZIKA-2')
--     OR title LIKE 'Dialyzačné roztoky%'
--     OR title LIKE 'DLHODOBÁ ÚSPEŠNÁ%'
--     OR title LIKE 'Kontinuálna renálna%';
--
-- ---------------------------------------------------------------------------
-- Rollback
-- ---------------------------------------------------------------------------
-- START TRANSACTION;
-- DELETE FROM books WHERE isbn IN ('NEFRO-SKNB-1-EN', 'NEFRO-SKNB-1-KOMP', 'NEFRO-SKNB-1-K-EN', 'METAFYZIKA-2');
-- UPDATE books b JOIN books_backup_2026_10_04 bk ON b.id = bk.id
--    SET b.title = bk.title, b.author = bk.author, b.year = bk.year,
--        b.isbn = bk.isbn, b.description = bk.description,
--        b.cover_image = bk.cover_image, b.url = bk.url,
--        b.web_url = bk.web_url, b.language = bk.language,
--        b.category = bk.category
--  WHERE b.id IN (12, 13, 15);
-- COMMIT;
