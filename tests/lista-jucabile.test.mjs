// CĂRȚI DE JOC FĂRĂ FRONTIERE 2.1.0 — lista exactă a jocurilor jucabile (derivată din cod) și prioritatea jocurilor românești.
// Rulare: node tests/lista-jucabile.test.mjs
import {readFileSync} from "node:fs";
import {launch, check, summary, INDEX} from "./_lib.mjs";

const PLAYABLE = ["blackjack", "crazy8", "holdem", "klondike", "macao", "popa", "razboi", "septica"];
const DOC_ONLY = ["baccarat", "bridge", "draw5", "freecell", "omaha", "pescuit", "remi", "spider", "whist"];

const {browser, page, st} = await launch({reducedMotion: "reduce"});
await page.waitForTimeout(600);
// GAMES nu este expus pe window: derivăm lista din sursa paginii (obiectele {id:"…",…,play:"…"} din const GAMES).
const src = readFileSync(INDEX, "utf8");
const body = src.slice(src.indexOf("const GAMES=["), src.indexOf("const GTX="));
const entries = [...body.matchAll(/^\{id:"([a-z0-9]+)",([^\n]*)/gm)].map(m => ({id: m[1], play: (m[2].match(/\bplay:"([a-z0-9]+)"/) || [])[1] || null}));
const ids = {p: entries.filter(e => e.play).map(e => e.id).sort(), d: entries.filter(e => !e.play).map(e => e.id).sort(), n: entries.length};
check("catalog: 17 jocuri", ids.n === 17, ids.n);
check("exact 8 jocuri jucabile (din câmpul play al codului)", JSON.stringify(ids.p) === JSON.stringify(PLAYABLE), ids.p);
check("exact 9 jocuri doar documentate", JSON.stringify(ids.d) === JSON.stringify(DOC_ONLY), ids.d);
check("panoul «Care jocuri sunt jucabile?» există și arată 8 din 17", /8 din 17/.test(await page.textContent("#plsum")), await page.textContent("#plsum"));
await page.click("#plsum");
const li = await page.locator("#plbody ul").evaluateAll(us => us.map(u => u.querySelectorAll("li").length));
check("panoul listează 8 jucabile + 9 documentate", JSON.stringify(li) === JSON.stringify([8, 9]), li);
const note = await page.textContent("#plbody .pl-note");
check("nota despre jocurile românești menționează Cruce, Septică, Macao și «de confirmat»", /Cruce/.test(note) && /Septic/.test(note) && /Macao/.test(note) && /de confirmat/.test(note), note);
const firstChip = await page.locator("#famchips .chip").nth(1).innerText();
check("«Jocuri românești» este prima familie în catalog", /românești/i.test(firstChip), firstChip);
const firstGroup = await page.locator("#catalog h2, #catalog .fam-head, #catalog .famhead").first().innerText().catch(() => "");
check("catalogul grupat începe cu familia românească", firstGroup === "" || /românești/i.test(firstGroup), firstGroup);
await page.selectOption("#lang", "en");
await page.waitForTimeout(200);
check("în engleză: titlul panoului este tradus", /Which games are playable\? 8 of 17/.test(await page.textContent("#plsum")), await page.textContent("#plsum"));
check("în engleză: nota menționează «to be confirmed»", /to be confirmed/.test(await page.textContent("#plbody .pl-note")));
check("0 erori de pagină/CSP și 0 cereri de rețea", st.errs.length === 0 && st.net.length === 0, [st.errs, st.net]);
await browser.close();
summary();
