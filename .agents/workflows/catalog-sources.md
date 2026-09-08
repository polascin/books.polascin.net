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

## Aktuálny stav (2. 9. 2026)

- 26 záznamov v katalógu (`data/books.json`, commit b3b93c0). Produkčná databáza sa dorovná spustením `tools/sql/2026-09-02_catalog_amazon_editions.sql`.
- Pridané 2. 9. 2026: tlačené vydania (Paperback + Hardcover) titulov Vital Algorithm (ISBN 9798243848893 / 9798243857475, január 2026), BLOOD EQUITY (9798275766110 / 9798275768503, november 2025) a Pulse Of The Body (9798275086690 / 9798275098167, november 2025).
- Opravené 2. 9. 2026: záznam 2 (ASIN B0FFGG4K4D) je Kindle 1. vydanie „The Vital Algorithm“ z 29. 11. 2025, nie paperback; záznam 4 (ASIN B0DHQY58C8) je Kindle vydanie Pulse Of The Body, nie hardcover; roky záznamov 1 až 3 zosúladené s Amazonom (2026, 2025, 2025).
- ResearchGate profil obsahuje jedinú publikáciu („Acute renal failure and acute kidney injury“, 2018), tá je v katalógu ako záznam 9. Práce „Defining AKD: The Spectrum of AKI, AKD, and CKD“ (RG 352741335, autor Andrew S. Levey, Nephron 2022) a „Research Progress in Early Prediction of Septic Associated AKI“ (RG 363106048, autor Wenjing Li, Advances in Clinical Medicine 2022) NIE SÚ práce Ľubomíra Polaščína a do katalógu nepatria. Skoršia poznámka, že sú „pripravené na pridanie“, bola chybná.
- „Blood Margin“: rukopis hotový, na Amazone zatiaľ nie je. Pridať po KDP publikácii.
- Na evidenciu: článok „Plnohodnotný život na dialýze“ pre časopis Rytmus života (LinkedIn, koniec augusta 2026). Online verzia sa nenašla, po zverejnení overiť a pridať ako Media Mention.
- Amazon Lubomir Polascin (4 tituly), Gumroad (2 produkty) a nefro.polascin.net: bez nových publikácií. Na mediweb.hnonline.sk a prolekare.cz sa nenašlo nič nové.
