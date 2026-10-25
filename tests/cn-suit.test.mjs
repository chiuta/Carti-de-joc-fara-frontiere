// Teste 1.2.10: Crazy Eights în rețea — culoarea cerută după un 8 trebuie să fie un întreg 0..3. Rulare: node tests/cn-suit.test.mjs
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const require = createRequire('/opt/node-tools/package.json');
const {chromium} = require('playwright');
const FILE = 'file://' + path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'index.html');
let ok = 0, bad = 0;
const check = (n, c, x) => { if (c) { ok++; console.log('  ok   ' + n); } else { bad++; console.log('  FAIL ' + n + (x !== undefined ? '  → ' + JSON.stringify(x) : '')); } };
const b = await chromium.launch({executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox']});
const ctx = await b.newContext(); await ctx.route(/^https?:/, (r) => r.abort());
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', (e) => errs.push(e.message));
await p.goto(FILE); await p.waitForTimeout(1200);
const run = (su) => p.evaluate((su) => {
  cn = {me: 0, host: true, up: true, ls: {stop() {}}, sess: {close() {}}, rnd: null};
  cnBegin(cn, 7, []);
  cn.hands[0] = [{r: 8, s: 0}, {r: 3, s: 1}]; cn.turn = 0; cn.over = false; cn.discard = [{r: 5, s: 2}]; cn.suit = 2;
  const res = cnApply({k: 'p', r: 8, s: 0, su}, 0);
  const out = {res: res === undefined ? 'ok' : res, suit: cn.suit, left: cn.hands[0].length};
  cn = null; return out;
}, su);
for (const su of [1.5, 'x', 4, -1, null, 0.1]) {
  const r = await run(su);
  check('culoare ' + JSON.stringify(su) + ' respinsă, starea neschimbată', (su === null ? true : r.res === 'suit') && (su === null || (r.suit === 2 && r.left === 2)), r);
}
for (const su of [0, 1, 2, 3, '3']) {
  const r = await run(su);
  check('culoare ' + JSON.stringify(su) + ' acceptată', r.res === 'ok' && r.suit === Number(su) && r.left === 1, r);
}
check('fără pageerror', errs.length === 0, errs);
await b.close();
console.log(`Carti-de-joc cn-suit: ${ok} ok, ${bad} eșuate`); process.exit(bad ? 1 : 0);
