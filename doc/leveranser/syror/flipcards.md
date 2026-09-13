# Flipcards — delkapitel Syror

> Samma schema och id-mönster som repetitionen. Inga `redogorelsekort`.
> Kort märkta **[formel]** innehåller `\ce{}` — dubbla backslash i JSON.
>
> Bygg (Code 2026-09-13): `node verktyg/bygg-flipcards.js syror` läser denna fil och bygger om
> kapitlets begreppsbank ur alla delkapitels flipcards.md. Kort märkta **[brygga]** byggs som
> vanliga kort; märkningen är bara en notis. Leverans 2026-09-13 (klistrad i chatten).
> Beslut 2026-09-13: räkningen nedan säger 85 kort men filen innehåller 84 (avsnitt 5 har 6 modellkort) –
> 84 är rätt. "Koncentration" (avsnitt 4) går inte till begreppsbanken: repetitionens post står kvar
> eftersom eleven möter begreppet där först; kortet finns kvar som flipcard (bygg-avsnitt-konfig.js).

---

## Nivåprincipen i korten

Flipcardsen följer textnivåerna:

| `niva` | Modell |
|---|---|
| `grundlaggande` | **Vätejon.** Samma modell som Enkel-texten. |
| `fordjupning` | **Oxoniumjon.** Standardnivåns och fördjupningens modell. |

**Fördelningen blir jämnare än i repetitionen** — ungefär 55/45 i stället för 75/25. Skälet är att
oxoniumjonen är standardnivåns modell och inte fördjupningsstoff; den ligger på `fordjupning` bara
för att korten inte har fler nivåer.

### Brygg-kort

Tre kort på **grundläggande** nivå kopplar ihop de två modellerna, så att en elev som bara pluggar
grundläggande ändå möter oxoniumjonen. De är markerade **[brygga]**.

Utan dem finns risken att eleven tror att vätejonmodellen är allt som finns.

---

# AVSNITT 1 — Vad är en syra?
**18 kort:** 11 begreppskort, 7 modellkort

## Begreppskort — grundläggande

**Vätejon**
F: Vad är en vätejon?
S: En väteatom som avgett sin enda elektron. Kvar finns **bara protonen** — ingen elektron, inget
skal.

**Syra**
F: Vad är en syra?
S: Ett ämne som kan **avge vätejoner**.

**Sur lösning**
F: Vad kännetecknar en sur lösning?
S: Den innehåller **vätejoner** som en syra avgett. Ju fler, desto surare.

**Saltsyra**
F: Vad är saltsyra?
S: Ämnet **väteklorid** löst i vatten. Varje partikel avger en vätejon, och kvar blir en kloridjon.

**Kloridjon** [formel]
F: Vad blir kvar av vätekloriden när den avgett sin vätejon?
S: En **kloridjon**, `\ce{Cl-}`. Den gör inte lösningen sur — det gör vätejonerna.

**Brygga: vätejonen i vatten** [brygga]
F: Vad händer med vätejonen när den hamnar i vatten?
S: Den kan inte vara ensam. Den **binder direkt till en vattenmolekyl**, och då bildas en
oxoniumjon.

**Brygga: oxoniumjon** [brygga] [formel]
F: Vad är en oxoniumjon?
S: En vattenmolekyl som tagit upp en vätejon: `\ce{H3O+}`. Det är den som faktiskt finns i en sur
lösning.

## Begreppskort — fördjupning

**Oxoniumjon, formel** [formel]
F: Skriv reaktionen när en vattenmolekyl tar upp en vätejon.
S: `\ce{H2O + H+ -> H3O+}`

**Amfolyt**
F: Vad är en amfolyt?
S: Ett ämne som kan fungera **både som syra och som bas**. Vatten är det viktigaste exemplet.

**Protonöverföring**
F: Vad menas med att en syra-basreaktion är en protonöverföring?
S: Att en **proton byter ägare** — syran avger den, basen tar emot. Det krävs alltid två parter.

**Autoprotolys** [formel]
F: Vad händer när två vattenmolekyler reagerar med varandra?
S: Den ena avger en proton till den andra: `\ce{2 H2O <=> H3O+ + OH-}`. Därför finns joner även i
rent vatten.

