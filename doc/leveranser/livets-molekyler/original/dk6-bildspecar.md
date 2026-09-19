# Bildspecar — delkapitel 6 "Livets molekyler"

Tolv bilder.

## Kontrollräkning, båda hållen

| Avsnitt | Underdelar | Bilder |
|---|---|---|
| 1 Kolhydrater | 3 | 4 (M1–M4) |
| 2 Fetter | 3 | 2 (M5–M6) |
| 3 Proteiner | 3 | 4 (M7–M10) |
| 4 Kvävet, vitaminerna och mineralerna | 3 | 2 (M11–M12) |
| **Summa** | **12** | **12** |

Per typ: **12 SVG + 0 AI = 12.** Båda hållen ger 12.

---

## Gemensamt

Platt stil. Konturer och text `#2d4a35`, signaturfärg `#5a9668`, papper `#ece2c8`, kol `#3a3a3a`,
väte `#f5f0e4` med kontur, grått `#8A8A8A`, ljusblå vätska `#a8c4d8`, energi `#e8c547`.

**Ritsätt: bokstavsstil**, KOMPONENTER 9.5.

### Tre färgsignaler

Delkapitlet använder tre samtidiga signaler. Det är första gången två atomslag färgkodas i samma
bild.

| Signal | Färg | Betyder | Sedan |
|---|---|---|---|
| Röd atom | `#C0392B` | syre | delkapitel 4 |
| **Blå atom** | `#3D6BA8` | **kväve** | **nytt här** |
| Grön ring | `#5a9668` | funktionell grupp | delkapitel 5 |

**Kvävet är nytt.** Det förekommer bara i avsnitt 3 och 4, och där ska varje kväveatom vara blå.
Dokumentera signalen i `KOMPONENTER-INNEHALL.md` tillsammans med de två tidigare.

**Den gröna ringen** användes i delkapitel 5 om karboxylgruppen. Här utvidgas den till **funktionell
grupp i allmänhet** — karboxylgrupp, aminogrupp och hydroxylgrupp ringas alla in när de är
poängen i bilden. Etiketten vid ringen säger vilken grupp det är.

Filnamn `k6-m1.svg` … `k6-m12.svg`.

---

## Den viktigaste designregeln i delkapitlet

**M3, M7 och L9 i delkapitel 5 ska ha identisk uppställning.**

De visar samma reaktionstyp i tre sammanhang: esterbindning, glykosidbindning och peptidbindning.
Om eleven ska se mönstret måste bilderna se likadana ut.

**Kraven:**

- Samma antal steg, i samma ordning, med samma stegetiketter.
- Samma placering av de två utgångsämnena — det som lämnar OH till vänster, det som lämnar H till
  höger.
- Samma gula markering `#e8c547` på de delar som ska lämna.
- Samma ruta för vattenmolekylen, på samma plats.
- Samma grön markering på den nya bindningen i sista steget.
- Samma bildbredd och samma höjd per steg.

**Kontrollera detta programmatiskt** genom att jämföra de tre filernas koordinater och etiketter.
Skiljer sig något annat än molekylerna själva är det ett fel.

Om L9 behöver justeras för att de tre ska bli lika, gör det — och bygg om delkapitel 5. Säg till
innan, så att jag vet.

---

# Avsnitt 1 — Kolhydrater

## M1 — Glukos, fullständigt och förenklat
*1.1, vid tredje rubriken*

Två ritningar av samma molekyl, sida vid sida.

**Vänster: fullständig strukturformel.** Glukosringen med alla atomer utskrivna — sex kolatomer,
tolv väteatomer, sex syreatomer, alla bindningar ritade.

Etikett under: **fullständig strukturformel**, och: *korrekt men svårläst*.

**Höger: förenklad.** Sexhörning. Fem hörn är kolatomer, ett är en **syreatom i `#C0392B`**. Från
kolatomerna sticker OH-grupper ut, syret rött. Den sjätte kolatomen med sin OH-grupp sitter utanför
ringen, uppe till vänster.

