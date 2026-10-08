-- Add the three free editorial PDFs, the two German paid editions, and
-- Metafyzika; correct the existing SK Nefro Báza 1 catalog description.
--
-- Primary metadata sources:
--   https://polascin.net/library.php?slug=sk-nefro-dokazane-pravdepodobne-otvorene&lang=sk
--   https://polascin.net/library.php?slug=sk-nefro-proven-probable-open&lang=sk
--   https://polascin.net/library.php?slug=sk-nefro-belegt-wahrscheinlich-offen&lang=sk
--   https://nefro.polascin.net/publikacia.php?slug=sk-nefro-baza-1-de
--   https://nefro.polascin.net/publikacia.php?slug=sk-nefro-baza-1-kompendium-de
--   https://polascin.net/library.php?slug=metafyzika&lang=sk
--
-- The free editorial downloads are PDFs, not complete books and not open
-- licensed. No ISBN, DOI, or unverified sales permalink is claimed.
-- Descriptions below mirror data/books.json. Identifiers are internal catalog
-- keys and each fits books.isbn VARCHAR(20).
--
-- Back up affected records BEFORE START TRANSACTION: CREATE TABLE ... AS is
-- DDL and implicitly commits in MariaDB.
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS books_backup_2026_10_08_catalog AS
SELECT *
  FROM books
 WHERE isbn IN (
         'NEFRO-SKNB-1',
         'NEFRO-DPO-SK',
         'NEFRO-PPO-EN',
         'NEFRO-BWO-DE',
         'NEFRO-SKNB-1-DE',
         'NEFRO-SKNB-1-K-DE',
         'METAFYZIKA'
       )
    OR title IN (
         'SK Nefro: Dokázané, pravdepodobné, otvorené',
         'SK Nefro: Proven, Probable, Open',
         'SK Nefro: Belegt, wahrscheinlich, offen',
         'SK Nefro Báza 1 — Deutsche Ausgabe',
         'SK Nefro Báza 1 Kompendium — Deutsche Ausgabe',
         'Metafyzika'
       )
    OR url IN (
         'https://polascin.net/library.php?slug=sk-nefro-dokazane-pravdepodobne-otvorene&lang=sk',
         'https://polascin.net/library.php?slug=sk-nefro-proven-probable-open&lang=sk',
         'https://polascin.net/library.php?slug=sk-nefro-belegt-wahrscheinlich-offen&lang=sk',
         'https://nefro.polascin.net/publikacia.php?slug=sk-nefro-baza-1-de',
         'https://nefro.polascin.net/publikacia.php?slug=sk-nefro-baza-1-kompendium-de',
         'https://polascin.net/library.php?slug=metafyzika&lang=sk'
       );

START TRANSACTION;

-- Correct the existing item by its stable catalog key, not numeric row id.
UPDATE books
   SET description = 'E-kniha, 1. vydanie - október 2026. Elektronický súhrn 387 odborných článkov z portálu Nefro-projekt Slovensko (nefro.polascin.net) o chronickej chorobe obličiek, dialýze, transplantácii a internej medicíne, tematicky usporiadaných a vzájomne prelinkovaných na čítanie offline. 1745 strán, 393 ilustrácií, 579608 slov. Formáty PDF, EPUB, AZW3, DOCX a ODT; 7 EUR za jeden formát, 12 EUR za všetky formáty. Bez ISBN a DOI. Primárny zdroj: nefro.polascin.net; sekundárny predajný kanál: Gumroad (permalink mvktwf).'
 WHERE isbn = 'NEFRO-SKNB-1'
   AND NOT (description <=> 'E-kniha, 1. vydanie - október 2026. Elektronický súhrn 387 odborných článkov z portálu Nefro-projekt Slovensko (nefro.polascin.net) o chronickej chorobe obličiek, dialýze, transplantácii a internej medicíne, tematicky usporiadaných a vzájomne prelinkovaných na čítanie offline. 1745 strán, 393 ilustrácií, 579608 slov. Formáty PDF, EPUB, AZW3, DOCX a ODT; 7 EUR za jeden formát, 12 EUR za všetky formáty. Bez ISBN a DOI. Primárny zdroj: nefro.polascin.net; sekundárny predajný kanál: Gumroad (permalink mvktwf).');

