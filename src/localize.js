import { en } from './translations/en.js';
import { de } from './translations/de.js';

export const LANGUAGES = { en, de };
export function resolveLanguage(config = {}, hass) {
  config ??= {};
  const requested = config.language && config.language !== 'auto' ? config.language : hass?.locale?.language ?? hass?.language ?? 'en';
  const base = String(requested).toLowerCase().split(/[-_]/)[0];
  return Object.hasOwn(LANGUAGES, base) ? base : 'en';
}
// Structured messages preserve parameters until rendering, including a language change.
export function uiMessage(key, params = {}) { return { key, params }; }
export class UiError extends Error {
  constructor(key, params = {}) { super(translate('en', key, params)); this.key = key; this.params = params; }
}
export function translate(language, key, params = {}) {
  if (key instanceof UiError || (key && typeof key === 'object' && typeof key.key === 'string')) {
    return translate(language, key.key, key.params);
  }
  // Integration/backend errors are external prose, not translation keys.
  if (key instanceof Error) return key.message;
  if (key == null) return '';
  const dictionary = LANGUAGES[language] ?? en;
  const text = Object.hasOwn(dictionary, key) ? dictionary[key] : Object.hasOwn(en, key) ? en[key] : String(key);
  return text.replace(/\{(\w+)\}/g, (match, name) => Object.hasOwn(params, name) ? String(params[name] instanceof Error || typeof params[name] === 'object' ? translate(language, params[name]) : params[name]) : match);
}