## Modellkort — grundläggande

**Vätejonens storlek**
F: Varför är vätejonen så reaktiv?
S: Den är **bara en naken kärna** utan elektronskal, och positivt laddad. Den fastnar på allt som
har elektroner att erbjuda.

**Vad syran gör**
F: En syra hamnar i vatten. Vad händer?
S: Syrans partiklar **avger vätejoner** till vattnet, och lösningen blir sur.

**Ström i sur lösning**
F: Varför leder sura lösningar elektrisk ström?
S: De innehåller **fria joner** som kan röra sig. Ström är laddning i rörelse.

**Vad som inte gör lösningen sur**
F: Saltsyra ger både vätejoner och kloridjoner. Vilken av dem gör lösningen sur?
S: **Vätejonerna.** Kloridjonerna finns bara kvar i lösningen utan att påverka surheten.

**Brygga: vad finns i lösningen?** [brygga]
F: En syra har avgett sina vätejoner i vatten. Vilka joner finns nu i lösningen?
S: **Oxoniumjoner** — vätejonerna sitter på vattenmolekyler. Fria vätejoner finns inte i vatten.

## Modellkort — fördjupning

**Saltsyra i vatten** [formel]
F: Skriv reaktionen när väteklorid löses i vatten.
S: `\ce{HCl + H2O -> H3O+ + Cl-}`

**Vem är basen?**
F: I reaktionen `\ce{HCl + H2O -> H3O+ + Cl-}` — vilket ämne fungerar som bas?
S: **Vattnet.** Det tar emot protonen, och det är vad en bas gör.

---

# AVSNITT 2 — pH och indikatorer
**17 kort:** 10 begreppskort, 7 modellkort

## Begreppskort — grundläggande

**pH**
F: Vad beskriver pH-värdet?
S: Hur **sur eller basisk** en lösning är. Skalan går från 0 till 14.

**Surt, neutralt, basiskt**
F: Vad betyder pH under 7, pH 7 och pH över 7?
S: Under 7 = **surt**. Precis 7 = **neutralt**. Över 7 = **basiskt**.

**Indikator**
F: Vad är en indikator?
S: Ett ämne som **byter färg** beroende på lösningens pH.

**Lackmus**
F: Vad visar lackmuspapper?
S: Blått papper blir **rött** i surt. Rött papper blir **blått** i basiskt. Inget pH-värde, bara
surt eller basiskt.

**BTB**
F: Vilka färger har BTB?
S: **Gult** i surt, **grönt** omkring neutralt, **blått** i basiskt.

**Universalindikator**
F: Vad skiljer universalindikator från lackmus?
S: Den innehåller **flera indikatorämnen** och visar ett ungefärligt pH-värde, inte bara surt eller
basiskt.

**pH-mätare**
F: När använder man en pH-mätare i stället för en indikator?
S: När man behöver ett **exakt tal**. Indikatorer ger bara ungefärliga värden.

## Begreppskort — fördjupning

**Omslagsområde**
F: Vad är en indikators omslagsområde?
S: Det **pH-intervall** där indikatorn byter färg. BTB slår om mellan ungefär pH 6 och 7,6.

**pOH**
F: Vad är pOH?
S: Ett mått på koncentrationen av **hydroxidjoner**, på samma sätt som pH mäter oxoniumjoner. Vid
25 °C gäller pH + pOH = 14.

**Jonprodukten**
F: Vad är sambandet mellan oxoniumjoner och hydroxidjoner i vattenlösning?
S: Produkten av deras koncentrationer är alltid **10⁻¹⁴** vid 25 °C. Ökar den ena minskar den andra.

## Modellkort — grundläggande

**Riktningen på skalan**
F: En lösning innehåller många vätejoner. Är dess pH högt eller lågt?
S: **Lågt.** Fler vätejoner betyder lägre pH — talen går åt motsatt håll mot vad man först tror.

**Tiofaldigheten**
F: Hur mycket surare är en lösning med pH 3 än en med pH 4?
S: **Tio gånger.** Varje steg på skalan är en tiofaldig skillnad.

