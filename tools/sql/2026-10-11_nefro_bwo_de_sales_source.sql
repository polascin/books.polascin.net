-- Keep the free German PDF as the primary catalog source and add the verified
-- paid Gumroad bundle as its secondary sales channel. The free library page
-- describes a 105-page PDF with 16 chapter editorials and one appendix
-- editorial; Gumroad describes a paid five-format bundle with 17 expanded
-- chapter editorials, 387 source articles, and no DRM. Preserve those
-- channel-specific facts rather than conflating the products.
-- Gumroad product verification: publicly visible on the seller profile;
-- is_published=true; is_compliance_blocked=false (checked 2026-10-11).
-- No publication date, ISBN, DOI, or price is added.
SET NAMES utf8mb4;

-- Back up the exact stable-key row before START TRANSACTION because CREATE
-- TABLE ... AS SELECT is DDL and implicitly commits in MariaDB.
CREATE TABLE IF NOT EXISTS books_backup_2026_10_11_nefro_bwo_de_sales_source AS
SELECT *
  FROM books
 WHERE isbn = 'NEFRO-BWO-DE';

START TRANSACTION;

UPDATE books
   SET description = 'Kostenloses PDF (105 Seiten) mit 16 Kapitel-Editorials und einem Editorial zum Anhang zu den 387 Fachartikeln von SK Nefro Báza 1; kein vollständiger Band. Separates kostenpflichtiges Gumroad-Paket: 17 erweiterte Kapitel-Editorials zu 387 Fachartikeln in PDF, EPUB, AZW3, DOCX und ODT; ohne DRM. Ohne ISBN und DOI (interne Katalogkennung: NEFRO-BWO-DE). Kostenloser Zugang bedeutet keine offene Lizenz; alle Rechte vorbehalten.',
       web_url = 'https://polascin.gumroad.com/l/sk-nefro-belegt-wahrscheinlich-offen-de'
 WHERE isbn = 'NEFRO-BWO-DE'
   AND (
     NOT (description <=> 'Kostenloses PDF (105 Seiten) mit 16 Kapitel-Editorials und einem Editorial zum Anhang zu den 387 Fachartikeln von SK Nefro Báza 1; kein vollständiger Band. Separates kostenpflichtiges Gumroad-Paket: 17 erweiterte Kapitel-Editorials zu 387 Fachartikeln in PDF, EPUB, AZW3, DOCX und ODT; ohne DRM. Ohne ISBN und DOI (interne Katalogkennung: NEFRO-BWO-DE). Kostenloser Zugang bedeutet keine offene Lizenz; alle Rechte vorbehalten.')
     OR NOT (web_url <=> 'https://polascin.gumroad.com/l/sk-nefro-belegt-wahrscheinlich-offen-de')
   );

COMMIT;

-- Verify the updated row and unchanged catalog totals after applying:
-- SELECT isbn, title, description, url, web_url FROM books
--  WHERE isbn = 'NEFRO-BWO-DE';
-- SELECT COUNT(*) AS records, COUNT(DISTINCT category) AS categories,
--        COUNT(DISTINCT language) AS languages FROM books;
-- Expected: 43 / 9 / 3. Compare every catalog field by stable identifier
-- against data/books.json using CATALOG_CHECK_DB=1 in an isolated database.
--
-- Rollback to the backed-up row:
-- START TRANSACTION;
-- UPDATE books AS current
-- JOIN books_backup_2026_10_11_nefro_bwo_de_sales_source AS original
--   ON original.isbn = current.isbn
--    SET current.description = original.description,
--        current.web_url = original.web_url
--  WHERE current.isbn = 'NEFRO-BWO-DE';
-- COMMIT;