-- Free Slovak editorial PDF
INSERT INTO books (title, author, year, isbn, description, cover_image, url, web_url, language, category)
  SELECT 'SK Nefro: Dokázané, pravdepodobné, otvorené',
         'MUDr. Ľubomír Polaščín',
         2026,
         'NEFRO-DPO-SK',
         'PDF, 1. elektronické vydanie - zostavené 6. októbra 2026; pridané do hlavnej knižnice 8. októbra 2026. Bezplatné PDF so 16 kapitolovými úvodníkmi a úvodníkom k prílohe k 387 odborným článkom SK Nefro Báza 1; nejde o úplný zväzok. 94 strán. Bez ISBN a DOI (interný katalógový identifikátor: NEFRO-DPO-SK). Bezplatné sprístupnenie neudeľuje otvorenú licenciu; všetky práva vyhradené.',
         NULL,
         'https://polascin.net/library.php?slug=sk-nefro-dokazane-pravdepodobne-otvorene&lang=sk',
         'https://polascin.net/library_file.php?slug=sk-nefro-dokazane-pravdepodobne-otvorene&download=1',
         'Slovak',
         'Digital Product'
  FROM DUAL
  WHERE NOT EXISTS (
    SELECT 1 FROM books
     WHERE isbn = 'NEFRO-DPO-SK'
        OR (title = 'SK Nefro: Dokázané, pravdepodobné, otvorené'
            AND language = 'Slovak'
            AND year = 2026
            AND url = 'https://polascin.net/library.php?slug=sk-nefro-dokazane-pravdepodobne-otvorene&lang=sk')
  );

-- Free English editorial PDF
INSERT INTO books (title, author, year, isbn, description, cover_image, url, web_url, language, category)
  SELECT 'SK Nefro: Proven, Probable, Open',
         'MUDr. Ľubomír Polaščín',
         2026,
         'NEFRO-PPO-EN',
         'PDF, 1st electronic edition - compiled October 6, 2026; added to the main library on October 8, 2026. Free PDF with 16 chapter editorials and an appendix editorial to the 387 specialist articles in SK Nefro Báza 1; it is not the complete volume. 97 pages. No ISBN or DOI (internal catalog identifier: NEFRO-PPO-EN). Free access does not grant an open license; all rights reserved.',
         NULL,
         'https://polascin.net/library.php?slug=sk-nefro-proven-probable-open&lang=sk',
         'https://polascin.net/library_file.php?slug=sk-nefro-proven-probable-open&download=1',
         'English',
         'Digital Product'
  FROM DUAL
  WHERE NOT EXISTS (
    SELECT 1 FROM books
     WHERE isbn = 'NEFRO-PPO-EN'
        OR (title = 'SK Nefro: Proven, Probable, Open'
            AND language = 'English'
            AND year = 2026
            AND url = 'https://polascin.net/library.php?slug=sk-nefro-proven-probable-open&lang=sk')
  );

-- Free German editorial PDF
INSERT INTO books (title, author, year, isbn, description, cover_image, url, web_url, language, category)
  SELECT 'SK Nefro: Belegt, wahrscheinlich, offen',
         'MUDr. Ľubomír Polaščín',
         2026,
         'NEFRO-BWO-DE',
         'PDF, 1. elektronische Ausgabe - zusammengestellt am 6. Oktober 2026; am 8. Oktober 2026 in die Hauptbibliothek aufgenommen. Kostenloses PDF mit 16 Kapitel-Editorials und einem Editorial zum Anhang zu den 387 Fachartikeln von SK Nefro Báza 1; kein vollständiger Band. 105 Seiten. Ohne ISBN und DOI (interne Katalogkennung: NEFRO-BWO-DE). Kostenloser Zugang bedeutet keine offene Lizenz; alle Rechte vorbehalten.',
         NULL,
         'https://polascin.net/library.php?slug=sk-nefro-belegt-wahrscheinlich-offen&lang=sk',
         'https://polascin.net/library_file.php?slug=sk-nefro-belegt-wahrscheinlich-offen&download=1',
         'German',
         'Digital Product'
  FROM DUAL
  WHERE NOT EXISTS (
    SELECT 1 FROM books
     WHERE isbn = 'NEFRO-BWO-DE'
        OR (title = 'SK Nefro: Belegt, wahrscheinlich, offen'
            AND language = 'German'
            AND year = 2026
            AND url = 'https://polascin.net/library.php?slug=sk-nefro-belegt-wahrscheinlich-offen&lang=sk')
  );

-- Paid German full edition; no unverified secondary-sales permalink.
INSERT INTO books (title, author, year, isbn, description, cover_image, url, web_url, language, category)
  SELECT 'SK Nefro Báza 1 — Deutsche Ausgabe',
         'MUDr. Ľubomír Polaščín',
         2026,
         'NEFRO-SKNB-1-DE',
         'E-kniha, 1. vydanie - október 2026. Nemecké vydanie prvého zväzku série SK Nefro Báza: 387 odborných článkov na 1912 stranách, 393 ilustrácií a 652560 slov. Formáty PDF, EPUB, AZW3, DOCX a ODT; 7 EUR za jeden formát a 12 EUR za všetky formáty. Bez ISBN a DOI (interný katalógový identifikátor: NEFRO-SKNB-1-DE). Primárny zdroj: nefro.polascin.net.',
         'https://nefro.polascin.net/img/publikacie/sk-nefro-baza-1-de-obalka.jpg',
         'https://nefro.polascin.net/publikacia.php?slug=sk-nefro-baza-1-de',
         NULL,
         'German',
         'Digital Product'
  FROM DUAL
  WHERE NOT EXISTS (
    SELECT 1 FROM books
     WHERE isbn = 'NEFRO-SKNB-1-DE'
        OR (title = 'SK Nefro Báza 1 — Deutsche Ausgabe'
            AND language = 'German'
            AND year = 2026
            AND url = 'https://nefro.polascin.net/publikacia.php?slug=sk-nefro-baza-1-de')
  );

