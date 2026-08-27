# books.polascin.net

Portfolio of books by Dr. Lubomir Polascin — a PHP/MariaDB catalogue site.

---

## Local setup

### 1. Clone and configure the environment

```bash
git clone https://github.com/polascin/books.polascin.net.git
cd books.polascin.net

# Copy the example env file and fill in your real credentials.
# Never commit .env – it is excluded by .gitignore.
cp .env.example .env
$EDITOR .env
```

`.env` keys:

| Key        | Description                                           |
| ---------- | ----------------------------------------------------- |
| `DB_HOST`  | Database hostname (usually `localhost`)               |
| `DB_PORT`  | MySQL/MariaDB port (usually `3306`)                   |
| `DB_NAME`  | Database name                                         |
| `DB_USER`  | Database user                                         |
| `DB_PASS`  | Database password                                     |
| `SITE_URL` | Canonical base URL, e.g. `https://books.polascin.net` |
| `APP_DEBUG` | `true` shows PHP errors in the browser. Leave `false` in production - traces expose absolute server paths. Absent means off. |

### 2. Install the Git hooks

Run once after cloning so secret-blocking hooks are active on your machine:

```bash
bash hooks/install.sh
```

This copies `hooks/pre-commit` and `hooks/pre-push` into `.git/hooks/` and marks them executable.

### 3. Create the database

```bash
php setup_db.php
```

### 4. Build the front-end assets

The site loads **no third-party CDN** - fonts and Tailwind are served from our
own origin, so opening a page discloses no visitor IP to Google or any other
provider. Both build outputs are committed, so a plain clone already works and
the server never builds anything; you only need Node when you change them.

```bash
npm install

# Rebuild the Tailwind bundle after adding/removing classes in any .php file.
npm run build:css     # -> assets/css/tailwind.css

# Re-download the web fonts (rarely needed).
npm run fonts         # -> assets/fonts/*.woff2 + assets/css/fonts.css
```

- **Tailwind is pinned to v3.4.17** on purpose: it matches what
  `cdn.tailwindcss.com` used to serve. Upgrading to v4 changes the default
  border colour, the `shadow`/`rounded` scale names and ring widths, which
  would silently restyle the site.
- The `content` globs in `tailwind.config.js` decide which classes survive
  purging. A class that only ever exists as a runtime-built string must be
  added to the globs or safelisted, or it will be purged.
- CI rebuilds the bundle on every push and **fails if the committed
  `assets/css/tailwind.css` is stale**, so a forgotten rebuild cannot reach
  production.
- Fonts are marked `binary` in `.gitattributes`; without that, `core.autocrlf`
  would corrupt the `.woff2` files on Windows.

---

## Security

### Environment variables

- Credentials live **only** in `.env` (gitignored).
- `.env.example` contains safe placeholder values — commit changes there when new variables are added.
- The application loads `.env` via `loadEnv()` in `includes/functions.php`; no third-party dotenv library is required.

### Secret-blocking Git hooks

`hooks/pre-commit` blocks:

- Files whose names match known secret patterns (`.env`, `*.pem`, `*.key`, `id_rsa`, …)
- Staged content containing credential patterns (`DB_PASS=`, `API_KEY=`, AWS/GCP/GitHub/Stripe key patterns)

`hooks/pre-push` rescans all commits in the push range for the same patterns as a second line of defence.

To bypass a **confirmed false positive** (e.g. a test fixture):

```bash
git commit --no-verify   # use sparingly and with justification
```

### GitHub Actions CI

`.github/workflows/secret-scan.yml` runs on every push and pull request, scanning newly introduced commits with the same pattern set as the local hooks.

### If a secret is accidentally committed

1. **Rotate the credential immediately** — assume it is compromised.
2. Remove the value from the source file.
3. Rewrite history to purge it from all commits:
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch path/to/file" \
     --prune-empty --tag-name-filter cat -- --all
   ```
   Or use [`git-filter-repo`](https://github.com/newren/git-filter-repo) (faster, preferred).
4. Clean local refs and force-push:
   ```bash
   git for-each-ref --format='delete %(refname)' refs/original | git update-ref --stdin
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   git push origin --force main
   ```
5. Notify any collaborators to re-clone or hard-reset their local copies.
