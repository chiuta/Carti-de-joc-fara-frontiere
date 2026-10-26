// CĂRȚI DE JOC FĂRĂ FRONTIERE 2.0.0 — Atelier de reguli: jocuri definite în fișier JSON (levate / scăpat de cărți),
// validare, motor generic, AI local, încărcare/descărcare/salvare. Rulare: node tests/fff-v2.test.mjs
import {readFileSync as __rf, writeFileSync as __wf, mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
const APP = JSON.parse(__rf(new URL('../app.json', import.meta.url), 'utf8'));
import {launch, axeRun, hOverflow, check, summary} from "./_lib.mjs";

const SEED = `window.__mul = (a) => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };`;

console.log("1. pornire și validator");
{
  const {browser, page, st} = await launch({reducedMotion: "reduce"});
  await page.waitForTimeout(800);
  check(`versiune ${APP.version} 2.x în meta`, (await page.getAttribute('meta[name="application-version"]', "content")) === APP.version && /^2\./.test(APP.version));
  check("butonul «Atelier de reguli» există și motorul e expus", (await page.locator("#rlbtn").count()) === 1 && await page.evaluate(() => !!window.CJ_RULES));
  const V = (x) => page.evaluate((x) => { const r = window.CJ_RULES.validate(x); return {ok: r.ok, errs: r.errors.map(e => e.k), warns: r.warns.map(e => e.k)}; }, x);
  const ex = await page.evaluate(() => window.CJ_RULES.examples);
  for (const e of ex) { const r = await V(e); check(`exemplu valid: ${e.id}`, r.ok && !r.errs.length, r); }
  const sh = JSON.parse(JSON.stringify(ex[0])), tr = JSON.parse(JSON.stringify(ex[2]));
  const mut = (o, f) => { const c = JSON.parse(JSON.stringify(o)); f(c); return c; };
  const bad = [
    ["JSON stricat", '{"format": '], ["nu e obiect", "[1,2]"], ["format greșit", mut(sh, c => { c.format = "x"; })], ["versiune greșită", mut(sh, c => { c.version = 2; })],
    ["tip necunoscut", mut(sh, c => { c.type = "poker"; })], ["5 jucători", mut(sh, c => { c.players = 5; })], ["1 jucător", mut(sh, c => { c.players = 1; })],
    ["titlu lipsă", mut(sh, c => { delete c.title; })], ["rang 15", mut(sh, c => { c.deck.ranks = [2, 15]; })], ["culoare X", mut(sh, c => { c.deck.suits = ["X"]; })],
    ["rang repetat", mut(sh, c => { c.deck.ranks = [2, 2, 3]; })], ["pachet prea mic", mut(sh, c => { c.hand = 13; c.players = 4; c.deck.ranks = [7, 8, 9, 10, 11, 12, 13, 14]; })],
    ["wild + match rank", mut(sh, c => { c.match = "rank"; })], ["wild în afara pachetului", mut(sh, c => { c.deck.ranks = [2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14]; })],
    ["efect pe rang din wild", mut(sh, c => { c.effects = [{rank: 8, do: "skip"}]; })], ["efect necunoscut", mut(sh, c => { c.effects = [{rank: 7, do: "explode"}]; })],
    ["efect repetat", mut(sh, c => { c.effects = [{rank: 7, do: "skip"}, {rank: 7, do: "reverse"}]; })], ["draw n=9", mut(sh, c => { c.effects = [{rank: 7, do: "draw", n: 9}]; })],
    ["noPlay greșit", mut(sh, c => { c.noPlay = "x"; })], ["hand 0", mut(sh, c => { c.hand = 0; })],
    ["rankOrder nu e permutare", mut(tr, c => { c.rankOrder = [7, 8, 9]; })], ["trump cu culoare inexistentă", mut(tr, c => { c.deck.suits = ["H", "D", "C"]; c.trump = {suit: "S"}; })],
    ["points.rank peste limită", mut(tr, c => { c.points.rank["14"] = 999; })], ["points.suit greșit", mut(tr, c => { c.points = {suit: {Z: 1}}; })], ["points.cards cu carte din afara pachetului", mut(tr, c => { c.points = {cards: [{rank: 2, suit: "S", points: 1}]}; })],
    ["rounds 99", mut(tr, c => { c.rounds = 99; })], ["goal greșit", mut(tr, c => { c.goal = "all"; })], ["follow greșit", mut(tr, c => { c.follow = "x"; })],
    ["deal 20", mut(tr, c => { c.deal = 20; })], ["mustBeat nu e boolean", mut(tr, c => { c.mustBeat = "da"; })]
  ];
  for (const [n, x] of bad) { const r = await V(x); check(`respins: ${n}`, !r.ok && r.errs.length > 0, r); }
  const big = '{"format":"carti-de-joc-rules","version":1,"title":"' + "a".repeat(110 * 1024) + '"}';
  const rb = await V(big); check("respins: fișier peste 100 KB", !rb.ok && rb.errs.includes("rl.e.size"), rb);
  const rw = await V(mut(sh, c => { c.extra = 1; })); check("câmp necunoscut → avertisment, nu eroare", rw.ok && rw.warns.includes("rl.w.unknown"), rw);
  const rs = await page.evaluate(() => { const r = window.CJ_RULES.validate({format: "carti-de-joc-rules", version: 1, title: '<img src=x onerror=alert(1)>Joc', type: "shedding", players: 2, deck: {ranks: [2, 3, 4, 5, 6, 7, 8, 9], suits: ["S", "H"]}}); return r.ok ? r.spec.title["*"] : null; });
  check("titlul este curățat de etichete (<, >)", rs && !/[<>]/.test(rs), rs);
  const pp = await page.evaluate(() => { window.CJ_RULES.validate('{"__proto__":{"polluted":1},"format":"carti-de-joc-rules","version":1,"constructor":{"x":1}}'); return ({}).polluted === undefined; });
  check("JSON cu __proto__ nu poluează obiectele", pp);
  check("0 erori", st.errs.length === 0, st.errs);
  check("0 cereri de rețea", st.net.length === 0, st.net);
  await browser.close();
}

console.log("2. motorul: reguli exacte");
{
  const {browser, page, st} = await launch({reducedMotion: "reduce"});
  await page.waitForTimeout(600);
  const r = await page.evaluate(() => {
    const R = window.CJ_RULES, out = {};
    const spT = R.validate(R.examples[2]).spec;   // levate cu puncte, atu "last", mustBeat, 10 > K
    const mkT = (hands, trick, trump) => { const G = R.newGame(spT, () => 0.5); G.hands = hands; G.trick = trick.map(([p, r, s]) => ({p, c: {r, s}})); G.trump = trump; G.turn = trick.length ? (trick[trick.length - 1][0] + 1) % 4 : 0; return G; };
    const H = (...xs) => xs.map(([r, s]) => ({r, s}));
    // adversarul joacă 9♥; ai 10♥ și A♥ și 7♠ → trebuie să servești și să bați
    let G = mkT([H([14, 1], [10, 1], [7, 0]), H([8, 2]), H([8, 3]), H([8, 0])], [[3, 9, 1]], 2); G.turn = 0;
    out.mustBeat = R.legal(G, 0).map(c => c.r + "/" + c.s).sort().join();
    // nu poți bate → orice carte din culoare
    G = mkT([H([7, 1], [8, 1], [7, 0]), H([8, 2]), H([8, 3]), H([8, 0])], [[3, 14, 1]], 2); G.turn = 0;
    out.followOnly = R.legal(G, 0).map(c => c.r + "/" + c.s).sort().join();
    // fără culoare cerută → orice carte
    G = mkT([H([7, 2], [8, 3]), H([8, 2]), H([8, 3]), H([8, 0])], [[3, 14, 1]], 0); G.turn = 0;
    out.anyCard = R.legal(G, 0).length;
    // câștigătorul: atu bate culoarea cerută; 10 bate K; A bate 10
    const win = (plays, trump) => { const G = mkT([[], [], [], []], plays, trump); return R.playTricks ? null : null; };
    G = mkT([H([13, 1]), H([10, 1]), H([14, 2]), H([7, 1])], [], -1); G.turn = 0;
    const seq = [[0, 13, 1], [1, 10, 1], [2, 14, 2], [3, 7, 1]];
    seq.forEach(([p, r, s]) => { R.playTricks(G, p, G.hands[p][0]); });
    out.winner10 = G.lastWinner;            // 10♥ bate K♥ (rankOrder personalizat), A♦ nu e culoare cerută → câștigă jucătorul 1
    G = mkT([H([13, 1]), H([10, 1]), H([14, 2]), H([7, 1])], [], 2); G.turn = 0;
    seq.forEach(([p]) => { R.playTricks(G, p, G.hands[p][0]); });
    out.winnerTrump = G.lastWinner;         // atu = ♦ → A♦ câștigă
    out.trickPts = G.last.pts;              // 4 + 10 + 11 + 0
    // cardPts cu suit + cards (evită penalitățile)
    const spP = R.validate(R.examples[3]).spec;
    out.pen = [R.cardPts(spP, {r: 12, s: 0}), R.cardPts(spP, {r: 5, s: 1}), R.cardPts(spP, {r: 12, s: 1}), R.cardPts(spP, {r: 5, s: 2})].join();
    // scăpat de cărți
    const spS = R.validate(R.examples[1]).spec;   // 7 draw2 stack, 10 skip, 9 reverse, J wild, draw-until
    const mkS = (hands, top, suit) => { const G = R.newGame(spS, () => 0.5); G.hands = hands; G.discard = [top]; G.suit = suit; G.turn = 0; G.stock = H([8, 0], [8, 1], [8, 2], [8, 3], [12, 0], [12, 1], [12, 2], [12, 3]); G.pending = 0; return G; };
    G = mkS([H([7, 1], [8, 3], [14, 0]), H([12, 0], [13, 3]), H([9, 0], [14, 2])], {r: 13, s: 1}, 1);
    out.shLegal = R.legal(G, 0).map(c => c.r + "/" + c.s).sort().join();   // aceeași culoare (♥) sau rang K; 7♥ legal
    const ev = R.playShed(G, 0, G.hands[0][0], undefined);
    out.stack = [G.pending, G.turn, ev.pending].join();                      // 7 → pending 2, rândul lui 1
    out.stackLegal = R.legal(G, 1).length;                                    // jucătorul 1 n-are alt 7 → nu poate stivui
    const pen = R.drawShed(G, 1); out.pen2 = [pen.ev, pen.drew, G.pending, G.turn, G.hands[1].length].join();
    // skip: 10 sare peste următorul
    G = mkS([H([10, 1], [8, 3]), H([12, 0], [13, 3]), H([9, 0], [14, 2])], {r: 13, s: 1}, 1);
    R.playShed(G, 0, G.hands[0][0]); out.skip = G.turn;
    // reverse cu 3 jucători: sensul se inversează → după 0 urmează 2
    G = mkS([H([9, 1], [8, 3]), H([12, 0], [13, 3]), H([9, 0], [14, 2])], {r: 13, s: 1}, 1);
    R.playShed(G, 0, G.hands[0][0]); out.reverse = [G.dir, G.turn].join();
    // wild (J): alegi culoarea
    G = mkS([H([11, 3], [8, 3]), H([12, 0], [13, 3]), H([9, 0], [14, 2])], {r: 13, s: 1}, 1);
    out.wildLegal = R.legal(G, 0).some(c => c.r === 11);
    R.playShed(G, 0, G.hands[0][0], 2); out.wildSuit = G.suit;
    // carte nelegală respinsă
    G = mkS([H([8, 3], [14, 0]), H([12, 0]), H([9, 0])], {r: 13, s: 1}, 1);
    out.illegal = R.playShed(G, 0, G.hands[0][0]) === null && G.hands[0].length === 2;
    // în afara rândului
    out.offTurn = R.playShed(G, 1, G.hands[1][0]) === null;
    // fără carte legală: trage până găsește (draw-until)
    G = mkS([H([8, 3], [14, 0]), H([12, 0]), H([9, 0])], {r: 13, s: 1}, 1);
    G.stock = H([14, 3], [14, 2], [12, 1]);   // se trage de la coadă: 12♥ este legală (culoare ♥)
    const dr = R.drawShed(G, 0); out.drawUntil = [dr.ev, dr.drew, G.turn, G.hands[0].length].join();
    return out;
  });
  check("mustBeat: doar cărțile din culoare care bat (10♥, A♥)", r.mustBeat === "10/1,14/1", r.mustBeat);
  check("fără carte care bate: orice carte din culoarea cerută", r.followOnly === "7/1,8/1", r.followOnly);
  check("fără culoarea cerută: poți juca orice", r.anyCard === 2, r.anyCard);
  check("ordinea personalizată: 10♥ bate K♥ (fără atu) și câștigă jucătorul 1", r.winner10 === 1, r.winner10);
  check("atu: A♦ (atu) câștigă levata", r.winnerTrump === 2, r.winnerTrump);
  check("puncte pe levată: K 4 + 10 10 + A 11 + 7 0 = 25", r.trickPts === 25, r.trickPts);
  check("penalități: Q♠ 13, 5♥ 1, Q♥ 1 (suit, nu se adună cu cards), 5♦ 0", r.pen === "13,1,1,0", r.pen);
  check("scăpat: legale = culoare ♥ sau rang K (inclusiv 7♥)", r.shLegal === "13/3,14/0,7/1,8/3" || r.shLegal === "7/1", r.shLegal);
  check("7 cu stack: pedeapsa 2, rândul trece la jucătorul 1", r.stack === "2,1,2", r.stack);
  check("sub pedeapsă fără alt 7 nu ai carte legală", r.stackLegal === 0, r.stackLegal);
  check("trage pedeapsa: 2 cărți, pedeapsa se golește, rândul trece", r.pen2 === "penalty,2,0,2,4", r.pen2);
  check("10 sare peste următorul jucător", r.skip === 2, r.skip);
  check("9 inversează sensul (3 jucători: după 0 urmează 2)", r.reverse === "-1,2", r.reverse);
  check("valetul (wild) e legal oricând și alege culoarea", r.wildLegal && r.wildSuit === 2, [r.wildLegal, r.wildSuit]);
  check("carte nelegală / în afara rândului respinsă", r.illegal && r.offTurn);
  check("draw-until: trage până găsește o carte legală", /^draw,1,0,3$/.test(r.drawUntil), r.drawUntil);
  check("0 erori", st.errs.length === 0, st.errs);
  await browser.close();
}

console.log("3. simulări complete (invarianți) pe exemple și pe reguli aleatoare");
{
  const {browser, page, st} = await launch({reducedMotion: "reduce", init: SEED});
  await page.waitForTimeout(600);
  const r = await page.evaluate(() => {
    const R = window.CJ_RULES, rep = {games: 0, bad: [], steps: 0, stuck: 0};
    const total = (G) => G.hands.reduce((a, h) => a + h.length, 0) + (G.stock ? G.stock.length : 0) + (G.discard ? G.discard.length : 0) + (G.won ? G.won.reduce((a, w) => a + w.length, 0) : 0) + (G.trick ? G.trick.length : 0);
    const sim = (spec, seed, label) => {
      const G0 = R.newGame(spec, window.__mul(seed)); let G = G0; const n0 = total(G);
      let guard = 0;
      while (!G.over && guard++ < 5000) {
        if (G.type === "tricks" && G.roundOver) { G = R.nextRound(G); continue; }
        const ev = R.stepAI(G);
        if (!ev) { rep.bad.push(label + ": AI fără mutare"); return; }
        rep.steps++;
        if (G.type === "shed" && total(G) !== n0) { rep.bad.push(label + ": cărți pierdute/dublate " + total(G) + "/" + n0); return; }
      }
      if (!G.over) { rep.bad.push(label + ": nu se termină"); return; }
      rep.games++;
      if (G.type === "shed") {
        if (G.stuck) rep.stuck++;
        else if (G.hands[G.winner].length !== 0) rep.bad.push(label + ": câștigătorul are cărți");
      } else {
        if (G.hands.some(h => h.length)) rep.bad.push(label + ": mâini nevide la final");
        const sp = spec, per = sp.per, nTr = per, deckPts = (() => { let t = 0; const dealt = G.won.reduce((a, w) => a.concat(w), []); dealt.forEach(c => { t += R.cardPts(sp, c); }); return t; })();
        const expectRound = deckPts + G.taken.reduce((a, b) => a + b, 0) * sp.points.perTrick + sp.points.lastTrick;
        if (sp.rounds === 1 && G.totals.reduce((a, b) => a + b, 0) !== expectRound) rep.bad.push(label + ": suma punctelor " + G.totals.reduce((a, b) => a + b, 0) + " ≠ " + expectRound);
        if (G.winners.length < 1) rep.bad.push(label + ": fără câștigător");
      }
    };
    R.examples.forEach((ex, i) => { const sp = R.validate(ex).spec; for (let k = 0; k < 40; k++) sim(sp, 1000 * i + k + 1, ex.id + "#" + k); });
    // reguli aleatoare valide
    const rr = window.__mul(777), pick = (a) => a[Math.floor(rr() * a.length)], ri = (a, b) => a + Math.floor(rr() * (b - a + 1));
    let tried = 0, valid = 0;
    for (let t = 0; t < 250; t++) {
      const all = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], ranks = all.filter(() => rr() < 0.6); if (ranks.length < 3) continue;
      const suits = ["S", "H", "D", "C"].filter(() => rr() < 0.7); if (!suits.length) continue;
      const players = ri(2, 4), type = pick(["tricks", "shedding"]);
      const spec = {format: "carti-de-joc-rules", version: 1, title: "R" + t, type, players, deck: {ranks, suits}};
      if (type === "shedding") {
        spec.hand = ri(1, 7); spec.match = pick(["suit-or-rank", "suit", "rank"]); spec.noPlay = pick(["draw-one", "draw-until", "pass"]);
        const rest = ranks.slice(); const take = () => rest.splice(Math.floor(rr() * rest.length), 1)[0];
        if (spec.match !== "rank" && rest.length > 4 && rr() < 0.6) spec.wild = [take()];
        spec.effects = []; for (let e = 0; e < ri(0, 3) && rest.length > 2; e++) { const d = pick(["draw", "skip", "reverse"]); spec.effects.push(d === "draw" ? {rank: take(), do: d, n: ri(1, 3), stack: rr() < 0.5} : {rank: take(), do: d}); }
      } else {
        spec.deal = rr() < 0.5 ? "all" : ri(1, 6); spec.trump = pick(["none", "last", "random", {suit: suits[0]}]); spec.follow = pick(["must", "free"]); spec.mustBeat = rr() < 0.4;
        spec.goal = pick(["most", "least"]); spec.rounds = ri(1, 3); spec.rankOrder = ranks.slice().sort(() => rr() - 0.5);
        spec.points = {rank: {}, suit: {}, perTrick: ri(0, 2), lastTrick: ri(0, 5)}; ranks.forEach(x => { if (rr() < 0.4) spec.points.rank[x] = ri(-3, 12); }); if (rr() < 0.4) spec.points.suit[suits[0]] = ri(-2, 2);
      }
      tried++;
      const v = R.validate(spec);
      if (!v.ok) { if (type === "tricks" || true) { /* pachet prea mic pentru mână: respins corect */ } continue; }
      valid++; for (let k = 0; k < 3; k++) sim(v.spec, 50000 + t * 7 + k, "rand" + t);
    }
    rep.tried = tried; rep.valid = valid;
    return rep;
  });
  check(`simulări: ${r.games} partide terminate fără erori de invarianți (exemple + ${r.valid} reguli aleatoare valide din ${r.tried})`, r.bad.length === 0 && r.games > 300 && r.valid > 50, r.bad.slice(0, 5));
  check("AI-ul nu cicleză: partidele fără ieșire (reguli degenerate) sunt oprite de limita de pași, rar", r.stuck <= r.games * 0.2, r.stuck);
  check("0 erori", st.errs.length === 0, st.errs);
  await browser.close();
}

