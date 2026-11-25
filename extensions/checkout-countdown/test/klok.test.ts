import assert from 'node:assert/strict';
import { test } from 'node:test';
import { bannerSvg } from '../src/banner.ts';
import { formatRest, hoeken, kleur, parseEinde, resterend, splits } from '../src/klok.ts';

const EINDE = Date.parse('2026-12-01T00:00:00+01:00');
const OPTIES = { kop: 'A & B', regel: 'ends in', labels: ['days', 'hrs', 'min', 'sec'] as [string, string, string, string], vlak: '#121212', tekst: '#fff', vakjes: '#fff', cijfers: '#121212', hoeken: 8 };

test('einde: leeg of onleesbaar = null', () => {
  assert.equal(parseEinde(''), null);
  assert.equal(parseEinde(undefined), null);
  assert.equal(parseEinde('2026-20-11 00:00'), null);
  assert.equal(parseEinde(' 2026-12-01T00:00:00+01:00 '), EINDE);
});

test('na het einde of zonder einde: niets', () => {
  assert.equal(resterend(EINDE, EINDE, 0), null);
  assert.equal(resterend(EINDE + 1000, EINDE, 0), null);
  assert.equal(resterend(EINDE - 5000, null, 0), null);
});

test('laatste uren: alleen binnen het venster', () => {
  assert.equal(resterend(EINDE - 25 * 3600e3, EINDE, 24), null);
  assert.equal(resterend(EINDE - 23 * 3600e3, EINDE, 24), 23 * 3600);
  assert.equal(resterend(EINDE - 25 * 3600e3, EINDE, undefined), 25 * 3600);
});

test('opmaak', () => {
  assert.deepEqual(splits(86400 + 4 * 3600 + 12 * 60 + 33), [1, 4, 12, 33]);
  assert.equal(formatRest(86400 + 4 * 3600 + 12 * 60 + 33, 'd'), '1d 04:12:33');
  assert.equal(formatRest(59, 'd'), '00:00:59');
});

test('kleuren en hoeken: alleen geldige waarden', () => {
  assert.equal(kleur('#D21404', '#000'), '#D21404');
  assert.equal(kleur('#fff', '#000'), '#fff');
  assert.equal(kleur('rood', '#000'), '#000');
  assert.equal(kleur('#12"/><script>', '#000'), '#000');
  assert.equal(hoeken('', 8), 8);
  assert.equal(hoeken(0, 8), 0);
  assert.equal(hoeken(99, 8), 20);
});

test('banner: dag-vakje vervalt op de laatste dag, tekst ge-escaped', () => {
  const laatsteDag = bannerSvg(3661, OPTIES);
  assert.equal((laatsteDag.match(/<rect /g) || []).length, 4);
  assert.ok(laatsteDag.includes('A &amp; B') && !laatsteDag.includes('DAYS'));
  const metDag = bannerSvg(90000, OPTIES);
  assert.equal((metDag.match(/<rect /g) || []).length, 5);
  assert.ok(metDag.includes('DAYS'));
});
