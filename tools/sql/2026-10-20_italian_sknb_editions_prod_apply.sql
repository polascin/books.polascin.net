-- Production catch-up for the two Italian SK Nefro Báza 1 editions (ids 49, 50)
-- and the Marža z krvi row (id 51).
--
-- Why this file exists (verified on the production DB, 2026-10-20):
--   * tools/sql/2026-10-19_italian_sknb_editions.sql was committed (03a9a37)
--     and deployed in git, but it was never applied to the production DB:
--     there is no books_backup_2026_10_19_italian_editions table and the rows
--     NEFRO-SKNB-1-IT / NEFRO-SKNB-1-K-IT are absent. `tools/` is excluded by
--     .deployignore, so migrations only run when someone applies them by hand.
--   * tools/sql/2026-10-20_marza_z_krvi.sql WAS applied (backup table
--     books_backup_2026_10_20_marza exists), so AUTO_INCREMENT handed
--     MARZA-Z-KRVI id 49 instead of the id 51 that data/books.json records.
--   * Result: DB 49 rows / JSON 51 rows; catalog.php (DB-driven) shows 49.
--
-- This migration makes the DB identical to data/books.json, ids included:
--   1. move MARZA-Z-KRVI from id 49 to id 51 (row matched by isbn, never by id);
--   2. insert the two Italian editions with their catalog ids 49 and 50.
-- Every statement is guarded, so re-running it is a no-op. No table references
-- books.id (checked information_schema.KEY_COLUMN_USAGE), and the only public
-- use of the id is the `#book-<id>` anchor on catalog.php.
--
-- The 2026-10-19 file stays for history; do NOT run it after this one (it would
-- be a no-op anyway thanks to its NOT EXISTS guards on isbn/url).
SET NAMES utf8mb4;

-- Backup BEFORE START TRANSACTION: CREATE TABLE ... AS is DDL and commits.
CREATE TABLE IF NOT EXISTS books_backup_2026_10_20_italian_prod_apply AS
SELECT *
  FROM books
 WHERE isbn IN ('NEFRO-SKNB-1-IT', 'NEFRO-SKNB-1-K-IT', 'MARZA-Z-KRVI')
    OR id IN (49, 50, 51);

START TRANSACTION;

-- 1) Marža z krvi: id 49 -> 51, only while 51 is free.
UPDATE books
   SET id = 51
 WHERE isbn = 'MARZA-Z-KRVI'
   AND id = 49
   AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM books WHERE id = 51) AS taken);

-- 2) SK Nefro Báza 1 — Edizione italiana (id 49)
INSERT INTO books (id, title, author, year, isbn, description, cover_image, url, web_url, language, category)
  SELECT 49,
         'SK Nefro Báza 1 — Edizione italiana',
         'MUDr. Ľubomír Polaščín',
         2026,
         'NEFRO-SKNB-1-IT',
         'E-kniha, 1. vydanie - október 2026. Talianske vydanie prvého zväzku série SK Nefro Báza: 387 odborných článkov na 1853 stranách, 393 ilustrácií a 722612 slov. Formáty PDF, EPUB, AZW3, DOCX a ODT; 7 EUR za jeden formát a 12 EUR za všetky formáty. Bez ISBN a DOI (interný katalógový identifikátor: NEFRO-SKNB-1-IT). Primárny zdroj: nefro.polascin.net; sekundárny predajný kanál: Gumroad (sk-nefro-baza-1-it).',
         'https://nefro.polascin.net/img/publikacie/sk-nefro-baza-1-it-obalka.jpg',
         'https://nefro.polascin.net/publikacia.php?slug=sk-nefro-baza-1-it',
         'https://polascin.gumroad.com/l/sk-nefro-baza-1-it?layout=profile',
         'Italian',
         'Digital Product'
  FROM DUAL
  WHERE NOT EXISTS (
    SELECT 1 FROM books
     WHERE isbn = 'NEFRO-SKNB-1-IT'
        OR url = 'https://nefro.polascin.net/publikacia.php?slug=sk-nefro-baza-1-it'
        OR id = 49
  );

-- 3) SK Nefro Báza 1 Compendio — Edizione italiana (id 50)
INSERT INTO books (id, title, author, year, isbn, description, cover_image, url, web_url, language, category)
  SELECT 50,
         'SK Nefro Báza 1 Compendio — Edizione italiana',
         'MUDr. Ľubomír Polaščín',
         2026,
         'NEFRO-SKNB-1-K-IT',
         'E-kniha, 1. vydanie - október 2026. Talianske vydanie kompendia: 387 odborných článkov spracovaných do abstraktov a stručných zhrnutí na 290 stranách; 154412 slov, bez ilustrácií. Formáty PDF, EPUB, AZW3, DOCX a ODT; 7 EUR za jeden formát a 12 EUR za všetky formáty. Bez ISBN a DOI (interný katalógový identifikátor: NEFRO-SKNB-1-K-IT). Primárny zdroj: nefro.polascin.net; sekundárny predajný kanál: Gumroad (sk-nefro-baza-1-compendio-it).',
         'https://nefro.polascin.net/img/publikacie/sk-nefro-baza-1-kompendium-it-obalka.jpg',
         'https://nefro.polascin.net/publikacia.php?slug=sk-nefro-baza-1-kompendium-it',
         'https://polascin.gumroad.com/l/sk-nefro-baza-1-compendio-it?layout=profile',
         'Italian',
         'Digital Product'
  FROM DUAL
  WHERE NOT EXISTS (
    SELECT 1 FROM books
     WHERE isbn = 'NEFRO-SKNB-1-K-IT'
        OR url = 'https://nefro.polascin.net/publikacia.php?slug=sk-nefro-baza-1-kompendium-it'
        OR id = 50
  );

COMMIT;

-- Verify (expected: 51 rows; 49 = NEFRO-SKNB-1-IT, 50 = NEFRO-SKNB-1-K-IT, 51 = MARZA-Z-KRVI):
-- SELECT COUNT(*) FROM books;
-- SELECT id, isbn, title, language, category FROM books WHERE id >= 49 ORDER BY id;
--
-- Rollback:
-- START TRANSACTION;
-- DELETE FROM books
--  WHERE isbn IN ('NEFRO-SKNB-1-IT', 'NEFRO-SKNB-1-K-IT')
--    AND NOT EXISTS (
--      SELECT 1 FROM books_backup_2026_10_20_italian_prod_apply AS o
--       WHERE o.isbn = books.isbn
--    );
-- UPDATE books
--    SET id = 49
--  WHERE isbn = 'MARZA-Z-KRVI' AND id = 51
--    AND EXISTS (SELECT 1 FROM books_backup_2026_10_20_italian_prod_apply AS o
--                 WHERE o.isbn = 'MARZA-Z-KRVI' AND o.id = 49);
-- COMMIT;
