-- books.polascin.net: Vital Algorithm 1st-edition print format fix, 15 September 2026
-- ASIN B0G4JLDMWG / ISBN-13 979-8276693088 was labeled Hardcover; Amazon format is Paperback.
-- Match by isbn (not id). Mirrors data/books.json id 27.

START TRANSACTION;

UPDATE books
SET
  title = 'The Vital Algorithm: A Novel of Code and Conscience (Paperback)',
  description = 'Paperback - November 29, 2025 by Walter Kyo Csoelle. Independently published, 356 pages, ISBN-13 979-8276693088 (ASIN B0G4JLDMWG). If an algorithm had to choose between saving a wealthy CEO or a beloved kindergarten teacher, how would it decide? Dr. Jana Bravcová returns to Bratislava to join MedCore and confronts VITAL-7, where the Social Utility Score prices human life. As she uncovers a so-called glitch that was actually murder, she must decide whether to comply or crash the system. Original first edition of the novel, written by Dr. Ľubomír Polaščín; superseded by the expanded second edition (January 2026), which is also available in paperback and hardcover. Perfect for readers of Black Mirror and Robin Cook.'
WHERE isbn = '9798276693088'
  AND (
    title LIKE '%(Hardcover)%'
    OR description LIKE 'Hardcover -%'
  );

COMMIT;

-- Verification:
-- SELECT id, isbn, title, LEFT(description, 40) AS d FROM books WHERE isbn = '9798276693088';
