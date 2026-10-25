import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCSV, toCSV } from '../js/utils.js';

test('CSV parser handles commas, quotes, and newlines inside quoted cells', () => {
  const parsed = parseCSV('name,note\r\n"Smith, Jane","said ""hello"""\r\nAlex,"first line\nsecond line"');
  assert.deepEqual(parsed.columns, ['name', 'note']);
  assert.equal(parsed.rows[0].name, 'Smith, Jane');
  assert.equal(parsed.rows[0].note, 'said "hello"');
  assert.equal(parsed.rows[1].note, 'first line\nsecond line');
});

test('CSV export and import preserve string values', () => {
  const columns = ['id', 'comment'];
  const rows = [{id: 1, comment: 'good, really'}, {id: 2, comment: 'line one\nline two'}];
  const again = parseCSV(toCSV(columns, rows));
  assert.equal(again.rows[0].comment, rows[0].comment);
  assert.equal(again.rows[1].comment, rows[1].comment);
});