Väteatomer som sitter på kol ritas inte.

Etikett under: **förenklad strukturformel**, och: *visar formen och grupperna*.

**En pil mellan** med texten *samma molekyl*.

**Vid den högra ringens syreatom** en utpekning: *ringens enda syreatom*.

**Kontroller:** vänstra bilden 6 C, 12 H, 6 O. Högra bilden: ringen har fem kolatomer och en
syreatom, alltså sex hörn. Fem OH-grupper totalt. Den sjätte kolatomen utanför ringen.

**Alt:** Glukos ritad på två sätt. Till vänster fullständigt med alla atomer, till höger förenklat
som en sexhörning där ett hörn är en röd syreatom och OH-grupper sticker ut.

**Bildtext Enkel:** Samma molekyl två gånger. Den högra är lättare att läsa.

**Bildtext Standard:** Den förenklade formeln visar det viktigaste — ringens form och var
grupperna sitter.

**Titta efter (endast Enkel):**
- Hitta den röda syreatomen i ringen till höger.
- Hur många hörn har sexhörningen, och vad är varje hörn?
- Vilken kolatom sitter utanför ringen?

---

## M2 — Tre sockerarter med samma formel
*1.1, vid fjärde rubriken*

Tre ringar i rad, alla förenklat ritade.

| Position | Ämne | Ringform | Antal hörn |
|---|---|---|---|
| Vänster | glukos | sexhörning | 6 |
| Mitten | galaktos | sexhörning | 6 |
| Höger | fruktos | femhörning | 5 |

**Alla ringars syreatom i `#C0392B`.** Alla OH-grupper utritade med rött syre.

**Under varje ring** namnet och formeln **C₆H₁₂O₆** — identisk under alla tre.

**Skillnaden mellan glukos och galaktos:** en enda OH-grupp pekar åt olika håll. Markera **just
den** OH-gruppen i båda med en tunn ring i signaturfärg och en utpekning: *enda skillnaden*.

**Under hela raden:** *samma formel, tre olika ämnen — de är isomerer*.

**Kontroller:** alla tre har 6 C, 12 H, 6 O. Fruktosens ring har fem hörn, de andra sex. Den
markerade OH-gruppen sitter på samma kolatom i glukos och galaktos men pekar åt olika håll.

**Alt:** Tre sockerringar. Glukos och galaktos som sexhörningar, fruktos som femhörning. Under
alla tre står samma formel C₆H₁₂O₆.

**Bildtext Enkel:** Samma atomer i alla tre. Ändå är det tre olika ämnen.

**Bildtext Standard:** Glukos, fruktos och galaktos är isomerer — samma molekylformel, olika
struktur.

**Titta efter (endast Enkel):**
- Räkna hörnen i varje ring.
- Jämför de två inringade OH-grupperna. Vad är skillnaden?
- Vad står under alla tre ringarna?

---

## M3 — Två sockerringar kopplas ihop
*1.2, vid första rubriken*

**Följ den gemensamma uppställningen.** Se avsnittet ovan.

Tre steg.

**Steg 1 — utgångsämnena.** Två glukosringar med tydligt mellanrum. Den vänstra har en **OH-grupp**
markerad i `#e8c547`. Den högra har ett **H** på en OH-grupp markerat i samma färg.

Etikett: *dessa två lämnar*.

**Steg 2 — vattnet lämnar.** De gulmarkerade delarna har lyfts ut och sitter i en egen ruta som
bildar **H₂O**, med en pil ut ur bilden. Kvar i ringarna: två lediga bindningar.

Etikett: *OH från den ena och H från den andra bildar vatten*.

**Steg 3 — bindningen.** De två ringarna sitter ihop via en syreatom i `#C0392B`. Bindningen
markeras med grön ring och etiketten **glykosidbindning**.

Molekylen som bildats är **maltos**.

**Under hela bilden:** *två monosackarider ⇌ en disackarid + vatten*.

