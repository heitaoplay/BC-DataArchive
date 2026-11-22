# Data Archive · DA — BC Backup & Restore

> A Bondage Club userscript to back up and restore your in-game data. Geek-styled UI, 3 languages, animated import/export.
>
> 📋 [Changelog](CHANGELOG.md) · [简体中文](README.md)

[![Install Data Archive](https://img.shields.io/badge/Install-Tampermonkey%20%2F%20Violentmonkey-blue?logo=tampermonkey&logoColor=white)](https://raw.githubusercontent.com/heitaoplay/BC-DataArchive/main/BC-DataArchive.user.js)

Click the badge to open the raw script and get the Tampermonkey / Violentmonkey install prompt — no copy-paste.

**Auto-update**: Tampermonkey holds only a 2KB loader; the core code lives on GitHub Pages. Every BC page load dynamically imports the latest core (with a cache-busting timestamp) — after the author pushes, **just refresh the page**, no manual Tampermonkey update or reinstall.

## What it does

Packs your BC progress into a JSON file on your own computer, and restores it later.

| Area | Contents |
|---|---|
| Character data | Wardrobe, crafted items, appearance, money, reputation, skills, ownership/lovership, saved colors |
| Character settings | LSCG, EmeryBC and other addon settings stored on your character account |
| Shared settings | FCM friends, profile backgrounds and other cross-room settings |
| Addon data | Outfit caches, chat history, OutfitManager and other browser-local data |

- **Full archive** — pick which areas to include (all selected by default), save via a native file picker
- **Fine-grained** — back up a single entry or just the checked ones
- **Restore / Import** — preview old vs new values with validation, pick entries, second-step confirmation, then overwrite
- **Validation** — flags account mismatch, wrong types, empty or oversized data; invalid entries are disabled
- **Geek UI** — dark terminal styling, custom checkboxes, hover / long-press tooltips, progress animations
- **3 languages** — Simplified Chinese / Traditional Chinese / English, switchable in-panel
- **Readable names** — English data keys (e.g. `LSCG_Outfits`) show a human-readable label ("LSCG · Outfits") covering 99% of common mods, with the original key kept for reference
- **Backup reminder** — set Off / every 7 / 15 / 30 days / custom. When due, a banner appears in the panel ("Back up now" / "Remind me later today") plus at most one daily toast after login. Backing up resets the timer. Settings and last-backup time are stored locally

## Where your data goes (important)

**It stays on your computer. Nothing is uploaded to any cloud server.**

- Archive → a native "Save file" dialog → you choose the location → a `.json` file is written
- Your data is never sent to GitHub or any third party
- This repo contains only the plugin **code**, never your game data

**Moving to a new device**: copy the `.json` file over → open BC → click the DA button → Restore/Import → pick the file → follow the prompts.

## How to open

Two ways to open it:

1. **Information sheet**: open **your own** information sheet (profile). A dark blue **DA** square sits at the lower-left beside the portrait — click it.
2. **Chat command**: type `/da` in the chat box and press Enter. Case-insensitive — `/DA`, `/Da`, `/dA` all work.

## After restoring, do I need to reload?

| Restored content | Action |
|---|---|
| Character data (appearance, items, money...) | Submitted to server; **re-login** for changes to fully apply |
| Character / shared settings | Usually sync automatically; switch page or re-login if stale |
| Addon data (localStorage) | Effective immediately; a few addons may need their own reload |

## Install

Install Tampermonkey or Violentmonkey, then click the badge above or open:

<https://raw.githubusercontent.com/heitaoplay/BC-DataArchive/main/BC-DataArchive.user.js>

Supported servers: `bondageprojects.elementfx.com`, `bondage-asia.com`, `bondage-europe.com` (and `www.` variants).

## Requirements

- Needs **bcModSdk**. If you run BCX or other mainstream BC mods, it is already present.
- Adapted to the R134 information-sheet DOM button mechanism.
- Registered via ModSDK, so BCX compatibility check won't report "Unknown mod".

## Credits & license

The capacity-manager core logic is extracted from [awdrrawd/BC-LCE](https://github.com/awdrrawd/BC-LCE) `src/settings/storage-manager.js`, by **Likolisu**, under **AGPL-3.0**. Original author attribution retained; this derivative work is likewise **AGPL-3.0**.
