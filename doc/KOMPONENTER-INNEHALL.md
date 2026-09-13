# Komponenter — HTML-strukturer för innehållsproducenter (KEMI)

> Kanonisk dokumentation av återanvändbara HTML-komponenter och
> avsnittsmallar i Alphaskolans lärplattform — Kemibokens version.
> Bilaga till `LEVERANSGUIDE-INNEHALL.md`.
>
> Innehållssessioner ser inte CSS — bara HTML. För att producera
> fungerande markup måste de exakta klassnamnen vara dokumenterade.

**Senast uppdaterad:** 2026-09-13 (v1.3)
**Version:** 1.3 (Kemi)
**DELAD-BAS:** v1.1 — måste matcha över alla ämnen
**Ärvd från:** KOMPONENTER-INNEHALL-GEOGRAFI v1.6
**Källa för alla mallar:** Geografis v1.6 (DOM-verifierad hero-banner) + Historias mappstruktur

---

## LÄS DETTA FÖRST — vad som är nytt i kemi

Kemi ärver hela den delade basen. Sex saker skiljer, och alla är dokumenterade nedan:

1. **Mappstruktur** — kemi använder historias fyra-nivåers djup, inte geografis platta (DEL 0)
2. **Signaturfärg** — varm patina `#5a9668` (DEL 1)
3. **Formelrendering** — MathJax + mhchem, tredelad notation (DEL 8)
4. **Bild i fördjupning** — tillåten i kemi, till skillnad från övriga ämnen (DEL 3)
5. **Färgkonvention för atomer** — CPK-grund, genom hela boken (DEL 9)
6. **Faktaruta** — ny komponent, ej ärvd, kräver bygge (DEL 4.6)

Allt annat ärvs oförändrat. **Uppfinn inte om det som redan finns.**

### Skillnad mot geografis dokument — en scaffold, inte två

Geografis v1.6 innehåller två motstridiga scaffolds: DEL 1:s "kompletta scaffold-mall"
(ljus header, `<div class="sida">`, brödsmulor i sidan) och DEL 4.5 (hero-banner,
`<main class="sida">`, brödsmulor i headern). v1.6-noten erkänner att den första är
inaktuell men lämnar kvar koden.

**Kemi har en scaffold.** Den ljusa header-varianten existerar inte i detta dokument
och ska inte produceras. Finns tvekan — det som står i DEL 1 här är facit.

---

## Sektions-typ: DELAD vs ÄMNESEGET

Dokumentet innehåller både **delad plattform** (identisk över alla ämnen — gör att eleven
känner igen *plattformen*) och **ämneseget** (får skilja sig per ämne — gör att eleven
känner igen *ämnet*).

- 🔗 **DELAD** — synka över alla ämnen. Ändrar du här: ändra i ALLA ämnens KOMPONENTER
  samtidigt **och höj DELAD-BAS-versionen**.
- 🎨 **ÄMNESEGET** — får skilja sig per ämne. Ändra fritt.

**DELAD-BAS: v1.1** — höj (i alla ämnen samtidigt) närhelst en 🔗-sektion ändras.

### Sektionskarta

| Sektion | Typ |
|---|---|
| DEL 0 — Placering och sökvägar | 🎨 ÄMNESEGET |
| Princip / Dokumentationsprincip | 🔗 DELAD |
| DEL 1 — Scaffold: hero-banner (struktur) | 🔗 DELAD |
| DEL 1 — Scaffold: signaturfärg (patina) | 🎨 ÄMNESEGET |
| DEL 1 — Scaffold: flikrad och nedåt | 🔗 DELAD |
| DEL 2 — Brödtext-principer per nivå | 🔗 DELAD |
| DEL 2.4 — Kemins fördjupningsnivå | 🎨 ÄMNESEGET |
| DEL 3 — Bildstöd: Enkel + Standard | 🔗 DELAD |
| DEL 3.4 — Bildstöd: Fördjupning | 🎨 ÄMNESEGET |
| DEL 4.1–4.4 — fordj-kort, brodtext-bild, karnpunkter, bildguide | 🔗 DELAD |
| DEL 4.5 — hero-banner | 🔗 struktur / 🎨 färg |
| DEL 4.6 — faktaruta | 🎨 ÄMNESEGET (ny, ej byggd) |
| DEL 5 — Ej dokumenterade (boklokal lista) | 🎨 ÄMNESEGET |
| DEL 6 — Process | 🔗 DELAD |
| DEL 7 — Föreläsning | 🔗 DELAD |
| DEL 8 — Formler och notation | 🎨 ÄMNESEGET |
| DEL 9 — Färgkonvention för bilder | 🎨 ÄMNESEGET |
| DEL 10 — Öva-fliken och flipcards | 🔗 struktur / 🎨 korttyper |
| DEL 11 — Arbetsmodell och leveransflöde | 🎨 ÄMNESEGET |
| Bilagor / Revisionshistorik | 🎨 boklokal |

**Ändring mot geografi:** DEL 3 var tidigare 🔗 DELAD i sin helhet. Den är nu **splittrad** —
Enkel och Standard förblir delade, fördjupningsnivåns bildregel blir ämnesegen.
DELAD-BAS är **oförändrad (v1.1)**: ingen delad komponent har ändrats, bara sektionens
räckvidd. Motsvarande rad ska läggas in i geografis och historias dokument så att
divergensen är dokumenterad och ingen "rättar" tillbaka kemi.

---

## Princip
**🔗 DELAD**

Plattformskomponenter har **exakta klassnamn och struktur** som CSS:n kräver.
Innehållsproducenten:

- Kopierar mallen rakt av
- Byter bara innehållet (text, länkar, ikoner)
- Ändrar INTE klassnamn, element-typer eller nesting-struktur

Vid tveksamhet — fråga. Gissa aldrig.

### Dokumentationsprincip

Komponentstrukturer dokumenteras enligt **vad CSS:n faktiskt stilsätter och JS:n läser**,
inte enligt vad som råkar finnas i HTML-källkod. CSS + JS är det som avgör vad eleven ser.

Verifieringskrav: HTML + CSS + renderad sida måste stämma innan dokumentation skrivs.

---

## DEL 0 — Placering och sökvägar
**🎨 ÄMNESEGET**

### Mappstruktur

Kemi använder **historias fyra-nivåers djup**:

```
kapitel/{område}/delkapitel/{delområde}/avsnitt-{n}-{slug}.html
```

Mappnamnen är bokstavligen `kapitel/` och `delkapitel/` — **samma ord som i historia och
geografi**, så att eleven känner igen sig mellan ämnen. I kemins innehåll motsvarar de
*område* och *delområde*, men det är en läraretikett, inte ett mappnamn.

### Varför fyra nivåer överallt

Kemins fyra områden är olika stora. Materia kommer att svälla; andra områden ryms på ett
plan. **Djupet är ändå enhetligt för alla fyra.** Får djupet variera per område måste Code
avgöra vilket djup som gäller var, och då uppstår tolkningsutrymme. Ett litet område får
hellre ett enda delkapitel än att kemi har två filformer.

Priset är en pro forma-nivå i början. Vinsten är att sökvägen är identisk i varenda fil
från fil ett, och att svällning inte kräver flytt av filer.

### Sökvägsdjup — kritiskt

| Vad | Djup | Exempel |
|---|---|---|
| CSS + JS | **fyra nivåer upp** | `../../../../css/kemi.css` |
| Data-filer | **två nivåer upp** | `../../data/forelasningar.json` |

