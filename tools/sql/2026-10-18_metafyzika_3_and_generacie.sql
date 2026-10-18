-- Add three verified PDF publications from their public library pages.
-- Primary metadata sources:
--   https://polascin.net/library.php?slug=metafyzika-3&lang=sk
--   https://polascin.net/library.php?slug=generacie-v-dejinach-a-sucasnosti&lang=sk
--   https://polascin.net/library.php?slug=sk-nefro-dimostrato-probabile-aperto&lang=sk
-- The Slovak PDFs were reachable on 2026-10-18; the Italian PDF was added
-- on 2026-10-13. None has an ISBN or DOI; internal catalog identifiers fit
-- books.isbn VARCHAR(20).
SET NAMES utf8mb4;

-- Back up any matching rows BEFORE START TRANSACTION: CREATE TABLE ... AS is
-- DDL and implicitly commits in MariaDB.
CREATE TABLE IF NOT EXISTS books_backup_2026_10_18_new_publications AS
SELECT *
  FROM books
 WHERE isbn IN ('METAFYZIKA-3', 'GENERACIE-HIST', 'NEFRO-DPA-IT')
    OR title IN (
         'Metafyzika 3',
         'Generácie v dejinách a v súčasnosti',
         'SK Nefro: Dimostrato, probabile, aperto'
       )
    OR url IN (
         'https://polascin.net/library.php?slug=metafyzika-3&lang=sk',
         'https://polascin.net/library.php?slug=generacie-v-dejinach-a-sucasnosti&lang=sk',
         'https://polascin.net/library.php?slug=sk-nefro-dimostrato-probabile-aperto&lang=sk'
       );

START TRANSACTION;

INSERT INTO books (title, author, year, isbn, description, cover_image, url, web_url, language, category)
  SELECT 'Metafyzika 3',
         'MUDr. Ľubomír Polaščín',
         2026,
         'METAFYZIKA-3',
         'PDF, slovenské vydanie na 18. októbra 2026; do knižnice pridané 17. októbra 2026. Tretí diel Nedeľnej metafyziky: analytický spis o gnóze a gnosticizme, pôvode človeka, nedokonalosti sveta a poznaní, ktoré má oslobodzovať. 25 strán, 359 kB. Bez ISBN a DOI (interný katalógový identifikátor: METAFYZIKA-3).',
         NULL,
         'https://polascin.net/library.php?slug=metafyzika-3&lang=sk',
         'https://polascin.net/library_file.php?slug=metafyzika-3&download=1',
         'Slovak',
         'Digital Product'
  FROM DUAL
  WHERE NOT EXISTS (
    SELECT 1 FROM books
     WHERE isbn = 'METAFYZIKA-3'
        OR title = 'Metafyzika 3'
        OR url = 'https://polascin.net/library.php?slug=metafyzika-3&lang=sk'
  );

INSERT INTO books (title, author, year, isbn, description, cover_image, url, web_url, language, category)
  SELECT 'Generácie v dejinách a v súčasnosti',
         'MUDr. Ľubomír Polaščín',
         2026,
         'GENERACIE-HIST',
         'PDF, rozšírené vydanie zo 17. októbra 2026; do knižnice pridané 17. októbra 2026. Kritická analytická štúdia o vzniku, pomenovaniach a charakteristikách generácií a medzigeneračných vzťahoch, v medzinárodnom prehľade so slovenským a československým kontextom, vrátane jazyka, slangu, zdravotníctva a vzdelávania. 35 strán, 256 kB. Bez ISBN a DOI (interný katalógový identifikátor: GENERACIE-HIST).',
         NULL,
         'https://polascin.net/library.php?slug=generacie-v-dejinach-a-sucasnosti&lang=sk',
         'https://polascin.net/library_file.php?slug=generacie-v-dejinach-a-sucasnosti&download=1',
         'Slovak',
         'Digital Product'
  FROM DUAL
  WHERE NOT EXISTS (
    SELECT 1 FROM books
     WHERE isbn = 'GENERACIE-HIST'
        OR title = 'Generácie v dejinách a v súčasnosti'
        OR url = 'https://polascin.net/library.php?slug=generacie-v-dejinach-a-sucasnosti&lang=sk'
  );

INSERT INTO books (title, author, year, isbn, description, cover_image, url, web_url, language, category)
  SELECT 'SK Nefro: Dimostrato, probabile, aperto',
         'MUDr. Ľubomír Polaščín',
         2026,
         'NEFRO-DPA-IT',
         'PDF, talianske vydanie; do knižnice pridané 13. októbra 2026. Kapitolové úvodníky k publikácii SK Nefro Báza 1 o nefrológii a internej medicíne, pokrývajúce články z obdobia 25. apríla až 2. októbra 2026. Veľkosť 1,1 MB. Bez ISBN a DOI (interný katalógový identifikátor: NEFRO-DPA-IT).',
         NULL,
         'https://polascin.net/library.php?slug=sk-nefro-dimostrato-probabile-aperto&lang=sk',
         'https://polascin.net/library_file.php?slug=sk-nefro-dimostrato-probabile-aperto&download=1',
         'Italian',
         'Digital Product'
  FROM DUAL
  WHERE NOT EXISTS (
    SELECT 1 FROM books
     WHERE isbn = 'NEFRO-DPA-IT'
        OR title = 'SK Nefro: Dimostrato, probabile, aperto'
        OR url = 'https://polascin.net/library.php?slug=sk-nefro-dimostrato-probabile-aperto&lang=sk'
  );

COMMIT;

-- Verify the added rows by stable identifier:
-- SELECT isbn, title, language, category, url, web_url FROM books
--  WHERE isbn IN ('METAFYZIKA-3', 'GENERACIE-HIST', 'NEFRO-DPA-IT');
--
-- Rollback the inserted rows if they were not present in the backup:
-- START TRANSACTION;
-- DELETE FROM books
--  WHERE isbn IN ('METAFYZIKA-3', 'GENERACIE-HIST', 'NEFRO-DPA-IT')
--    AND NOT EXISTS (
--      SELECT 1 FROM books_backup_2026_10_18_new_publications AS original
--       WHERE original.isbn = books.isbn
--    );
-- COMMIT;