**Två steg**
F: Hur många gånger surare är pH 2 än pH 4?
S: **Hundra gånger.** Två steg betyder tio gånger tio.

**Välj metod**
F: Du vill snabbt veta om en lösning är sur eller basisk. Vad använder du?
S: En **indikator**, till exempel lackmus. En pH-mätare behövs bara när du vill ha ett exakt tal.

**Rödkål**
F: Vilken färg blir rödkålsindikator i en sur lösning?
S: **Röd eller rosa.** I neutralt blir den lila, i basiskt blått eller grönt.

## Modellkort — fördjupning

**pH som tiopotens**
F: En lösning har oxoniumjonkoncentrationen 10⁻⁵ mol/dm³. Vilket pH har den?
S: **pH 5.** pH är exponenten utan minustecknet.

**Från pH till hydroxidjoner**
F: En lösning har pH 3. Vilken koncentration av hydroxidjoner har den?
S: **10⁻¹¹ mol/dm³.** Produkten av de två koncentrationerna är alltid 10⁻¹⁴.

---

# AVSNITT 3 — Starka och svaga syror
**18 kort:** 10 begreppskort, 8 modellkort

## Begreppskort — grundläggande

**Stark syra**
F: Vad är en stark syra?
S: En syra som avger **nästan alla** sina vätejoner i vatten.

**Svag syra**
F: Vad är en svag syra?
S: En syra som bara avger **en del** av sina vätejoner. Resten finns kvar som hela partiklar.

**Tre starka syror**
F: Vilka är de tre viktigaste starka syrorna?
S: **Saltsyra**, **svavelsyra** och **salpetersyra**.

**Fem svaga syror**
F: Ge exempel på svaga syror.
S: **Ättiksyra**, **citronsyra**, **kolsyra**, **mjölksyra** och **myrsyra**.

**Vad styrka inte betyder**
F: Säger stark och svag något om hur mycket syra det finns i lösningen?
S: **Nej.** Styrka handlar bara om hur lätt syran avger sina vätejoner.

**Jämviktspilen**
F: Vad betyder pilen ⇌ i en reaktionsformel?
S: Att reaktionen går **åt båda hållen** samtidigt och aldrig blir helt färdig.

**Svavelsyrans två vätejoner**
F: Vad är särskilt med svavelsyra?
S: Varje partikel har **två** vätejoner att avge. Den första avges lätt, den andra sitter hårdare.

## Begreppskort — fördjupning

**Kemisk jämvikt**
F: Vad är kemisk jämvikt?
S: Ett tillstånd där två motsatta reaktioner går **lika fort**. Antalen förblir oförändrade, men
partiklarna byter ständigt form.

**Buffert**
F: Vad är en buffert?
S: En lösning som **motstår pH-förändringar**. Den bygger på att en svag syra står i jämvikt med
sin jon.

**Acetatjon** [formel]
F: Vad blir kvar när en ättiksyramolekyl avgett sin vätejon?
S: En **acetatjon**, `\ce{CH3COO-}`. Den kan ta tillbaka vätejonen igen.

## Modellkort — grundläggande

**Räkna vätejoner**
F: Två glas innehåller lika mycket syra — ett starkt och ett svagt. Vilket har flest vätejoner?
S: Det med den **starka** syran. Nästan alla dess partiklar har avgett sin vätejon.

**Vad finns kvar**
F: Vad finns i en lösning med svag syra som inte finns i en med stark?
S: **Hela syrapartiklar** som ännu inte avgett sin vätejon.

**Klassificera**
F: Ättiksyra — stark eller svag?
S: **Svag.** Bara en liten del av molekylerna avger sin vätejon.

**Klassificera igen**
F: Salpetersyra — stark eller svag?
S: **Stark.** Nästan alla partiklar avger sin vätejon i vatten.

**Varför sitter den hårdare**
F: Varför avges svavelsyrans andra vätejon svårare än den första?
S: Den ska lämna en partikel som **redan är negativ**, och den negativa laddningen håller kvar den
positiva vätejonen.

## Modellkort — fördjupning