**Kontroller:** båda ringarna 6 C, 12 H, 6 O i steg 1. Produkten i steg 3: 12 C, 22 H, 11 O. Vattnet
2 H, 1 O. Atombalans: 2 × (6,12,6) = (12,22,11) + (0,2,1).

**Alt:** Två glukosringar kopplas ihop i tre steg. Först är en OH-grupp och en väteatom markerade,
sedan bildar de en vattenmolekyl som lämnar, och sist sitter ringarna ihop med en glykosidbindning.

**Bildtext Enkel:** Följ de gula delarna. De blir en vattenmolekyl, och ringarna sitter ihop.

**Bildtext Standard:** Samma reaktionstyp som esterbildningen — två molekyler kopplas ihop och
vatten lämnar.

**Titta efter (endast Enkel):**
- Vilken ring lämnar OH, och vilken lämnar H?
- Vad bildas av de två gula delarna?
- Jämför med bilden av esterbildningen i förra delkapitlet. Vad är likadant?

---

## M4 — Stärkelse och cellulosa
*1.3, vid andra rubriken*

**Delkapitlets viktigaste bild efter M3.** Vändningen måste synas omedelbart.

Två kedjor under varandra, fyra glukosringar i varje.

**Övre: stärkelse.** Alla fyra ringar vända **åt samma håll**. Ringarnas syreatomer ligger alla i
samma position, uppåt. Kedjan ritas med en svag böjning.

Etikett: **stärkelse** — *alla ringar åt samma håll*.

**Nedre: cellulosa.** Varannan ring **vänd ett halvt varv**. Ringarnas syreatomer ligger omväxlande
uppåt och nedåt. Kedjan ritas helt rak.

Etikett: **cellulosa** — *varannan ring vänd*.

**Det som gör vändningen synlig:** i varje ring markeras syreatomen i `#C0392B` **och** en av
OH-grupperna i signaturfärg. I stärkelsen ligger de gröna markeringarna på rad. I cellulosan
växlar de upp och ner.

Eleven ska kunna se skillnaden utan att läsa etiketten.

**Under nedre kedjan:** tre streckade lodräta linjer som visar var vätebindningar till nästa kedja
skulle sitta, med etiketten *kedjorna kan ligga tätt*.

**Kontroller:** fyra ringar i varje kedja. I stärkelsen har alla fyra syreatomen i samma position.
I cellulosan växlar den. De gröna markeringarna följer samma mönster.

**Alt:** Två kedjor av fyra sockerringar. I den övre är alla ringar vända åt samma håll. I den
nedre är varannan ring vänd ett halvt varv, och kedjan blir rakare.

**Bildtext Enkel:** Samma byggsten i båda. Titta på hur ringarna är vända.

**Bildtext Standard:** Vändningen av varannan glukosenhet är hela skillnaden mellan stärkelse och
cellulosa.

**Titta efter (endast Enkel):**
- Var sitter den röda syreatomen i varje ring? Följ den längs båda kedjorna.
- Vilken kedja är rakast?
- Varför kan amylas bryta den ena men inte den andra?

---

# Avsnitt 2 — Fetter

## M5 — Fettmolekylen
*2.1, vid första rubriken*

**Ny bild.** Den ersätter återanvändningen av L10 från delkapitel 5, som inte går att lita på
över delkapitelgränser.

**Skillnad mot L10:** L10 visade att fettet är en ester. M5 visar **vad fettet består av**, med
tonvikt på att de tre fettsyrorna är olika.

**Till vänster:** glycerolen, tre kolatomer, tre syreatomer i `#C0392B`, med de tre bindningarna ut
åt höger.

**Till höger:** tre fettsyror som sicksacklinjer av **olika längd** — förslagsvis 12, 16 och 18
kolatomer, ritade i proportion. Vid varje fettsyras början en karboxylgrupp, inringad i grönt.

**Den mellersta fettsyran ritas med en knyck**, de två andra raka. Det förbereder M6 utan att
förklara något.

