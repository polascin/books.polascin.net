-- books.polascin.net: two AVN 2016 congress talks, 5 October 2026
--
-- Verified 2026-10-05 against the primary source
-- https://www.tigis.cz/images/stories/Aktuality_nefro/2016/03/AVN_program_3_2016.pdf
-- (HTTP 200, application/pdf). Text extraction of that PDF shows:
--   * Printed page 81, Thursday 20. 10. 2016, block Dialýza a transplantácia
--     (16.40–17.40): "Dopad voľby dialyzačnej membrány na hladinu albumínu",
--     Ľ. Polaščín, J. Kalatová, G. Karasová, L. Slezáková (Bratislava).
--   * Printed page 82, Friday 21. 10. 2016, block Ekonomika v nefrológii
--     (9.30–11.00): "Ekonomika nefrologickej ambulancie",
--     M. Alaxinová, Ľ. Polaščín (Bratislava).
--
-- Both are program records of congress talks (prednášky), not journal
-- articles and not full abstracts. The same PDF already holds the page-80
-- poster (title beginning "DLHODOBÁ ÚSPEŠNÁ REMISIA..."). There is no
-- separate page for either talk, so all three records share that primary
-- URL and web_url stays NULL. NOT EXISTS / the update guard therefore match
-- on isbn and title, never on the shared PDF URL.
--
-- No ISBN and no DOI exist for these talks, and none was invented. Catalog
-- keys fit books.isbn VARCHAR(20) (this server has no STRICT_TRANS_TABLES,
-- so a longer value would be silently truncated):
--   AVN-2016-MEMB  (13 chars)  membrane / albumin talk, program p. 81
--   AVN-2016-AMB   (12 chars)  outpatient-clinic economics, program p. 82
-- getBookIdentifier() renders both as ID, not as ISBN.
--
-- cover_image stays NULL. The column is VARCHAR(255); a generated SVG data
-- URI would be truncated. The catalog does not render covers.
--
-- Strings below are copied from data/books.json. Production apply uses bound
-- parameters read from that file (descriptions are not split on ';').
-- Backup is DDL and runs BEFORE the transaction, because CREATE TABLE ...
-- AS SELECT implicitly commits in MariaDB. On the first run the pre-image
-- is empty.
--
-- Pair rows by isbn, never by numeric id.

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS books_backup_2026_10_05_avn AS
SELECT * FROM books
 WHERE isbn IN ('AVN-2016-MEMB', 'AVN-2016-AMB')
    OR title IN (
         'Dopad voľby dialyzačnej membrány na hladinu albumínu',
         'Ekonomika nefrologickej ambulancie'
       );

START TRANSACTION;

INSERT INTO books (title, author, year, isbn, description, cover_image, url, web_url, language, category)
  SELECT 'Dopad voľby dialyzačnej membrány na hladinu albumínu',
         'Ľ. Polaščín, J. Kalatová, G. Karasová, L. Slezáková',
         2016,
         'AVN-2016-MEMB',
         'Programový záznam odbornej prednášky na 38. kongrese Slovenskej nefrologickej spoločnosti s medzinárodnou účasťou, uverejnený v programe časopisu Aktuality v nefrologii (roč. 22, 2016, č. 3, s. 81). Dátum 20. 10. 2016 (štvrtok), blok Dialýza a transplantácia (16.40–17.40, 12 + 3 min.). Prednášajúci: Ľ. Polaščín, J. Kalatová, G. Karasová, L. Slezáková (Bratislava). Ide o kongresovú prednášku zaznamenanú v programe, nie o plný text článku ani abstraktu.',
         NULL,
         'https://www.tigis.cz/images/stories/Aktuality_nefro/2016/03/AVN_program_3_2016.pdf',
         NULL,
         'Slovak',
         'Academic Paper'
  FROM DUAL
  WHERE NOT EXISTS (
    SELECT 1 FROM books
     WHERE isbn = 'AVN-2016-MEMB'
        OR title = 'Dopad voľby dialyzačnej membrány na hladinu albumínu'
  );

UPDATE books
   SET title = 'Dopad voľby dialyzačnej membrány na hladinu albumínu',
       author = 'Ľ. Polaščín, J. Kalatová, G. Karasová, L. Slezáková',
       year = 2016,
       description = 'Programový záznam odbornej prednášky na 38. kongrese Slovenskej nefrologickej spoločnosti s medzinárodnou účasťou, uverejnený v programe časopisu Aktuality v nefrologii (roč. 22, 2016, č. 3, s. 81). Dátum 20. 10. 2016 (štvrtok), blok Dialýza a transplantácia (16.40–17.40, 12 + 3 min.). Prednášajúci: Ľ. Polaščín, J. Kalatová, G. Karasová, L. Slezáková (Bratislava). Ide o kongresovú prednášku zaznamenanú v programe, nie o plný text článku ani abstraktu.',
       cover_image = NULL,
       url = 'https://www.tigis.cz/images/stories/Aktuality_nefro/2016/03/AVN_program_3_2016.pdf',
       web_url = NULL,
       language = 'Slovak',
       category = 'Academic Paper'
 WHERE isbn = 'AVN-2016-MEMB'
   AND (
        NOT (title <=> 'Dopad voľby dialyzačnej membrány na hladinu albumínu')
     OR NOT (author <=> 'Ľ. Polaščín, J. Kalatová, G. Karasová, L. Slezáková')
     OR NOT (year <=> 2016)
     OR NOT (description <=> 'Programový záznam odbornej prednášky na 38. kongrese Slovenskej nefrologickej spoločnosti s medzinárodnou účasťou, uverejnený v programe časopisu Aktuality v nefrologii (roč. 22, 2016, č. 3, s. 81). Dátum 20. 10. 2016 (štvrtok), blok Dialýza a transplantácia (16.40–17.40, 12 + 3 min.). Prednášajúci: Ľ. Polaščín, J. Kalatová, G. Karasová, L. Slezáková (Bratislava). Ide o kongresovú prednášku zaznamenanú v programe, nie o plný text článku ani abstraktu.')
     OR NOT (cover_image <=> NULL)
     OR NOT (url <=> 'https://www.tigis.cz/images/stories/Aktuality_nefro/2016/03/AVN_program_3_2016.pdf')
     OR NOT (web_url <=> NULL)
     OR NOT (language <=> 'Slovak')
     OR NOT (category <=> 'Academic Paper')
   );

