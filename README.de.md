# Cărți de joc fără frontiere

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · **Deutsch** · [Magyar](README.hu.md)

**Version:** 1.2.0 · **Zuletzt aktualisiert:** 2026-10-19

Oberflächensprachen: **Română, English, Français, Italiano, Español, Português (PT), Deutsch, Magyar**

Ein Atlas der Kartenspiele mit acht spielbaren Spielen, in einer einzigen HTML-Datei.

**Online-Anwendung:** https://chiuta.github.io/Carti-de-joc-fara-frontiere/

![Screenshot](screenshot.png)

## Was es ist

Ein interaktiver Atlas der Kartenspiele, von Solitaire und Popa Prostul (Schwarzer Peter) bis zum Poker, in der Anwendung beschrieben als „spielbare Enzyklopädie, offline, ohne Werbung und ohne Tracking“. Der Katalog gruppiert die Spiele nach Familien; zu jedem Spiel gibt es ein Blatt mit Informationen und Regeln, und einige davon lassen sich direkt auf der Seite spielen. Er ist der Begleiter des Atlas „Șah fără frontiere“ (Schach ohne Grenzen).

## Funktionen

- Ein Katalog mit 17 Spielen, gruppiert nach Familien: Für Kinder & schnelle Spiele, Rumänische Spiele, Ablegespiele, Stichspiele, Kombinationen & Rommé, Poker-Familie, Casino & Wetten, Patience (Solitaire).
- Acht spielbare Spiele (laut Hinweis in der Fußzeile): Solitaire (Klondike), Krieg, Popa Prostul, Macao, Crazy Eights (Opt nebun, 1 gegen 1 gegen den Computer), Septică, Blackjack und Texas Hold'em. Die übrigen sind dokumentiert.
- Suche in Titeln, Beschreibungen, Tags und Regeln („Suche ein Spiel, eine Familie, eine Regel …“).
- Sortierung: Gruppierung nach Familien, alphabetisch A→Z, aufsteigende Schwierigkeit, Spielbare zuerst.
- Filter nach Familien, dazu der Filter „★ Nur Spielbare“.
- Spielblatt mit Spielerzahl, Epoche, Schwierigkeit; Markierung als Favorit (★).
- Spiel des Tages und Statistikzähler (Spiele, Spielbare, Familien, gespielte Partien).
- Barrierefreiheit am Tisch: Kartennamen auf Rumänisch und Ansage der Spielmeldungen für Screenreader.
- Schaltfläche **▶ Spielen** im Blatt jedes spielbaren Spiels; **Schließen** / ✕ / **Esc** zum Verlassen.

## Bedienungsanleitung

1. Öffne die Seite; oben siehst du die Statistiken und das Spiel des Tages.
2. Suche im Suchfeld oder wähle eine Familie aus den Chips; ändere die Reihenfolge in der Sortierliste.
3. Klicke auf ein Spiel, um sein Blatt mit den Regeln zu öffnen. Drücke im Blatt auf ★, um es als Favorit zu markieren.
4. Ist das Spiel als „Spielbar“ gekennzeichnet, drücke **▶ Spielen** und folge den Hinweisen am Tisch.
5. Schließe das Blatt oder den Spieltisch mit **Schließen**, ✕ oder **Esc**.
6. Der Zähler „▶ N Partien“ in der oberen Ecke zeigt, wie viele Partien du begonnen hast.

## Warnhinweis

