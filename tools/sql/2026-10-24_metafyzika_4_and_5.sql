-- Add the fourth and fifth parts of Nedeľná metafyzika from their public
-- library pages (both added to the polascin.net library on 2026-10-24).
-- Primary metadata sources (verified 2026-10-24):
--   https://polascin.net/library.php?slug=metafyzika-4&lang=sk
--     PDF, 403 kB, 30 pages, Slovak edition dated 25 October 2026
--   https://polascin.net/library.php?slug=metafyzika-5&lang=sk
--     PDF, 669 kB, 36 pages, Slovak edition dated 1 November 2026
-- Both PDFs answered HTTP 200 with Content-Type application/pdf on 2026-10-24.
-- Neither has an ISBN or DOI; the internal catalog identifiers fit
-- books.isbn VARCHAR(20). data/books.json carries the same rows as ids 52
-- and 53; the ids here come from AUTO_INCREMENT, so apply this file only
-- after every earlier migration (the DB held 51 rows on 2026-10-20).
SET NAMES utf8mb4;

-- Back up any matching rows BEFORE START TRANSACTION: CREATE TABLE ... AS is
-- DDL and implicitly commits in MariaDB.
CREATE TABLE IF NOT EXISTS books_backup_2026_10_24_metafyzika_4_and_5 AS
SELECT *
  FROM books
 WHERE isbn IN ('METAFYZIKA-4', 'METAFYZIKA-5')
    OR title IN ('Metafyzika 4', 'Metafyzika 5')
    OR url IN (
         'https://polascin.net/library.php?slug=metafyzika-4&lang=sk',
         'https://polascin.net/library.php?slug=metafyzika-5&lang=sk'
       );

START TRANSACTION;

INSERT INTO books (title, author, year, isbn, description, cover_image, url, web_url, language, category)
  SELECT 'Metafyzika 4',
         'MUDr. Ľubomír Polaščín',
         2026,
         'METAFYZIKA-4',
         'PDF, slovenské vydanie na 25. októbra 2026; do knižnice pridané 24. októbra 2026. Štvrtý diel Nedeľnej metafyziky: filozofický a klinicko-etický spis o hraniciach pomoci, autonómii pacienta a dôvere v medicíne (odmietnutie liečby, odvolanie súhlasu, úloha rodiny a starostlivosť pri konečnosti života), ktorý rozlišuje filozofickú úvahu, klinicko-etické odporúčanie a slovenský právny rámec. 30 strán, 403 kB. Bez ISBN a DOI (interný katalógový identifikátor: METAFYZIKA-4).',
         NULL,
         'https://polascin.net/library.php?slug=metafyzika-4&lang=sk',
         'https://polascin.net/library_file.php?slug=metafyzika-4&download=1',
         'Slovak',
         'Digital Product'
  FROM DUAL
  WHERE NOT EXISTS (
    SELECT 1 FROM books
     WHERE isbn = 'METAFYZIKA-4'
        OR title = 'Metafyzika 4'
        OR url = 'https://polascin.net/library.php?slug=metafyzika-4&lang=sk'
  );

INSERT INTO books (title, author, year, isbn, description, cover_image, url, web_url, language, category)
  SELECT 'Metafyzika 5',
         'MUDr. Ľubomír Polaščín',
         2026,
         'METAFYZIKA-5',
         'PDF, slovenské vydanie na 1. novembra 2026; do knižnice pridané 24. októbra 2026. Piaty diel Nedeľnej metafyziky, Hranice medicíny: filozofická a klinicko-etická úvaha o tom, do akej miery vieme pomôcť pacientovi, ktorý pomoc odmieta. Nadväzuje na štvrtý diel: autonómia a rozhodovacia spôsobilosť, informovaný nesúhlas, akútne zhoršenie, úloha rodiny, konanie a nekonanie, pasívna eutanázia a trestnoprávne hranice, dialýza, paliatívna starostlivosť a pokyny vopred. 36 strán, 669 kB. Bez ISBN a DOI (interný katalógový identifikátor: METAFYZIKA-5).',
         NULL,
         'https://polascin.net/library.php?slug=metafyzika-5&lang=sk',
         'https://polascin.net/library_file.php?slug=metafyzika-5&download=1',
         'Slovak',
         'Digital Product'
  FROM DUAL
  WHERE NOT EXISTS (
    SELECT 1 FROM books
     WHERE isbn = 'METAFYZIKA-5'
        OR title = 'Metafyzika 5'
        OR url = 'https://polascin.net/library.php?slug=metafyzika-5&lang=sk'
  );

COMMIT;

-- Verify the added rows by stable identifier:
-- SELECT id, isbn, title, language, category, url, web_url FROM books
--  WHERE isbn IN ('METAFYZIKA-4', 'METAFYZIKA-5');
--
-- Rollback the inserted rows if they were not present in the backup:
-- START TRANSACTION;
-- DELETE FROM books
--  WHERE isbn IN ('METAFYZIKA-4', 'METAFYZIKA-5')
--    AND NOT EXISTS (
--      SELECT 1 FROM books_backup_2026_10_24_metafyzika_4_and_5 AS original
--       WHERE original.isbn = books.isbn
--    );
-- COMMIT;
