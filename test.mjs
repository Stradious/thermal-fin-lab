import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeFin } from './fin.mjs';
const base = { length: 0.08, width: 0.03, thickness: 0.003, conductivity: 205, convectionCoefficient: 35, baseTemperature: 90, ambientTemperature: 25 };
test('temperature falls toward ambient and efficiency is bounded', () => {
  const r = analyzeFin(base);
  assert.equal(r.temperature[0], base.baseTemperature);
  assert.ok(r.tipTemperature < base.baseTemperature && r.tipTemperature > base.ambientTemperature);
  assert.ok(r.efficiency > 0 && r.efficiency < 1);
  assert.ok(r.heatWatts > 0);
});
test('reversing temperature difference reverses heat flow', () => {
  const hot = analyzeFin(base), cold = analyzeFin({ ...base, baseTemperature: -40, ambientTemperature: 25 });
  assert.ok(Math.abs(hot.heatWatts + cold.heatWatts) < 1e-10);
});
