# Jurnal de modificări

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
