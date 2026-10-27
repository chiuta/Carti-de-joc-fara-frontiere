# Jurnal de modificări

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
