# Deploy – books.polascin.net

Automatické nasadenie cez GitHub Actions (`.github/workflows/deploy.yml`):
po každom pushi do `main` (alebo manuálne cez **Actions → Deploy → Run
workflow**) sa repozitár zosynchronizuje rsyncom do web rootu na WebSupport.
Súbory vylúčené v `.deployignore` sa nenasadzujú (vrátane `setup_db.php`);
`--delete` sa nepoužíva, takže serverové súbory mimo repozitára (databáza,
konfigurácia) zostávajú nedotknuté. Push s `[skip deploy]` v commit message
deploy preskočí.

Pred nasadením beží job `validate`: `php -l` na všetkých sledovaných PHP
súboroch, `node --check` na skriptoch a prestavba Tailwind bundle, ktorá zlyhá,
ak je commitnutý `assets/css/tailwind.css` zastaraný. Po rsyncu prebehne smoke
test na `/`, `/privacy.php` a `/terms.php`.

> **Aktuálny stav (overené 2026-08-27): `DEPLOY_*` secrets nastavené nie sú**,
> takže job `deploy` sa iba preskočí s upozornením a workflow skončí zeleno.
> Jediná skutočne fungujúca cesta nasadenia je zatiaľ lokálny `post-commit`
> hook popísaný nižšie. Job `validate` beží a chráni repozitár aj tak.

Kým secrets nie sú nastavené, deploy job sa iba preskočí s upozornením
(workflow nezlyhá).

## GitHub Secrets (Settings → Secrets and variables → Actions)

| Secret               | Popis                                                                                                          |
| -------------------- | -------------------------------------------------------------------------------------------------------------- |
| `DEPLOY_HOST`        | SSH host, napr. `shell.r1.websupport.sk`                                                                       |
| `DEPLOY_USER`        | SSH používateľ, napr. `uid58858`                                                                               |
| `DEPLOY_PORT`        | SSH port (WebSupport shell používa `26650`; predvolené `22`)                                                   |
| `DEPLOY_SSH_KEY`     | Celý obsah privátneho SSH kľúča                                                                                |
| `DEPLOY_KNOWN_HOSTS` | Host key servera (`ssh-keyscan -p <port> <host>`), formát `[host]:port`                                        |
| `DEPLOY_REMOTE_PATH` | Absolútna cesta k web rootu subdomény (pravdepodobne `…/polascin.net/sub/books` — overte vo WebSupport paneli) |

Workflow pred rsyncom overí, že vzdialený adresár existuje — pri zlej ceste
bezpečne zlyhá bez zápisu.

## Druhá, lokálna cesta nasadenia

Okrem GitHub Actions existuje **lokálny `post-commit` hook** v `.git/hooks/`
(`post-commit` → `deploy.sh`), ktorý po každom commite pushne branch a rovno
nahrá zmenené súbory cez SFTP. Nie je v repozitári — po novom klonovaní ho
treba nastaviť ručne a používa kľúč `~/.ssh/books_deploy`.

Do behu #1 auditu tento hook **nerešpektoval `.deployignore`** a filtroval len
`.claude/`, `.vscode/` a `.agents/` — na produkčný web root sa tak dostal
`setup_db.php`, interné `.md` dokumenty, CI konfigurácia aj vývojárske
nástroje. Odvtedy číta `.deployignore` rovnako ako rsync v CI.

Ak sa vylučovanie mení, treba ho overiť **v oboch** cestách — `.deployignore`
je spoločný zdroj pravdy, ale používajú ho dva nezávislé skripty.