console.log("4. atelierul în interfață");
{
  const tmp = mkdtempSync(path.join(tmpdir(), "cj-"));
  const {browser, page, st} = await launch({reducedMotion: "reduce", perm: ["clipboard-read", "clipboard-write"]});
  await page.waitForTimeout(800);
  await page.click("#rlbtn");
  await page.waitForSelector("#rl-src");
  check("atelierul se deschide cu primul exemplu validat", /Reguli valide/.test(await page.textContent("#rl-out")), await page.textContent("#rl-out"));
  check("un exemplu din listă se încarcă în editor", await (async () => { await page.selectOption("#rl-ex", "3"); return /evita-penalitatile/.test(await page.inputValue("#rl-src")) && /Reguli valide/.test(await page.textContent("#rl-out")); })());
  await page.fill("#rl-src", '{"format":"carti-de-joc-rules","version":1,"type":"tricks","players":9}');
  await page.click("#rl-val");
  check("erorile apar ca listă (role=alert) în română", (await page.getAttribute("#rl-out", "role")) === "alert" && /probleme/.test(await page.textContent("#rl-out")) && (await page.locator("#rl-out li").count()) >= 2, await page.textContent("#rl-out"));
  await page.click("#rl-play");
  check("regulile invalide nu pornesc jocul", await page.locator("#rl-src").count() === 1);
  // încărcare din fișier
  const fp = path.join(tmp, "joc.json"); __wf(fp, JSON.stringify(await page.evaluate(() => window.CJ_RULES.examples[4])));
  await page.setInputFiles("#rl-fin", fp);
  await page.waitForFunction(() => /Reguli valide/.test(document.querySelector("#rl-out").textContent), null, {timeout: 5000});
  check("fișier JSON încărcat și validat", /numara-levatele/.test(await page.inputValue("#rl-src")));
  const big = path.join(tmp, "mare.json"); __wf(big, " ".repeat(120 * 1024));
  await page.setInputFiles("#rl-fin", big);
  await page.waitForTimeout(300);
  check("fișier peste 100 KB respins", /prea mare/.test(await page.textContent("#rl-out")), await page.textContent("#rl-out"));
  await page.setInputFiles("#rl-fin", fp); await page.waitForTimeout(300);
  // descărcare
  const [dl] = await Promise.all([page.waitForEvent("download"), page.click("#rl-dl")]);
  check("descărcare ca <id>.json", dl.suggestedFilename() === "numara-levatele.json", dl.suggestedFilename());
  const dtxt = __rf(await dl.path(), "utf8");
  check("fișierul descărcat e identic cu editorul", dtxt === (await page.inputValue("#rl-src")));
  // copiere
  await page.click("#rl-copy"); await page.waitForTimeout(300);
  check("copiere în clipboard confirmată", /Copiat|copia/.test(await page.textContent("#rl-out")));
  // salvare locală + persistență + ștergere în 2 pași
  await page.click("#rl-store");
  check("salvat în browser (apare în listă)", (await page.locator("#rl-mine [data-open]").count()) === 1 && /Salvat în browser/.test(await page.textContent("#rl-out")));
  const keys = await page.evaluate(() => Object.keys(localStorage));
  check("cheia de stocare are prefixul aplicației", keys.some(k => k === "carti-de-joc.rules.saved") && keys.every(k => k.startsWith("carti-de-joc.") || k.startsWith("fff")), keys);
  await page.reload(); await page.waitForTimeout(600);
  await page.click("#rlbtn"); await page.waitForSelector("#rl-mine [data-open]");
  check("regulile salvate persistă după reîncărcare", (await page.locator("#rl-mine [data-open]").count()) === 1);
  await page.click("#rl-mine [data-del]");
  check("ștergere: primul clic cere confirmare (fără confirm() nativ)", /Confirmă/.test(await page.textContent("#rl-mine [data-del]")) && (await page.locator("#rl-mine [data-open]").count()) === 1);
  await page.click("#rl-mine [data-del]");
  check("ștergere: al doilea clic șterge", (await page.locator("#rl-mine [data-open]").count()) === 0);
  // limba
  await page.click("#closeplay"); await page.selectOption("#lang", "en"); await page.click("#rlbtn"); await page.waitForSelector("#rl-src");
  check("interfața atelierului urmează limba (EN)", /Rules workshop/.test(await page.textContent(".rl-h")) && /Valid rules/.test(await page.textContent("#rl-out")), await page.textContent("#rl-out"));
  await page.selectOption("#lang", "ro");
  check("0 erori", st.errs.length === 0, st.errs);
  check("0 cereri de rețea", st.net.length === 0, st.net);
  await browser.close();
}

