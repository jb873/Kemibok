# Leveransguide — KEMI-TILLÄGG

> Ämnesspecifikt tillägg till `LEVERANSGUIDE-INNEHALL.md` v2.1.
> Läses **tillsammans med** huvuddokumentet, aldrig i stället för.
> Allt som inte står här följer huvuddokumentet oförändrat.

**Senast uppdaterad:** 2026-09-12 (v1.0)
**Gäller:** Kemibok
**Kräver:** `LEVERANSGUIDE-INNEHALL.md` v2.1 + `KOMPONENTER-INNEHALL.md` v1.0 (Kemi)

---

## Varför en egen fil i stället för ändringar i huvuddokumentet

Leveransguiden är **gemensam för alla böcker**. Ändras den för kemis skull driver böckerna
isär, vilket är precis vad plattformsdokumentationen finns för att hindra.

Kemi avviker på sex punkter. De ligger här, samlade, så att huvuddokumentet förblir orört
och skillnaderna är synliga på ett ställe.

---

## 1 — Formelkonvertering: obligatoriskt steg före leverans

Detta steg finns inte i något annat ämne.

### Joachim skriver Unicode, Claude konverterar

Joachim skriver formler i löptexten som han alltid gjort — fetstilt, Unicode:

```
H₃O⁺ + OH⁻ → 2 H₂O
```

Claude konverterar vid bearbetning till `\ce{}`:

```
\ce{H3O+ + OH- -> 2 H2O}
```

Fullständiga regler i `KOMPONENTER-INNEHALL.md` DEL 8.

### Tre sorters notation — blanda inte ihop

| Sort | Exempel | Åtgärd |
|---|---|---|
| Reaktion/jon | H₃O⁺ + OH⁻ → 2 H₂O | → `\ce{...}` |
| Matematiskt uttryck | 1 · 10⁻⁷ mol/dm³ | → vanlig MathJax |
| Enhet i löptext | mol/dm³, °C, pH 7 | **lämnas som Unicode** |

### Kontroll före varje leverans till Code

Sök igenom texten efter: **₀₁₂₃₄₅₆₇₈₉ ⁺ ⁻ →**

Varje träff ska ligga inuti `\ce{}` eller `\(...\)`, eller vara en enhet i löptext. Inget annat.

> ⚠️ **Ingen text går vidare till Code med Unicode-formler kvar.** Renderas de inte ser texten
> *nästan* rätt ut — den upptäcks inte i granskning, utan i klassrummet.

---

## 2 — Flipcards: två korttyper, inte tre

### Kemi startar utan redogörelsekort

`redogorelsekort` är byggt kring att eleven **skriver på papper först** — det har
`instruktion`, `modellsvar` och `stodlarare`-block. I kemi lever skrivandet i **Elevboken**.
Kemins flipcards är rena fråga/svar: eleven läser, tänker, vänder.

**Kemi levererar därför `begreppskort` och `modellkort`.** Sektionen `redogorelsekort` utelämnas
eller lämnas som tom array — Code bekräftar vilket `flipcards.js` kräver.

> Detta är ett **startbeslut, inte ett principbeslut.** Redogörelsekort läggs till efter hand om
> behov visar sig i klassrummet. Logga i så fall som 🔵-post.

### Fördelning per avsnitt (kemi)

Huvuddokumentets 50/30/20 gäller inte. Kemi:

- ~60 % `begreppskort`
- ~40 % `modellkort`

**Riktmärke:** 8–14 kort per avsnitt. Kemi är begreppstät — hellre fler korta kort än få långa.

### Nivåfördelning — oförändrad

~75 % `grundlaggande`, ~25 % `fordjupning`. Endast dessa två strängar.

> **Observera:** `niva` på ett flipcard anger **kortets svårighetsgrad**, inte vilken textnivå
> det hör till. Ett avsnitt utan fördjupningstext kan mycket väl ha `fordjupning`-kort.

### Formelkort — villkorat

Ett kort med `\ce{...}` i `fraga`-fältet är tekniskt ett `modellkort`.

**Producera inga formelkort förrän MathJax-omkörningen efter flipcards-rendering är verifierad**
(`KOMPONENTER-INNEHALL.md` DEL 8.5, krav 3). Utan den står `\ce{}` som rå text på kortet.

Code ska också bekräfta om kortens fält tillåter HTML — det avgör om `\ce{}` alls går att
använda där.

---

## 3 — Fördjupningsnivån: kan saknas, och är något annat

Fullständig beskrivning i `KOMPONENTER-INNEHALL.md` DEL 2.4. För leveransen:

### Fördjupning är inte obligatorisk i kemi

Ett avsnitt är **levererbart och publicerbart utan fördjupningstext.** Där standardmodellen
håller hela vägen finns ingen sannare modell att ge.

Detta bryter mot huvuddokumentets leveransordning (Fas 2, punkt 6), där Enkel och Fördjupning
produceras tillsammans när Standard godkänts. **I kemi produceras Enkel direkt; fördjupningen
kommer separat, efter att Joachim undervisat avsnittet.**

### Fördjupningen är en sannare modell, inte mer nyans

