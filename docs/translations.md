# Translations

The card and editor support `language: auto`, `en`, and `de`. Automatic uses the current Home Assistant user's locale, with English as the fallback. Languages are resolved per card, so different cards can use different languages.

## Adding a language

1. Copy `src/translations/en.js` to a new language file. Keep every message key and translate only its value. Preserve placeholders such as `{name}`, `{selected}`, and `{total}`.
2. Import the dictionary and register its language code in `src/localize.js`.
3. Add the code to configuration validation in `src/core.js` and its native language name to the selector in `src/editor.js`. Update the language-validation message in every dictionary.
4. Add the translation module before `localize` in `scripts/build.mjs` and document the new configuration value.
5. Run `npm run check`, then verify the editor, planner, session and Info overlay in both narrow and wide layouts. `tests/languages-browser.mjs` exercises language switching and checks that service payloads remain unchanged (requires Playwright and Edge).

English phrases are stable message keys. When adding a UI message, add it to every dictionary and use `t()` for text or `ht()` for HTML. Use placeholders for dynamic values rather than concatenating translated sentences. The unit tests check matching keys and placeholders.

## Keep display text separate from data

- Translate option labels only; keep each option's original `value` and action payload unchanged.
- Do not translate room names, device names, entity IDs or custom titles.
- Card-owned errors use `UiError`; delayed messages can use `uiMessage`. Both retain their key and parameters so a later language change can translate them.
- External integration errors and unknown options remain readable in their original language.
- Never use a translated string to decide robot state, availability or which action to send.
- A language-only change preserves local room drafts and pending requests.

Translations are bundled into the single distribution file. They require no network requests or additional installation files.
