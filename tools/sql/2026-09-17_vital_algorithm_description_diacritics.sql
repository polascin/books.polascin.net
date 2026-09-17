-- books.polascin.net: repair mojibake in three Vital Algorithm descriptions, 17 September 2026
-- The catalog seed already contains the corrected UTF-8; this migration repairs existing rows.

START TRANSACTION;

UPDATE books
SET description = CASE isbn
  WHEN 'B0FFGG4K4D' THEN 'Kindle Edition, 1st edition - November 29, 2025 by Walter Kyo Csoelle (ASIN B0FFGG4K4D, 358 pages). If an algorithm had to choose between saving a wealthy CEO or a beloved kindergarten teacher, how would it decide? Dr. Jana Bravcová returns to Bratislava to join MedCore and confronts VITAL-7, where the Social Utility Score prices human life. As she uncovers a so-called glitch that was actually murder, she must decide whether to comply or crash the system. Original first edition of the novel, written by Dr. Ľubomír Polaščín; superseded by the expanded second edition (January 2026), which is also available in paperback and hardcover. Perfect for readers of Black Mirror and Robin Cook.'
  WHEN '9798243848893' THEN 'Paperback - January 13, 2026 by Walter Kyo Csoelle. Independently published, 415 pages, ISBN-13 979-8243848893 (ASIN B0GGQGWGQY). If an algorithm had to choose between saving a wealthy CEO or a beloved kindergarten teacher, how would it decide? Dr. Jana Bravcová returns to Bratislava to join MedCore and confronts VITAL-7, where the Social Utility Score prices human life. As she uncovers a so-called glitch that was actually murder, she must decide whether to comply or crash the system. Written by Dr. Ľubomír Polaščín, this second edition includes the Developer''s Cut appendix, an updated AI chapter (2026), a new afterword (Leaving the Factory), and a reading group guide. Perfect for readers of Black Mirror and Robin Cook.'
  WHEN '9798243857475' THEN 'Hardcover - January 13, 2026 by Walter Kyo Csoelle. Independently published, 415 pages, ISBN-13 979-8243857475 (ASIN B0GGQL6LTT). If an algorithm had to choose between saving a wealthy CEO or a beloved kindergarten teacher, how would it decide? Dr. Jana Bravcová returns to Bratislava to join MedCore and confronts VITAL-7, where the Social Utility Score prices human life. As she uncovers a so-called glitch that was actually murder, she must decide whether to comply or crash the system. Written by Dr. Ľubomír Polaščín, this second edition includes the Developer''s Cut appendix, an updated AI chapter (2026), a new afterword (Leaving the Factory), and a reading group guide. Perfect for readers of Black Mirror and Robin Cook.'
  ELSE description
END
WHERE isbn IN ('B0FFGG4K4D', '9798243848893', '9798243857475');

COMMIT;

-- Verification:
-- SELECT isbn, description FROM books
-- WHERE isbn IN ('B0FFGG4K4D', '9798243848893', '9798243857475');