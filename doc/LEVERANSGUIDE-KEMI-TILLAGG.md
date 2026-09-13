# Leveransguide — KEMI-TILLÄGG

> Ämnesspecifikt tillägg till `LEVERANSGUIDE-INNEHALL.md` v2.1.
> Läses **tillsammans med** huvuddokumentet, aldrig i stället för.
> Allt som inte står här följer huvuddokumentet oförändrat.

**Senast uppdaterad:** 2026-09-13 (v1.2)
**Gäller:** Kemibok
**Kräver:** `LEVERANSGUIDE-INNEHALL.md` v2.1 + `KOMPONENTER-INNEHALL.md` v1.0 (Kemi)

---

## Varför en egen fil i stället för ändringar i huvuddokumentet

Leveransguiden är **gemensam för alla böcker**. Ändras den för kemis skull driver böckerna
isär, vilket är precis vad plattformsdokumentationen finns för att hindra.

Kemi avviker på åtta punkter. De ligger här, samlade, så att huvuddokumentet förblir orört
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

## 7 — Enkelnivån i kemi: uppackad, inte kortad

Detta är kemins största avvikelse från DELAD-basen när det gäller textproduktion, och den beror
på ämnets natur.

### Varför kemi är annorlunda

I historia och geografi går Enkel att göra kortare än Standard. Man tar bort nyanser, resonemang
och undantag, och kärnan står kvar.

I kemi finns sällan nyanser att ta bort. "Antalet protoner bestämmer atomslaget" är redan minimal
— stryker man något försvinner en definition eleven behöver. Texten är tydlig fakta, och det är
precis den fakta eleven ska förstå.

**Enkel i kemi är därför inte kortare. Den är långsammare.** Samma innehåll, men med fler steg
emellan.

Det betyder att **Enkel ofta är kemins längsta nivå**. Leveransguidens spann (Enkel 250–400,
kortast av nivåerna) gäller inte här. Räkna med 400–700 ord per underdel, och låt innehållet
avgöra.

### Fyra tekniker

**Tal i stället för regler.** Standard säger "antalet protoner bestämmer atomslaget". Enkel säger
"1 proton är väte, 6 är kol, 8 är syre — alltid".

**Ett begrepp per stycke.** Laddning, repellera, attrahera och neutral introduceras i fyra
separata steg i stället för i ett.

**Frågan ställs innan den besvaras.** "Varför flyger inte kärnan isär?" får en egen rubrik, så att
eleven hinner undra innan svaret kommer.

**Något att haka upp det på.** Magneter för laddningar. En miljon atomer tunnare än ett hårstrå.

---

### 7.1 Formregel: stycken, inte rader

**Detta är en hård regel och den bryts lätt.**

Enkel brödtext skrivs i **sammanhållna stycken om tre till fem meningar**. Meningar som hör ihop
står i samma stycke.

Rubriker används för att orientera läsaren, inte för att bryta upp texten.

#### Varför regeln finns

Enkelnivån frestar till korta rader. Det *ser* lättläst ut — mycket luft, korta enheter, snabbt
att skanna. Men effekten blir motsatt: en text där varje mening står för sig läser som en
punktlista utan punkter, och den blir hackig snarare än lugn. Det bryter dessutom mot DELAD-basens
regel att Enkel ska vara löpande prosa utan punktlistor i brödtexten.

Luft hjälper. Radbrytning mellan meningar som hör ihop gör det inte.

#### Exempel

❌ **Fel — rader:**

> Protoner och elektroner har något som kallas elektrisk laddning.
>
> Protonerna är positiva. Vi skriver det med ett plustecken: **+**
>
> Elektronerna är negativa. Vi skriver det med ett minustecken: **−**
>
> Neutronerna har ingen laddning alls. De är neutrala — det är därifrån namnet kommer.

✅ **Rätt — stycke:**

> Protoner och elektroner har något som kallas **elektrisk laddning**. Protonerna är positiva, och
> vi skriver det med ett plustecken. Elektronerna är negativa, och de skrivs med ett minustecken.
> Neutronerna har ingen laddning alls — de är neutrala, och det är därifrån namnet kommer.

Samma information, samma ordning, samma begrepp. Skillnaden är att det andra går att läsa.

#### Kontroll före leverans

Gå igenom varje Enkel-text och räkna meningar per stycke. Finns stycken med **en enda mening**
som inte är en avsiktlig markering — slå ihop dem med det som hör till.

Undantaget är en mening som *ska* stå ensam för att den bär avsnittets kärna, till exempel:

> Nu kommer det viktigaste i hela avsnittet: **det är antalet protoner som bestämmer vilket ämne
> atomen är.**

Ett sådant per underdel, inte fler.

---

### 7.2 Röst och ägarskap på Enkel

Enkel-texten är **Claudes produkt** ur Joachims standardtext. Till skillnad från Standard och
Fördjupning, som är Joachims röst, skrivs Enkel av Claude och granskas av Joachim.

Det betyder att Claude får omformulera fritt — men inte lägga till sakinnehåll som inte finns i
standardtexten. Uppackning betyder fler steg genom samma material, inte nytt material.

---

## 8 — Kortsvar: en leveransdel som inte finns i andra ämnen

Kemi har ett fjärde övningsformat, **Testa dig själv**, under Öva-fliken (KOMPONENTER DEL 10).
Det levereras som en JSON-fil per avsnitt:

**Fil:** `kapitel/{kapitel}/data/kortsvar/avsnitt-N-{slug}.json`

```json
{
  "avsnitt": 1,
  "titel": "Atomer, molekyler och joner",
  "delkapitel": "repetition",
  "version": "1.0",
  "antal_per_omgang": 10,
  "fragor": [
    { "id": "k1-s1", "typ": "tal", "fraga": "Hur många atomer finns det i en molekyl \\(\\ce{H2O}\\)?", "svar": 3,
      "forklaring": "Två väteatomer och en syreatom. Står ingen siffra efter O menas en." },
    { "id": "k1-s2", "typ": "formel", "fraga": "Skriv formeln för en vattenmolekyl.", "svar": ["H2O"],
      "forklaring": "Två väteatomer och en syreatom." },
    { "id": "k1-s3", "typ": "ord", "fraga": "Vad kallas en atom som fått laddning?", "svar": ["jon"],
      "forklaring": "…" },
    { "id": "k1-s4", "typ": "flerval", "fraga": "Vilket är ett grundämne?",
      "alternativ": ["\\(\\ce{H2O}\\)", "\\(\\ce{O2}\\)", "\\(\\ce{CO2}\\)"], "svar": 1, "forklaring": "…" }
  ]
}
```

### Fält-för-fält

| Fält | Krävs | Beskrivning |
|---|---|---|
| `avsnitt`, `titel`, `delkapitel`, `version` | ✅ | Som flipcards |
| `antal_per_omgang` | ❌ | Antal frågor per omgång, slumpat urval (6–12). Utan → alla |
| `fragor.id` | ✅ | `k{nr}-s{n}`, unikt |
| `fragor.typ` | ✅ | `tal`, `tal-par`, `flerval`, `markera`, `ord`, `formel` |
| `fragor.fraga` | ✅ | Frågetexten; formler som `\\(\\ce{…}\\)` (backslash dubblas i JSON) |
| `fragor.svar` | ✅ | Se typtabellen |
| `fragor.forklaring` | ✅ | **Obligatorisk.** Visas direkt vid fel svar. Filen laddas inte om den saknas |
| `fragor.alternativ` | flerval/markera | Lista; blandas per omgång |
| `fragor.tolerans` | ❌ (tal, tal-par) | `{"abs": 0.1}` eller `{"rel": 0.02}` |
| `fragor.enhet` | ❌ (tal) | Utelämnad = enhet i svaret ignoreras; `"mol/dm³"` = enheten krävs |
| `fragor.oordnad` | ❌ (tal-par) | `true` = valfri ordning |
| `fragor.skiftlage` | ❌ (formel) | `false` = skiftlägesokänslig. Default känslig (CO ≠ Co) |

### Svar per typ

| Typ | `svar` | Eleven skriver/väljer | Rättas på |
|---|---|---|---|
| `tal` | tal | text | värde; decimalkomma och -punkt, alla minus-varianter; enhet strippas |
| `tal-par` | `[a, b]` | två fält | båda värdena |
| `flerval` | index | ett alternativ | index |
| `markera` | `[index, …]` | flera alternativ | exakt mängd – alla rätta, inga fel |
| `ord` | `["ord", …]` | text | gemener, ändelser tolereras (jonen, joner, jonerna); flera accepterade former |
| `formel` | `["H2O", …]` | text | normaliserat: H₂O = H2O, Na⁺ = Na+, SO₄²⁻ = SO4^2- = SO4 2-; skiftlägeskänsligt |

### Riktmärken

- 10–15 frågor per avsnitt i filen, `antal_per_omgang` 6–12.
- Blanda typer. Räknefrågor (`tal`) och formler (`formel`) är det kortsvar gör som flipcards inte kan.
- `forklaring` säger **varför**, inte bara vad – det är den eleven lär sig av.
- **Frågan får inte innehålla svaret.** "Kväve har atomnummer 7 – hur många protoner?" fungerar som
  flipcard (sambandet är poängen) men inte som kortsvar (svaret står i frågan). Vänd den: "Vilket
  ämne har atomnummer 7?" Kontrollera varje fråga: går den att läsa sig till är den fel.
- Formler i `fraga` och `alternativ` renderas; i `svar` skrivs de utan `\\ce{}` (`"H2O"`).

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

- **v1.2 (2026-09-13):** §8 Kortsvar tillagt – leveransschema för Testa dig själv (fasta frågor
  med facit och obligatorisk förklaring), sex svarstyper, tolerans/enhet/alternativ.
- **v1.1 (2026-09-12):** §7 tillagt — Enkelnivån i kemi är uppackad, inte kortad, och skrivs i
  sammanhållna stycken om 3–5 meningar. Formregeln (§7.1) tillagd efter att levererade texter vid
  upprepade tillfällen glidit mot rad-per-mening, trots att principen var överenskommen.
- **v1.0 (2026-09-12):** Första versionen. Skriven som tillägg till gemensam LEVERANSGUIDE v2.1
  i stället för som egen fullständig guide, så att huvuddokumentet förblir delat mellan alla
  böcker. Sex avvikelser dokumenterade: formelkonvertering, två korttyper, fördjupning som
  frivillig och som sannare modell, bild i fördjupning, färre djupdykningar, verbval för formler.