> ⚠️ **Den vanligaste förväxlingen.** Geografis DEL 4.5-mall är skriven med `../../`
> eftersom geografi är platt. Klistras den in rakt av i kemis fyra-nivåers struktur bryts
> alla CSS- och script-länkar. Felet ser ut som *"sidan renderar ostylad"* — inte som ett
> sökvägsfel. Använd alltid kemins egen scaffold i DEL 1.

**Att bekräfta av Code vid JSON-fasen:** exakt sökväg till flipcards-data. Historias mönster
lägger `data/` på kapitel-nivån (`kapitel/{kapitel}/data/`), vilket ger `../../data/` från
avsnittsfilen. Bekräfta mot faktisk struktur innan JSON produceras.

### Brödsmulor

Fyra nivåer: **Kemi › Område › Delområde › Avsnitt**. Aktuell crumb visar nummerprefix:
`{{N}}. {{Avsnittstitel}}`.

---

## DEL 1 — Avsnitts-scaffold (kanonisk)
**🔀 BLANDAD** — header-regionens färg är 🎨 ämneseget; struktur och allt från flikraden
och nedåt är 🔗 delat.

> Detta är **facit** för flik-/underdels-/nivå-strukturen på en avsnittssida.
> Klipp och fyll i.

### Signaturfärg
**🎨 ÄMNESEGET**

**Varm patina `#5a9668`** — grönt med kopparvärme i botten. Läser som kemi/natur/kretslopp,
lyser mot mörk hero, bryter rent mot historias guld och geografins blå.

**Detta är kemins enda ämnesegna färg.** Allt annat formspråk (typsnitt, komponenter,
layout, `as-`-prefix) är 🔗 DELAT och ärvs oförändrat. **Code väljer aldrig färg.**

Sätts som `--accent` i `css/kemi.css`. Bannerns h1-textfärg är `rgba(232,222,200,0.95)`
(grädde, delad).

### Aktiv-markering — källan till alla tidigare buggar

- **KNAPPAR** markeras aktiva med klassen `aktiv`
- **INNEHÅLL** (paneler, underdel-text, nivå-artiklar) markeras aktivt genom **frånvaro**
  av `dold`
- `js/avsnitt.js` togglar `dold` på innehåll och `aktiv` på knappar

### Fem fällor — gör ALDRIG så här

1. **`data-niva` måste vara `"enkel"`/`"standard"`/`"fordjupning"`** — aldrig `"1"`/`"2"`/`"3"`.
   `avsnitt.js` startar på `'standard'`; fel värde → ingen text syns.

2. **EN delad `.niva-valjare`** i Läs-panelen, EFTER `.underdel-valjare` och UTANFÖR alla
   `.underdel-text` — aldrig en väljare per underdel.

3. **`data-niva-nyckel` sitter på `.niva-valjare`** — aldrig på `<body>`.

4. **Underdels-sektioner har klass `underdel-text`** — aldrig bara `underdel`. Bar
   `.underdel` blir scope-rot i `avsnitt.js` och bryter flik/nivå-logiken.

5. **Tom `.forelasningar-lista`-container är rätt.** Skriv ALDRIG statisk HTML för
   föreläsningskort inuti — `js/forelasningar.js` tömmer containern vid laddning och fyller
   på från JSON. Se DEL 7.

### Ankarpunkter

Underdels-sektioner behöver **ingen `id`**. `avsnitt.js` läser `location.hash`
(`#a`/`#b`/`#c`) och aktiverar via `data-underdel`. Djupdykningars tillbaka-länk pekar på
`avsnitt-...html#a/#b/#c` (rätt underdel).

### Komplett scaffold-mall

