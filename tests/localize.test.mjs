import test from 'node:test';
import assert from 'node:assert/strict';
import { LANGUAGES, resolveLanguage, translate, UiError, uiMessage } from '../src/localize.js';
import { normalizeConfig } from '../src/core.js';

test('language follows the user locale with explicit per-card overrides and English fallback', () => {
  assert.equal(resolveLanguage({}, { locale: { language: 'de-DE' } }), 'de');
  assert.equal(resolveLanguage({}, { language: 'de' }), 'de');
  assert.equal(resolveLanguage({ language: 'en' }, { language: 'de' }), 'en');
  assert.equal(resolveLanguage({ language: 'auto' }, { language: 'fr' }), 'en');
  assert.equal(resolveLanguage(null), 'en');
  assert.equal(normalizeConfig({ entity: 'vacuum.robot' }).language, 'auto');
  assert.throws(() => normalizeConfig({ entity: 'vacuum.robot', language: 'fr' }), /language/);
});

test('all translations have matching keys and interpolation placeholders', () => {
  const keys = Object.keys(LANGUAGES.en).sort();
  const placeholders = text => [...text.matchAll(/\{(\w+)\}/g)].map(match => match[1]).sort();
  for (const dictionary of Object.values(LANGUAGES)) {
    assert.deepEqual(Object.keys(dictionary).sort(), keys);
    for (const key of keys) assert.deepEqual(placeholders(dictionary[key]), placeholders(key), key);
  }
});

test('own messages translate parameters without changing names or external errors', () => {
  const error = new UiError('{setting} is no longer available for {room}.', {
    setting: uiMessage('Water level'), room: 'Living Room <North>',
  });
  assert.equal(translate('de', error), 'Wassermenge ist für Living Room <North> nicht mehr verfügbar.');
  assert.equal(translate('de', new Error('Robot firmware: unavailable')), 'Robot firmware: unavailable');
  assert.equal(translate('de', 'Future mode'), 'Future mode');
  assert.equal(translate('fr', 'Plan a clean'), 'Plan a clean');
  assert.equal(translate('de', '{selected} of {total} rooms selected', { selected: 2, total: 5 }), '2 von 5 Räumen ausgewählt');
});


test('Dutch supports regional HA locales, overrides and translated parameters', () => {
  for (const language of ['nl', 'nl-NL', 'nl_BE']) assert.equal(resolveLanguage({}, {locale:{language}}), 'nl');
  assert.equal(normalizeConfig({entity:'vacuum.robot',language:'nl'}).language,'nl');
  assert.equal(resolveLanguage({language:'nl'},{language:'en'}),'nl');
  assert.equal(translate('nl','Plan a clean'),'Reiniging plannen');
  assert.equal(translate('nl','{selected} of {total} rooms selected',{selected:2,total:5}),'2 van 5 kamers geselecteerd');
  assert.equal(translate('nl',new Error('Robot firmware: unavailable')),'Robot firmware: unavailable');
});

test('Dutch accents and punctuation survive translation encoding', () => {
  assert.equal(translate('nl', 'One pass'), 'E\u00e9n keer');
  assert.equal(translate('nl', 'One Pass'), 'E\u00e9n keer');
  assert.equal(translate('nl', 'Select at least one room without duplicates.'), 'Selecteer minstens \u00e9\u00e9n kamer, zonder dubbele selecties.');
  assert.equal(translate('nl', 'Saving \u2026'), 'Opslaan \u2026');
  assert.equal(translate('nl', 'Vacuum \u00b7 Auto \u00b7 One pass. Drag the zone or resize its lower-right corner.'), 'Stofzuigen \u00b7 Auto \u00b7 E\u00e9n keer. Versleep de zone of pas het formaat aan via de rechteronderhoek.');
  for (const [key, value] of Object.entries(LANGUAGES.nl)) {
    assert.ok(!value.includes('\ufffd'), key);
    if (key.endsWith('\u2026')) assert.ok(value.endsWith('\u2026'), key);
  }
});
