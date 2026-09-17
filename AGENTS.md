# Pokyny pre pridávanie publikácií do katalógu

Pri pridávaní nových záznamov do `books.polascin.net/catalog.php` dodrž tieto pravidlá:

## Amazon tituly

- Over ASIN/ISBN priamo na produktovej stránke Amazonu (`amazon.com`, `amazon.es` alebo `amazon.co.uk`), nie iba na author page.
- Over formát (Kindle/Paperback/Hardcover), dátum publikácie, počet strán a ISBN.
- Pred pridaním skontroluj duplicitu podľa ASIN, ISBN a názvu.
- Každé vydanie je samostatný záznam. Názov obsahuje formát v zátvorke, napr. `(Kindle Edition)`, `(Paperback)` alebo `(Hardcover)`.
- Pre fiction používaj autora `Walter Kyo Csoelle`, pre odborné publikácie `Lubomir Polascin`, ak zdroj nepotvrdzuje inak.
- Popis pri knihe začína formátom a dátumom a pri tlačenom vydaní obsahuje počet strán, ISBN a ASIN.
- Vyplň `category`, `language`, primárny Amazon `url` a sekundárny `web_url` podľa štruktúry existujúcich záznamov.

## Odborné publikácie

- Over publikáciu v primárnom zdroji, napríklad vo Via Practica, u vydavateľa, v PubMed alebo cez DOI.
- Pridaj iba overené vlastné práce alebo práce so spoluautorstvom; k záznamu vždy ulož odkaz na zdroj.

## Čakajúce publikácie

Tieto tituly pridaj až po oficiálnom vydaní:

- `Blood Margin` (medical thriller, 18 kapitol, 389 strán): čaká na publikáciu v KDP.
- `KDIGO 2024` (Via Practica): prijaté po peer review, čaká na formálne úpravy.

## Encoding a databáza

- Katalóg používa UTF-8. Slovenská diakritika musí zostať správna, najmä `Ľubomír Polaščín` a `Bravcová`; mojibake je chyba.
- Pri SQL/PHP zmenách over, že databázové spojenie používa `utf8mb4`.
- Každú zmenu urob v `data/books.json` aj v samostatnej SQL migrácii v `tools/sql/`.
- SQL migrácie páruj podľa `isbn`/ASIN, nikdy nie podľa numerického `id`.
- Po zmene spusti testy a skontroluj výsledný záznam na `catalog.php`, vrátane diakritiky.

## Referenčné zdroje

- Amazon author page: https://www.amazon.com/Lubomir-Polascin/e/B07PN436VJ
- Walter Kyo Csoelle: https://www.amazon.com/stores/Walter-Kyo-Csoelle/author/B0G2TCCJZZ
- Via Practica: Slovenský lekársky časopis
- Google Scholar a PubMed pre odborné publikácie