console.log("5. se joacă fiecare exemplu prin interfață, până la sfârșit");
{
  const {browser, page, st} = await launch({reducedMotion: "reduce", init: SEED});
  await page.waitForTimeout(800);
  for (let i = 0; i < 5; i++) {
    await page.evaluate(() => { const o = document.querySelector("#closeplay"); if (o) o.click(); });
    await page.click("#rlbtn"); await page.waitForSelector("#rl-src");
    await page.selectOption("#rl-ex", String(i));
    await page.click("#rl-play");
    await page.waitForSelector(".hand .card", {timeout: 5000});
    let guard = 0, finished = false;
    while (guard++ < 800) {
      if (await page.locator(".actionbar .act:has-text('Din nou'), .actionbar .act:has-text('Again')").count()) { finished = true; break; }
      const nextR = page.locator(".actionbar .act:has-text('Runda următoare')");
      if (await nextR.count()) { await nextR.click(); await page.waitForTimeout(40); continue; }
      const did = await page.evaluate(() => {
        const sels = document.querySelectorAll(".suitpick button"); if (sels.length) { sels[0].click(); return "suit"; }
        const cards = [...document.querySelectorAll(".seat .hand .card.selectable")]; if (cards.length) { cards[0].click(); return "card"; }
        const b = [...document.querySelectorAll(".actionbar .act")].find(x => !x.disabled); if (b) { b.click(); return "btn"; }
        return "";
      });
      await page.waitForTimeout(did ? 30 : 120);
    }
    const msg = (await page.textContent('[data-rl="msg"]')).trim();
    check(`exemplul ${i + 1}: partida se termină cu mesaj final`, finished && msg.length > 10, msg);
    if (i === 0) {
      check("la final: «Din nou», «Înapoi la atelier», «Înapoi la atlas»", (await page.locator(".actionbar .act").count()) === 3);
      await page.click(".actionbar .act:has-text('Înapoi la atelier')"); await page.waitForSelector("#rl-src");
      check("«Înapoi la atelier» păstrează regulile din editor", /scapa-cu-jolly/.test(await page.inputValue("#rl-src")));
    }
  }
  check("contorul de partide a crescut", /▶ [1-9]/.test(await page.textContent("#trophy")), await page.textContent("#trophy"));
  check("0 erori", st.errs.length === 0, st.errs);
  check("0 cereri de rețea", st.net.length === 0, st.net);
  await browser.close();
}