**De tre esterbindningarna** markeras med grön ring var, gemensam etikett **tre esterbindningar**.

**Under bilden:** *glycerol + tre fettsyror → fett + tre vattenmolekyler*.

**Kontroller:** tre esterbindningar, tre ringar. Glycerolen har tre kolatomer och tre syreatomer.
De tre fettsyrorna har olika antal kolatomer, och antalet ska stämma med etiketterna.

**Alt:** En fettmolekyl. Till vänster glycerol med tre bindningar ut, till höger tre fettsyror av
olika längd. Den mellersta har en knyck. De tre esterbindningarna är inringade.

**Bildtext Enkel:** Ett fett är glycerol plus tre fettsyror. De tre är sällan lika.

**Bildtext Standard:** Glyceroldelen är alltid densamma. Det är fettsyrorna som varierar.

**Titta efter (endast Enkel):**
- Räkna de gröna ringarna vid glycerolen.
- Är de tre fettsyrorna lika långa?
- En av dem ser annorlunda ut. Vilken, och hur?

---

## M6 — Raka och knyckiga kedjor
*2.2, vid andra rubriken*

Två paneler sida vid sida, med samma antal kedjor i varje.

**Vänster — mättade fettsyror.** Sex raka sicksackkedjor, parallella och **tätt packade**. Mellan
dem korta streckade linjer i `#8A8A8A` som markerar van der Waals-krafter — många, jämnt fördelade
längs hela längden.

Etikett: **mättade** — *raka kedjor, packas tätt*. Under: **fast vid rumstemperatur**.

**Höger — omättade fettsyror.** Sex kedjor med **en knyck var**, på ungefär samma ställe. De kan
inte ligga parallellt och lämnar tydliga mellanrum. Färre streckade linjer, och bara där kedjorna
råkar komma nära.

Vid varje knyck en liten markering: dubbelbindningen ritad som två streck i signaturfärg.

Etikett: **omättade** — *knyckiga kedjor, packas glest*. Under: **flytande vid rumstemperatur**.

**Under båda panelerna:** *fler kontaktpunkter betyder starkare attraktion och högre smältpunkt*.

**Kontroller:** sex kedjor i varje panel. Antalet streckade attraktionslinjer ska vara tydligt
fler i vänstra panelen — förslagsvis minst dubbelt så många. Varje knyck ska ha en dubbelbindning
markerad.

**Alt:** Till vänster sex raka fettsyrekedjor som ligger tätt packade med många attraktionslinjer
mellan sig. Till höger sex kedjor med en knyck var, som inte kan packas lika tätt och har färre
attraktionslinjer.

**Bildtext Enkel:** Raka kedjor ligger tätt. Knyckiga gör det inte.

**Bildtext Standard:** Ju fler kontaktpunkter mellan kedjorna, desto starkare hålls molekylerna
ihop och desto högre blir smältpunkten.

**Titta efter (endast Enkel):**
- Räkna de streckade linjerna i varje panel.
- Var sitter knyckarna, och vad har de gemensamt?
- Vilken panel skulle vara svårast att pressa ihop?

---

# Avsnitt 3 — Proteiner

## M7 — Två aminosyror kopplas ihop
*3.2, vid första rubriken*

**Följ den gemensamma uppställningen.** Se avsnittet högst upp. Denna bild och M3 och L9 ska vara
identiska i allt utom molekylerna.

Tre steg.

**Steg 1 — utgångsämnena.** Två aminosyror med tydligt mellanrum.

Den **vänstra** har sin **karboxylgrupp** vänd åt höger, och dess **OH** markerad i `#e8c547`.
Karboxylgruppen inringad i grönt, syreatomerna röda.

Den **högra** har sin **aminogrupp** vänd åt vänster, och ett av dess **H** markerat i `#e8c547`.
Aminogruppen inringad i grönt, **kväveatomen blå `#3D6BA8`**.

Båda har sin sidokedja ritad som en ruta märkt **R**.