Die Spiele (einschließlich Blackjack und Texas Hold'em aus der Familie „Casino & Wetten“) sind lehrreiche Simulationen mit virtuellen Chips; es wird kein echtes Geld eingesetzt. Glücksspiel um Geld kann süchtig machen und richtet sich an Erwachsene. Die Gegner in den spielbaren Spielen sind lokale Programme (die Anwendung nennt sie „lokale KIs“); die Anwendung zeigt einen Hinweis in der Fußzeile.

## Datenschutz und Netzwerk

- **Lokale Speicherung (localStorage):** zwei Schlüssel mit dem Präfix `cff:`, `cff:fav` (die Lieblingsspiele) und `cff:played` (die Anzahl der Partien). Sie werden nirgendwohin gesendet.
- **Netzwerk:** Es gibt keine `fetch`-Anfragen, keine externen Skripte, Schriftarten oder Bilder. Die Seite enthält nur Links, die sich beim Klicken öffnen: Șah fără frontiere (alexio.tf), Buy Me a Coffee. Die Seite hat eine restriktive CSP-Richtlinie (`default-src 'self'`). Es gibt keine Telemetrie.

## Lokal / offline ausführen

Lade `index.html` herunter und öffne die Datei im Browser; sie braucht kein Internet (die externen Links schon).

## Lizenz

MIT-Lizenz — siehe Datei `LICENSE`. Der Kopfbereich in `index.html` und der Text in der Oberfläche nennen dieselbe Lizenz (ein früherer Hinweis auf „CC-BY-SA 4.0“ in der Oberfläche wurde beim Audit am 2026-10-11 entfernt, um den Widerspruch zu beseitigen).

## Marken

Spielnamen sind Handelsbezeichnungen ihrer Inhaber und werden beschreibend verwendet; das Projekt ist nicht mit ihnen verbunden.

## Audit

Audit: 2026-10-10 — geprüft mit Playwright und axe-core (Katalog, Blätter und Tische der damaligen sieben Spiele); im Code geprüft: kein `fetch`, CSP `default-src 'self'`. Behoben: ein dekoratives fokussierbares Kontrollkästchen (axe serious); ein Warnhinweis zu Glücksspielen wurde hinzugefügt.

## Autor

Alexio — Alexandru-Ionuț Chiuță, Centrul StrING (wie in der Anwendung angegeben). Kontakt: alexio@trom.tf

## Zusammenfassung

Cărți de joc fără frontiere ist ein Atlas in einer einzigen Datei mit 17 nach Familien gruppierten Kartenspielen, mit Suche, Sortierung, Favoriten und acht spielbaren Spielen (Klondike-Solitaire, Krieg, Popa Prostul, Macao, Crazy Eights, Septică, Blackjack, Texas Hold'em). Es speichert in localStorage nur Favoriten und einen Zähler gespielter Partien und lädt keine externen Ressourcen. Die Oberfläche ist auf Rumänisch. Lizenz MIT (siehe LICENSE).

## Neue Funktionen (v1.1.0)

- **Zwei-Personen-Spiel über das Netzwerk** (Schaltfläche „Zu zweit über das Netzwerk spielen“ im Blatt von Crazy Eights): eine Partie zwischen zwei Menschen, dieselbe Kartenverteilung für beide (gemeinsamer Seed), die Hand des Gegners bleibt verborgen, Züge außerhalb der Reihe werden abgelehnt. Die Verbindung wird direkt zwischen den beiden Browsern hergestellt (WebRTC), ohne einen Server von uns: Man tauscht zwei Texte (Angebot/Antwort) aus, als Text oder QR-Code, über einen beliebigen Kanal eigener Wahl. Standardmäßig wird kein STUN-Server kontaktiert; einer kann im Verbindungsfenster manuell eingetragen werden, nur wenn du es willst. Bricht die Verbindung ab, zeigt die Anwendung das an und kann die Partie anhand des Zugprotokolls fortsetzen.
- **Lokale Suche** im Spielekatalog (FFF.search): findet auch ohne Diakritika oder mit kleinen Tippfehlern, im Text der Regeln und Beschreibungen; ohne Netzwerk.
- **Vorlesen** der Regeln (Schaltfläche „Anhören“, FFF.tts), mit Stimmauswahl.
- Gemeinsames Kit (core, label, bundle, qr, p2p, tts, search): Versionskennzeichnung, .fff.json-Sicherung.
- Die neuen Texte liegen in allen Sprachen der Anwendung vor (einschließlich hu/de, wo ein i18n-System existiert); die automatischen Übersetzungen sind nicht von Muttersprachlern geprüft.
- Tests: `tests/fff-r8.test.mjs` (Netzwerk blockiert, zwei Kontexte über den echten Dialog verbunden, axe 0 Verstöße bei 1280 und 360 px).

## Verlauf / Changelog

### 14. Oktober 2026 (v1.1.0)
- Neu: Zwei-Personen-Netzwerkspiel bei Crazy Eights, lokale Suche tolerant gegenüber Diakritika und Tippfehlern, Vorlesen der Regeln, gemeinsames Kit, Tests.

### 12. Oktober 2026 (v1.0.0)
- 1.0.0 — 2026-10-12: Die Version und das Datum der letzten Aktualisierung werden in der Anwendung angezeigt

### 11. Oktober 2026
- Die Karten auf dem Tisch haben jetzt einen barrierefreien Namen auf Rumänisch („Herz-Dame rot“, „Karo 3“, „Verdeckte Karte“) anstelle des wiederholten Eckentexts; Karten, die angeklickt werden können, sind Schaltflächen (Rolle `button`, Enter/Leertaste), die übrigen Bilder (Rolle `img`).
- Die Meldungen des Spieltisches („Du bist dran.“, „Wähle den Einsatz …“) werden Screenreadern über eine Live-Region angesagt (geprüft bei Solitaire, Macao, Blackjack, Septică).
- Neues spielbares Spiel: **Crazy Eights (Opt nebun)**, 1 gegen 1 gegen den Computer (7 Karten, 8 = Joker mit Farbwahl, Ziehen, bis eine gültige Karte gefunden ist); getestet mit 40 automatischen Partien (52 Karten erhalten, jede Partie wurde beendet). Jetzt sind 8 von 17 Spielen spielbar.
- CSP: `script-src` per SHA-256-Hash (zwei Skripte), ohne `'unsafe-inline'`.
- Blackjack: hinzugefügt **Split** (nur einmal, Karten gleichen Wertes; ein geteiltes Ass erhält nur eine Karte), **Versicherung** 2:1, wenn der Dealer ein Ass zeigt, und Verdoppeln bei jeder Hand; geprüft mit festen Händen (Auszahlungen, Bank, Unentschieden).
- Auf dem Handy ist die Spenden-Pille standardmäßig eine kleine ♥-Schaltfläche (sie klappt bei Berührung auf), und die Seite hat unten einen Abstand, damit sie den Inhalt nicht verdeckt; ihre Bedienelemente sind jetzt per Tastatur erreichbar.
- Der Inhalt ist in `<main>`/`<header>` eingefasst; die Fenster (Blatt, Tisch) haben die Dialog-Rolle; Überschriftenreihenfolge korrigiert (axe: 0 Verstöße).