console.log("6. accesibilitate");
for (const [w, h] of [[1280, 800], [390, 780]]) {
  const {browser, page, st} = await launch({w, h, bypassCSP: true, reducedMotion: "reduce"});
  await page.waitForTimeout(700);
  await page.click("#rlbtn"); await page.waitForSelector("#rl-src");
  const a1 = await axeRun(page);
  check(`axe 0 (atelier ${w}×${h})`, a1 && a1.length === 0, a1);
  check(`fără depășire orizontală (atelier ${w}×${h})`, (await hOverflow(page)) <= 0);
  await page.selectOption("#rl-ex", "2"); await page.click("#rl-play"); await page.waitForSelector(".hand .card");
  const a2 = await axeRun(page);
  check(`axe 0 (masa cu levate ${w}×${h})`, a2 && a2.length === 0, a2);
  check(`fără depășire orizontală (masa ${w}×${h})`, (await hOverflow(page)) <= 0);
  await page.click("#closeplay"); await page.click("#rlbtn"); await page.selectOption("#rl-ex", "1"); await page.click("#rl-play"); await page.waitForSelector(".hand .card");
  const a3 = await axeRun(page);
  check(`axe 0 (masa cu scăpat de cărți ${w}×${h})`, a3 && a3.length === 0, a3);
  check("0 erori", st.errs.length === 0, st.errs);
  await browser.close();
}
summary();