Etikett: *dessa två lämnar*.

**Steg 2 — vattnet lämnar.** De gulmarkerade delarna sitter i en egen ruta som bildar **H₂O**, med
pil ut. Två lediga bindningar kvar.

**Steg 3 — bindningen.** De två aminosyrorna sitter ihop. Bindningen mellan karboxylgruppens
kolatom och aminogruppens kväveatom markeras med grön ring och etiketten **peptidbindning**.

**Under hela bilden:** *aminosyra + aminosyra ⇌ peptid + vatten*.

**Kontroller:** kväveatomerna blå i alla tre stegen. Syreatomerna röda. Det som lämnar den vänstra
är **OH**, det som lämnar den högra är **H** — programmatiskt kontrollerat, som i L9. Varje
kolatom har fyra bindningar.

**Alt:** Två aminosyror kopplas ihop i tre steg. Den vänstra lämnar en OH-grupp från sin
karboxylgrupp, den högra en väteatom från sin aminogrupp. De bildar vatten, och kvar blir en
peptidbindning mellan kolatomen och kväveatomen.

**Bildtext Enkel:** Tredje gången samma sak. OH och H lämnar som vatten, och molekylerna sitter
ihop.

**Bildtext Standard:** Karboxylgruppen binder till aminogruppen. Bindningen kallas peptidbindning.

**Titta efter (endast Enkel):**
- Vilken grupp lämnar OH, och vilken lämnar H?
- Vilken färg har kväveatomen?
- Jämför med bilderna av esterbildningen och av sockerringarna. Vad är likadant?

---

## M8 — Aminosyrans uppbyggnad
*3.1, vid tredje rubriken*

En enda aminosyra, stor och centrerad.

**I mitten** en kolatom med **fyra** bindningar, tydligt utritade åt fyra håll:

| Riktning | Vad som sitter där | Markering |
|---|---|---|
| Vänster | **aminogrupp –NH₂** | grön ring, kväve blått |
| Höger | **karboxylgrupp –COOH** | grön ring, syren röda |
| Uppåt | **sidokedja R** | ruta i signaturfärg |
| Nedåt | **väteatom H** | ingen |

**Vid aminogruppen** en utpekning: *kan ta upp en vätejon — basisk*.
**Vid karboxylgruppen** en utpekning: *kan avge en vätejon — sur*.
**Vid sidokedjan** en utpekning: *det enda som skiljer aminosyrorna åt*.

**Under bilden:** *alla tjugo aminosyror ser likadana ut — utom i rutan*.

**Kontroller:** exakt fyra bindningar från mittkolatomen. En kväveatom, blå. Två syreatomer, röda.
Två gröna ringar.

**Alt:** En aminosyra. I mitten en kolatom med fyra bindningar: en aminogrupp till vänster med blå
kväveatom, en karboxylgrupp till höger med röda syreatomer, en sidokedja märkt R uppåt och en
väteatom nedåt.

**Bildtext Enkel:** En syragrupp åt ena hållet, en basgrupp åt det andra. Och en ruta som är olika
för varje aminosyra.

**Bildtext Standard:** Aminosyran har två funktionella grupper samtidigt. Sidokedjan avgör vilken
aminosyra det är.

**Titta efter (endast Enkel):**
- Räkna bindningarna från kolatomen i mitten.
- Vilken grupp är sur, och vilken är basisk?
- Vad står det i rutan, och varför står det just det?

---

## M9 — Från kedja till form
*3.2, vid tredje rubriken*

Tre steg i rad.

**Steg 1 — aminosyror.** Fem lösa aminosyror, ritade schematiskt som små rutor märkta med olika
bokstäver eller färger, alla med samma grundform. Etikett: **tjugo att välja mellan**.

**Steg 2 — kedja.** Samma fem kopplade i en rak rad, med peptidbindningarna markerade i grönt.
Etikett: **polypeptid** — *ordningen bestämmer vilket protein det blir*.

