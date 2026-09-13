-- books.polascin.net: catalog update, 13 September 2026
-- Source: Amazon product page https://www.amazon.com/dp/B0G4JLDMWG verified 2026-09-13.
-- Adds the first-edition hardcover of The Vital Algorithm (ASIN B0G4JLDMWG, ISBN-13 979-8276693088).
-- Amazon lists this ASIN/ISBN as Hardcover (Paperback is a separate format option on the same family).
-- Mirrors data/books.json at the same commit. Insert is skipped when the ISBN already exists.

START TRANSACTION;

INSERT INTO books (title, author, year, isbn, description, cover_image, url, web_url, language, category)
  SELECT 'The Vital Algorithm: A Novel of Code and Conscience (Hardcover)', 'Walter Kyo Csoelle', 2025, '9798276693088', 'Hardcover - November 29, 2025 by Walter Kyo Csoelle. Independently published, 356 pages, ISBN-13 979-8276693088 (ASIN B0G4JLDMWG). If an algorithm had to choose between saving a wealthy CEO or a beloved kindergarten teacher, how would it decide? Dr. Jana Bravcová returns to Bratislava to join MedCore and confronts VITAL-7, where the Social Utility Score prices human life. As she uncovers a so-called glitch that was actually murder, she must decide whether to comply or crash the system. Original first edition of the novel, written by Dr. Ľubomír Polaščín; superseded by the expanded second edition (January 2026), which is also available in paperback and hardcover. Perfect for readers of Black Mirror and Robin Cook.', 'https://m.media-amazon.com/images/I/61WS6zmeeOL._SY466_.jpg', 'https://www.amazon.com/dp/B0G4JLDMWG', 'https://www.amazon.com/stores/author/B0G2TCCJZZ', 'English', 'Medical Thriller'
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '9798276693088' OR isbn = 'B0G4JLDMWG');

COMMIT;

-- Verification (expect 27 rows, including ISBN 9798276693088):
-- SELECT id, year, isbn, title FROM books ORDER BY id;
