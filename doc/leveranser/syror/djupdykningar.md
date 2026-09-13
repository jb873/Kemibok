# Djupdykningar — delkapitel Syror

> Tre texter, skrivna av Joachim och tidigare delade med eleverna. De används **oförändrade** som
> djupdykningar.
>
> Här står **korttext** till `fordj-kort`, **underrubrik** till hero, och var varje text ska
> länkas från.
>
> Bygg (Code 2026-09-13): `node verktyg/bygg-djupdykning.js syror` läser denna fil; raden
> **Brödtext:** pekar på textfilen i samma mapp (lib-djupdykningar.js). Stark/svag byggs först när
> delkapitlet Baser finns – då pekar dess djupdykningar.md på `../syror/starka-och-svaga.md`.

---

## Varför dessa tre blir djupdykningar och inte fördjupningar

De är **fristående**. De börjar från början, förklarar ett helt område och förutsätter inte att man
just läst ett visst avsnitt.

Fördjupningarna i boken är byggda annorlunda: de hänger på standardtexten strax ovanför, börjar ofta
med *"standardtexten sa att…"* och slutar med en modellplacering. Lyfter man ut dem tappar de sitt
fäste.

Att ha båda är därför inte upprepning. **Fördjupningen är den sannare modellen för den som just läst
avsnittet. Djupdykningen är den samlade förklaringen för den som vill ha allt på ett ställe.**

Två justeringar är gjorda i fördjupningarna för att undvika dubbelarbete, se sist i filen.

---

# 1. pH-värdet: oxoniumjoner, hydroxidjoner och mol

**Länkas från:** avsnitt 2, underdel A
**Filnamn:** `djupdykning-ph-och-mol.html`

**Underrubrik:** *vad pH-talet egentligen mäter*

**Korttext:** pH är inte en godtycklig skala utan en direkt avläsning av hur många oxoniumjoner som
finns. Här är hela sambandet — med tiopotenser, pOH och varför 0 och 14 inte är absoluta gränser.

**Text:** Joachims dokument *pH-värdet – oxoniumjoner, hydroxidjoner och mol*, oförändrat.
**Brödtext:** ph-vardet.md

---

# 2. Mol: en brygga mellan atomer och gram

**Länkas från:** avsnitt 4, underdel A — **och från flera delkapitel framåt**
**Filnamn:** `djupdykning-mol.html`

**Underrubrik:** *från osynliga partiklar till gram på en våg*

**Korttext:** Atomer går inte att räkna en och en. Mol är sättet att koppla ihop den osynliga världen
med det man faktiskt kan väga.

**Text:** Joachims dokument *Mol – en brygga mellan atomer och gram*, oförändrat.
**Brödtext:** mol.md

### Särskild placering

Den här texten hör inte till syrorna specifikt. Mol är ett **verktyg** som behövs i flera
delkapitel — neutralisation kräver det för mängdförhållanden, salter för formelenheter.

**Förslag:** lägg den i syrornas djupdykningsmapp, men länka till den från flera avsnitt. Om
plattformen inte tillåter att samma djupdykning länkas från flera avsnitt bör den ligga på
kapitelnivå i stället, tillsammans med kapitelverktygen.

**Code får avgöra vad som är möjligt** och rapportera innan något byggs.

---

# 3. Starka och svaga syror och baser

**Länkas från:** delkapitel **Baser**, avsnitt 2
**Filnamn:** `djupdykning-starka-och-svaga.html`

**Underrubrik:** *samma princip för båda sidorna*

**Korttext:** Stark och svag betyder samma sak för syror och baser — hur stor andel av partiklarna
som reagerar med vatten. Här står de sida vid sida.

**Text:** Joachims dokument *Starka och svaga syror och baser*, oförändrat.
**Brödtext:** starka-och-svaga.md

### Varför i baserna och inte i syrorna

