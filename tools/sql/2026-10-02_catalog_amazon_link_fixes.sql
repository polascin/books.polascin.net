-- books.polascin.net: fix shifted Amazon shortlinks in the catalog, 2 October 2026
--
-- Rows 2-5 carried the shortlink that belongs to the PREVIOUS row (off-by-one
-- shift), so the card title and the "View Online" button opened a different
-- title/edition than the record describes. Verified on 2 October 2026 by
-- following each 301 (curl -I https://amzn.to/<slug>):
--
--   https://amzn.to/4lO2EHJ -> /dp/B0FFGG4K4D  (The Vital Algorithm, Kindle 1st ed.)
--   https://amzn.to/4d3XxRj -> /dp/B0G3MLQ1PN  (BLOOD EQUITY, Kindle Edition)
--   https://amzn.to/4d3eQC8 -> /dp/B0DHQY58C8  (Pulse Of The Body, Kindle Edition)
--   https://amzn.to/47hdmk5 -> /dp/1090110758  (Blood Purification, Print)
--
-- Wrong state being corrected:
--   B0FFGG4K4D had 4uLOhrl -> B0GGJXHQDH (2nd edition)
--   B0G3MLQ1PN had 4lO2EHJ -> B0FFGG4K4D
--   B0DHQY58C8 had 4d3XxRj -> B0G3MLQ1PN
--   1090110758 had 4d3eQC8 -> B0DHQY58C8
--
-- ISBNs/ASINs are NOT touched: each record keeps its own identifier and only
-- the link is moved to the row it actually resolves to. The Kindle 1st edition
-- (B0FFGG4K4D) was re-checked on amazon.com on 2 October 2026 and is still on
-- sale, so it stays a live entry rather than a historical one.
--
-- Row 1 (B0GGJXHQDH, https://amzn.to/4rLFwe8) already resolves correctly and is
-- left untouched. Mirrors data/books.json at the same commit: there only id 5
-- changes, because ids 2-4 already use direct /dp/ URLs in the JSON fallback.
-- Rows are matched by isbn, never by numeric id. Re-running is a no-op.

START TRANSACTION;

-- Pre-change snapshot of the affected rows. CREATE TABLE IF NOT EXISTS keeps a
-- second run from overwriting the original backup.
CREATE TABLE IF NOT EXISTS books_backup_2026_10_02
  AS SELECT * FROM books
     WHERE isbn IN ('B0FFGG4K4D', 'B0G3MLQ1PN', 'B0DHQY58C8', '1090110758');

UPDATE books SET url = 'https://amzn.to/4lO2EHJ'
  WHERE isbn = 'B0FFGG4K4D' AND url <> 'https://amzn.to/4lO2EHJ';

UPDATE books SET url = 'https://amzn.to/4d3XxRj'
  WHERE isbn = 'B0G3MLQ1PN' AND url <> 'https://amzn.to/4d3XxRj';

UPDATE books SET url = 'https://amzn.to/4d3eQC8'
  WHERE isbn = 'B0DHQY58C8' AND url <> 'https://amzn.to/4d3eQC8';

UPDATE books SET url = 'https://amzn.to/47hdmk5'
  WHERE isbn = '1090110758' AND url <> 'https://amzn.to/47hdmk5';

COMMIT;

-- Verification:
-- SELECT id, isbn, title, url FROM books
--   WHERE isbn IN ('B0GGJXHQDH', 'B0FFGG4K4D', 'B0G3MLQ1PN', 'B0DHQY58C8', '1090110758')
--   ORDER BY id;
--
-- Rollback (restores the four pre-change rows):
-- START TRANSACTION;
-- UPDATE books b JOIN books_backup_2026_10_02 k ON k.isbn = b.isbn SET b.url = k.url;
-- COMMIT;
