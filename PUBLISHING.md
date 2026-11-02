# Publish the Layer-4 family website (GitHub Pages)

The source website is committed under `docs/`:

- `docs/index.html` — phone-friendly storytelling, timeline, family-tree preview and historical notes.
- `docs/assets/site.css` and `docs/assets/site.js` — styling and in-browser interactions.

## Activation (one GitHub settings action)

1. Visit **https://github.com/edenlum/Lazarus/settings/pages** while signed into `edenlum`.
2. Choose **Build and deployment → Source: Deploy from a branch**.
3. Select **Branch: main**, **Folder: /docs**.
4. Click **Save**. When Pages is active, GitHub will display a **Visit site** button.
5. Expected project-site URL: **https://edenlum.github.io/Lazarus/** (verify GitHub's actual URL before sharing).

**Note:** GitHub Pages from a **private** repository requires an eligible paid plan (e.g. GitHub Pro or Team). GitHub Free only publishes Pages from public repositories. If GitHub refuses to publish this private repo, **do not make Lazarus public**: instead, create a separate public repository containing *only the `docs/` website files*. The private original scans and vault remain private.

## Privacy boundaries

GitHub Pages sites are ordinarily **publicly viewable**, even when the source repository is private. Anyone with the public URL—and potentially anyone on the internet—could view its published contents. This site intentionally includes only a small curated layer of history and does **not** load from `Scans/`, `Transcriptions/`, or the rest of `People/`.

An `noindex` meta tag is present to discourage search indexing, but **this is not a password or access control**. Review website text before sharing more widely. Do not put private records, confidential information, or details about living relatives into the public `docs/` output without permission.

The site uses relative paths so it works under the `/Lazarus/` GitHub Pages URL. No database, account login, external JavaScript dependency or tracker is used.

## How to update

Edit the curated narrative in `docs/index.html` or the public preview notes in `docs/assets/site.js`. The complete private research vault is **not automatically published**. Cite PDF page numbers in public material and consult `Sources and review status.md` before quoting original words.

The website is an **interpretive public output**, not a second historical source.
