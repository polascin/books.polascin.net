# Latest handoff pointer

Active loop handoff: `.codex/handoffs/2026-11-05-194700-books-dev-loop-beh7.md`

Loop sentinel: `AGENT_LOOP_WAKE_books_dev`
Head: `b6ccfe4` on `main` (+ pending test/audit docs commit)
Last closed: Beh #7 (privacy, sitemap/robots, server junk, robots.php edge bypass)
Open: bare `/robots.txt` may stay on edge TTL (473 B); `/robots.php` is correct (590 B)
Next: Beh #8 — next audit finding; re-check `/robots.txt` size==590
Stop: kill sleeper PID and do not re-arm