**Steg 3 — veckad form.** Samma kedja, nu vikt till en oregelbunden tredimensionell form. Kedjan
ska gå att följa med ögat från ena änden till den andra.

Vid några ställen i den veckade formen: korta streckade linjer i `#8A8A8A` som visar var sidokedjor
håller ihop veckningen. Etikett: **svaga bindningar håller formen**.

Etikett under: **protein** — *formen avgör funktionen*.

**Kontroller:** exakt fem enheter i alla tre stegen, och de ska ha samma ordning. Kedjan i steg 3
ska vara sammanhängande och följbar.

**Alt:** Tre steg. Först fem lösa aminosyror, sedan samma fem hopkopplade till en rak kedja, sist
kedjan vikt till en tredimensionell form med streckade linjer som visar var den hålls ihop.

**Bildtext Enkel:** Först byggs kedjan. Sedan viks den — och det är formen som gör nytta.

**Bildtext Standard:** Ordningen mellan aminosyrorna bestämmer hur kedjan viks, och veckningen
bestämmer funktionen.

**Titta efter (endast Enkel):**
- Räkna enheterna i varje steg. Är de lika många?
- Följ kedjan med fingret i sista bilden. Går den att följa hela vägen?
- Vad är det de streckade linjerna visar?

---

## M10 — Denaturering
*3.3, vid första rubriken*

Två lägen med en pil emellan.

**Vänster — veckat protein.** Samma form som i M9 steg 3, ritad likadant. Sidokedjornas streckade
bindningar markerade.

Etikett: **fungerar**.

**Pilen** märkt **värme eller ändrat pH**, med två små symboler: en termometer och ett pH-värde.

**Höger — denaturerat protein.** Samma kedja, nu uppveckad och oregelbunden. De streckade
bindningarna är **borta**.

Etikett: **fungerar inte**.

**Det avgörande kravet:** kedjan ska vara **hel och sammanhängande i båda lägena**. Samma antal
enheter, samma ordning, inga avbrott. Ritas den avklippt säger bilden motsatsen till texten.

**Under båda:** **kedjan är hel — det är formen som är borta**.

**En streckad pil tillbaka**, överkryssad, med etiketten *går oftast inte*.

**Kontroller:** samma antal enheter i båda lägena, programmatiskt jämfört. Inga brutna bindningar
i den högra bilden. De streckade sidokedjebindningarna finns bara i den vänstra.

**Alt:** Till vänster ett veckat protein som fungerar, till höger samma kedja uppveckad och utan
form. Kedjan är hel i båda bilderna. En överkryssad pil tillbaka visar att det oftast inte går att
ångra.

**Bildtext Enkel:** Kedjan är hel i båda bilderna. Det som försvunnit är formen.

**Bildtext Standard:** Vid denaturering bryts inte peptidbindningarna. Det är de svaga bindningarna
som håller veckningen som ger vika.

**Titta efter (endast Enkel):**
- Räkna enheterna i båda bilderna. Är de lika många?
- Vad finns i den vänstra bilden som saknas i den högra?
- Varför är pilen tillbaka överkryssad?

---

# Avsnitt 4 — Kvävet, vitaminerna och mineralerna

## M11 — Tre näringsämnen, tre nedbrytningsvägar
*4.1, vid tredje rubriken*

Tre rader, en per näringsämne, alla med samma uppställning.

| Rad | Ämne | Innehåller | Lämnar kroppen som |
|---|---|---|---|
| 1 | kolhydrat | C, H, O | CO₂ och H₂O |
| 2 | fett | C, H, O | CO₂ och H₂O |
| 3 | protein | C, H, O **och N** | CO₂, H₂O **och urea** |

**Atomslagen ritas som färgade cirklar:** kol `#3a3a3a`, väte `#f5f0e4`, syre `#C0392B`, **kväve
`#3D6BA8`**.

**Rad 1 och 2 ser identiska ut.** Rad 3 har en blå cirkel extra, och en tredje pil ut.

