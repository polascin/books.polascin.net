-- books.polascin.net: replace the two remaining Google-search placeholder URLs
-- with the canonical sources already held in data/books.json, 2 October 2026
--
-- Found by comparing the database against data/books.json by identifier and by
-- URL (not just by row count): both rows carry a "google.com/search?q=…" link,
-- so the card title and "View Online" opened a search page instead of the
-- publication. The JSON fallback already had the real sources.
--
--   323586471  -> ResearchGate publication 323586471. Checked 2026-10-02:
--                 responds 403 to a plain curl, which is ResearchGate's bot
--                 wall, not a dead link; the identifier matches the URL path.
--   Pravda.sk  -> interview, verified 2026-10-02 (HTTP 200). The stored
--                 zdravie.pravda.sk address 301-redirects to the canonical
--                 www.pravda.sk/zdravie/prevencia/… URL, which is used here.
--   1090779291 -> https://amzn.to/3PBrlei, the shortlink already cited in the
--                 record's own description; verified 2026-10-02 to redirect to
--                 /dp/1090779291. This row was the same defect in BOTH the
--                 database and data/books.json and was caught by the new
--                 "no search-engine results page" test after the first two
--                 rows had already been migrated — hence the second snapshot
--                 table below rather than one combined backup.
--
-- The Pravda row has isbn 'N/A', which is not unique, so it is matched by
-- (isbn, title). Both statements are guarded — re-running is a no-op.

START TRANSACTION;

CREATE TABLE IF NOT EXISTS books_backup_2026_10_02_urls
  AS SELECT * FROM books
     WHERE isbn = '323586471'
        OR (isbn = 'N/A' AND title LIKE 'Nefrológ Polaščín:%');

UPDATE books
SET url = 'https://www.researchgate.net/publication/323586471_Acute_renal_failure_and_acute_kidney_injury',
    web_url = 'https://www.researchgate.net/profile/Lubomir-Polascin'
WHERE isbn = '323586471'
  AND url <> 'https://www.researchgate.net/publication/323586471_Acute_renal_failure_and_acute_kidney_injury';

UPDATE books
SET url = 'https://www.pravda.sk/zdravie/prevencia/clanok/344814-nefrolog-polascin-na-zlyhanie-obliciek-by-pacient-v-dnesnej-dobe-nemal-zomriet'
WHERE isbn = 'N/A'
  AND title LIKE 'Nefrológ Polaščín:%'
  AND url <> 'https://www.pravda.sk/zdravie/prevencia/clanok/344814-nefrolog-polascin-na-zlyhanie-obliciek-by-pacient-v-dnesnej-dobe-nemal-zomriet';

CREATE TABLE IF NOT EXISTS books_backup_2026_10_02_urls_print
  AS SELECT * FROM books WHERE isbn = '1090779291';

UPDATE books
SET url = 'https://amzn.to/3PBrlei'
WHERE isbn = '1090779291'
  AND url <> 'https://amzn.to/3PBrlei';

COMMIT;

-- Verification:
-- SELECT id, isbn, title, url FROM books
--   WHERE isbn IN ('323586471', '1090779291') OR title LIKE 'Nefrológ Polaščín:%';
-- SELECT id, isbn, url FROM books WHERE url LIKE 'https://www.google.com/search%';
--
-- Rollback:
-- START TRANSACTION;
-- UPDATE books b JOIN books_backup_2026_10_02_urls k ON k.id = b.id
--   SET b.url = k.url, b.web_url = k.web_url;
-- COMMIT;