```html
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{Avsnittstitel}} – {{Delområde}} – Kemi</title>
  <link rel="stylesheet" href="../../../../css/kemi.css">
  <link rel="stylesheet" href="../../../../css/flipcards.css">
  <link rel="stylesheet" href="../../../../css/fonts.css">
</head>
<body>

  <!-- ===== HERO-BANNER (mörk, patina-accent) ===== -->
  <header class="hero-banner">
    <div class="hero-inner">
      <nav class="brodsmulor" aria-label="Brödsmulor">
        <a href="../../../../index.html">Kemi</a>
        <span class="skiljare" aria-hidden="true">›</span>
        <a href="../../index.html">{{Område}}</a>
        <span class="skiljare" aria-hidden="true">›</span>
        <a href="index.html">{{Delområde}}</a>
        <span class="skiljare" aria-hidden="true">›</span>
        <span class="aktuell" aria-current="page">{{N}}. {{Avsnittstitel}}</span>
      </nav>
      <span class="avsnitt-label">Avsnitt {{n}}</span>
      <h1>{{Avsnittstitel}}</h1>
      <p class="subtitel">— {{kort underrubrik}} —</p>
    </div>
  </header>

  <main class="sida">

    <!-- ===== FLIKRAD ===== -->
    <div class="flikar-rad" role="tablist">
      <button type="button" class="flik" data-flik="forelasning" role="tab">Föreläsning</button>
      <button type="button" class="flik aktiv" data-flik="las" role="tab">Läs</button>
      <button type="button" class="flik" data-flik="ova" role="tab">Öva</button>
      <button type="button" class="flik" data-flik="elevboken" role="tab">Elevboken</button>
    </div>

    <!-- ===== FÖRELÄSNING — tom mount, JS fyller på från data/forelasningar.json.
         Flikknappen sätts disabled av JS om inga föreläsningar finns. Se DEL 7. ===== -->
    <section class="flik-innehall dold" data-flik="forelasning" role="tabpanel">
      <div class="forelasningar-lista"></div>
    </section>

    <!-- ===== LÄS (aktiv panel = utan dold) ===== -->
    <section class="flik-innehall" data-flik="las" role="tabpanel">

      <!-- Underdelsväljare (2-4 underdelar) -->
      <div class="underdel-valjare" role="tablist" aria-label="Textval">
        <button type="button" class="underdel-knapp aktiv" data-underdel="a" role="tab">
          <span class="underdel-bokstav">A</span>
          <span class="underdel-titel">{{Underdel A-titel}}</span>
        </button>
        <button type="button" class="underdel-knapp" data-underdel="b" role="tab">
          <span class="underdel-bokstav">B</span>
          <span class="underdel-titel">{{Underdel B-titel}}</span>
        </button>
      </div>

      <!-- EN delad nivåväljare — EFTER underdel-valjare, UTANFÖR underdel-text -->
      <div class="niva-valjare" role="group" aria-label="Textnivå"
           data-niva-nyckel="kemi-niva-{{kapitel}}-{{slug}}">
        <button type="button" class="niva-knapp" data-niva="enkel">📗 Enkel</button>
        <button type="button" class="niva-knapp aktiv" data-niva="standard">📘 Standard</button>
        <button type="button" class="niva-knapp" data-niva="fordjupning">📕 Fördjupning</button>
      </div>

      <!-- UNDERDEL A (aktiv = utan dold) -->
      <div class="underdel-text" data-underdel="a">

        <!-- 📗 ENKEL — se DEL 2 -->
        <div class="niva-innehall brodtext dold" data-niva="enkel">

          <div class="karnpunkter">
            <div class="karnpunkter-rubrik">🎯 Kärnpunkter</div>
            <ul><li>{{kärnpunkt}}</li><li>{{kärnpunkt}}</li></ul>
          </div>

          <div class="bildguide">
            <div class="bildguide-rubrik">👁 Titta efter</div>
            <ul><li>{{vad eleven ska leta efter}}</li></ul>
          </div>
          <figure class="brodtext-bild enkel">
            <img src="img/{{bild}}.webp" alt="{{rik alt-text}}">
            <figcaption>{{kort, orienterande bildtext}}</figcaption>
          </figure>

          <p>{{enkel brödtext i LÖPANDE PROSA}}</p>
        </div>

        <!-- 📘 STANDARD (default synlig = utan dold) -->
        <div class="niva-innehall brodtext" data-niva="standard">
          <p class="inledning">{{inledning}}</p>
          <h2>{{rubrik}}</h2>
          <p>{{standard brödtext}}</p>
          <figure class="brodtext-bild standard">
            <img src="img/{{bild}}.webp" alt="{{rik alt-text — IDENTISK med Enkel}}">
            <figcaption>{{längre/analytisk bildtext}}</figcaption>
          </figure>
        </div>

        <!-- 📕 FÖRDJUPNING — i kemi TILLÅTEN med bild, se DEL 3.4.
             Kan saknas helt för ett avsnitt, se DEL 2.4. -->
        <div class="niva-innehall brodtext dold" data-niva="fordjupning">
          <h2>{{rubrik}}</h2>
          <p>{{fördjupningstext}}</p>
        </div>

      </div>

      <!-- UNDERDEL B (dold tills vald) -->
      <div class="underdel-text dold" data-underdel="b">
        <div class="niva-innehall brodtext dold" data-niva="enkel"><p>{{…}}</p></div>
        <div class="niva-innehall brodtext" data-niva="standard"><p>{{…}}</p></div>
        <div class="niva-innehall brodtext dold" data-niva="fordjupning"><p>{{…}}</p></div>
      </div>

      <!-- DJUPDYKNINGAR -->
      <section class="djupdykningar">
        <span class="sektion-label">Vill du veta mer?</span>
        <div class="fordj-kort-grid">
          <a class="fordj-kort" href="djupdykning-{{slug}}.html">
            <span class="fordj-kort-ikon" aria-hidden="true">{{emoji}}</span>
            <span class="fordj-kort-text">
              <span class="fordj-kort-titel">{{Djupdykningstitel}}</span>
              <span class="fordj-kort-sammanfattning">{{1-2 meningar.}}</span>
            </span>
          </a>
        </div>
      </section>

    </section>

    <!-- ===== ÖVA — tre arbetssätt (kemi-eget lager, DEL 10). Texterna i .ova-valjare kopieras
         rakt av; flipcards-mount och kortsvar-mount pekar på kapitlets data-mapp. ===== -->
    <section class="flik-innehall dold" data-flik="ova" role="tabpanel">
      <div class="ova-valjare" role="group" aria-label="Arbetssätt">
        <span class="sektion-label">Hur vill du öva?</span>
        <button type="button" class="ova-kort" data-arbetssatt="begrepp">
          <span class="ova-kort-ikon" aria-hidden="true">🟢</span>
          <span class="ova-kort-titel">Plugga begrepp</span>
          <span class="ova-kort-beskr">Vänd kort. Ett begrepp i taget, snabb repetition.</span>
        </button>
        <button type="button" class="ova-kort" data-arbetssatt="kortsvar">
          <span class="ova-kort-ikon" aria-hidden="true">✍️</span>
          <span class="ova-kort-titel">Testa dig själv</span>
          <span class="ova-kort-beskr">Kortsvar med rättning. Du får veta direkt vad som stämde och varför.</span>
        </button>
        <button type="button" class="ova-kort" data-arbetssatt="tillampa">
          <span class="ova-kort-ikon" aria-hidden="true">🔵</span>
          <span class="ova-kort-titel">Tillämpa</span>
          <span class="ova-kort-beskr">Vänd kort. Frågor där du måste använda det du kan.</span>
        </button>
      </div>
      <div class="flipcards-mount"
           data-fil="../../data/flipcards/avsnitt-{{N}}-{{slug}}.json"
           data-avsnitt="a{{N}}_{{slug}}">
        <p class="flipcards-laddar">Laddar övningskort…</p>
      </div>
      <div class="kortsvar-mount"
           data-fil="../../data/kortsvar/avsnitt-{{N}}-{{slug}}.json"></div>
    </section>

    <!-- ===== ELEVBOKEN ===== -->
    <section class="flik-innehall dold" data-flik="elevboken" role="tabpanel">
      <div class="elevbok-fragor">
        <p class="laddar-fragor">Laddar frågor ...</p>
      </div>
    </section>

  </main>

  <!-- AVSNITT_ID-block FÖRE de externa skripten -->
  <script>
    const AVSNITT_ID = 'a{{N}}_{{slug}}';
    const KAPITEL_ID = '{{kapitel}}';
    const DELKAPITEL_ID = '{{delkapitel}}';
  </script>

  <!-- MathJax + mhchem — SJÄLVHOSTAD, se DEL 8 -->
  <script src="../../../../js/mathjax-config.js"></script>
  <script src="../../../../js/mathjax/tex-mml-chtml.js" id="MathJax-script" async></script>

  <script src="../../../../js/elevbok.js"></script>
  <script src="../../../../js/avsnitt.js"></script>
  <script src="../../../../js/bildmodal.js" defer></script>
  <script src="../../../../js/egna-fragor.js" defer></script>
  <script src="../../../../js/avsnitt-elevbok.js" defer></script>
  <script src="../../../../js/textbyggar-stodlarare.js" defer></script>
  <script src="../../../../js/flipcards.js" defer></script>
  <script src="../../../../js/kortsvar-gradering.js" defer></script>
  <script src="../../../../js/kortsvar.js" defer></script>
  <script src="../../../../js/ova-arbetssatt.js" defer></script>
  <script src="../../../../js/forelasningar.js" defer></script>
  <script src="../../../../js/elevfeedback.js" defer></script>
</body>
</html>
```

**Ingen `tidslinje.js`** och ingen sticky tidslinje-header — det är enbart Historia.

---

## DEL 2 — Brödtext-principer per nivå
**🔗 DELAD**

### 📗 Enkel

**Brödtext = LÖPANDE PROSA.** Hela meningar i stycken.

**Använd INTE punktlistor för själva brödtexten.** Mycket punktform blir en tröskel eleven
måste ta sig över — inte en hjälp.

**Punktlistor hör bara hemma i:**
- `.karnpunkter` (kärnpunkter-blocket)
- `.bildguide` (advance organizer)

**Volym:** ~250–400 ord prosa per underdel
**Ton:** Vardagsspråk, tydlig kausalitet

### 📘 Standard (default)

Standardförklaring med flerdimensionalitet. Också prosa, men med större vokabulär och fler
analytiska kopplingar än Enkel.

**Volym:** ~500–700 ord per underdel
**Ton:** Pedagogisk men inte förenklad

### 📕 Fördjupning

**Volym:** ~800–1100 ord per underdel
**Ton:** Akademisk men begriplig för åk 9

> Volymerna följer DELAD-basen oförändrat. Notera att en kemitext med inbakade formler läser
> långsammare per ord än en historietext — en formelrad äter läsbudget utan att räknas som
> ord. Ligg därför hellre i nedre delen av spannen än i övre.

---

## DEL 2.4 — Kemins fördjupningsnivå
**🎨 ÄMNESEGET**

Detta är den största innehållsmässiga skillnaden mot historia och geografi, och den måste
förstås innan en fördjupning skrivs.

### Vad fördjupningen ÄR i kemi

I historia och geografi är fördjupningen **en annan blick på samma sak** — historiografi,
kontroverser, frågor utan enkla svar. Samma innehåll, mer nyans.

