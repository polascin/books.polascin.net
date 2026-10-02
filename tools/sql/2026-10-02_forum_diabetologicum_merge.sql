-- books.polascin.net: merge the duplicated Forum diabetologicum record and
-- align the Diabetik title with the published headline, 2 October 2026
--
-- The 2012 Forum diabetologicum article was held twice: once as a library
-- record (isbn 'N/A', Google-search URL, from the UK Bratislava catalogue,
-- ref. vtls000259231) and once as the 2026-09-21 proLékaře import
-- (isbn 'FD-40671'). They are the same article, so the row is merged into one
-- and keeps the stable FD-40671 identifier.
--
-- Bibliography checked before merging: Forum diabetologicum (Facta Medica)
-- has been published since 2012, so the 2012 issue is roč. 1 — the "roč. 11"
-- in the proLékaře-derived description was wrong and is corrected to roč. 1,
-- č. 1 (2012), s. 24-31 as catalogued by UK Bratislava. Both ISSNs are kept
-- and labelled: 1805-3807 print, 1805-9279 online (ISSN portal). No DOI and no
-- page range beyond the catalogued one is asserted, and no full text is
-- reproduced — proLékaře.cz serves it only to registered professionals.
--
-- Author list follows the library record (five names); the online listing
-- shows the first four. Category follows the catalog's existing
-- 'Academic Paper', not the one-off 'Medical Writing' from the import.
--
-- Also: the Diabetik interview is published as "MUDr. Ľubomír Polaščín:
-- Cukrovka ničí obličky čoraz viac" (verified on dia.hnonline.sk, 08.12.2019
-- 15:27, autorka Zlatica Beňová); the stored title dropped the name prefix.
--
-- Mirrors data/books.json at the same commit. The merged row is matched by its
-- old (isbn, title) pair because 'N/A' is not unique; every statement is
-- guarded, so re-running is a no-op.

START TRANSACTION;

CREATE TABLE IF NOT EXISTS books_backup_2026_10_02_merge
  AS SELECT * FROM books
     WHERE isbn IN ('FD-40671', 'DIA-2054968')
        OR (isbn = 'N/A' AND title LIKE 'Novšie aspekty antihypertenzívnej%');

-- Drop the proLékaře import row if it was ever applied separately, so the
-- merge below cannot leave two rows behind.
DELETE FROM books
  WHERE isbn = 'FD-40671'
    AND EXISTS (
      SELECT 1 FROM (SELECT 1 FROM books WHERE isbn = 'N/A'
                       AND title LIKE 'Novšie aspekty antihypertenzívnej%') AS legacy
    );

UPDATE books
SET
  isbn = 'FD-40671',
  author = 'Silvester Krčméry, Ľubomír Polaščín, Rastislav Tahotný, Zuzana Gábrišová, Klára Soláriková',
  year = 2012,
  category = 'Academic Paper',
  language = 'Slovak',
  url = 'https://www.prolekare.cz/casopisy/forum-diabetologicum/2012-1-11/novsie-aspekty-antihypertenzivnej-liecby-u-pacientov-s-diabetickou-nefropatiou-40671',
  web_url = 'https://www.forumdiabetologicum.sk/',
  description = 'Odborný recenzovaný článok v časopise Forum diabetologicum (vydavateľ Facta Medica), roč. 1, č. 1 (2012), s. 24-31; print ISSN 1805-3807, online ISSN 1805-9279. Autori podľa katalogizačného záznamu UK Bratislava (ref. číslo vtls000259231): Silvester Krčméry, Ľubomír Polaščín, Rastislav Tahotný, Zuzana Gábrišová, Klára Soláriková; online výpis na proLékaře.cz uvádza prvých štyroch. Článok rozoberá novšie aspekty antihypertenzívnej liečby u pacientov s diabetickou nefropatiou: konzistentnú metabolickú kontrolu a kontrolu krvného tlaku, blokádu RAAS (ACE inhibítory, sartany), kombinovanú liečbu a novšie skupiny antihypertenzív, s cieľom spomaliť progresiu ochorenia obličiek a znížiť kardiovaskulárne riziko. Online plný text je prístupný len registrovaným zdravotníckym pracovníkom (proLékaře.cz, článok č. 40671).'
WHERE isbn = 'N/A'
  AND title LIKE 'Novšie aspekty antihypertenzívnej%';

UPDATE books
SET title = 'MUDr. Ľubomír Polaščín: Cukrovka ničí obličky čoraz viac'
WHERE isbn = 'DIA-2054968'
  AND title <> 'MUDr. Ľubomír Polaščín: Cukrovka ničí obličky čoraz viac';

COMMIT;

-- Verification:
-- SELECT id, isbn, title, author, year, category FROM books
--   WHERE isbn IN ('FD-40671', 'DIA-2054968', 'ZDN-96291978', 'VP-2026-3-4-KDIGO')
--   ORDER BY id;
-- SELECT isbn, COUNT(*) FROM books WHERE isbn <> 'N/A' GROUP BY isbn HAVING COUNT(*) > 1;
--
-- Rollback:
-- START TRANSACTION;
-- DELETE FROM books WHERE isbn = 'FD-40671';
-- INSERT INTO books SELECT * FROM books_backup_2026_10_02_merge;
-- COMMIT;