| Standardnivå | Fördjupning |
|---|---|
| Syra avger vätejoner | Protonöverföring |
| Elektronskal | Orbitaler |
| Bindning som streck | Elektronpar som delas ojämnt |

Syfte: gymnasieförberedande, mot teknik och natur.

### Modellplacering — obligatoriskt

En fördjupning som byter modell **måste säga det uttryckligen** och säga varför den enklare
modellen inte var fel. Annars läser eleven två nivåer som motsäger varandra och drar slutsatsen
att någon av dem ljuger.

### Två ingångar

**Beställd** (Joachim ser ett behov i klassrummet) eller **föreslagen** (Claude ser att
standardtexten vilar på en modell som bara räcker en bit).

**Claude föreslår, Joachim avgör.** Claude skriver aldrig en fördjupning självsvåldigt.

### Röst

Fördjupningen är **Joachims röst** när han skrivit den — till skillnad från i historia, där den
var Claudes produkt ur standardtexten. Claude stryker, stramar åt, fångar kemiska fel,
konverterar formler. Skriver aldrig om meningar för att de låter bättre.

---

## 4 — Bilder: tre sorter, och bild i fördjupning

### Kemi har bild på fördjupningsnivå

Övriga ämnen har det inte. Skälet: i kemi är referenten **osynlig**. Bilden ersätter inte
analys — den ger analysen ett objekt att handla om.

Detta är en dokumenterad splittring av en tidigare delad regel. Se
`KOMPONENTER-INNEHALL.md` DEL 3.4.

### Tre sorter, olika regler

| Sort | Nivåer | Klass |
|---|---|---|
| **Strukturformel** (kolkedjor, ringar) | Alla, inkl. fördjupning | `strukturformel` |
| **Modellbild** (partikelnivå, elektroner, förlopp) | Alla, inkl. fördjupning | `brodtext-bild` |
| **Illustration** (foto, labbuppställning) | Enkel + Standard | `brodtext-bild` |

Strukturformler är **notation, inte illustration** — de skapas som bilder av tekniska skäl, inte
för att förenkla. Code ritar aldrig kolkedjor.

### Färgkonvention — gäller alla bilder med atomer

Atomer har **samma färg genom hela boken**, CPK-grund. Tabell i `KOMPONENTER-INNEHALL.md` DEL 9.
Plocka de rader som gäller och klistra in i prompten.

Ingen gemensam promptmall — bilderna promptas individuellt.

---

## 5 — Djupdykningar: färre än i historia

Huvuddokumentets riktmärke är 1–3 per avsnitt. **Kemi: 0–2, ofta noll.**

Djupdykningar föddes ur historias "frågor utan enkla svar". Kemi har färre sådana, och det som i
historia blivit en djupdykning blir i kemi oftare en **fördjupning**.

---

## 6 — Matris: verbval för kemi

Huvuddokumentets tre kanoniska verb gäller oförändrat (`Kan beskriva` / `Kan redogöra för` /
`Kan förklara`), liksom regeln att gruppera 3–4 begrepp per moment.

Kemispecifik anmärkning: moment som handlar om **formler och mängdförhållanden** hör till
`kategori: "fardighet"`, inte `"begrepp"` — eleven ska kunna göra något, inte bara förklara ett
ord.

✅ `"Kan balansera enkla reaktionsformler"` → `fardighet`
✅ `"Kan redogöra för begreppen syra, bas och neutralisation"` → `begrepp`

---

## Öppna punkter — Code inventerar och rapporterar

Bygg ingenting på gissningar. Rapportera först, invänta godkännande.

| # | Fråga | Varför den är öppen |
|---|---|---|
| 1 | Behöver kemi `avsnittslista.json` alls? | Den driver Historias sticky tidslinje-header. Kemi har ingen sådan header. Om filen ändå krävs av annan JS: `ar`-fältet passar inte kemi — samma öppna fråga som Geografi har (huvuddokumentet DEL 7 föreslår `underrubrik`). |
| 2 | Tom array eller utelämnad sektion för `redogorelsekort`? | Vad `flipcards.js` faktiskt tål. |
| 3 | Tillåter flipcards-fälten HTML? | Avgör om `\ce{}` kan användas på kort. |
| 4 | MathJax: självhostad + mhchem + omkörning efter flipcards | `KOMPONENTER-INNEHALL.md` DEL 8.5. Verifieras i headless Chromium på både löptextformel och kortformel. |
| 5 | Disabled nivåknapp när fördjupning saknas | Nytt plattformsbeteende. Knappen får inte leda till tom vit yta. |
| 6 | `faktaruta` — CSS byggs och verifieras | Kemins enda helt nya komponent. `KOMPONENTER-INNEHALL.md` DEL 4.6. |
| 7 | Exakt `kallfil`-sökväg i kemis fyra-nivåers struktur | Geografis exempel är skrivet för platt struktur. |

---

## Revisionshistorik

- **v1.0 (2026-09-12):** Första versionen. Skriven som tillägg till gemensam LEVERANSGUIDE v2.1
  i stället för som egen fullständig guide, så att huvuddokumentet förblir delat mellan alla
  böcker. Sex avvikelser dokumenterade: formelkonvertering, två korttyper, fördjupning som
  frivillig och som sannare modell, bild i fördjupning, färre djupdykningar, verbval för formler.
