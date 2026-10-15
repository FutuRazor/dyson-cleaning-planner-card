# Repository instructions

- Treat `src/` as the source of truth. Never implement a feature or fix only in
  `dist/`.
- Generate `dist/dyson-cleaning-planner-card.js` with `npm run build`; do not
  edit the generated bundle manually.
- After application changes, run `npm run check` and keep the generated `dist/`
  file in the same change as its corresponding `src/` files.
- Keep release versions consistent in `package.json`, `package-lock.json`, the
  README, changelog, test documentation, UI version label, and generated bundle.
- Do not change the release version unless the user explicitly requests it.
- Write repository-facing text, documentation, release notes, and commit messages
  in English.