**Den tredje pilen** ritas kraftigare och i signaturfärg, med etiketten **urea, CO(NH₂)₂** och
under: *lämnar med urinen*.

**Vid kväveatomen i rad 3** en utpekning: *kan varken bli koldioxid eller vatten*.

**Under hela bilden:** *kvävet behöver en egen väg ut*.

**Kontroller:** rad 1 och 2 ska ha identisk uppställning och lika många pilar. Rad 3 har exakt en
pil mer. Kväveatomen förekommer bara i rad 3, och den är blå.

**Alt:** Tre rader som visar hur kolhydrat, fett och protein bryts ner. De två första ger koldioxid
och vatten. Proteinet innehåller dessutom kväve och ger därför också urea, som lämnar med urinen.

**Bildtext Enkel:** Kol blir koldioxid, väte blir vatten. Men kvävet behöver en egen utväg.

**Bildtext Standard:** Proteinnedbrytningen kräver ett extra steg, eftersom kväve varken kan bli
koldioxid eller vatten.

**Titta efter (endast Enkel):**
- Jämför de tre raderna. Vilken skiljer sig?
- Vilken färg har kväveatomen?
- Hur många pilar går ut från varje rad?

---

## M12 — Fem grupper jämförda
*4.3, vid tredje rubriken*

Tabell med fem rader och fyra kolumner. Delkapitlets sammanfattning.

| Grupp | Byggd av | Bindning | Innehåller kol |
|---|---|---|---|
| Kolhydrater | sockerenheter | glykosidbindning | ja |
| Fetter | glycerol + fettsyror | esterbindning | ja |
| Proteiner | aminosyror | peptidbindning | ja |
| Vitaminer | varierande | varierande | ja |
| Mineralämnen | **enskilda atomer** | **inga** | **nej** |

**Rubrikrad i signaturfärg.** Tabellinjer och text `#2d4a35`.

**De tre första raderna markeras** med en tunn linje i signaturfärg längs bindningskolumnen — det
är de tre som bildas genom kondensation.

**Mineralraden markeras annorlunda:** cellerna får en grå bakgrund `#8A8A8A` med låg opacitet, så
att den skiljer sig visuellt från de övriga fyra.

**Under tabellen** två rader:
*de fyra översta byggs och bryts ner*
*den nedersta ska bara finnas på plats*

**Kontroller:** fem rader. Bindningskolumnen har de tre namnen i rätt ordning. Mineralraden är den
enda med grå bakgrund och den enda med "nej" i sista kolumnen.

**Alt:** En tabell med fem grupper av näringsämnen. Kolhydrater, fetter och proteiner byggs av
enheter med varsin bindningstyp. Vitaminer varierar. Mineralämnen består av enskilda atomer, har
inga bindningar och innehåller inget kol.

**Bildtext Enkel:** Fyra grupper byggs av molekyler. Den femte är bara atomer.

**Bildtext Standard:** De tre första bildas alla genom kondensation. Mineralämnena bildas inte
alls — de ska bara finnas där.

**Titta efter (endast Enkel):**
- Vilken rad ser annorlunda ut, och varför?
- Vad har de tre översta bindningarna gemensamt?
- Vilken grupp innehåller inget kol?

---

# Fyra saker att kontrollera först

**Den gemensamma uppställningen för M3, M7 och L9.** Det är delkapitlets viktigaste designbeslut.
Jämför koordinater och etiketter programmatiskt. Behöver L9 justeras, säg till innan — då byggs
delkapitel 5 om.

**Kvävet är en ny färgsignal.** Blå `#3D6BA8` i M7, M8 och M11. Dokumentera i
`KOMPONENTER-INNEHALL.md`.

**M10 måste visa att kedjan är hel.** Samma antal enheter i båda lägena, programmatiskt jämfört.

**M4 måste göra vändningen omedelbart synlig.** Ritas den otydligt faller 1.3, och 1.3 är
delkapitlets viktigaste underdel.
