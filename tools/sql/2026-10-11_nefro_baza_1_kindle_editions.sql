-- Add the verified Slovak and English Kindle editions of SK Nefro Báza 1.
--
-- Amazon product pages are the primary sources for these Kindle editions:
--   https://www.amazon.co.uk/SK-Nefro-B%C3%A1za-odborn%C3%BDch-nefro-polascin-net-ebook/dp/B0HM2VHKFV
--   https://www.amazon.co.uk/Nefro-B%C3%A1za-Collected-specialist-nefro-polascin-net-ebook/dp/B0HM3F4F8T
-- Publisher pages are stored as secondary web_url sources:
--   https://nefro.polascin.net/publikacia.php?slug=sk-nefro-baza-1
--   https://nefro.polascin.net/publikacia.php?slug=sk-nefro-baza-1-en
-- The Slovak item is cataloged as Slovak despite Amazon's English language label;
-- its product description states that the book itself is in Slovak.
-- Descriptions mirror data/books.json. Amazon ASINs serve as isbn identifiers.
--
-- Back up affected records BEFORE START TRANSACTION: CREATE TABLE ... AS is
-- DDL and implicitly commits in MariaDB.
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS books_backup_2026_10_11_nefro_kindle AS
SELECT *
  FROM books
 WHERE isbn IN ('B0HM2VHKFV', 'B0HM3F4F8T')
    OR title IN (
         'SK Nefro Báza 1: Súhrn odborných článkov z portálu nefro.polascin.net, apríl - október 2026 (Kindle Edition)',
         'SK Nefro Báza 1 - English edition: Collected specialist articles from nefro.polascin.net, April - October 2026 (Kindle Edition)'
       );

START TRANSACTION;

INSERT INTO books (title, author, year, isbn, description, cover_image, url, web_url, language, category)
  SELECT 'SK Nefro Báza 1: Súhrn odborných článkov z portálu nefro.polascin.net, apríl - október 2026 (Kindle Edition)',
         'MUDr. Ľubomír Polaščín',
         2026,
         'B0HM2VHKFV',
         'Kindle Edition, 1. vydanie - 6. októbra 2026. Súhrn 405 odborných článkov vrátane ťahákov a textov pre pacientov; 1 745 strán. Primárny zdroj: Amazon.co.uk; sekundárny zdroj: nefro.polascin.net (ASIN B0HM2VHKFV).',
         NULL,
         'https://www.amazon.co.uk/SK-Nefro-B%C3%A1za-odborn%C3%BDch-nefro-polascin-net-ebook/dp/B0HM2VHKFV',
         'https://nefro.polascin.net/publikacia.php?slug=sk-nefro-baza-1',
         'Slovak',
         'Medical'
  FROM DUAL
  WHERE NOT EXISTS (
    SELECT 1 FROM books
     WHERE isbn = 'B0HM2VHKFV'
        OR (title = 'SK Nefro Báza 1: Súhrn odborných článkov z portálu nefro.polascin.net, apríl - október 2026 (Kindle Edition)'
            AND language = 'Slovak'
            AND year = 2026
            AND url = 'https://www.amazon.co.uk/SK-Nefro-B%C3%A1za-odborn%C3%BDch-nefro-polascin-net-ebook/dp/B0HM2VHKFV')
  );

INSERT INTO books (title, author, year, isbn, description, cover_image, url, web_url, language, category)
  SELECT 'SK Nefro Báza 1 - English edition: Collected specialist articles from nefro.polascin.net, April - October 2026 (Kindle Edition)',
         'Ľubomír Polaščín',
         2026,
         'B0HM3F4F8T',
         'Kindle Edition, 1st edition - October 6, 2026. English collection of 387 specialist articles, including cheat sheets; 1,782 pages and 393 illustrations. Primary source: Amazon.co.uk; secondary source: nefro.polascin.net (ASIN B0HM3F4F8T).',
         NULL,
         'https://www.amazon.co.uk/Nefro-B%C3%A1za-Collected-specialist-nefro-polascin-net-ebook/dp/B0HM3F4F8T',
         'https://nefro.polascin.net/publikacia.php?slug=sk-nefro-baza-1-en',
         'English',
         'Medical'
  FROM DUAL
  WHERE NOT EXISTS (
    SELECT 1 FROM books
     WHERE isbn = 'B0HM3F4F8T'
        OR (title = 'SK Nefro Báza 1 - English edition: Collected specialist articles from nefro.polascin.net, April - October 2026 (Kindle Edition)'
            AND language = 'English'
            AND year = 2026
            AND url = 'https://www.amazon.co.uk/Nefro-B%C3%A1za-Collected-specialist-nefro-polascin-net-ebook/dp/B0HM3F4F8T')
  );

COMMIT;

-- Verify:
-- SELECT isbn, title, language, url, web_url FROM books
--  WHERE isbn IN ('B0HM2VHKFV', 'B0HM3F4F8T');
-- Roll back a committed migration if needed:
-- START TRANSACTION;
-- DELETE FROM books WHERE isbn IN ('B0HM2VHKFV', 'B0HM3F4F8T');
-- INSERT INTO books (title, author, year, isbn, description, cover_image, url, web_url, language, category)
-- SELECT title, author, year, isbn, description, cover_image, url, web_url, language, category
--   FROM books_backup_2026_10_11_nefro_kindle;
-- COMMIT;