I kemi är fördjupningen **en annan modell av samma sak.** Standardtexten ger en förenklad
men användbar modell; fördjupningen ger en sannare. Det eleven lärde sig på standardnivå
skrivs delvis om:

| Standardnivå | Fördjupning |
|---|---|
| Syra avger vätejoner | Protonöverföring |
| Elektronskal | Orbitaler |
| Bindning som streck | Elektronpar som delas ojämnt |

**Syfte:** gymnasieförberedande, riktad mot teknik- och naturprogrammet.

### Modellplacering — obligatoriskt krav

**En fördjupning som byter modell måste säga det uttryckligen, och säga varför den enklare
modellen inte var fel.**

Utan det upptäcker eleven en motsägelse mellan två nivåer i samma bok och drar slutsatsen
att någon av dem ljuger — eller att kemi är godtyckligt. Det är den klassiska skadan av
modellbyten i naturvetenskap, och den är helt undvikbar med en eller två meningar som
placerar modellen:

> *Så här långt räcker den enklare bilden. Här slutar den räcka. Därför behövs den här.*

### Fördjupningen finns inte överallt

Där standardmodellen håller hela vägen finns ingen sannare modell att ge, och en fördjupning
vore utfyllnad. **Ett avsnitt kan stå färdigt och publicerat utan fördjupningsnivå.**

> ⚠️ **Plattformskrav till Code:** nivåknappen `📕 Fördjupning` får **inte** leda till en tom
> vit yta. När `data-niva="fordjupning"` saknas eller är tom ska knappen sättas **disabled**
> — samma beteende som föreläsningsfliken redan har i `forelasningar.js`.
> **Detta är ett nytt plattformsbeteende som måste beställas och verifieras.**

### Två ingångar till en fördjupning

**Från klassrummet:** Joachim ser var eleverna fastnar eller var de starka drar iväg, och
beställer en fördjupning. Joachims innehåll, Joachims röst — Claude bearbetar.

**Från texten:** Claude läser standardtexten, ser att den vilar på en modell som bara räcker
en bit, och **föreslår**: *här borde vi ta upp detta för de starka eleverna.*

> **Gränsen: Claude föreslår, Joachim avgör.** Claude skriver aldrig en fördjupning
> självsvåldigt. Annars växer boken fördjupningar som ingen elev efterfrågat, och det som
> skulle vara ett tecken på behov blir brus.

De två ingångarna ger olika texter. En **beställd** fördjupning svarar på en fråga som redan
ställts i klassrummet. En **föreslagen** måste själv motivera varför den finns — den ska
kunna läsas av en stark elev som ingen skickat dit.

---

## DEL 3 — Bildstöd-mönstret per nivå
**🔗 DELAD** (3.1–3.3) / **🎨 ÄMNESEGET** (3.4)

### Tre bildsorter i kemi

Kemi skiljer på tre sorter, med olika regler. Skillnaden ska vara synlig i markupen och
inte bero på att någon minns regeln.

| Sort | Vad | Nivåer | Komponent |
|---|---|---|---|
| **Strukturformel** | Kolkedjor, ringar, bindningar | Alla, inkl. fördjupning | `strukturformel` (DEL 8) |
| **Modellbild** | Det osynliga: partikelnivå, elektroner, reaktionsförlopp | Alla, inkl. fördjupning | `brodtext-bild` |
| **Illustration** | Foto, laborationsuppställning, kretslopp i landskapet | Enkel + Standard | `brodtext-bild` |

### 3.1 📗 Enkel
**🔗 DELAD**

- **Bild:** SAMMA bild som Standard (identisk `src` + identisk `alt`-text)
- **Föregås av:** `<div class="bildguide">` med "👁 Titta efter" och 2–5 observationspunkter
- **Bildtext:** Kort och orienterande
- **Layout:** `<figure class="brodtext-bild enkel">`

### 3.2 📘 Standard
**🔗 DELAD**

- **Bild:** SAMMA bild som Enkel (identisk `src` + identisk `alt`-text)
- **Föregås av:** ingen bildguide (eleven förväntas tolka själv)
- **Bildtext:** Längre och analytisk
- **Layout:** `<figure class="brodtext-bild standard">`

### 3.3 Princip — varför samma bild
**🔗 DELAD**

Eleven känner igen bilden från Enkel när hen byter till Standard. Det skapar **kontinuitet**
mellan nivåerna. `alt`-texten måste vara identisk för att skärmläsare ska behandla dem som
samma resurs.

### 3.4 📕 Fördjupning — kemi avviker
**🎨 ÄMNESEGET**

**I kemi har fördjupningen bilder.** Övriga ämnen har det inte.

**Skälet, och varför det inte gäller andra ämnen:**

I geografi och historia illustrerar bilden något eleven i princip kan se — ett landskap, en
stadsbild, ett föremål. Bilden lägger till konkretion som texten redan äger. Därför
förenklar den i fördjupning, och därför utesluts den.

I kemi är referenten **osynlig**. Joner, elektronskal, vad som händer när en syra möter en
bas i lösningen — ingen elev har sett det, och ingen text gör det synligt hur många ord den
än får. Bilden ersätter inte analys; **den ger analysen ett objekt att handla om.** En
fördjupningstext om protonöverföring utan en bild av vad som flyttas är abstraktion staplad
på abstraktion.

Det osynliga blir alltså inte enklare av att avbildas — det blir **tillgängligt**.

**Regler för fördjupningsbild:**
- Strukturformler och modellbilder: tillåtna
- Rena illustrationer (foto, labbuppställning): fortsätter utebli, som i övriga ämnen
- Ingen bildguide (den hör till Enkel)
- `<figure class="brodtext-bild fordjupning">`

---

## DEL 4 — HTML-komponenter

### 4.1 fordj-kort (djupdykningskort)
**🔗 DELAD**

Klickbara kort längst ner på en avsnittssida (i Läs-fliken). Synliga oavsett vald underdel
eller textnivå. Frivillig fördjupning.

```html
<section class="djupdykningar">
  <span class="sektion-label">Vill du veta mer?</span>
  <div class="fordj-kort-grid">

    <a class="fordj-kort" href="djupdykning-{slug}.html">
      <span class="fordj-kort-ikon" aria-hidden="true">🧪</span>
      <span class="fordj-kort-text">
        <span class="fordj-kort-titel">{Titel på djupdykningen}</span>
        <span class="fordj-kort-sammanfattning">{1-3 meningar som lockar.}</span>
      </span>
    </a>

  </div>
</section>
```

**Regler:**
- Rubriken är **`<span class="sektion-label">`** — inte `<h2>`
- Griden heter **`fordj-kort-grid`** — inte `kort-grid`
- Allt textinnehåll inuti `<a>` är **inline `<span>`** — inga `<h3>`, `<p>` eller block
- `aria-hidden="true"` på ikon-spannet
- Sektionen har **ingen `id`**

**Antal per avsnitt i kemi:** färre än i historia. Djupdykningar föddes ur historias "frågor
utan enkla svar"; kemi har färre sådana, och det som i historia blivit en djupdykning blir
i kemi oftare en **fördjupning**. Riktmärke: 0–2 per avsnitt.

---

### 4.2 brodtext-bild
**🔗 DELAD**

```html
<figure class="brodtext-bild {nivå}">
  <img src="img/{tema}/{bild}.webp" alt="{Lång beskrivning}">
  <figcaption>{Förklarande bildtext}</figcaption>
</figure>
```

