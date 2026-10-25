import test from 'node:test';
import assert from 'node:assert/strict';
import { mean, median, variance, describe, pearson, spearman, linearRegression, studentTTestOne, welchTTest, chiSquareIndependence, oneWayAnova } from '../js/stats.js';

test('descriptive statistics calculate expected values', () => {
  const values = [1, 2, 3, 4, 5];
  assert.equal(mean(values), 3);
  assert.equal(median(values), 3);
  assert.equal(variance(values), 2.5);
  const d = describe(values);
  assert.equal(d.n, 5);
  assert.equal(d.min, 1);
  assert.equal(d.max, 5);
  assert.equal(d.q1, 2);
  assert.equal(d.q3, 4);
});

test('correlation and simple regression detect a perfect linear relation', () => {
  const x = [1, 2, 3, 4, 5];
  const y = [3, 4, 5, 6, 7];
  assert.equal(pearson(x, y), 1);
  assert.equal(spearman(x, y), 1);
  const r = linearRegression(x, y);
  assert.equal(r.slope, 1);
  assert.equal(r.intercept, 2);
  assert.equal(r.r2, 1);
});

test('t tests return finite statistics on non-degenerate samples', () => {
  const one = studentTTestOne([1, 2, 3, 4, 5], 3);
  assert.equal(one.t, 0);
  assert.equal(one.p, 1);
  assert.ok(one.ciLow < one.mean && one.ciHigh > one.mean);
  const two = welchTTest([1, 2, 3, 4, 5], [3, 4, 5, 6, 7]);
  assert.equal(two.difference, -2);
  assert.ok(two.p > 0.07 && two.p < 0.09);
});

test('chi-square test and one-way ANOVA return finite p-values', () => {
  const chi = chiSquareIndependence([[20, 10], [10, 20]]);
  assert.ok(chi.chi2 > 0);
  assert.ok(chi.p > 0 && chi.p < 1);
  const anova = oneWayAnova([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
  assert.equal(anova.F, 27);
  assert.ok(anova.p > 0 && anova.p < 0.01);
});
