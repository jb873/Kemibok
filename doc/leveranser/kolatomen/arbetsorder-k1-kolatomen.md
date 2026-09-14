# Arbetsorder — Kemiboken, delkapitel 1 "Kolatomen"

Detta är första arbetsordern för kapitlet Organisk kemi. Den omfattar **leveransfiler med
standardtexter** och **nio SVG-bilder**, samt inläggning av en AI-bild.

**Bygg inte HTML-sidor ännu.** Enkel- och Fördjupningstexterna är inte skrivna. Denna order
lägger leveransfilerna på plats och producerar bildfilerna.

---

## 0. Kontrollräkning

| Avsnitt | Underdelar | Bilder |
|---|---|---|
| 1 — Kol bildar fler föreningar än något annat grundämne | 3 | 4 (A1–A4) |
| 2 — Samma kolatomer kan bygga helt olika ämnen | 3 | 3 (A5–A7) |
| 3 — Kol rör sig mellan luften och det levande | 3 | 3 (A8–A10) |
| **Summa** | **9** | **10** |

Per bildtyp: **9 SVG + 1 AI = 10.** Båda hållen ger 10. Rapportera tillbaka samma kontroll
efter bygget.

---

## 1. Leveransfiler

Skapa katalogen:

```
doc/leveranser/kolatomen/
  avsnitt-1.md
  avsnitt-2.md
  avsnitt-3.md
  bildguider.md
```

De tre textfilerna levereras färdiga tillsammans med denna order — `avsnitt-1.md`,
`avsnitt-2.md`, `avsnitt-3.md`. De innehåller **standardtexter, granskade och godkända**.
Inga ▸-markeringar återstår. Lägg dem i katalogen ovan utan att ändra något i dem.

Varje avsnittsfil innehåller, för varje underdel: tre rubriker med löptext, samt en
bildruta med alt-text, bildtext för Enkel, bildtext för Standard och tre "Titta
efter"-punkter.

Flipcards, kortsvar och djupdykningar kommer i senare order.

### Notation

Reaktioner och formler i texterna är skrivna i Unicode. **Kör `lib-notation.js`** så att de
konverteras till `\ce{}`. Det gäller: CH₄, CO₂, H₂O, C₆H₁₂O₆, O₂, C₆₀, CH₃CH₂CH₃, samt de två
fullständiga reaktionsformlerna i avsnitt 3.

Ljuspilen i fotosyntesformeln ska bli `\ce{->[ljus]}`.

---

## 2. Bildspecar — SVG

Gemensamt för alla nio:

- Platt stil. Inga skuggor, glansdagrar, gradienter eller reflexer.
- Papper `#ece2c8`, konturer och text `#2d4a35`, signaturfärg `#5a9668`.
- Kol `#3a3a3a`, syre `#C0392B`, väte `#f5f0e4` med kontur, kväve `#3D6BA8`, grått `#8A8A8A`,
  ljusblå vätska `#a8c4d8`.
- All text i bilderna på svenska, i bokens brödtextsnitt.
- Filnamn `k1-a1.svg` … `k1-a10.svg` i kapitlets bildkatalog.

### A1 — Organiskt och oorganiskt kol
*Placering: 1.1, vid tredje rubriken*

Två fält sida vid sida på papperfärg, skilda av en lodrät linje i signaturfärg.

Vänster fält, rubrik "Organiska ämnen": fyra enkla molekylsymboler — metan, etanol, socker,
en kort fettkedja.
Höger fält, rubrik "Räknas som oorganiska": koldioxid och en karbonatjon.

Under båda fälten en gemensam rad över hela bredden: **"Alla innehåller kol."**

### A2 — Metan skriven på tre sätt
*Placering: 1.2, vid tredje rubriken*

Tre kolumner med samma molekyl.

1. Molekylformeln CH₄ i stor stil.
2. Strukturformel: kolatom i centrum, fyra streck ut till fyra väteatomer.
3. Rymdmodell: en stor mörk kolsfär med fyra mindre ljusa vätesfärer. Platta cirklar, ingen
   3D-skuggning.

Etiketter under kolumnerna: "Molekylformel", "Strukturformel", "Modell".
Rad längst ner: "Samma molekyl, tre sätt att visa den."

**Antalet väteatomer måste vara exakt fyra i alla tre kolumnerna.**

### A3 — Fyra bindningar kan fördelas olika
*Placering: 1.2, vid andra rubriken*

Tre exempel i rad. Varje har en kolatom i mitten med streck ut till små **tomma cirklar** —
de bindande atomerna namnges inte, det är fördelningen som visas.

1. Fyra enkelbindningar.
2. Två enkelbindningar och en dubbelbindning (två parallella streck).
3. En enkelbindning och en trippelbindning (tre parallella streck).

Vid varje kolatom en liten sifferruta: `1+1+1+1 = 4`, `1+1+2 = 4`, `1+3 = 4`.

### A4 — Kedja, gren och ring
*Placering: 1.3, vid andra rubriken*

Tre strukturer, bara kolskelett utan väteatomer. Kolatomer som fyllda cirklar, bindningar som
streck.

1. Rak kedja, sex kolatomer.
2. Grenad kedja, sex kolatomer, med grenen på tredje atomen.
3. Ring, sex kolatomer. Ringens insida fylld med signaturfärg i låg opacitet.

Rad ovanför alla tre: "Sex kolatomer, tre olika ämnen."

**Exakt sex kolatomer i varje struktur — detta är bildens hela poäng.**

### A5 — Diamant och grafit
*Placering: 2.2, vid första rubriken. Avsnittets kärnbild, ge den mest yta.*

