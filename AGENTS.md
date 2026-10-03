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
- Ak primárny zdroj neexistuje, nevymýšľaj URL. Nechaj záznam označený ako
  nedostupný a zapíš do testu, čo presne bolo hľadané a kedy
  (`SEARCH_URL_ALLOWED` v `tools/tests/catalog-urls.test.cjs`).

## Vlastné digitálne publikácie (e-knihy, Gumroad)

- Primárny zdroj je vlastná publikačná stránka (napr.
  `nefro.polascin.net/publikacia.php?slug=...`), pretože uvádza úplné metadáta.
  Predajný kanál (Gumroad) patrí do `web_url` ako sekundárny.
- Verejný odkaz nie je dôkaz publikovania. Pri Gumroade over vo vloženom
  produktovom JSON `"is_published":true` a `"is_compliance_blocked":false`,
  a že produkt je viditeľný na profile predajcu.
- Rozdiely medzi kanálmi (ceny, zoznam formátov) nezjednocuj potichu - riaď sa
  primárnym zdrojom a rozdiel zapíš do komentára SQL migrácie.

## Identifikátory bez ISBN

- Ak publikácia nemá ISBN ani DOI, nevymýšľaj ich. Do `isbn` daj katalógový
  kľúč podľa zavedeného vzoru: `VP-2026-3-4-KDIGO`, `ZDN-96291978`,
  `DIA-2054968`, `FD-40671`, `NEFRO-SKNB-1`. `getBookIdentifier()` ho zobrazí
  ako `ID`, nie ako ISBN.
- **Kľúč musí mať najviac 20 znakov.** `books.isbn` je `VARCHAR(20)` a server
  nemá `STRICT_TRANS_TABLES`, takže dlhšiu hodnotu *bez chyby skráti* a potom
  ju žiadna migrácia nenájde. Kontroluje to test „every identifier fits the
  isbn column".
- Predajné ID (napr. Gumroad permalink) daj do popisu ako text, nikdy nie do
  `isbn`.

## Čakajúce publikácie

Tieto tituly pridaj až po oficiálnom vydaní:

- `Blood Margin` (medical thriller, 18 kapitol, 389 strán): čaká na publikáciu v KDP.
- Rukopis `KDIGO+ESH` (Via Practica): sleduj oficiálne vydanie pred pridaním.

## Encoding a databáza

- Katalóg používa UTF-8. Slovenská diakritika musí zostať správna, najmä `Ľubomír Polaščín` a `Bravcová`; mojibake je chyba.
- Pri SQL/PHP zmenách over, že databázové spojenie používa `utf8mb4`.
- Každú zmenu urob v `data/books.json` aj v samostatnej SQL migrácii v `tools/sql/`.
- SQL migrácie páruj podľa `isbn`/ASIN, nikdy nie podľa numerického `id`.
- Po zmene spusti testy a skontroluj výsledný záznam na `catalog.php`, vrátane diakritiky.
- `.env` smeruje na **produkčnú** databázu, nie na lokálnu. Každý zápis rob
  v transakcii, so zálohou dotknutých riadkov a s rollbackom v komentári.
- Zálohu (`CREATE TABLE ... AS SELECT`) sprav **pred** `START TRANSACTION`:
  je to DDL, ktoré v MariaDB implicitne commituje, takže vnútri transakcie ju
  potichu ukončí a nasledujúce `UPDATE` bežia v autocommite.
- Guard píš ako `NOT (col <=> 'hodnota')`, nie `col <> 'hodnota'`.
  `NULL <> 'x'` je `NULL`, nie `TRUE`, takže riadok s `NULL` sa preskočí.
- Pri vkladaní riadku radšej použi viazané parametre a hodnoty čítaj z
  `data/books.json`, aby boli oba zdroje identické. Popisy obsahujú `;`, takže
  delenie SQL súboru podľa `;` rozbije príkaz.

## Testy

```sh
node --test "tools/tests/*.test.cjs"      # offline, vždy
CATALOG_CHECK_DB=1   node --test "tools/tests/*.test.cjs"   # + parita s DB
CATALOG_CHECK_URLS=1 node --test "tools/tests/*.test.cjs"   # + dostupnosť URL
RESOLVE_SHORTLINKS=1 node --test "tools/tests/*.test.cjs"   # + amzn.to redirecty
```

- Parita DB/JSON sa porovnáva podľa stabilných identifikátorov a **po poliach**,
  nie podľa počtu riadkov - rovnaký počet riadkov skryl chybu z 2026-10-02.
- Kontrolujú sa **všetky** URL polia (`url`, `web_url`, `cover_image`), nie iba
  `url`. Tak sa našiel Google-search odkaz, ktorý prežil v `web_url`.

## Referenčné zdroje

- Amazon author page: https://www.amazon.com/Lubomir-Polascin/e/B07PN436VJ
- Walter Kyo Csoelle: https://www.amazon.com/stores/Walter-Kyo-Csoelle/author/B0G2TCCJZZ
- Via Practica: Slovenský lekársky časopis
- Google Scholar a PubMed pre odborné publikácie
