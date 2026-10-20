-- Add the two paid Italian SK Nefro Báza 1 editions (catalog ids 49 and 50).
-- NOTE 2026-10-20: this file was committed and deployed in git but never applied to
-- the production DB (no books_backup_2026_10_19_italian_editions table). Production
-- was brought in line by tools/sql/2026-10-20_italian_sknb_editions_prod_apply.sql,
-- which also sets the ids to 49/50 as in data/books.json. Keep for history only.
--
-- Primary sources (checked 2026-10-19, HTTP 200):
--   https://nefro.polascin.net/publikacia.php?slug=sk-nefro-baza-1-it
--   https://nefro.polascin.net/publikacia.php?slug=sk-nefro-baza-1-kompendium-it
-- Secondary sales channel (Gumroad, is_published true, is_compliance_blocked false):
--   https://polascin.gumroad.com/l/sk-nefro-baza-1-it?layout=profile
--   https://polascin.gumroad.com/l/sk-nefro-baza-1-compendio-it?layout=profile
-- Prices on the primary pages: 7 EUR single format, 12 EUR all formats.
-- No ISBN or DOI; NEFRO-SKNB-1-IT (15) and NEFRO-SKNB-1-K-IT (17) fit
-- books.isbn VARCHAR(20). Rows are matched by isbn, never by numeric id.
SET NAMES utf8mb4;

-- Backup BEFORE START TRANSACTION: CREATE TABLE ... AS is DDL and commits.
CREATE TABLE IF NOT EXISTS books_backup_2026_10_19_italian_editions AS
SELECT *
  FROM books
 WHERE isbn IN ('NEFRO-SKNB-1-IT', 'NEFRO-SKNB-1-K-IT')
    OR url IN (
         'https://nefro.polascin.net/publikacia.php?slug=sk-nefro-baza-1-it',
         'https://nefro.polascin.net/publikacia.php?slug=sk-nefro-baza-1-kompendium-it'
       );

START TRANSACTION;

INSERT INTO books (title, author, year, isbn, description, cover_image, url, web_url, language, category)
  SELECT 'SK Nefro Báza 1 — Edizione italiana',
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
  );

INSERT INTO books (title, author, year, isbn, description, cover_image, url, web_url, language, category)
  SELECT 'SK Nefro Báza 1 Compendio — Edizione italiana',
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
  );

COMMIT;

-- Verify:
-- SELECT id, isbn, title, language, category FROM books
--  WHERE isbn IN ('NEFRO-SKNB-1-IT', 'NEFRO-SKNB-1-K-IT');
--
-- Rollback (only rows absent from the backup):
-- START TRANSACTION;
-- DELETE FROM books
--  WHERE isbn IN ('NEFRO-SKNB-1-IT', 'NEFRO-SKNB-1-K-IT')
--    AND NOT EXISTS (
--      SELECT 1 FROM books_backup_2026_10_19_italian_editions AS o
--       WHERE o.isbn = books.isbn
--    );
-- COMMIT;