**Ättiksyra i vatten** [formel]
F: Skriv reaktionen när ättiksyra reagerar med vatten.
S: `\ce{CH3COOH + H2O <=> H3O+ + CH3COO-}`

**Varför en syra är stark**
F: Vad avgör hur lätt en syra avger sin vätejon?
S: Bindningens styrka, och hur **stabil** den jon är som blir kvar. Är jonen stabil avges protonen
gärna.

**Neutralisera en svag syra**
F: Går det att neutralisera en svag syra fullständigt, trots att bara en del har avgett sin proton?
S: **Ja.** När oxoniumjonerna tas bort förskjuts jämvikten, och fler partiklar avger sin proton.

---

# AVSNITT 4 — Koncentrerade och utspädda syror
**16 kort:** 8 begreppskort, 8 modellkort

## Begreppskort — grundläggande

**Koncentration**
F: Vad betyder en lösnings koncentration?
S: Hur **mycket** löst ämne det finns i en viss mängd lösning.

**Koncentrerad**
F: Vad betyder att en lösning är koncentrerad?
S: Den innehåller **mycket** löst ämne i förhållande till mängden vätska.

**Utspädd**
F: Vad betyder att en lösning är utspädd?
S: Den innehåller **lite** löst ämne i förhållande till mängden vätska.

**mol/dm³**
F: Vad betyder enheten mol/dm³?
S: Antal **mol per liter** lösning. En kubikdecimeter är samma sak som en liter.

**Att späda ut**
F: Vad händer när man späder ut en syra?
S: Mängden syra är oförändrad, men den **fördelas i mer vatten**. Koncentrationen minskar och pH
stiger.

**SIV-regeln**
F: Vad betyder SIV?
S: **Syra I Vatten.** Häll alltid syran i vattnet, aldrig vatten i koncentrerad syra.

## Begreppskort — fördjupning

**Mol**
F: Vad är en mol?
S: En bunt om ungefär **6 · 10²³ partiklar**, på samma sätt som ett dussin är tolv.

**Molmassa**
F: Vad anger molmassan?
S: Hur många **gram** ett mol av ämnet väger, i enheten g/mol.

## Modellkort — grundläggande

**Två egenskaper**
F: Vilka två saker avgör en syralösnings pH?
S: Syrans **styrka** och lösningens **koncentration**. Båda spelar roll.

**Kan pH avslöja styrkan?**
F: Går det att avgöra om en syra är stark eller svag genom att mäta pH?
S: **Nej.** En utspädd stark syra kan ha högre pH än en koncentrerad svag.

**Fyra kombinationer**
F: Vilka fyra kombinationer av styrka och koncentration finns?
S: Stark och koncentrerad, stark och utspädd, svag och koncentrerad, svag och utspädd.

**Blir syran svagare?**
F: En stark syra späds ut. Blir den svagare?
S: **Nej.** Styrkan är oförändrad — det är koncentrationen som minskat.

**Varför blir det varmt**
F: Varför frigörs värme när koncentrerad syra blandas med vatten?
S: När syrans partiklar **omges av vattenmolekyler** frigörs energi. För svavelsyra är mängden
ovanligt stor.

**Fel ordning**
F: Varför får man aldrig hälla vatten i koncentrerad syra?
S: Den lilla vattenmängden blir **mycket varm mycket snabbt**, kokar, och kastar ut frätande syra.

## Modellkort — fördjupning

**Räkna mol**
F: Du har 9 gram vatten. Vattnets molmassa är 18 g/mol. Hur många mol är det?
S: **0,5 mol.** n = m / M = 9 / 18.

**Utspädning och pH**
F: En stark syra späds tio gånger. Hur ändras pH?
S: Det **stiger ett steg**. Tio gångers utspädning motsvarar ett pH-steg — men bara för starka
syror.

---

# AVSNITT 5 — Viktiga syror
**16 kort:** 9 begreppskort, 7 modellkort

## Begreppskort — grundläggande

**Syrors gemensamma egenskaper**
F: Vad har alla sura lösningar gemensamt?
S: **pH under 7**, de **leder ström**, många är **frätande**, och de kan **neutraliseras** av baser.

