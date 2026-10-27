// CĂRȚI DE JOC FĂRĂ FRONTIERE: statistici locale victorii/remize/înfrângeri pe joc (Șeptică, Macao, Popa, Războiul, Crazy Eights, Hold'em), în localStorage.
// Blackjack (banca nu are „final de partidă”) și Klondike (pasiență) NU au statistici de victorie/înfrângere contra calculatorului.
// Rulare: node tests/statistici.test.mjs
import {launch, check, summary} from "./_lib.mjs";
const {browser, page, st} = await launch({reducedMotion: "reduce"});
await page.waitForTimeout(600);
const open = async (q) => { await page.fill("#q", q); await page.locator("#catalog .card-entry").first().click(); await page.click("#playbtn"); await page.waitForTimeout(250); };
const line = () => page.evaluate(() => document.querySelector("#wlstat").textContent);
const ls = () => page.evaluate(() => { try { return JSON.parse(localStorage.getItem("carti-de-joc.wl")); } catch (e) { return null; } });

await open("septic");
check("linia apare, la zero", /0 victorii · 0 remize · 0 înfrângeri/.test(await line()), await line());
await page.evaluate(() => { septica.scores = [20, 5]; septEnd(); });
check("Șeptică: victorie numărată", /1 victorii · 0 remize · 0 înfrângeri/.test(await line()), await line());
await page.evaluate(() => { septEnd(); });
check("același sfârșit apelat a doua oară nu se dublează", /1 victorii · 0 remize · 0 înfrângeri/.test(await line()), await line());
await page.click("#closeplay");

await open("septic");
await page.evaluate(() => { septica.scores = [3, 9]; septEnd(); });
check("Șeptică: înfrângere numărată pe aceeași cheie", /1 victorii · 0 remize · 1 înfrângeri/.test(await line()), await line());
await page.click("#closeplay");

await open("macao");
check("Macao: contor propriu (zero)", /0 victorii · 0 remize · 0 înfrângeri/.test(await line()), await line());
const d = await ls();
check("localStorage are doar șeptica până acum", d && JSON.stringify(d.septica) === "[1,0,1]" && !d.macao, d);
await page.click("#closeplay");

await open("razboi");
await page.evaluate(() => { warSt.ai = []; wEnd(); });
check("Războiul: victorie numărată", /1 victorii · 0 remize · 0 înfrângeri/.test(await line()), await line());
await page.click("#closeplay");

await open("blackjack");
check("Blackjack: fără linie de statistică (nu are final clar)", (await line()) === "", await line());
await page.click("#closeplay");
check("0 erori și 0 cereri de rețea", st.errs.length === 0 && st.net.length === 0, [st.errs, st.net]);
await browser.close(); summary();