`{nivå}` = `enkel` | `standard` | `fordjupning`

**Placering:** bilden sitter **inline vid det stycke den hör till** — aldrig staplad före
brödtexten. Med bildguide (endast Enkel): löpande text → bildguide → bild → texten
fortsätter.

**Balans:** bilden ska vara ett **stöd**, aldrig en **tröskel**. För lite text runt bilden
gör den kontextlös, för mycket dränker den.

**🎨 Kemi: ingen ram, transparent bakgrund (v1.3).** Plattformens tunna ram runt `.brodtext-bild img`
är avstängd i kemi.css. Den fungerar på Historias och Geografis foton och målningar, men kemins
bilder är platta illustrationer på sidans eget papper, och där ramar linjen in tomrum. Ämnesegen
avvikelse, inte en plattformsändring. Följden för bildleveranser: **bakgrunden ska vara
transparent** – aldrig en hårdkodad benvit eller `--paper`-färg, som låser bilden till en viss
sidbakgrund och spricker om `--paper` ändras eller bilden läggs på ett kort. SVG:er genereras
transparenta; AI-bilder promptas med transparent bakgrund, eller med en enhetlig kontrastfärg
som inte förekommer i motivet och nycklas bort innan leverans (se DEL 9).

---

### 4.3 karnpunkter (Det viktigaste-block)
**🔗 DELAD**

```html
<div class="karnpunkter">
  <div class="karnpunkter-rubrik">🎯 Kärnpunkter</div>
  <ul>
    <li>{Punkt 1 — kort, viktiga ord <strong>fetstilta</strong>}</li>
    <li>{Punkt 2}</li>
    <li>{Punkt 3}</li>
  </ul>
</div>
```

**Regler:**
- Rubriken är `<div class="karnpunkter-rubrik">` (som Historia). `<h3>` fungerar tekniskt men
  träffas av `.brodtext h3` i geografi.css och blir en stor mellanrubrik i stället för en etikett
  (v1.1, verifierat i Chromium)
- 3–5 punkter, max 6
- Fetstil för viktiga begrepp

**Riktmärke:** 1–3 block per textnivå per avsnitt.

---

### 4.4 bildguide (advance organizer)
**🔗 DELAD**

```html
<div class="bildguide">
  <div class="bildguide-rubrik">👁 Titta efter</div>
  <ul>
    <li>{Vad eleven specifikt ska titta efter i bilden}</li>
    <li>{... max 5 punkter}</li>
  </ul>
</div>
```

**Regler:**
- 2–5 specifika observationspunkter
- Placeras **FÖRE** `<figure class="brodtext-bild">`
- **Endast på Enkel-nivå**

---

### 4.5 hero-banner
**🔗 struktur / 🎨 färg**

Se fullständig markup i DEL 1. Struktur delad med alla ämnen; färgen (`#5a9668`) ämnesegen;
sökvägsdjupet fyra nivåer (DEL 0).

---

### 4.6 faktaruta — NY KOMPONENT, EJ BYGGD
**🎨 ÄMNESEGET**

> ⚠️ **Status: beställning till Code.** Denna komponent finns inte i plattformen. CSS saknas.
> Enligt DEL 6 får en komponent inte räknas som dokumenterad förrän den verifierats mot CSS,
> JS och rendering. **Detta är kemins enda helt nya komponent** — allt annat ärvs.

#### Pedagogisk funktion

Faktarutan **ställer två förväxlingsbara begrepp mot varandra**. Den gör något ingen befintlig
komponent gör: `karnpunkter` sammanfattar det viktigaste, `bildguide` förbereder en bild.
Faktarutan isolerar en distinktion mitt i texten och säger: *det här är två saker, inte en.*

Behovet är inte en engångsföreteelse. Kemi är ovanligt tät på begreppspar som elever slår
ihop, och just de paren är där proven går fel:

- Neutralpunkt / ekvivalenspunkt
- Stark syra / koncentrerad syra
- Atom / jon
- Molekyl / formelenhet
- Lösning / smälta

#### Form

Löpande prosa i en ruta — inte ett stelt tvåfältsformat. Prosan bär förklaringen; två
sammanfattande rader stänger. Formen är flexibel nog för det som inte är ett rent par.

```html
<aside class="faktaruta">
  <h3>{{Rubrik — vanligen "X och Y"}}</h3>

  <p><strong>{{Begrepp A}}</strong> {{förklaring i prosa}}</p>

  <p><strong>{{Begrepp B}}</strong> {{förklaring i prosa}}</p>

  <p>{{ev. nyansering — när de sammanfaller, när de inte gör det}}</p>

  <div class="faktaruta-sammanfattning">
    <p><strong>{{Begrepp A}} = {{kort formel för skillnaden}}</strong></p>
    <p><strong>{{Begrepp B}} = {{kort formel för skillnaden}}</strong></p>
  </div>
</aside>
```

#### Regler

- `<aside>`, inte `<div>` — rutan är sidoordnad texten, inte en del av resonemanget
- Rubriken är `<h3>`
- Brödtexten i rutan är **prosa**, inte punktlista
- `.faktaruta-sammanfattning` är frivillig men rekommenderad — den är det eleven minns
- Kan innehålla formler (DEL 8) och ligga på alla tre nivåerna
- Riktmärke: högst en per underdel. Fler betyder att texten själv behöver skrivas om.

---

## DEL 5 — Komponenter som inte är dokumenterade ännu
**🎨 ÄMNESEGET**

- `kapitel-kort` (kapitelöversikt på startsidor) — ej dokumenterad
- `resurs-kort` (kapitelverktygs-rad) — ej dokumenterad
- Kapitelverktygs-sidor (`kapitelelevbok.html`, `kapitelbegreppsbank.html`,
  `sjalvskattning.html` — inte `kapitelsjalvskattning.html` som LEVERANSGUIDE DEL 2 säger;
  Historia använder `sjalvskattning.html` och kemi följer verkligheten) — separat dokumentation
- **`faktaruta`** — se DEL 4.6, beställd men ej byggd
- **Klickbara begreppsord i löptext** — se DEL 12, plattformsfråga, ej kemibygge

Vid första felmönster: logga som Typ C-ändring i `PLATTFORMS-ANDRINGAR.md`.

---

## DEL 6 — Process när nya komponenter behöver dokumenteras
**🔗 DELAD**

### Verifieringskrav

Innan en komponent dokumenteras **måste minst fyra källor stämma**:

1. **HTML** från referensimplementationen
2. **CSS-regler i `css/kemi.css`** (vad som faktiskt stilsätts)
3. **JS-tillstånd** (vad `avsnitt.js` och andra moduler förväntar sig)
4. **Renderad visuell verifiering i headless Chromium**

Om HTML och CSS är internt motstridiga: **CSS vinner.**

> **Verifiera i headless Chromium — inte node-harness.** Node-harness gav flera falska gröna
> bockar i matematikbygget. Per-item browser-verifierade rapporter.

### Steg

1. Innehållssession eller Code stöter på en odokumenterad komponent
2. **Frågar Joachim istället för att gissa**
3. Joachim ger HTML-fragment från referensimplementation
4. Ramverks-chatten verifierar mot CSS + JS + rendering
5. Komponenten läggs till i denna fil
6. Loggas i `PLATTFORMS-ANDRINGAR.md` som Typ C-ändring

---

## DEL 7 — Föreläsnings-komponenten
**🔗 DELAD**

Ärvs oförändrat från geografi v1.6. Sammanfattat:

- Föreläsning är **alltid första fliken**
- `<div class="forelasningar-lista">` är **tom** — JS fyller på från JSON
- **Ingen statisk HTML** för föreläsningskort
- Flikknappen sätts **disabled** av JS när ingen föreläsning matchar avsnittet

### JSON-schema (`data/forelasningar.json`)

En central fil per kapitel: `kapitel/{kapitel}/data/forelasningar.json`

```json
{
  "delkapitel": "{kapitel-id}",
  "forelasningar": [
    {
      "id": "f_{kortord}",
      "avsnitt_id": "a{N}_{slug}",
      "titel": "{Titel som visas i kortet}",
      "youtube_id": "{id-delen ur youtu.be/<id>}",
      "langd": "14:02"
    }
  ]
}
```

| Fält | Krävs | Beskrivning |
|---|---|---|
| `delkapitel` (rot) | ✅ | Kapitel-id, samma som mappnamn |
| `forelasningar[]` | ✅ | Lista över alla föreläsningar |
| `id` | ✅ | Stabilt id — `f_{kortord}` |
| `avsnitt_id` | ✅ | Matchar `AVSNITT_ID` i avsnitts-HTML |
| `titel` | ✅ | Titel som visas på kortet |
| `youtube_id` | ✅ | **Bara id-delen**, inte hela URL:en |
| `langd` | ❌ | Frivillig text |

**Ignoreras av plattformen:** `beskrivning`, `thumbnail`, `varaktighet`, `kategori`, `taggar`.

---

## DEL 8 — Formler och notation
**🎨 ÄMNESEGET — kemins tekniska kärna**

Detta är det beslut som allt formeltungt innehåll hänger på. **Lös renderingen först,
författa sen.**

### 8.1 Tre sorters notation — INTE en

Kemitext innehåller tre olika saker som ser likadana ut men hanteras olika. Förväxlas de
MathJax-renderas varenda `dm³` i boken.

| Sort | Exempel | Hantering |
|---|---|---|
| **Reaktioner och joner** | H₃O⁺ + OH⁻ → 2 H₂O | `\ce{}` via mhchem |
| **Matematiska uttryck** | 1 · 10⁻⁷ mol/dm³ | Vanlig MathJax (`\(...\)`) — mhchem hanterar inte potenser |
| **Enheter i löptext** | mol/dm³, °C, pH 7 | **Unicode rakt av, ingen rendering** |

Den tredje raden är den viktigaste. Enheter förekommer i var tredje mening; att rendera
varje förekomst vore absurt och långsamt.

### 8.2 Joachim skriver Unicode — Claude konverterar

**Joachim skriver formler i Unicode i löptexten**, fetstilt, som han alltid gjort:

```
H₃O⁺ + OH⁻ → 2 H₂O
```

**Claude konverterar vid bearbetning** till `\ce{}`:

```
\ce{H3O+ + OH- -> 2 H2O}
\ce{HCl + H2O -> H3O+ + Cl-}
\ce{H2SO4 + 2 NaOH -> Na2SO4 + 2 H2O}
\ce{2 HCl + Ca(OH)2 -> CaCl2 + 2 H2O}
```

> ⚠️ **HÅRD REGEL: ingen text går vidare till Code med Unicode-formler kvar.**
> Går en text förbi konverteringen hamnar H₃O⁺ i HTML som tecken, renderas aldrig, och ser
> *nästan* rätt ut. Det är den värsta sortens fel — det upptäcks sent, i klassrummet.

Detta är ett medvetet val: att tvinga Joachim att skriva `\ce{}` skulle göra varje text
långsammare att skriva och svårare att korrekturläsa. Konverteringen ligger där den kostar
minst.

### 8.3 Markup i sidan

Formel i löptext (inline):

```html
<p>En oxoniumjon reagerar med en hydroxidjon och bildar två vattenmolekyler:
\(\ce{H3O+ + OH- -> 2 H2O}\)</p>
```

Fristående formel (display):

```html
<div class="formel">\[\ce{H2SO4 + 2 NaOH -> Na2SO4 + 2 H2O}\]</div>
```

### 8.4 Strukturformler = BILDER, inte rendering

Kolkedjor, ringar och bindningar i organisk kemi **renderas inte**. De skapas som bilder via
Joachims prompter i ChatGPT och läggs in som bilder.

**Code ritar aldrig kolkedjor.**

En strukturformel är **notation, inte illustration** — samma sorts innehåll som `\ce{}`, bara
levererad som bild av tekniska skäl. Den förenklar inte; den *är* sakinnehållet. Därför är
den tillåten på alla tre nivåerna, inklusive fördjupning (DEL 3.4).

```html
<figure class="strukturformel">
  <img src="img/{{tema}}/{{namn}}.webp" alt="{{Strukturformel för X — beskriv bindningar och atomer}}">
  <figcaption>{{Namn på föreningen}}</figcaption>
</figure>
```

Egen klass, inte `brodtext-bild` — så att skillnaden syns i markupen.

### 8.5 Krav till Code — MathJax-uppsättning

**Tre krav, alla måste verifieras:**

1. **mhchem-tillägget laddat.** Utan det renderas `\ce{}` inte alls.

2. **Självhostad fil — inte CDN.** Plattformens regel är att allt hostas själv. Samma sorts
   fel som Google Fonts-läckan i åk7. MathJax laddas från `js/mathjax/`, inte från
   `cdn.jsdelivr.net` eller motsvarande. Skäl: långsamt på Chromebooks, och trasigt om
   skolans nät blockerar.

3. **Omkörning efter att flipcards renderat.** MathJax läser sidan **en gång**, vid laddning.
   Flipcards ritas av JS **efteråt** — de finns inte när MathJax tittar. Ett kort med en
   formel visar då rå text: `\ce{H2SO4 + 2 NaOH -> Na2SO4 + 2 H2O}`.
   `flipcards.js` måste därför anropa MathJax på nytt när korten är klara.

**Verifiering i headless Chromium krävs på båda fallen:**
- en formel i löptext
- en formel på ett flipcard

**Felsymptom för Joachim:** om något gått fel står formeln som `\ce{...}` i stället för som
formel. Det syns direkt.

---

## DEL 9 — Färgkonvention för bilder
**🎨 ÄMNESEGET**

Bilderna promptas individuellt — de spänner från elektronskal till reaktionsförlopp, och en
gemensam promptmall skulle bli så vag att den inte styr något. **Ingen promptstandard.**

Men **atomer ska ha samma färg genom hela boken.** Ritas väte vitt i ett område och grönt i
ett annat lär sig eleven ingenting av färgen — den blir brus. Med konsekventa färger börjar
eleven läsa bilderna innan hen läst texten.

Detta är en **uppslagstabell**, inte en mall: plocka de rader som gäller och klistra in i
prompten.

### 9.0 Bakgrund: kontrastfärg som nycklas bort (v1.3)

Bildens bakgrund på sidan ska vara **transparent** (se 4.2). **Nya AI-bilder promptas med en ren
kontrastfärg som bakgrund — `#00ff00` — som nycklas bort förlustfritt före leverans.** Motivet
får aldrig innehålla den färgen. Skälet att inte be generatorn om "transparent" direkt är att
resultatet ofta blir falsk transparens (ett inmålat rutmönster) eller en benvit ton som inte går
att skilja från vita motiv.

