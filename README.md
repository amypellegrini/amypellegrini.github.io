# Amy Pellegrini — website and reusable skills library

An Eleventy website with a searchable skills and agents library at `/library/`.

## Develop and validate

```sh
npm ci
npm run build
npm test
npm run dev
```

The build indexes the maintained definitions and clears generated output before rendering, so retired pages and downloads cannot remain in a deployment. The catalog works without JavaScript; JavaScript adds search, category/type/runtime filters, shareable filter URLs, and copy buttons.

## Maintain the library

- `skills/<name>/SKILL.md`: 22 self-contained, repository-neutral workflows; edit these files directly.
- `agents/dev.md` and `agents/qa.md`: optional Claude Code orchestrators with local execution fallbacks in the companion skills.
- `registry/index.json`: generated schema version 2 catalog with one entry per definition.
- `scripts/sync-library.cjs`: indexes the maintained definitions without reading external repositories.
- `_data/library.js`: reads registry data for catalog and detail pages.

After editing a skill or agent:

```sh
npm run library:sync
npm run build
npm test
```

Each registry entry records a stable ID, kind, category, runtime, metadata, source path/URL, SHA-256 checksum, download path, and install command (null for agents). Paths beginning with `/` are relative to the website origin. Source URLs point to these maintained definitions on the library's main branch, rather than to immutable historical snapshots.

Portable skills discover the target project's owner, default branch, tooling, tracker, and workflow at use time. They do not require a board, mobile device, parent repository, or custom script. Specific tools and permissions may still be needed for the requested operation. Optional companion skills and agents have procedural fallbacks. Repository-specific copies and downloadable source snapshots have been retired; refreshing the registry cannot reintroduce them.

## Install with Vercel Skills CLI

See the website's installation guide and the [official Skills CLI documentation](https://github.com/vercel-labs/skills). Requires Node.js and npm.

Before publication, from this checkout:

```sh
npx skills add ./skills --list
npx skills add ./skills --skill tdd --agent claude-code
```

After the changes reach this repository's main branch:

```sh
npx skills add amypellegrini/amypellegrini.github.io --list
npx skills add amypellegrini/amypellegrini.github.io --skill tdd --agent codex
```

Choose a supported target with `--agent`, or omit that option for interactive selection. Add `--global` for a user-wide installation. The repository address in these commands identifies this distribution library; it is not a dependency on the repository where the skill will run.

Agent definitions are installed separately: save the appropriate file under `.claude/agents/` in the target project. Installing the `dev` or `qa` skill does not install its companion agent. Those skills also support direct execution when an agent is unavailable. The JSON catalog does not itself register a skills.sh listing.

## Publication

The existing GitHub Pages workflow builds, validates, and deploys `_site` on a push to `main`. It publishes the catalog, detail pages, registry, skills, and agent definitions. Commit the maintained definitions and generated registry together. Local edits and builds do not publish anything.
