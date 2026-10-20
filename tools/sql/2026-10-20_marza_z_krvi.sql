-- Add the published Slovak e-book Marza z krvi, verified 2026-10-20.
-- Source: https://polascin.gumroad.com/l/marza-z-krvi
-- Gumroad product JSON: is_published=true, is_compliance_blocked=false,
-- currency_code=eur, price_cents=2000. Seller profile search also verified.
-- The book has no separate publisher page; Gumroad is both source and sales channel.
-- EPUB, PDF and AZW3 are included in the EUR 20 bundle. No channel discrepancy.
-- The author is confirmed by the title page and the Gumroad product.
-- No ISBN or DOI; MARZA-Z-KRVI is an internal identifier (11 characters).
SET NAMES utf8mb4;

-- DDL backup must precede the transaction because MariaDB implicitly commits DDL.
CREATE TABLE IF NOT EXISTS books_backup_2026_10_20_marza AS
SELECT * FROM books
 WHERE isbn = 'MARZA-Z-KRVI'
    OR url = 'https://polascin.gumroad.com/l/marza-z-krvi'
    OR title = 'Marža z krvi: Triler o ukradnutých minútach (e-kniha)';

START TRANSACTION;

INSERT INTO books (title, author, year, isbn, description, cover_image, url, web_url, language, category)
SELECT 'Marža z krvi: Triler o ukradnutých minútach (e-kniha)',
       'MUDr. Ľubomír Polaščín',
       2026,
       'MARZA-Z-KRVI',
       'E-kniha, 1. slovenské vydanie - 20. októbra 2026. Ilustrovaný medicínsky triler o ukradnutých minútach, moci a cene ľudského života v prostredí dialyzačnej starostlivosti. Dokáže nezávislý nefrológ odhaliť systém, ktorý mení pacientov na finančnú záťaž, skôr než zničí jeho aj všetkých, ktorí mu pomáhajú? Za číslami a rozhodnutiami sa skrývajú pacienti, ktorým ubúda čas. Pátranie po pravde sa mení na zápas so systémom, ktorý má čo stratiť. Kompletné slovenské vydanie vo formátoch EPUB, PDF a AZW3 je dostupné cez Gumroad za 20 €; všetky tri formáty sú zahrnuté v jednej cene. Digitálna publikácia, nie tlačená kniha. Román je fikcia a nie je zdrojom medicínskych ani právnych rád. Bez ISBN a DOI (interný katalógový identifikátor: MARZA-Z-KRVI).',
       'https://books.polascin.net/assets/images/marza-z-krvi-obalka.jpg',
       'https://polascin.gumroad.com/l/marza-z-krvi',
       NULL,
       'Slovak',
       'Medical Thriller'
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM books
   WHERE isbn = 'MARZA-Z-KRVI'
      OR url = 'https://polascin.gumroad.com/l/marza-z-krvi'
      OR title = 'Marža z krvi: Triler o ukradnutých minútach (e-kniha)'
);

COMMIT;

-- Verify: SELECT isbn, title, author, description, cover_image, url FROM books
-- WHERE isbn = 'MARZA-Z-KRVI';
-- Rollback (only the newly inserted record, never a pre-existing row):
-- START TRANSACTION;
-- DELETE FROM books WHERE isbn = 'MARZA-Z-KRVI'
-- AND NOT EXISTS (SELECT 1 FROM books_backup_2026_10_20_marza AS original
--                 WHERE original.isbn = books.isbn);
-- COMMIT;
