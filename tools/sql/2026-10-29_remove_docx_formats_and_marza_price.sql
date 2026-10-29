-- Remove DOCX from the offered format lists and set the Marža z krvi price
-- to 9,98 EUR (owner decision, 2026-10-29).
-- Context:
--   * DOCX is no longer offered on nefro.polascin.net (the primary source of
--     the SK Nefro editions), so the catalog descriptions follow the source.
--   * The Marža z krvi price is 9,98 EUR on nefro.polascin.net and on Gumroad.
--   * Rows are matched by description content / isbn, never by numeric id.
--   * Every statement is guarded, so re-running the file is a no-op.
SET NAMES utf8mb4;

-- Backup BEFORE START TRANSACTION: CREATE TABLE ... AS is DDL and commits.
CREATE TABLE IF NOT EXISTS books_backup_2026_10_29_docx_price AS
SELECT *
  FROM books
 WHERE description LIKE '%DOCX%'
    OR isbn = 'MARZA-Z-KRVI';

START TRANSACTION;

UPDATE books
   SET description = REPLACE(description, 'PDF, EPUB, AZW3, DOCX a ODT', 'PDF, EPUB, AZW3 a ODT')
 WHERE description LIKE '%PDF, EPUB, AZW3, DOCX a ODT%';

UPDATE books
   SET description = REPLACE(description, 'PDF, EPUB, AZW3, DOCX, ODT', 'PDF, EPUB, AZW3, ODT')
 WHERE description LIKE '%PDF, EPUB, AZW3, DOCX, ODT%';

UPDATE books
   SET description = REPLACE(description, 'PDF, EPUB, AZW3, DOCX und ODT', 'PDF, EPUB, AZW3 und ODT')
 WHERE description LIKE '%PDF, EPUB, AZW3, DOCX und ODT%';

UPDATE books
   SET description = 'E-kniha, 1. slovenské vydanie - 20. októbra 2026. Ilustrovaný medicínsky triler o ukradnutých minútach, moci a cene ľudského života v prostredí dialyzačnej starostlivosti. Dokáže nezávislý nefrológ odhaliť systém, ktorý mení pacientov na finančnú záťaž, skôr než zničí jeho aj všetkých, ktorí mu pomáhajú? Za číslami a rozhodnutiami sa skrývajú pacienti, ktorým ubúda čas. Pátranie po pravde sa mení na zápas so systémom, ktorý má čo stratiť. Kompletné slovenské vydanie vo formátoch EPUB, PDF a AZW3 je dostupné cez Gumroad za 9,98 €; všetky tri formáty sú zahrnuté v jednej cene. Digitálna publikácia, nie tlačená kniha. Román je fikcia a nie je zdrojom medicínskych ani právnych rád. Bez ISBN a DOI (interný katalógový identifikátor: MARZA-Z-KRVI).'
 WHERE isbn = 'MARZA-Z-KRVI'
   AND NOT (description <=> 'E-kniha, 1. slovenské vydanie - 20. októbra 2026. Ilustrovaný medicínsky triler o ukradnutých minútach, moci a cene ľudského života v prostredí dialyzačnej starostlivosti. Dokáže nezávislý nefrológ odhaliť systém, ktorý mení pacientov na finančnú záťaž, skôr než zničí jeho aj všetkých, ktorí mu pomáhajú? Za číslami a rozhodnutiami sa skrývajú pacienti, ktorým ubúda čas. Pátranie po pravde sa mení na zápas so systémom, ktorý má čo stratiť. Kompletné slovenské vydanie vo formátoch EPUB, PDF a AZW3 je dostupné cez Gumroad za 9,98 €; všetky tri formáty sú zahrnuté v jednej cene. Digitálna publikácia, nie tlačená kniha. Román je fikcia a nie je zdrojom medicínskych ani právnych rád. Bez ISBN a DOI (interný katalógový identifikátor: MARZA-Z-KRVI).');

COMMIT;

-- Verify:
--   SELECT COUNT(*) FROM books WHERE description LIKE '%DOCX%';   -- expect 0
--   SELECT description FROM books WHERE isbn = 'MARZA-Z-KRVI';    -- expect "za 9,98 €"
-- Rollback (restores the descriptions of the touched rows only):
--   UPDATE books b JOIN books_backup_2026_10_29_docx_price o ON o.isbn = b.isbn
--      SET b.description = o.description;
