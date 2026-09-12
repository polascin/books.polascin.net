-- books.polascin.net: legacy title alignment, 12 September 2026
-- Aligns three older MariaDB titles with data/books.json (seed source of truth).
-- Rows matched by isbn where unique; Gumroad storefront matched by id + url because isbn is N/A.

START TRANSACTION;

UPDATE books
SET title = 'Elimination from the Body: Kidney Replacement Book (Kindle Edition)'
WHERE isbn = 'B07PQ4RW5Z'
  AND title <> 'Elimination from the Body: Kidney Replacement Book (Kindle Edition)';

UPDATE books
SET title = 'Elimination from the Body: Kidney Replacement (Paperback)'
WHERE isbn = '1090779291'
  AND title <> 'Elimination from the Body: Kidney Replacement (Paperback)';

UPDATE books
SET title = 'Lubomir Polascin - Gumroad Storefront'
WHERE id = 20
  AND url = 'https://polascin.gumroad.com'
  AND title <> 'Lubomir Polascin - Gumroad Storefront';

COMMIT;

-- Verification:
-- SELECT id, isbn, title FROM books WHERE id IN (7, 8, 20) ORDER BY id;