INSERT INTO books (title, author, year, isbn, description, cover_image, url, web_url, language, category)
  SELECT 'Ekonomika nefrologickej ambulancie',
         'M. Alaxinová, Ľ. Polaščín',
         2016,
         'AVN-2016-AMB',
         'Programový záznam odbornej prednášky na 38. kongrese Slovenskej nefrologickej spoločnosti s medzinárodnou účasťou, uverejnený v programe časopisu Aktuality v nefrologii (roč. 22, 2016, č. 3, s. 82). Dátum 21. 10. 2016 (piatok), blok Ekonomika v nefrológii (9.30–11.00, 12 + 3 min.). Prednášajúci: M. Alaxinová, Ľ. Polaščín (Bratislava). Ide o kongresovú prednášku zaznamenanú v programe, nie o plný text článku ani abstraktu.',
         NULL,
         'https://www.tigis.cz/images/stories/Aktuality_nefro/2016/03/AVN_program_3_2016.pdf',
         NULL,
         'Slovak',
         'Academic Paper'
  FROM DUAL
  WHERE NOT EXISTS (
    SELECT 1 FROM books
     WHERE isbn = 'AVN-2016-AMB'
        OR title = 'Ekonomika nefrologickej ambulancie'
  );

UPDATE books
   SET title = 'Ekonomika nefrologickej ambulancie',
       author = 'M. Alaxinová, Ľ. Polaščín',
       year = 2016,
       description = 'Programový záznam odbornej prednášky na 38. kongrese Slovenskej nefrologickej spoločnosti s medzinárodnou účasťou, uverejnený v programe časopisu Aktuality v nefrologii (roč. 22, 2016, č. 3, s. 82). Dátum 21. 10. 2016 (piatok), blok Ekonomika v nefrológii (9.30–11.00, 12 + 3 min.). Prednášajúci: M. Alaxinová, Ľ. Polaščín (Bratislava). Ide o kongresovú prednášku zaznamenanú v programe, nie o plný text článku ani abstraktu.',
       cover_image = NULL,
       url = 'https://www.tigis.cz/images/stories/Aktuality_nefro/2016/03/AVN_program_3_2016.pdf',
       web_url = NULL,
       language = 'Slovak',
       category = 'Academic Paper'
 WHERE isbn = 'AVN-2016-AMB'
   AND (
        NOT (title <=> 'Ekonomika nefrologickej ambulancie')
     OR NOT (author <=> 'M. Alaxinová, Ľ. Polaščín')
     OR NOT (year <=> 2016)
     OR NOT (description <=> 'Programový záznam odbornej prednášky na 38. kongrese Slovenskej nefrologickej spoločnosti s medzinárodnou účasťou, uverejnený v programe časopisu Aktuality v nefrologii (roč. 22, 2016, č. 3, s. 82). Dátum 21. 10. 2016 (piatok), blok Ekonomika v nefrológii (9.30–11.00, 12 + 3 min.). Prednášajúci: M. Alaxinová, Ľ. Polaščín (Bratislava). Ide o kongresovú prednášku zaznamenanú v programe, nie o plný text článku ani abstraktu.')
     OR NOT (cover_image <=> NULL)
     OR NOT (url <=> 'https://www.tigis.cz/images/stories/Aktuality_nefro/2016/03/AVN_program_3_2016.pdf')
     OR NOT (web_url <=> NULL)
     OR NOT (language <=> 'Slovak')
     OR NOT (category <=> 'Academic Paper')
   );

COMMIT;

-- Verify:
-- SELECT isbn, title, author, year, url, web_url, language, category
--   FROM books
--  WHERE isbn IN ('AVN-2016-MEMB', 'AVN-2016-AMB');
-- Expect two rows, Slovak diacritics intact, and descriptions that call
-- each item a prednáška rather than an article.
--
-- Rollback (restores the pre-image; empty if these keys were new):
-- START TRANSACTION;
-- DELETE FROM books WHERE isbn IN ('AVN-2016-MEMB', 'AVN-2016-AMB');
-- INSERT INTO books (title, author, year, isbn, description, cover_image, url, web_url, language, category)
-- SELECT title, author, year, isbn, description, cover_image, url, web_url, language, category
--   FROM books_backup_2026_10_05_avn;
-- COMMIT;