-- Paid German compendium; no illustrations and no unverified sales permalink.
INSERT INTO books (title, author, year, isbn, description, cover_image, url, web_url, language, category)
  SELECT 'SK Nefro Báza 1 Kompendium — Deutsche Ausgabe',
         'MUDr. Ľubomír Polaščín',
         2026,
         'NEFRO-SKNB-1-K-DE',
         'E-kniha, 1. vydanie - október 2026. Nemecké vydanie kompendia: 387 odborných článkov spracovaných do abstraktov a stručných zhrnutí na 300 stranách; 137769 slov, bez ilustrácií. Formáty PDF, EPUB, AZW3, DOCX a ODT; 7 EUR za jeden formát a 12 EUR za všetky formáty. Bez ISBN a DOI (interný katalógový identifikátor: NEFRO-SKNB-1-K-DE). Primárny zdroj: nefro.polascin.net.',
         'https://nefro.polascin.net/img/publikacie/sk-nefro-baza-1-kompendium-de-obalka.jpg',
         'https://nefro.polascin.net/publikacia.php?slug=sk-nefro-baza-1-kompendium-de',
         NULL,
         'German',
         'Digital Product'
  FROM DUAL
  WHERE NOT EXISTS (
    SELECT 1 FROM books
     WHERE isbn = 'NEFRO-SKNB-1-K-DE'
        OR (title = 'SK Nefro Báza 1 Kompendium — Deutsche Ausgabe'
            AND language = 'German'
            AND year = 2026
            AND url = 'https://nefro.polascin.net/publikacia.php?slug=sk-nefro-baza-1-kompendium-de')
  );

-- Metafyzika, first part of the Sunday Metaphysics series.
INSERT INTO books (title, author, year, isbn, description, cover_image, url, web_url, language, category)
  SELECT 'Metafyzika',
         'MUDr. Ľubomír Polaščín',
         2026,
         'METAFYZIKA',
         'PDF, text z 27. septembra 2026; do hlavnej knižnice pridané 1. októbra 2026. Úvod do metafyziky s premostením medzi akademickou filozofiou a ezoterickou tradíciou. 29 strán, 178 kB. Bez ISBN a DOI (interný katalógový identifikátor: METAFYZIKA). Bezplatný prístup neudeľuje otvorenú licenciu; všetky práva vyhradené.',
         NULL,
         'https://polascin.net/library.php?slug=metafyzika&lang=sk',
         'https://polascin.net/library_file.php?slug=metafyzika&download=1',
         'Slovak',
         'Philosophy'
  FROM DUAL
  WHERE NOT EXISTS (
    SELECT 1 FROM books
     WHERE isbn = 'METAFYZIKA'
        OR (title = 'Metafyzika'
            AND language = 'Slovak'
            AND year = 2026
            AND url = 'https://polascin.net/library.php?slug=metafyzika&lang=sk')
  );

COMMIT;

-- Verify row counts, language/category totals and updated descriptions:
-- SELECT isbn, title, language, category, description FROM books
--  WHERE isbn IN ('NEFRO-SKNB-1', 'NEFRO-DPO-SK', 'NEFRO-PPO-EN',
--                 'NEFRO-BWO-DE', 'NEFRO-SKNB-1-DE',
--                 'NEFRO-SKNB-1-K-DE', 'METAFYZIKA');
-- SELECT COUNT(*) AS records, COUNT(DISTINCT category) AS categories,
--        COUNT(DISTINCT language) AS languages FROM books;
-- Expected, from a 37-record/9-category/2-language baseline: 43 / 9 / 3.
--
-- Rollback (the backup table was created before this transaction):
-- START TRANSACTION;
-- DELETE FROM books
--  WHERE isbn IN ('NEFRO-DPO-SK', 'NEFRO-PPO-EN', 'NEFRO-BWO-DE',
--                 'NEFRO-SKNB-1-DE', 'NEFRO-SKNB-1-K-DE', 'METAFYZIKA')
--    AND NOT EXISTS (
--      SELECT 1 FROM books_backup_2026_10_08_catalog AS original
--       WHERE original.isbn = books.isbn
--    );
-- UPDATE books AS current
-- JOIN books_backup_2026_10_08_catalog AS original
--   ON original.isbn = current.isbn
--    SET current.description = original.description
--  WHERE current.isbn = 'NEFRO-SKNB-1';
-- COMMIT;
