# Jurnal de modificări

## 2.3.2 — 2026-11-17

- Compatibilitate cu browsere mai vechi (Chrome/Edge 55+, Firefox 52+, Safari 10.1+/iOS 10.3+): kitul 1.8.0 aduce stratul de compatibilitate (rezerve pentru API-urile care lipsesc în motoarele vechi), iar sintaxa JavaScript mai nouă decât ES2017 a fost înlocuită cu forme echivalente acolo unde exista; expresiile regulate noi și `import()` trec prin rezerve. Fără modificări de funcționalitate intenționate. Verificat cu parser ES2017 și într-un motor vechi simulat, nu pe dispozitive reale.

## 2.3.1 — 2026-11-15

- Nou: butoane de distribuire pe rețele sociale (vertical, pe marginea din stânga; fără scripturi externe, doar linkuri deschise la clic); bara de zoom cu lupă și „potrivire ecran” revine pe marginea din dreapta, centrată pe verticală; corectat afișarea suprapusă la zoom mare (panourile cu înălțimi în vh/vw nu mai ies din ecran).

## 2.3.0 — 2026-11-15

- Nou: accesibilitate pe toate ecranele — butonul „Aa” (mărimea textului, contrast ridicat, fără animații, text lizibil, linkuri subliniate, citire cu voce), săgeata „Înapoi sus” și „Sari la conținut”; fereastra se potrivește mereu ecranului; zoom-ul cu lupă și „potrivire ecran” stau acum pe marginea din stânga (fff-kit 1.6.0).

## 2.2.9 — 2026-11-15

- Nou: texturi fractale hiper-detaliate (fff-texturi 1.1.2) — fundalul și suprafețele mari (carduri, panouri, antete, butoane; filele și dialogurile ascunse la încărcare, când se deschid) primesc un material generat local (WebGL2, fără rețea și fără imagini), care se repetă fără cusătură; culorile aplicației rămân ale ei. Se oprește din dialogul „Transparență” sau cu `?notex=1`.

## 2.2.4 — 2026-11-08

- Filtre în catalog după numărul de jucători și după dificultate (8 limbi); test `filtre-jucatori`.

## 2.2.1 — 2026-11-03

Turneu și clasament Elo local (motor comun de jocuri), rezultate notate de mână

## 2.2.0 — 2026-11-02 (reîmprospătare kit)

- Nou (kit): **Sincronizare între dispozitive** (`FFF.sync`) — în dialogul «Transparență» (clic pe versiune → Copie de siguranță): conectezi două dispozitive direct (WebRTC, cod/QR, fără server și fără cont) și își schimbă datele aplicației; cea mai recentă valoare câștigă, secretele (chei API, parole) nu se trimit, ștergerile nu se propagă. Aplicarea trece prin importul kitului (confirmare, chei permise, rollback).
- Nou (kit): **Istoric local — «mașina timpului»** (`FFF.history`) — instantanee automate ale datelor (IndexedDB, fără secrete), diferență față de starea curentă și restaurare reversibilă; «Șterge datele aplicației» șterge și istoricul.
- Module adăugate: `qr`, `p2p`, `sync`, `history` (+~140 KB). Versiunea aplicației nu se schimbă.

## 2.2.0 — 2026-10-27 (anterior: v2.1.0)

Recenzie 2 (2026-10-27).

### Implementat
- Statistici locale victorii / remize / înfrângeri contra calculatorului, pe joc, în `localStorage` (cu try/catch): Șeptică, Macao, Popa Prostul, Război, Crazy Eights, Texas Hold'em (pe meci). Linia apare în bara mesei (RO+EN; celelalte limbi folosesc textul EN). Un final nu se numără de două ori.
- Test nou `tests/statistici.test.mjs` (9 verificări).

### Neimplementat și de ce
- Niveluri de dificultate AI: motoarele nu au parametri de forță (adâncime / aleatoriu reglabil); fără simulare N≥50 care să arate diferență, nu se adaugă. Rămâne «planificat».
- Statistici pentru Blackjack (banca nu are final de partidă) și Klondike (pasiență); nu s-au simulat victoriile.
- Cruce: nu a fost adăugat; regulile nu au putut fi confirmate din ≥2 surse.
- Variante regionale Șeptică/Macao: reguli neverificate, deci neadăugate.

## 2.1.0 — 2026-10-27 (anterior: v2.0.0)

Recenzie 2026-10-27.

### Implementat
- Panou «Care jocuri sunt jucabile? 8 din 17», derivat din cod (câmpul `play`): jucabile razboi, popa, septica, macao, crazy8, holdem, blackjack, klondike; doar documentate: pescuit, whist, bridge, remi, draw5, omaha, baccarat, spider, freecell.
- Jocurile românești (Septică, Macao, Popa, Cruce) apar primele în catalog; Cruce nu există în catalog, iar regulile ei sunt «de confirmat».
- Test nou `tests/lista-jucabile.test.mjs` (11 verificări).

### Neimplementat și de ce
- Variante regionale pentru Șeptică/Macao/Cruce: reguli neverificate din surse, deci neadăugate.
- AI cu niveluri de dificultate: neimplementat în această rundă (necesită calibrare și teste dedicate pe motorul jocului).
- Statistici comune între jocuri: neimplementat (ar cere un spațiu de stocare partajat între aplicații separate, contrar izolării actuale).
- Mod multiplayer local unificat între jocuri: **planificat**, NU acum; jocurile rămân separate.
