# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Personal website for eddie cameron, served at **https://eddiecameron.fun** (custom domain in `CNAME`) via GitHub Pages. It's a Jekyll site — the tagline is "i make games for computers." Despite the repo name (`eddiecameron.github.io`), the live host is `eddiecameron.fun`, set in `_config.yml`.

## Commands

```bash
bundle install              # install Ruby gem dependencies (first time / Gemfile changes)
bundle exec jekyll serve    # build + serve with live reload at http://localhost:4000
```

`npm test` is aliased to `bundle exec jekyll serve` (there are no automated tests). The VS Code "Serve Site" build task runs the same command. `npm install` only pulls Bootstrap as a convenience; the actual Bootstrap SCSS is vendored under `_sass/bootstrap/`, so the site builds without node_modules.

GitHub Pages builds and deploys automatically on push to `master` — there is no separate build/deploy step to run.

## Architecture

- **Jekyll + `minima` theme as a base, but most pages override it.** `_config.yml` sets `theme: minima`, yet the site's own pages use a custom `_layouts/default.html` (a near-bare HTML shell that injects only `{{ content }}` plus the compiled stylesheet). Markdown content pages like `about.md` use minima's `page` layout instead. When editing layout/nav, expect hand-written HTML pages, not theme templates.

- **Pages are hand-authored HTML with Jekyll front matter**, not Markdown. `index.html`, `portfolio/index.html`, `other/index.html`, `404.html`, etc. each carry their own `<nav>` navbar markup copied inline (no shared nav include) and pull in `_includes/footer.html` for the Bootstrap JS bundle. Changing the navbar means editing each page.

- **Styling**: `assets/grapefruitgames.scss` compiles to `grapefruitgames.css` (Jekyll Sass, `style: compressed`). It imports vendored Bootstrap 4 from `_sass/bootstrap/scss/`. The brand palette is the green `#BBCF78` / cream `#FCF3D2` seen across navbar and title blocks. The leading `---` front matter on the `.scss` is what tells Jekyll to process it — don't remove it.

- **Animated front page**: `index.html` renders a single `&` and runs `assets/js/titleText.js`. The `assets/js/` folder also holds Three.js (`three.min.js`) and custom shader/instancing JS (`eddieInstanceVert.js`, `eddieInstanceFrag.js`, `triangles.js`, `gifpicker.js`) used for visual experiments.

- **`games/`** hosts archived legacy Unity Web Player builds — each subfolder has an `index.html` plus a `.unity3d` payload. These are static historical artifacts.

- **`builds/`** is an iOS ad-hoc/OTA app distribution page (itms-services manifest install flow), historically used to hand out an app called "Tumble Time." Treat it as a one-off landing page, not part of the main site structure.

- **`portfolio/`** is a media gallery; assets live in `portfolio/assets/images/` (gifs, mp4s, stills of game-dev work).