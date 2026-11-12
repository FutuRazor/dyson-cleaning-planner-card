# Repository instructions

- Treat `src/` as the source of truth. Never read, open, search, diff, or manually edit `dist/dyson-cleaning-planner-card.js` or any files inside `dist/`.
- After application changes in `src/`, update the simulated entities or mock
  states in `preview/` if needed, then run `npm run check` and `npm run deploy`
  so the local bundle is copied to Home Assistant for testing (do not inspect or
  diff the generated `dist/` output).
- Keep release versions consistent in `package.json`, `package-lock.json`, the
  README, changelog, test documentation, and UI version label.
- Do not change the release version unless the user explicitly requests it.
- Write repository-facing text, documentation, release notes, and commit messages
  in English.
