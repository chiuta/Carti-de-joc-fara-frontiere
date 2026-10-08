# Cărți de joc fără frontiere

Atlas de jocuri cu cărți, cu șapte jocuri jucabile, într-un singur fișier HTML.

**Live:** https://chiuta.github.io/Carti-de-joc-fara-frontiere/

![Captura de ecran](screenshot.png)

## Ce este

Un atlas interactiv de jocuri cu cărți, de la Solitaire și Popa Prostul până la poker, descris în aplicație drept „enciclopedie jucabilă, offline, fără reclame și fără urmărire”. Catalogul grupează jocurile pe familii; pentru fiecare joc există o fișă cu informații și reguli, iar o parte dintre ele pot fi jucate direct în pagină. Este companionul atlasului „Șah fără frontiere”.

## Funcții

- Catalog cu 17 jocuri, grupate în familii: Pentru copii & rapide, Jocuri românești, De aruncare, Cu levate, Combinații & remi, Familia pokerului, Cazinou & pariuri, Pacient (solitaire).
- Șapte jocuri jucabile (conform notei din subsol): Solitaire (Klondike), Război, Popa Prostul, Macao, Septică, Blackjack și Texas Hold'em. Restul sunt documentate.
- Căutare în titluri, descrieri, etichete și reguli („Caută un joc, o familie, o regulă…”).
- Sortare: grupare pe familii, alfabetic A→Z, dificultate crescătoare, jucabile întâi.
- Filtre pe familii, plus filtrul „★ Doar jucabile”.
- Fișă de joc cu număr de jucători, epocă, dificultate; marcare ca favorit (★).
- Joc zilei și contor de statistici (jocuri, jucabile, familii, partide jucate).
- Buton **▶ Joacă** în fișa fiecărui joc jucabil; **Închide** / ✕ / **Esc** pentru ieșire.

## Manual de utilizare

1. Deschide pagina; sus vezi statisticile și jocul zilei.
2. Caută în câmpul de căutare sau alege o familie din chip-uri; schimbă ordinea din lista de sortare.
3. Apasă pe un joc pentru a deschide fișa cu reguli. Apasă ★ din fișă pentru a-l marca favorit.
4. Dacă jocul este marcat „Jucabil”, apasă **▶ Joacă** și urmează indicațiile de pe masă.
5. Închide fișa sau masa de joc cu **Închide**, ✕ sau **Esc**.
6. Contorul „▶ N partide” din colțul de sus arată câte partide ai început.

## Confidențialitate și rețea

- **Stocare locală (localStorage):** două chei cu prefix `cff:`, `cff:fav` (jocurile favorite) și `cff:played` (numărul de partide). Nu sunt trimise nicăieri.
- **Rețea:** nu există cereri `fetch`, scripturi, fonturi sau imagini externe. Pagina include doar linkuri care se deschid la clic: Șah fără frontiere (alexio.tf), Patreon și Buy Me a Coffee. Pagina are o politică CSP restrictivă (`default-src 'self'`). Nu există telemetrie.

## Rulare locală / offline

Descarcă `index.html` și deschide-l în browser; nu are nevoie de internet (linkurile externe au nevoie).

## Licență

Licența nu este încă declarată explicit în acest repository; vezi nota din aplicație.

Subsolul aplicației spune: „Realizat de Alexandru-Ionuț Chiuță (Alexio) · Centrul StrING · CC-BY-SA 4.0.” Antetul fișierului conține în schimb o mențiune CC0; cele două indicații urmează să fie clarificate.

## Autor

Alexio — Alexandru-Ionuț Chiuță, Centrul StrING (după cum este menționat în aplicație). Contact: alexio@trom.tf

## English summary

Cărți de joc fără frontiere is a single-file atlas of 17 card games grouped by family, with search, sorting, favourites and seven playable games (Klondike Solitaire, War, Popa Prostul, Macao, Septică, Blackjack, Texas Hold'em). It stores only favourites and a played-games counter in localStorage and loads no external resources. UI is in Romanian. License not yet declared explicitly (the app footer mentions CC-BY-SA 4.0).
