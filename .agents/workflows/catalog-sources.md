---
description: Mesačná kontrola zdrojov a pridávanie publikácií do katalógu books.polascin.net
---

# POKYNY: Pridávanie nových publikácií do katalógu books.polascin.net

## Zdroje na pravidelnú kontrolu (mesačne)

1. Amazon author page, Walter Kyo Csoelle: https://www.amazon.com/stores/Walter-Kyo-Csoelle/author/B0G2TCCJZZ
2. Amazon author page, Lubomir Polascin: https://www.amazon.com/stores/author/B07PN436VJ/about
3. ResearchGate profil: https://www.researchgate.net/profile/Lubomir-Polascin
4. Gumroad storefront: https://polascin.gumroad.com
5. nefro.polascin.net (nové články a publikácie)
6. LinkedIn aktivita: https://www.linkedin.com/in/lubomirpolascin/

Praktické poznámky ku zdrojom:

- Amazon aj ResearchGate blokujú automatické sťahovanie (robots.txt, Cloudflare). Kontrolu rob v prehliadači (Claude in Chrome), nie cez WebFetch.
- Na Amazone použi záložku „All Books“ a potom produktovú stránku každého ASIN (`/dp/ASIN`): tam je formát, dátum vydania, počet strán a ISBN-13. Zoznam na author page ukazuje len Kindle vydania, tlačené vydania sú v „Other formats“.
- ResearchGate: záznamom je iba to, čo je v sekcii „Publications“ profilu. Odporúčania, čítané články a podobné položky nie sú vlastné publikácie.

## Kde sú dáta

- Produkčný web číta z tabuľky `books` v MariaDB (WebSupport). `data/books.json` je iba seed pri prázdnej tabuľke a záložný zdroj pri výpadku databázy.
- Každá zmena sa preto robí dvakrát: úprava `data/books.json` v repozitári a SQL skript pre produkčnú databázu (ukladá sa do `tools/sql/`, ten adresár sa nenasadzuje). Riadky v SQL párovať podľa `isbn` (ISBN/ASIN), nie podľa `id`.
- Lokálny `post-commit` hook v `.git/hooks/` po každom commite pushne a nahrá zmenené súbory cez SFTP. Ak commit nemá spustiť nasadenie, použi `git -c core.hooksPath=/dev/null commit`.

## Štruktúra záznamu v katalógu

Každý záznam musí obsahovať:

- `title`: názov publikácie, pri knihách s formátom v zátvorke, napr. „(Kindle Edition)“, „(Paperback)“, „(Hardcover)“
- `author`: Lubomir Polascin / Walter Kyo Csoelle / spoluautori
- `category`: Academic Paper | Book Chapter | Book | Digital Product | Digital Storefront | Media Mention | Medical | Medical Fiction | Medical Thriller
- `language`: English | Slovak | Czech
- `year`: rok vydania podľa primárneho zdroja (Amazon: „Publication date“)
- `description`: krátky popis obsahu; pri knihách začína formátom a dátumom vydania, pri tlačených vydaniach aj počtom strán, ISBN-13 a ASIN
- `isbn`: ISBN-13 (13 číslic bez pomlčiek) pri tlačených knihách, ASIN pri Kindle vydaniach, inak N/A
- `url`: primárny odkaz (Amazon `/dp/ASIN`, ResearchGate, Gumroad atď.)
- `web_url`: sekundárny odkaz, ak existuje (napr. author store na Amazone)
- `cover_image`: URL obálky (pole sa v katalógu momentálne nezobrazuje, vypĺňa sa pre úplnosť)

Konvencia: každé vydanie je samostatný záznam (Kindle, Paperback a Hardcover zvlášť), tak ako pri starších tituloch Blood Purification a Elimination.

## Kritériá pre pridanie

- Pridaj iba publikácie, ktoré nie sú už v katalógu (skontroluj podľa titulu a ISBN/ASIN).
- Over existenciu publikácie na primárnom zdroji (nedaj sa zmiasť placeholderom).
- Over autorstvo. Do katalógu patria len vlastné práce Ľubomíra Polaščína (vrátane pseudonymu Walter Kyo Csoelle) a práce, kde je spoluautor.
- Pre Amazon knihy: skontroluj ASIN/ISBN priamo na produktovej stránke.
- Pre akademické práce: over na ResearchGate alebo publikačnom portáli (PubMed, DOI).
- Pre mediálne zmienky: over dostupnosť článku online; tlačené články bez online verzie zatiaľ nepridávať, len evidovať.
- Pre „Blood Margin“: pridaj ihneď po publikácii na Amazon KDP (monitoruj ASIN).

## Referenčná mapa: Walter Kyo Csoelle (Amazon)

Overené z produktových stránok 2. 9. 2026; znovu skontrolované oproti `data/books.json` 11. 9. 2026. Pri mesačnej kontrole porovnávaj podľa **ISBN-13** (tlač) alebo **ASIN** (Kindle/`url`), nie podľa odhadu formátu z author page.

Dôležité: ASIN tlačeného vydania **nie je** ISBN. V `isbn` poli je pre tlač ISBN-13; ASIN je v `url` (`/dp/ASIN`) a v `description`. Kindle má v `isbn` priamo ASIN.

### Vital Algorithm: A Novel of Code and Conscience