**Saltsyra i kroppen**
F: Var i kroppen finns saltsyra, och varför?
S: I **magsäcken**. Den hjälper till att bryta ner maten och oskadliggör många mikroorganismer.

**Svavelsyra**
F: Vad används svavelsyra till?
S: **Gödselmedel**, kemisk industri, och som vätska i **blybatterier**.

**Salpetersyra**
F: Vad används salpetersyra till?
S: **Gödselmedel** och **sprängämnen**.

**Ättiksyra**
F: Var finns ättiksyra?
S: I **ättika och vinäger**. Den används i matlagning och för att **konservera** livsmedel.

**Citronsyra**
F: Vad används citronsyra till, förutom i livsmedel?
S: **Avkalkning.** Den löser upp kalkavlagringar i kaffebryggare och vattenkokare.

**Myrsyra**
F: Var förekommer myrsyra?
S: Hos **myror**, som den fått sitt namn av. Den används också vid **ensilering** av djurfoder.

## Begreppskort — fördjupning

**Laktat**
F: Vad är laktat?
S: Mjölksyrans **jonform**. Det är den som faktiskt finns i kroppen, inte mjölksyra som molekyl.

**Spänningsserien**
F: Vad är spänningsserien?
S: En rangordning av metaller efter hur **villigt de avger elektroner**. Gränsen går vid vätet.

## Modellkort — grundläggande

**Vätgas ur syra**
F: Vad bildas när en syra reagerar med en metall?
S: **Vätgas**, som bubblar upp ur lösningen.

**Hur det går till**
F: Varför bildas vätgas när metall möter syra?
S: Metallatomerna **avger elektroner** till vätejonerna, som blir väteatomer igen. Två av dem
bildar en vätgasmolekyl.

**Frätande eller inte**
F: Är en svag syra alltid ofarlig?
S: **Nej.** Även koncentrerade svaga syror kan vara frätande. Koncentrationen spelar lika stor roll
som styrkan.

**Vid stänk**
F: Vad gör du om du får syra på huden?
S: **Skölj omedelbart med rikligt med vatten**, länge. Ta av förorenade kläder och säg till din
lärare.

**Kolsyra**
F: Hur bildas kolsyra?
S: När **koldioxid löser sig i vatten**. Därför är kolsyrade drycker lite sura.

## Modellkort — fördjupning

**Varför koppar inte löser sig**
F: Zink reagerar med saltsyra men koppar gör det inte. Varför?
S: Koppar ligger **under vätet** i spänningsserien och avger elektroner ogärnare. Zink ligger över.

---

# Räkning

| Avsnitt | Begreppskort | Modellkort | Grundläggande | Fördjupning | Totalt |
|---|---|---|---|---|---|
| 1 | 11 | 7 | 12 | 6 | 18 |
| 2 | 10 | 7 | 12 | 5 | 17 |
| 3 | 10 | 8 | 12 | 6 | 18 |
| 4 | 8 | 8 | 12 | 4 | 16 |
| 5 | 9 | 7 | 12 | 4 | 16 |
| **Summa** | **48** | **37** | **60** | **25** | **85** |

**Tre brygg-kort** i avsnitt 1, alla på grundläggande nivå, kopplar vätejonmodellen till
oxoniumjonen.

---

# Begreppsbanken

Som tidigare: **endast grundläggande begreppskort** går till banken.

| Avsnitt | Begrepp till banken |
|---|---|
| 1 | 7 |
| 2 | 7 |
| 3 | 7 |
| 4 | 6 |
| 5 | 7 |
| **Totalt** | **34** |

Brygg-korten i avsnitt 1 räknas med, eftersom de är begreppskort på grundläggande nivå.

**Formler i begreppsbanken går inte.** Två begrepp behöver omformuleras:

**Kloridjon** — Det som blir kvar av vätekloriden när den avgett sin vätejon. Den gör inte lösningen
sur — det gör vätejonerna.

**Brygga: oxoniumjon** — En vattenmolekyl som tagit upp en vätejon. Det är den som faktiskt finns i
en sur lösning.

Flipcardsen behåller sina formler.
