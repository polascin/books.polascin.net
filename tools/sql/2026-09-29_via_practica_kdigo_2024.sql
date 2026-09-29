-- Via practica 3-4/2026, V skratke; source:
-- https://www.solen.sk/sk/casopisy/via-practica/chronicka-choroba-obliciek-v-ambulancii-vld-kdigo-2024-v-klinickej-praxi
-- Mirrors data/books.json. Apply with a UTF-8 client; never match by numeric id.
SET NAMES utf8mb4;
START TRANSACTION;

INSERT INTO books (title, author, year, isbn, description, cover_image, url, web_url, language, category)
  SELECT 'Chronická choroba obličiek v ambulancii VLD: KDIGO 2024 v klinickej praxi',
         'MUDr. Ľubomír Polaščín',
         2026,
         'VP-2026-3-4-KDIGO',
         'Odborný článok v časopise Via practica 3-4/2026 (dvojčíslo), rubrika V skratke, ISSN 1339-424X. Praktický postup pre všeobecného lekára pri vyhľadávaní a potvrdení chronickej choroby obličiek podľa KDIGO 2024: eGF a uACR, potvrdenie trvania abnormalít aspoň tri mesiace, klasifikácia CGA a kritériá nefrologického vyšetrenia. Celý text je dostupný len pre predplatiteľov časopisu Via practica.',
         NULL,
         'https://www.solen.sk/sk/casopisy/via-practica/chronicka-choroba-obliciek-v-ambulancii-vld-kdigo-2024-v-klinickej-praxi',
         'https://www.solen.sk/sk/casopisy/via-practica',
         'Slovak',
         'Academic Paper'
  FROM DUAL
  WHERE NOT EXISTS (
    SELECT 1 FROM books
    WHERE isbn = 'VP-2026-3-4-KDIGO'
       OR title = 'Chronická choroba obličiek v ambulancii VLD: KDIGO 2024 v klinickej praxi'
       OR url = 'https://www.solen.sk/sk/casopisy/via-practica/chronicka-choroba-obliciek-v-ambulancii-vld-kdigo-2024-v-klinickej-praxi'
  );

COMMIT;

-- Verify: SELECT id, title, author, isbn FROM books WHERE isbn = 'VP-2026-3-4-KDIGO';
