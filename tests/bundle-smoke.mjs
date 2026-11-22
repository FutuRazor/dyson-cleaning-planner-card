import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import { batchFixture } from './fixture.mjs';

const bundle = await readFile(new URL('../dist/dyson-cleaning-planner-card.js', import.meta.url), 'utf8');
const elements = new Map();
const context = { EventTarget, HTMLElement:class {}, window:{}, customElements:{ get:name => elements.get(name), define:(name, element) => elements.set(name, element) } };
runInNewContext(bundle, context);
const f = batchFixture();
const Card = elements.get('dyson-cleaning-planner-card');
assert.ok(Card);
assert.ok(elements.get('dyson-cleaning-planner-card-editor'));
assert.ok(elements.get('dyson-planner-zone'));
const card = Object.create(Card.prototype);
Object.assign(card, { _hass:f.hass, registry:f.registry, config:f.config });
assert.equal(card.getModel().rooms.length, 5);
assert.equal(card.adapter.id, 'dyson_spot_scrub');
console.log("Standalone bundle smoke check passed.");
