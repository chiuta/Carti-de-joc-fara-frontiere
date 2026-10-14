// Teste funcții noi (runda 8, 14 octombrie 2026) — Playwright, Chromium headless, rețea blocată.
// Rulare: node tests/fff-r8.test.mjs   (cere /opt/node-tools cu playwright și /opt/pw-browsers/chromium; axe-core opțional prin AXE_PATH)
import {createRequire} from 'module';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const require = createRequire('/opt/node-tools/package.json');
const {chromium} = require('playwright');
const HERE = path.dirname(fileURLToPath(import.meta.url));
const INDEX = path.join(HERE, '..', 'index.html');
const URL_APP = 'file://' + INDEX;
const AXE = process.env.AXE_PATH || '/tmp/claude-0/-home-claude/78529928-3825-51c3-b9bd-0e81655ab6bc/scratchpad/sweep/node_modules/axe-core/axe.min.js';
const sleep = ms => new Promise(r => setTimeout(r, ms));
let pass = 0, fail = 0;
const ok = (cond, name, info) => { if (cond) { pass++; console.log('  ok   ' + name); } else { fail++; console.log('  FAIL ' + name + (info === undefined ? '' : ' ' + JSON.stringify(info).slice(0, 500))); } };
const FLAGS = ['--no-sandbox', '--allow-loopback-in-peer-connection', '--disable-features=WebRtcHideLocalIpsWithMdns'];
const browser = await chromium.launch({executablePath: '/opt/pw-browsers/chromium', args: FLAGS});
const net = [], errs = [];
async function mk(o = {}) {
  const ctx = await browser.newContext({viewport: {width: o.w || 1280, height: o.h || 800}, acceptDownloads: true, colorScheme: o.scheme || 'dark', reducedMotion: o.reduced ? 'reduce' : 'no-preference', locale: o.locale || 'ro-RO', bypassCSP: !!o.bypassCSP});
  await ctx.route(/^https?:/, r => { net.push(r.request().url()); r.abort(); });
  if (o.init) await ctx.addInitScript(o.init);
  const page = await ctx.newPage();
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  page.on('console', m => { const t = m.text(); if (m.type() === 'error' || /Content Security Policy|Refused to/i.test(t)) errs.push('console: ' + t); });
  if (o.goto !== false) await page.goto(o.url || URL_APP);
  return {ctx, page};
}
async function axeRun(page, sel) {
  if (!(await page.evaluate(() => !!window.axe))) await page.evaluate(fs.readFileSync(AXE, 'utf8') + '\n;0');
  return page.evaluate(async s => { const r = await window.axe.run(s ? document.querySelector(s) : document, {resultTypes: ['violations']}); return r.violations.map(v => v.id + ':' + v.nodes.map(n => n.target.join(' ')).slice(0, 3).join(' | ')); }, sel || null);
}
const noHScroll = page => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1);
// sintetizator vocal fals: înregistrează textele „citite”
const TTS_MOCK = () => {
  window.__spoken = [];
  class U { constructor(t) { this.text = t; this.voice = null; this.lang = ''; this.rate = 1; } }
  const V = [{name: 'Test RO', lang: 'ro-RO', voiceURI: 'ro', localService: true, default: true}, {name: 'Test EN', lang: 'en-US', voiceURI: 'en', localService: true, default: false}];
  const synth = {getVoices: () => V, speaking: false, addEventListener() {}, removeEventListener() {}, pause() {}, resume() {},
    cancel() { synth.speaking = false; }, speak(u) { synth.speaking = true; setTimeout(() => { window.__spoken.push({text: u.text, lang: u.lang}); synth.speaking = false; if (u.onstart) u.onstart({}); if (u.onend) u.onend({}); }, 5); }};
  Object.defineProperty(window, 'SpeechSynthesisUtterance', {value: U, configurable: true}); Object.defineProperty(window, 'speechSynthesis', {value: synth, configurable: true});
};
console.log('Cărți de joc fără frontiere — teste funcții noi (Crazy Eights în doi pe rețea, citire reguli cu voce, căutare tolerantă, kit)');
for (const [w, h] of [[1280, 800], [360, 740]]) {
  const {ctx, page} = await mk({w, h});
  await page.waitForTimeout(3600);
  ok(await page.evaluate(() => !!(window.FFF && FFF.p2p && FFF.tts && FFF.search && FFF.bundle && FFF.label)), `kit încărcat (${w}x${h})`);
  ok(await noHScroll(page), `fără depășire orizontală ${w}x${h}`);
  const ax = await axeRun(page); ok(ax.length === 0, `axe 0 violări (catalog) ${w}x${h}`, ax);
  await ctx.close();
}
ok(errs.length === 0, 'fără pageerror/CSP la pornire', errs); ok(net.length === 0, '0 cereri de rețea', net);
// ---------- căutare tolerantă ----------
{
  const {ctx, page} = await mk({});
  const count = async q => { await page.fill('#q', q); await page.waitForTimeout(80); return page.locator('#catalog .card-entry').count(); };
  const names = async () => page.locator('#catalog .card-entry h3').allInnerTexts();
  const base = await count('');
  ok(base === 17, 'catalog complet: 17 jocuri', base);
  ok((await count('macau'), (await names()).includes('Macao')), 'greșeală de scriere: „macau” găsește Macao', await names());
  ok((await count('septica'), (await names()).some(n => /Septic/.test(n))), 'fără diacritice: „septica” găsește Septica', await names());
  ok((await count('pasiente'), (await names()).some(n => /Solitaire|Pasien/i.test(n))), 'cuvânt apropiat: „pasiente” → Solitaire/pasiență', await names());
  ok(await count('xqzvkw') === 0 && /Niciun joc/.test(await page.locator('#catalog').innerText()), 'fără potrivire: mesaj „Niciun joc”');
  ok(await count('poker') >= 1, 'căutarea exactă veche merge în continuare');
  await ctx.close();
}
// ---------- citirea regulilor cu voce ----------
{
  const {ctx, page} = await mk({init: TTS_MOCK});
  await page.locator('#catalog .card-entry').first().click();
  await page.locator('#ttsbtn').click(); await page.waitForTimeout(400);
  const sp = await page.evaluate(() => window.__spoken);
  const title = await page.locator('#modal h2').innerText();
  ok(sp.length > 3 && sp[0].text.includes(title), 'titlul și regulile sunt citite', sp.slice(0, 2));
  ok(sp.every(x => x.lang === 'ro-RO'), 'voce ro-RO', sp.map(x => x.lang).slice(0, 3));
  await page.locator('#closebtn').click();
  await ctx.close();
  const c2 = await mk({init: () => { Object.defineProperty(window, 'speechSynthesis', {value: undefined, configurable: true}); }});
  await c2.page.locator('#catalog .card-entry').first().click(); await c2.page.locator('#ttsbtn').click(); await c2.page.waitForTimeout(300);
  ok((await c2.page.locator('#modal .ttsmsg').innerText()).length > 3, 'fără sintetizator: mesaj grațios');
  await c2.ctx.close();
}
// ---------- Crazy Eights în doi, pe rețea ----------
const D = (p, r) => p.locator('[data-role=' + r + ']');
async function openCrazy(p) { await p.locator('#q').fill('crazy'); await p.locator('#catalog .card-entry', {has: p.locator('h3', {hasText: 'Crazy Eights'})}).first().click(); }
const cs = p => p.evaluate(() => { const n = __cff.net(); return n ? {me: n.me, turn: n.turn, over: n.over, win: n.win, up: n.up, round: n.round, hands: n.hands.map(h => h.map(c => c.r * 4 + c.s).sort((a, b) => a - b)), top: n.discard[n.discard.length - 1], suit: n.suit, stock: n.stock.length, busy: n.busy, weak: n.weak, msg: n.msg} : null; });
async function connect(A, B) {
  await openCrazy(A); await A.locator('#netbtn').click();
  await D(A, 'optin').check(); await D(A, 'mode-host').click(); await D(A, 'gen-offer').click();
  await D(A, 'offer-out').waitFor(); const offer = await D(A, 'offer-out').inputValue();
  await openCrazy(B); await B.locator('#netbtn').click();
  await D(B, 'optin').check(); await D(B, 'mode-join').click(); await D(B, 'offer-in').fill(offer); await D(B, 'gen-answer').click();
  await D(B, 'answer-out').waitFor(); const answer = await D(B, 'answer-out').inputValue();
  await D(A, 'answer-in').fill(answer); await D(A, 'connect').click();
  await Promise.all([A, B].map(p => p.waitForFunction(() => { const n = window.__cff && __cff.net(); return n && n.hands && n.hands.length === 2; }, null, {timeout: 25000})));
}
async function moveOnce(P) {
  const s = await cs(P); if (!s || s.over || s.turn !== s.me) return false;
  const card = P.locator('#tableInner .seat:last-of-type .card.selectable, #tableInner .hand .card.selectable').first();
  if (await card.count()) { await card.click(); const sp = P.locator('.suitpick button'); if (await sp.count()) await sp.first().click(); }
  else await P.locator('.actionbar .act').first().click();
  return true;
}
{
  const a = await mk({w: 1100}), b = await mk({w: 1100}); const A = a.page, B = b.page;
  await connect(A, B);
  const sa = await cs(A), sb = await cs(B);
  ok(sa.me === 0 && sb.me === 1, 'gazdă = locul 0, oaspete = locul 1');
  ok(JSON.stringify(sa.hands) === JSON.stringify(sb.hands) && sa.top.r === sb.top.r && sa.top.s === sb.top.s, 'aceeași împărțire la ambii (seed comun)');
  ok(sa.hands[0].length === 7 && sa.hands[1].length === 7 && sa.top.r !== 8, 'reguli de start: 7 cărți fiecare, deschiderea nu e 8');
  ok(await B.locator('#tableInner .seat').first().locator('.card.back').count() === 7, 'mâna adversarului apare doar ca spate de carte în UI');
  const illegal = await B.evaluate(async () => { try { await __cff.net().ls.move({k: 'p', r: 99, s: 0}); return 'accepted'; } catch (e) { return e.code || 'rejected'; } });
  ok(illegal === 'rejected', 'carte inexistentă / mutare în afara rândului respinsă de gazdă', illegal);
  ok((await axeRun(A)).length === 0, 'axe 0 violări la masa în doi (gazdă)', await axeRun(A));
  let guard = 0, last = null;
  while (guard++ < 220) {
    const x = await cs(A); if (x.over) break;
    const P = x.turn === 0 ? A : B, O = x.turn === 0 ? B : A;
    await moveOnce(P);
    await P.waitForFunction(() => !__cff.net().busy, null, {timeout: 8000}).catch(() => {});
    await O.waitForFunction(h => { const n = __cff.net(); return n.hands.map(z => z.map(c => c.r * 4 + c.s).sort((a, b) => a - b).join('.')).join('|') + '/' + n.turn + n.discard.length === h; }, await A.evaluate(() => { const n = __cff.net(); return n.hands.map(z => z.map(c => c.r * 4 + c.s).sort((a, b) => a - b).join('.')).join('|') + '/' + n.turn + n.discard.length; }), {timeout: 8000}).catch(() => {});
  }
  const ea = await cs(A), eb = await cs(B);
  ok(ea.over && eb.over && ea.win === eb.win && (ea.win === 0 || ea.win === 1), 'partida s-a încheiat identic la ambii; câștigător = ' + ea.win, [ea.over, eb.over, ea.win, eb.win, guard]);
  ok(ea.hands[ea.win].length === 0, 'câștigătorul a rămas fără cărți');
  const msgW = await (ea.win === 0 ? A : B).locator('#tableInner .msg').innerText(), msgL = await (ea.win === 0 ? B : A).locator('#tableInner .msg').innerText();
  ok(/câștigat/.test(msgW) && /Adversarul a scăpat/.test(msgL), 'mesaje corecte pentru câștigător / învins', [msgW, msgL]);
  // revanșă
  await B.getByRole('button', {name: /Revanșă/}).click();
  await A.waitForFunction(() => __cff.net().round === 2 && !__cff.net().over, null, {timeout: 8000});
  const ra = await cs(A), rb = await cs(B);
  ok(JSON.stringify(ra.hands) === JSON.stringify(rb.hands) && ra.round === rb.round, 'revanșa re-împarte la fel la ambii (PRNG comun)');
  // resincronizare
  for (let i = 0; i < 4; i++) { const x = await cs(A); if (!x) { console.log('DIAG null', i, await A.locator('#playbg').innerHTML().then(h => h.slice(0, 200)), await A.evaluate(() => document.querySelector("#playbg").className)); break; } const P = x.turn === 0 ? A : B; await moveOnce(P); await P.waitForFunction(() => !__cff.net().busy, null, {timeout: 8000}).catch(() => {}); await sleep(250); }
  await B.evaluate(() => __cff.net().ls.resync()); await sleep(1500);
  const fa = await cs(A), fb = await cs(B);
  ok(JSON.stringify(fa.hands) === JSON.stringify(fb.hands) && fa.turn === fb.turn && fa.round === fb.round, 'resincronizare prin reluarea jurnalului: stare identică');
  // pierderea conexiunii
  await b.page.close();
  await A.waitForFunction(() => { const n = __cff.net(); return n && (n.weak || !n.up); }, null, {timeout: 25000}).catch(() => {});
  const lost = await cs(A);
  ok(lost && (lost.weak || !lost.up) && /Nu mai primim|întrerupt/.test(await A.locator('#tableInner .msg').innerText()), 'conexiune pierdută: mesaj clar, fără blocaj', await A.locator('#tableInner .msg').innerText());
  await A.locator('#closeplay').click();
  ok(await A.evaluate(() => __cff.net()) === null, 'închiderea mesei închide sesiunea');
  await a.ctx.close();
}
// ---------- regresie: Crazy Eights contra calculatorului ----------
{
  const {ctx, page} = await mk({});
  await page.locator('#q').fill('crazy'); await page.locator('#catalog .card-entry', {has: page.locator('h3', {hasText: 'Crazy Eights'})}).first().click(); await page.locator('#playbtn').click();
  ok(await page.locator('#tableInner .seat').count() === 2 && await page.evaluate(() => __cff.net()) === null, 'masa contra calculatorului pornește ca înainte');
  let n = 0; while (n++ < 40) { const c = page.locator('#tableInner .hand .card.selectable').first(); if (await c.count()) { await c.click(); const sp = page.locator('.suitpick button'); if (await sp.count()) await sp.first().click(); } else { const b = page.locator('.actionbar .act').first(); if (await b.count() && !(await page.locator('.actionbar .act').first().innerText()).includes('Joacă')) await b.click(); } await page.waitForTimeout(950); if (await page.locator('.actionbar .act', {hasText: 'Joacă din nou'}).count()) break; }
  ok(errs.length === 0, 'fără erori în partida contra AI', errs.slice(0, 3));
  await ctx.close();
}
// ---------- copie de siguranță (kit) ----------
{
  const {ctx, page} = await mk({});
  await page.evaluate(() => localStorage.setItem('cff:fav', JSON.stringify(['razboi'])));
  const bundle = await page.evaluate(() => FFF.bundle.build());
  ok(bundle && bundle.app === 'carti-de-joc' && /razboi/.test(bundle.data['cff:fav'] || ''), 'exportul .fff.json conține favoritele', bundle && Object.keys(bundle.data));
  await ctx.close();
}
ok(errs.length === 0, 'fără pageerror/CSP în tot setul', errs.slice(0, 5)); ok(net.length === 0, '0 cereri de rețea în tot setul', net.slice(0, 3));
await browser.close(); console.log(`\n${pass} ok, ${fail} eșuate`); process.exit(fail ? 1 : 0);
