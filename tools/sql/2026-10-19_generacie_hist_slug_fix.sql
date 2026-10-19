-- Correct the public slug of GENERACIE-HIST (catalog id 47).
-- Wrong:   generacie-v-dejinach-a-sucasnosti   (HTTP 404)
-- Correct: generacie-v-dejinach-a-v-sucasnosti (detail HTML 200, file application/pdf 200)
-- The id and the internal identifier stay unchanged; the row is matched by isbn.
--
-- Authorship note (NOT changed here): Books/web lists MUDr. Ľubomír Polaščín,
-- the PDF title page says "Pripravené pre" and its metadata "Littlebird pre...".
-- Authorship is not attributed automatically; align the wording only after an
-- editorial decision.
SET NAMES utf8mb4;

-- Backup BEFORE START TRANSACTION: CREATE TABLE ... AS is DDL and commits.
CREATE TABLE IF NOT EXISTS books_backup_2026_10_19_generacie_slug AS
SELECT * FROM books WHERE isbn = 'GENERACIE-HIST';

START TRANSACTION;

UPDATE books
   SET url = 'https://polascin.net/library.php?slug=generacie-v-dejinach-a-v-sucasnosti&lang=sk',
       web_url = 'https://polascin.net/library_file.php?slug=generacie-v-dejinach-a-v-sucasnosti&download=1'
 WHERE isbn = 'GENERACIE-HIST'
   AND (NOT (url <=> 'https://polascin.net/library.php?slug=generacie-v-dejinach-a-v-sucasnosti&lang=sk')
     OR NOT (web_url <=> 'https://polascin.net/library_file.php?slug=generacie-v-dejinach-a-v-sucasnosti&download=1'));

COMMIT;

-- Verify:
-- SELECT id, isbn, url, web_url FROM books WHERE isbn = 'GENERACIE-HIST';
--
-- Rollback:
-- START TRANSACTION;
-- UPDATE books b JOIN books_backup_2026_10_19_generacie_slug o ON o.isbn = b.isbn
--    SET b.url = o.url, b.web_url = o.web_url
--  WHERE b.isbn = 'GENERACIE-HIST';
-- COMMIT;