Texten täcker **båda** sidorna. Ligger den i syrorna möter eleven basdelen innan hon vet vad en bas
är. Ligger den i baserna har hon båda delarna färska, och texten blir det ställe där de knyts ihop.

Syrornas avsnitt 3 kan hänvisa framåt till den, men djupdykningskortet hör hemma i baserna.

---

# 4. Koncentration och spädning

**Länkas från:** avsnitt 4, underdel A
**Filnamn:** `djupdykning-koncentration.html`
**Underrubrik:** *c = n/V, och vad som händer när man häller i mer vatten*

**Korttext:** Vad betyder egentligen 0,1 mol/dm³? Och varför ändras pH när man späder, fast mängden syra är densamma? Här räknas det ut.

**Text:** Joachims dokument, oförändrat (leverans 2026-09-13, djupdykningar-placeringar-2026-09-13.md).
**Brödtext:** koncentration-och-spadning.md

---

# 5. Indikatorer och mätning av pH

**Länkas från:** avsnitt 2, underdel B
**Filnamn:** `djupdykning-indikatorer.html`
**Underrubrik:** *vad som händer i molekylen när färgen byts*

**Korttext:** Varför byter en indikator färg? Och hur mäter en pH-meter något man inte kan se? Här finns svaren — inklusive vad som gör rödkål så användbar.

**Text:** Joachims dokument, oförändrat (leverans 2026-09-13, djupdykningar-placeringar-2026-09-13.md).
**Brödtext:** indikatorer-och-matning.md

---

# Justeringar i befintliga fördjupningar

Två ändringar är gjorda så att fördjupning och djupdykning inte upprepar varandra.

### Syror avsnitt 2, fördjupning A — kortad

Slutet om att skalans ändpunkter inte är absoluta är borttaget. Fördjupningen stannar nu vid **varför
pH är exponenten och varför mitten ligger vid 7**, och avslutas med en hänvisning:

> Vill du gå vidare — hur man räknar med koncentrationerna, vad pOH är, och varför skalans ändpunkter
> inte är absoluta — finns det i djupdykningen pH-värdet: oxoniumjoner, hydroxidjoner och mol.

### Syror avsnitt 4, fördjupning A — hänvisning tillagd

Bunt-förklaringen av mol står kvar som inledning, men texten pekar nu vidare:

> Mol är ett verktyg som återkommer i flera delkapitel, inte bara här. Hur man räknar med det —
> molmassa, sambandet mellan gram och antal partiklar, och hur man använder det på reaktionsformler —
> finns samlat i djupdykningen Mol: en brygga mellan atomer och gram.

### Syror avsnitt 3, fördjupning A — oförändrad

Min fördjupning om bindningsstyrka och jonstabilitet överlappar delvis Joachims stark/svag-text, men
de svarar på olika frågor. Min förklarar **varför** en syra är stark, på molekylnivå. Joachims
beskriver **vad** skillnaden innebär i lösningen, för både syror och baser.

Ingen ändring behövs.

---

# Sammanställning: djupdykningar i kapitlet hittills

| Delkapitel | Djupdykning | Från avsnitt |
|---|---|---|
| Repetition | Kvarkar | 1 |
| Repetition | Ädelgaser som ändå reagerar | 2 |
| Repetition | Varför koksalt är ofarligt | 3 |
| Repetition | Varför is flyter | 4 |
| Repetition | Ytspänning i verkligheten | 4 |
| Syror | pH-värdet | 2 |
| Syror | Mol | 4 (och flera) |
| Baser | Starka och svaga syror och baser | 2 |

Åtta stycken. Tre av dem är Joachims tidigare texter, fem är skrivna för boken.

---

# Att bestämma

1. Godkänner du att de tre texterna används oförändrade som djupdykningar?
2. Mol-texten: ska den ligga i syrornas mapp med länkar från flera avsnitt, eller på kapitelnivå?
   Code bör rapportera vad plattformen tillåter innan något byggs.
3. Stark/svag-texten placeras i baserna. Stämmer det?