**De elva befintliga AI-bilderna** (repetition: atommodell-litium, attrahera-repellera,
enkel-dubbel-trippel, grundamne-forening, is-och-vatten, jon-loses-i-vatten, litium-atom-och-jon,
mattad-losning, metallbindning, polart-och-opolart; syror: stark-och-svag-syra) har **benvit
bakgrund** (`#f0e8d5`, brusig ±4 per kanal). De ligger på dagens `--paper` och lämnas som de är.
Ska de någon gång ligga på annan bakgrund — ett kort, ett ändrat `--paper` — behöver de göras om
enligt regeln ovan; efterhandsnyckling ger halos och nycklar bort vita motiv (verifierat i
Chromium 2026-09-13). Det är inte aktuellt nu.

### 9.1 Grundämnen — CPK-standard

CPK är den färgstandard molekylmodeller och läromedel använder. Skälet att inte hitta på
egna: eleven möter samma färger i fysiska molekylbyggsatser, i läroböcker och i allt hen
googlar. Egna färger skulle göra just den här boken avvikande.

| Ämne | Färg | Hex |
|---|---|---|
| Väte (H) | Vit | `#FFFFFF` |
| Kol (C) | Mörkgrå/svart | `#303030` |
| Kväve (N) | Blå | `#3050F8` |
| Syre (O) | Röd | `#FF0D0D` |
| Svavel (S) | Gul | `#FFFF30` |
| Klor (Cl) | Grön | `#1FF01F` |
| Fosfor (P) | Orange | `#FF8000` |
| Natrium (Na) | Violett | `#AB5CF2` |
| Kalium (K) | Violett, mörkare | `#8F40D4` |
| Kalcium (Ca) | Mörkgrön | `#3DFF00` |
| Magnesium (Mg) | Grön | `#8AFF00` |
| Järn (Fe) | Orangebrun | `#E06633` |
| Koppar (Cu) | Kopparbrun | `#C88033` |
| Zink (Zn) | Blågrå | `#7D80B0` |
| Aluminium (Al) | Ljusgrå | `#BFA6A6` |
| Brom (Br) | Mörkröd | `#A62929` |
| Jod (I) | Mörkviolett | `#940094` |

> **Att bekräfta:** flera CPK-färger är skrikiga på skärm (klor `#1FF01F`, kalcium `#3DFF00`).
> Mot bokens pappersbakgrund kan de behöva dämpas något. Dämpning ska i så fall göras
> **konsekvent för alla ämnen samtidigt**, inte ad hoc per bild.

### 9.2 Laddning och elektroner — förslag, ej låst

CPK täcker inte laddning och elektroner. De är pedagogiskt de viktigaste, eftersom de är
osynliga i verkligheten och eleven bara har bilden att gå på.

> **Status: förslag att bekräfta av Joachim.** Detta diskuterades i princip
> (symbol + färg, gråskalesäkert) men inte i detalj.

**Laddning** får inte bäras av färg ensam — eleven ska se skillnaden även i gråskala eller
med färgseendebrist. **Symbol plus färg**, där symbolen (`+` / `−`) är det som bär:

- Positiv jon: tydligt `+` i en badge
- Negativ jon: tydligt `−` i en badge

> ⚠️ **Kollisionsrisk att lösa:** det naturliga vore röd för positiv och blå för negativ —
> men röd är syre och blå är kväve i CPK. En jonbild skulle få två betydelser för samma färg.
> Badgen bör därför ha en egen, neutral färgvärld (t.ex. grå/vit badge med svart tecken),
> eller placeras utanför atomsymbolen.

**Elektroner** behöver en konsekvent framtoning så att en elektron som flyttar ser likadan ut
i alla områden. Gul är upptaget av svavel — förslag: ljus blågrå prick med `−`.

---

## DEL 10 — Öva-fliken: tre arbetssätt, flipcards och kortsvar
**🔗 flikrad och flipcards.js / 🎨 arbetssättsväljare, kortsvar, korttyper**

### Tre arbetssätt utan inbördes ordning (v1.2)

Öva-fliken visar en **arbetssättsväljare** (`.ova-valjare`, tre `.ova-kort`) i stället för
flipcards.js egen startskärm:

| Arbetssätt | `data-arbetssatt` | Vad som startar |
|---|---|---|
| Plugga begrepp | `begrepp` | flipcards, läge Nivå 1 (begreppskort) |
| Testa dig själv | `kortsvar` | `js/kortsvar.js` – kortsvar med omedelbar rättning |
| Tillämpa | `tillampa` | flipcards, läge Nivå 2 (modellkort) |

**Den delade `flipcards.js` är orörd.** `js/ova-arbetssatt.js` är ett lager ovanpå: den döljer
plattformens startskärm (CSS i kemi.css sektion 8), markerar rätt radioknapp och klickar
"Börja plugga" åt eleven, och visar väljaren igen när flipcards återvänder till sin startskärm
("Plugga igen"/"Avsluta"). Lägena Nivå 3 (redogörelsekort) och Anpassa döljs i lägesmenyn.

Detta är ett **kemi-eget lager** byggt fristående från kemi (inget i koden är kemispecifikt),
placerat i kemi tills klassrummet visat om det fungerar. Blir det bra lyfts det till plattformen;
blir det fel kastas det. 🔵-loggat 2026-09-13.

### Kortsvar – Testa dig själv

`<div class="kortsvar-mount" data-fil="../../data/kortsvar/avsnitt-N-{slug}.json">`. Fasta
frågor med facit, `antal_per_omgang` slumpade per omgång, en fråga i taget. Rätt → bekräftelse.
Fel → facit + `forklaring` **direkt** (en elev som får veta varför efter tolv frågor minns inte
vad hon svarade). Alla rätt → belöning. **Formativt: inget sparas** – ingen progress, ingen mastery.

Rättningen (`js/kortsvar-gradering.js`, ren funktion, Node-testad med `verktyg/test-gradering.js`)
är portad ur matematikbokens provbyggare (numeric/binary/markera/ordsvar/talfoljd) och utökad
med `formel` (Unicode-index och laddningar normaliseras: H₂O = H2O, SO₄²⁻ = SO4^2-),
tolerans, enhet och alternativa svar. `ord` är skiftlägesokänslig (Jon = jon); `formel` är **skiftlägeskänslig** (CO ≠ Co); ett svar som
är rätt bortsett från skiftläge räknas som fel men får en egen förklaring om stor bokstav först.

Leveransschemat för kortsvarsfiler står i `LEVERANSGUIDE-KEMI-TILLAGG.md` §8. Kemi har **inte**
matematikbokens övningsmotor (inventerad 2026-09-13: generatorbaserad, ramberoende – bara
graderaren återanvändes).

### Flipcards

Flipcards är det eleverna kommer använda mest i kemi.

### Fråga och svar — inget skrivande

**Kemins flipcards är rena fråga/svar-kort.** Ingen skrivyta, ingen inmatning från eleven.
Eleven läser frågan, tänker, vänder kortet.

(Skrivandet lever i Elevboken, som är en egen flik med egen filosofi.)

### Korttyper

Plattformen har tre: `begreppskort`, `modellkort`, `redogörelsekort`.

Kemi har ett fjärde behov: **formelkort** — *den här formeln, vad betyder den?* Ett kort med
`\ce{H2SO4 + 2 NaOH -> Na2SO4 + 2 H2O}` på framsidan.

Det kan tekniskt vara ett `modellkort`, men **bara om formelrenderingen fungerar inuti
flipcards** — se DEL 8.5, krav 3. Flipcards ritas av JS efter sidladdning, så MathJax måste
köras om. Utan det står `\ce{}` som rå text på kortet.

> **Samma fälla som Unicode-formlerna: det ser nästan rätt ut, och det upptäcks sent.**