Två fält sida vid sida.

**Vänster, diamant:** tredimensionellt nätverk i tetraedriskt mönster, 12–16 kolatomer, alla
bindningar heldragna och lika kraftiga, riktade åt fyra håll från varje atom.
Etikett: "fyra bindningar per kolatom".

**Höger, grafit:** tre plana skikt av sexkantiga ringar, sedda snett från sidan, med tydligt
avstånd mellan skikten. Bindningar inom skiktet heldragna. Mellan skikten korta **prickade**
streck i grått `#8A8A8A`.
Etiketter: "tre bindningar per kolatom" och "svaga krafter mellan skikten".

Under varje fält två egenskapsord: **"hårt, leder inte ström"** respektive **"mjukt, leder
ström"**.

### A6 — Aktivt kol *(AI-bild, levererad)*
*Placering: 2.3, vid andra rubriken*

Bilden är gjord och bifogas. Åtgärder:

- Nyckla bort den gröna bakgrunden till transparent.
- **Ta bort glansdagrarna på de röda partiklarna** — de bryter mot den platta stilen. Ersätt
  varje partikel med en jämnt fylld cirkel i `#C0392B`.
- Beskär så att den röda partikeln i högerkanten hamnar helt innanför motivet, alternativt ta
  bort den.

### A7 — Fulleren, nanorör och grafen
*Placering: 2.3, vid tredje rubriken*

Tre motiv i rad.

1. **Fulleren:** klotformad bur. Femkanterna fyllda med signaturfärg `#5a9668`, sexkanterna
   ofärgade. Etikett C₆₀. **Tolv femkanter och tjugo sexkanter — antalet måste stämma, och
   inga två femkanter får gränsa till varandra.** Bildguidens första punkt bygger på det.
2. **Nanorör:** ett rör av sexkantigt nät, öppet i ena änden så att nätets mönster syns.
3. **Grafen:** ett plant ark av sexkantiga ringar, lätt uppböjt i ena hörnet. Utpekning:
   "ett atomlager tjockt".

### A8 — Fotosyntesen
*Placering: 3.1, vid andra rubriken*

Ett blad i genomskärning till höger, skissat i signaturfärg, med stam ned till ett markfält.

Pilar in från vänster: **6 CO₂** från luften till bladet, **6 H₂O** från marken upp genom
stammen.
Pil uppifrån: **"ljusenergi"**, i en varm gul ton — samma ton återanvänds i A9.
Pil ut från bladet: **6 O₂**.
Inuti bladet en ruta med **C₆H₁₂O₆**.

**Bildens viktigaste detalj:** koldioxidens sex kolatomer ritas som små mörka prickar
`#3a3a3a` inuti pilen in, och **exakt samma sex prickar** syns sedan inuti glukosrutan.

Räknerad längst ner: "6 kolatomer in → 6 kolatomer i glukosen."

### A9 — Cellandningen
*Placering: 3.2, vid första rubriken*

**Samma formspråk som A8 men spegelvänt**, så att eleven ser släktskapet. Använd samma
pilbredd, samma ruttyp, samma teckengrader.

En cell eller djursilhuett i mitten.
In: ruta med **C₆H₁₂O₆**, och pil **6 O₂**.
Ut: pilar **6 CO₂**, **6 H₂O**, och en pil märkt **"energi"** i samma varma gula ton som
ljusenergin i A8.

De sex mörka kolprickarna följer glukosrutan in och syns sedan i koldioxidpilen ut.

### A10 — Kolets snabba kretslopp
*Placering: 3.3, vid andra rubriken*

En sluten cirkel av pilar.

- Överst **atmosfären** med koldioxid, fält i `#a8c4d8`.
- Pil ned till vänster till en **växt**, märkt "fotosyntes".
- Från växten pil till ett **djur**, märkt "näringskedja".
- Från både växt och djur pilar upp till atmosfären, märkta "cellandning".
- Från båda också pilar ned till ett markfält i `#8A8A8A` med en **nedbrytarruta** (svamp och
  bakterier), och därifrån en pil upp till atmosfären.

Pilar i signaturfärg `#5a9668`, text `#2d4a35`.

**Vid cirkelns nedre högra kant:** ett tomt utrymme med en **blek, streckad pil ut ur
cirkeln, utan etikett.** Den ska se avsiktligt ofullbordad ut. Bildguidens sista punkt frågar
vart den leder.

**Bygg filen som grundfigur.** Delkapitel 3 ska kunna lägga till den geologiska slingan i den
bleka pilens utrymme utan att grundfiguren ritas om. Lägg de återanvändbara delarna i en
grupp med stabila id:n.

Detta är en **ämnesegen** avvikelse — bilder har inte delats mellan delkapitel tidigare.
Dokumentera i `KOMPONENTER-INNEHALL.md`. Det rör inte delad plattformskod, så ingen 🔵-rad i
`PLATTFORMS-ANDRINGAR.md`.

---

## 3. Bildguider

Bildguider visas **endast på Enkel-nivå**. Lägg dem i `bildguider.md` enligt mallen i
`LEVERANSGUIDE-INNEHALL.md`. Alt-text, bildtext Enkel, bildtext Standard och 3 "Titta
efter"-punkter för varje bild — allt finns i avsnittsfilerna under respektive bild.

---

## 4. Rapportera

- Kontrollräkningen enligt avsnitt 0, båda hållen.
- Bekräfta att A2, A3, A4 och A7 har rätt antal atomer respektive hörningar.
- Bekräfta att de sex kolprickarna i A8 och A9 är lika många i båda ändar av varje bild.
- Lista eventuella avvikelser från paletten.