| id | Formát | isbn (kľúč) | ASIN (Amazon /dp) | Rok | category |
| --- | --- | --- | --- | --- | --- |
| 1 | Kindle Edition, 2nd ed. | B0GGJXHQDH | B0GGJXHQDH | 2026-01-13 | Medical Thriller |
| 2 | Kindle Edition, 1st ed. (title: *The* Vital Algorithm) | B0FFGG4K4D | B0FFGG4K4D | 2025-11-29 | Medical Thriller |
| 21 | Paperback | 9798243848893 | B0GGQGWGQY | 2026-01-13 | Medical Thriller |
| 22 | Hardcover | 9798243857475 | B0GGQL6LTT | 2026-01-13 | Medical Thriller |

### BLOOD EQUITY: Some Cures Are Deadlier Than Disease

| id | Formát | isbn (kľúč) | ASIN (Amazon /dp) | Rok | category |
| --- | --- | --- | --- | --- | --- |
| 3 | Kindle Edition | B0G3MLQ1PN | B0G3MLQ1PN | 2025-11-23 | Medical Thriller |
| 23 | Paperback | 9798275766110 | B0G3PZ47C1 | 2025-11-23 | Medical Thriller |
| 24 | Hardcover | 9798275768503 | B0G3NXZCNF | 2025-11-23 | Medical Thriller |

### Pulse Of The Body: A Novel of Medicine, Humanity, and the Edge of Life

| id | Formát | isbn (kľúč) | ASIN (Amazon /dp) | Rok | category |
| --- | --- | --- | --- | --- | --- |
| 4 | Kindle Edition | B0DHQY58C8 | B0DHQY58C8 | 2025-11-18 | Medical Fiction |
| 25 | Paperback | 9798275086690 | B0G2WW1CKG | 2025-11-18 | Medical Fiction |
| 26 | Hardcover | 9798275098167 | B0G2XC7PZ8 | 2025-11-18 | Medical Fiction |

### Časté zámeny (nepridávať znova)

Tieto ASIN už v katalógu sú; nesmieš ich znova vložiť pod iným formátom:

- `B0G2XC7PZ8` = Pulse Of The Body **Hardcover** (id 26), nie Paperback a nie Kindle
- `B0G2WW1CKG` = Pulse Of The Body **Paperback** (id 25), nie Kindle
- `B0DHQY58C8` = Pulse Of The Body **Kindle** (id 4)
- `B0G3NXZCNF` = BLOOD EQUITY **Hardcover** (id 24), nie Paperback
- `B0G3PZ47C1` = BLOOD EQUITY **Paperback** (id 23)
- `B0G3MLQ1PN` = BLOOD EQUITY **Kindle** (id 3)
- `B0GGQGWGQY` = Vital Algorithm **Paperback** (id 21), nie Hardcover
- `B0GGQL6LTT` = Vital Algorithm **Hardcover** (id 22)
- `B0GGJXHQDH` = Vital Algorithm Kindle 2nd ed. (id 1)
- `B0FFGG4K4D` = *The* Vital Algorithm Kindle 1st ed. (id 2)

## Aktuálny stav (11. 9. 2026)

- 26 záznamov v katalógu (`data/books.json`). Žiadne nové ASIN na pridanie oproti stavu z 2. 9. 2026; formáty a ASIN vyššie zodpovedajú JSON aj `tools/sql/2026-09-02_catalog_amazon_editions.sql`.
- Pridané 2. 9. 2026: tlačené vydania (Paperback + Hardcover) Vital Algorithm, BLOOD EQUITY a Pulse Of The Body — pozri referenčnú mapu (ISBN-13 v `isbn`, ASIN v `url`).
- Opravené 2. 9. 2026: id 2 (`B0FFGG4K4D`) = Kindle 1. vydanie „The Vital Algorithm“ (29. 11. 2025), nie paperback; id 4 (`B0DHQY58C8`) = Kindle Pulse Of The Body, nie hardcover; roky id 1–3 zosúladené s Amazonom (2026, 2025, 2025).
- 11. 9. 2026: dokumentácia doplnená o ASIN/formát mapu po pokuse znova pridať už existujúce ASIN (`B0G2XC7PZ8`, `B0G3NXZCNF`, `B0GGQGWGQY`, `B0G2WW1CKG`) s nesprávnymi formátmi. Dáta v JSON sa nemenili.
- ResearchGate profil obsahuje jedinú publikáciu („Acute renal failure and acute kidney injury“, 2018), tá je v katalógu ako záznam 9. Práce „Defining AKD: The Spectrum of AKI, AKD, and CKD“ (RG 352741335, autor Andrew S. Levey, Nephron 2022) a „Research Progress in Early Prediction of Septic Associated AKI“ (RG 363106048, autor Wenjing Li, Advances in Clinical Medicine 2022) NIE SÚ práce Ľubomíra Polaščína a do katalógu nepatria.
- „Blood Margin“: rukopis hotový, na Amazone zatiaľ nie je. Pridať po KDP publikácii.
- Na evidenciu: článok „Plnohodnotný život na dialýze“ pre časopis Rytmus života (LinkedIn, koniec augusta 2026). Online verzia sa nenašla, po zverejnení overiť a pridať ako Media Mention.
- Amazon Lubomir Polascin (4 tituly), Gumroad (2 produkty) a nefro.polascin.net: bez nových publikácií k 11. 9. 2026.