### Begreppsbanken

Konventionen är att begreppsbanken härleds **1:1 ur flipcardsens `begreppskort`-id:n**, med
`kallfil` som enda sanningskälla. Kemins begrepp är många och täta — den kopplingen kommer
bära mer vikt här än i geografi. Skapa aldrig en definition på två ställen.

---

## DEL 11 — Arbetsmodell och leveransflöde
**🎨 ÄMNESEGET**

### Vem gör vad

| Steg | Vem |
|---|---|
| Standardtexten | **Joachim** skriver |
| Enkel-varianten | **Claude** skapar ur standardtexten |
| Fördjupningen | **Joachim** (ur klassrumsbehov) eller **Claude föreslår** — se DEL 2.4 |
| Djupdykningsuppslag | **Claude** föreslår |
| Formelkonvertering Unicode → `\ce{}` | **Claude** |
| Bilder | **Joachim** (prompt → ChatGPT) |
| Sidbygge | **Code** |

### Röst och bearbetning

**Standardtexten är Joachims röst.** Claude bevarar den.

**Fördjupningen är också Joachims röst** när han skrivit den — till skillnad från i historia,
där fördjupningen var Claudes produkt ur standardtexten. I kemi utgår fördjupningen från ett
klassrumsbehov, inte från standardtexten. Claudes roll är därför stram: **stryka, strama åt,
fånga kemiska fel, konvertera formler — aldrig skriva om meningar för att de låter bättre.**

### Produktionsordning per avsnitt

1. Joachim skriver standardtexten (Unicode-formler)
2. Claude konverterar formler, gör Enkel-varianten, föreslår djupdykningar
3. Code bygger sidan
4. **Fördjupningen kommer när den kommer** — efter att Joachim undervisat

Punkt 4 betyder att ett avsnitt kan stå färdigt och publicerat med tom fördjupningsnivå.
Se plattformskravet i DEL 2.4.

### Mall-och-propagera

Bygg **Syror och baser** som *en* komplett enhet — ett delkapitel, alla nivåer,
formelrendering, föreläsning. Verifiera mot Joachims öga. **Propagera först därefter.**

---

## DEL 12 — Framtida: klickbara begreppsord
**Ej kemibygge — plattformsfråga**

Elever i NO-ämnena har svårt att **packa upp text**. Ett ord eleven tappat stoppar hela
meningen. Klickbara begreppsord i löptexten — klicka, få förklaringen, stanna kvar i
meningen — löser det på ett sätt faktarutan inte gör: rutan hjälper bara där en ruta råkar
ligga, klickbara ord hjälper i varje mening.

**Varför det inte byggs nu, och inte i kemi:**

1. **Plattformen har det halvvägs redan.** Begreppsbanken och flipcardsens `begreppskort`
   innehåller exakt dessa förklaringar, med `kallfil` som enda sanningskälla. Ett klickbart
   ord ska hämta därifrån — inte ha egna definitioner. Byggs det med egen text får plattformen
   två uppsättningar förklaringar som glider isär.

2. **Det rör alla ämnen**, inte bara kemi. Hör hemma i lärplattformens spår.

**Sparsamhet är ett designkrav, inte en tumregel.** Varje markerat ord känns motiverat när
man skriver det; utan spärr blir texten tät, och eleven slutar läsa meningar och börjar
klicka sig igenom. Två regler gör sparsamheten självbevakande när komponenten byggs:

- **Ett ord markeras en gång per avsnitt** — inte vid varje förekomst
- **Tak per underdel: 3–4 ord.** Blir det fler är det inte ett ordproblem, det är att texten
  behöver skrivas om.

---

## Bilagor — referensimplementationer
**🎨 boklokal**

- **Ärvd bas:** `KOMPONENTER-INNEHALL-GEOGRAFI.md` v1.6 (2026-07-03)
- **Scaffold-struktur:** Geografis DEL 4.5 (DOM-verifierad hero-banner) + Historias sökvägsdjup
- **Mappstruktur:** Historiabokens `kapitel/{k}/delkapitel/{dk}/`
- **Pilotenhet:** Syror och baser (första delkapitlet)

**CSS-referens:** `css/kemi.css` — denna fil avgör vad som faktiskt renderas.
**JS-referens:** `js/avsnitt.js` + `js/flipcards.js` + `js/forelasningar.js`.

När osäker — kolla referensimplementationen **plus** CSS:n **plus** JS:n. **Gissa aldrig.**

---

## Öppna punkter — kräver beslut eller verifiering

| # | Punkt | Vem |
|---|---|---|
| 1 | `faktaruta` — CSS byggs, verifieras (DEL 4.6) | Code |
| 2 | Disabled fördjupningsknapp vid tom nivå (DEL 2.4) | Code |
| 3 | MathJax självhostad + mhchem + omkörning efter flipcards (DEL 8.5) | Code |
| 4 | Exakt data-sökväg för flipcards-JSON (DEL 0) | Code |
| 5 | Laddnings- och elektronfärger — förslag att bekräfta (DEL 9.2) | Joachim |
| 6 | Dämpning av skrikiga CPK-färger mot pappersbakgrund (DEL 9.1) | Joachim |
| 7 | Rad om splittrad DEL 3 in i geografis och historias dokument | Ramverks-chatt |

---

## Revisionshistorik
**🎨 boklokal**

- **v1.3 (2026-09-13):** 4.2 – ingen ram på brödtextbilder i kemi (kemi.css), bildbakgrund ska
  vara transparent; 9.0 – nya AI-bilder promptas med `#00ff00` som nycklas bort före leverans;
  de elva befintliga har benvit bakgrund och görs om först om de ska ligga på annan bakgrund.
- **v1.2 (2026-09-13):** Öva-fliken får tre arbetssätt (Plugga begrepp / Testa dig själv /
  Tillämpa) via kemi-eget lager `js/ova-arbetssatt.js` ovanpå orörd flipcards.js, och den nya
  komponenten kortsvar (`js/kortsvar.js` + `js/kortsvar-gradering.js`). Scaffoldens Öva-panel
  och skriptlista uppdaterade (DEL 1), DEL 10 omskriven. Kemi-eget, kandidat till plattform.
- **v1.1 (2026-09-12):** Rättningar efter pilotbygget (Code, beslut av Joachim). Kärnpunkter- och
  bildguide-rubriken i scaffolden och DEL 4.3/4.4 är `<div class="…-rubrik">`, inte `<h3>` — `<h3>`
  träffas av `.brodtext h3` och renderas som mellanrubrik. Självskattningssidan heter
  `sjalvskattning.html` (DEL 5), som i Historia. Inga komponenter ändrade; DELAD-BAS oförändrad.
- **v1.0 (2026-09-12):** Första versionen. Ärvd från Geografi v1.6, DELAD-BAS v1.1 oförändrad.
  Kemispecifikt tillagt: fyra-nivåers mappstruktur med historias djup (DEL 0), signaturfärg
  `#5a9668`, kemins fördjupningsnivå som sannare modell med obligatorisk modellplacering
  (DEL 2.4), splittrad DEL 3 med bild tillåten i fördjupning (DEL 3.4), `faktaruta` som ny
  komponent (DEL 4.6), formler och tredelad notation (DEL 8), CPK-färgkonvention (DEL 9),
  flipcards som fråga/svar (DEL 10), arbetsmodell (DEL 11), klickbara begreppsord som
  framtida plattformsfråga (DEL 12). Geografis inaktuella ljusa header-scaffold **ej ärvd** —
  kemi har en scaffold.
