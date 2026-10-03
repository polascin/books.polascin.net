-- books.polascin.net: add the e-book "SK Nefro Báza 1", 3 October 2026
--
-- Verified before insertion, both channels checked on 2026-10-03:
--   PRIMARY   https://nefro.polascin.net/publikacia.php?slug=sk-nefro-baza-1
--             HTTP 200, canonical + og:url point at this slug. The page itself
--             states: 1. vydanie, október 2026; MUDr. Ľubomír Polaščín;
--             405 článkov; 1745 strán; 476 ilustrácií; 590 630 slov;
--             PDF 26.8 MB, EPUB 21.7 MB, AZW3 23.7 MB, DOCX 21.6 MB,
--             ODT 21.4 MB; 7 EUR za jeden formát, 12 EUR za všetky.
--   SECONDARY https://polascin.gumroad.com/l/sk-nefro-baza-1
--             HTTP 200 with "is_published":true and
--             "is_compliance_blocked":false in the embedded product JSON, so
--             this is a live listing and not a draft. It also appears on the
--             seller profile https://polascin.gumroad.com/. permalink mvktwf,
--             native_type "ebook", price_cents 700, currency_code "eur",
--             seller "Ľubomír Polaščín". A public link alone was not treated
--             as proof; the published flag and the profile listing were.
--
-- Known channel discrepancies, recorded deliberately and NOT smoothed over:
--   * Gumroad carries "options":[] — no variants — so the 12 EUR all-formats
--     tier exists only on nefro.polascin.net. The 7 EUR single-format price is
--     the one both channels agree on.
--   * The Gumroad summary names only PDF, EPUB, AZW3 and DOCX; ODT is listed
--     on the primary page. The description below follows the primary source.
--
-- No ISBN and no DOI are published for this title, and none was invented. The
-- isbn column therefore holds the catalog key 'NEFRO-SKNB-1', built from the
-- primary source (nefro.polascin.net) and the title, in the same spirit as the
-- existing non-ISBN keys 'VP-2026-3-4-KDIGO', 'ZDN-96291978', 'DIA-2054968'
-- and 'FD-40671'. getBookIdentifier() renders it as label "ID", not as an
-- ISBN. The Gumroad permalink is kept in the description as prose, never as a
-- fake identifier.
--
-- Keep the key at 20 characters or fewer: books.isbn is VARCHAR(20) and this
-- server's sql_mode has no STRICT_TRANS_TABLES, so a longer value is silently
-- TRUNCATED on INSERT instead of raising an error — after which no migration
-- matching the full key finds the row. The first attempt at this record used
-- 'NEFRO-SK-NEFRO-BAZA-1' (21 chars) and was stored as 'NEFRO-SK-NEFRO-BAZA-'.
-- tools/tests/catalog-parity.test.cjs now asserts the limit.
--
-- Mirrors data/books.json. Apply with a UTF-8 client; never match by numeric id.
SET NAMES utf8mb4;
START TRANSACTION;

INSERT INTO books (title, author, year, isbn, description, cover_image, url, web_url, language, category)
  SELECT 'SK Nefro Báza 1',
         'MUDr. Ľubomír Polaščín',
         2026,
         'NEFRO-SKNB-1',
         'E-kniha, 1. vydanie - október 2026. Elektronický súhrn 405 odborných a vzdelávacích článkov z portálu Nefro-projekt Slovensko (nefro.polascin.net) o chronickej chorobe obličiek, dialýze, transplantácii a internej medicíne, tematicky usporiadaných a vzájomne prelinkovaných na čítanie offline. 1745 strán, 476 ilustrácií. Formáty PDF, EPUB, AZW3, DOCX a ODT; 7 EUR za jeden formát, 12 EUR za všetky formáty. Bez ISBN a DOI. Primárny zdroj: nefro.polascin.net; sekundárny predajný kanál: Gumroad (permalink mvktwf).',
         'https://nefro.polascin.net/img/publikacie/sk-nefro-baza-1-obalka.jpg',
         'https://nefro.polascin.net/publikacia.php?slug=sk-nefro-baza-1',
         'https://polascin.gumroad.com/l/sk-nefro-baza-1',
         'Slovak',
         'Digital Product'
  FROM DUAL
  WHERE NOT EXISTS (
    SELECT 1 FROM books
    WHERE isbn = 'NEFRO-SKNB-1'
       OR title = 'SK Nefro Báza 1'
       OR url = 'https://nefro.polascin.net/publikacia.php?slug=sk-nefro-baza-1'
       OR web_url = 'https://polascin.gumroad.com/l/sk-nefro-baza-1'
  );

COMMIT;

-- Applied to production on 2026-10-03 as row id 31, with bound parameters taken
-- from data/books.json so both sources are byte-identical (verified: title,
-- author and description compare equal and are valid UTF-8).
--
-- Verify:
-- SELECT id, isbn, title, author, url, web_url, category
--   FROM books WHERE isbn = 'NEFRO-SKNB-1';
-- Expect exactly one row, with the Slovak diacritics intact in
-- 'SK Nefro Báza 1' and 'MUDr. Ľubomír Polaščín'.
--
-- Rollback:
-- DELETE FROM books WHERE isbn = 'NEFRO-SKNB-1';
