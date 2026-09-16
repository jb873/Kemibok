// bygg-avsnitt-konfig.js – per-avsnitt konfiguration för bygg-avsnitt.js och bygg-djupdykning.js
// (det leveransen inte säger maskinläsbart: slug/titel, djupdykningar, bildankare, faktaruta-ankare).
'use strict';
const AVSNITT_REPETITION = {
  1: { slug: 'atomer-molekyler-joner', titel: 'Atomer, molekyler och joner', sub: 'materiens minsta byggstenar',
       dd: [{ slug: 'kvarkar', titel: 'Kvarkar', ikon: '⚛️' }],
       bilder: {
         'atommodell-litium.webp': { aktiv: ['enkel', 'standard'], enkel: 'protoner och neutroner inne i kärnan, elektroner utanför', standard: '**protoner** och **neutroner**.' },
         'attrahera-repellera.webp': { aktiv: ['enkel', 'standard'], enkel: 'snäpper de ihop', standard: '**attraherar** varandra.' },
         'grundamne-forening.webp': { aktiv: ['enkel', 'standard'], enkel: 'bara genom att titta på formeln', standard: 'Genom att titta på vilka atomslag som ingår' },
         'litium-atom-och-jon.webp': { aktiv: ['enkel', 'standard'], enkel: 'Det lilla plustecknet visar att laddningen är positiv', standard: 'Plustecknet visar att partikeln har en positiv laddning' }
       },
       // faktarutan (leveransens ## FAKTARUTA-sektion) läggs efter ankarstycket och den figur som följer det
       faktaruta: { enkel: 'snäpper de ihop', standard: '**attraherar** varandra.' } },
  2: { slug: 'periodiska-systemet', titel: 'Det periodiska systemet', sub: 'hur atomslagen hänger ihop',
       dd: [{ slug: 'adelgaser-som-reagerar', titel: 'Ädelgaser som ändå reagerar', ikon: '💡' }],
       bilder: {
         // leveransen saknar bildspec; spec från Joachim 2026-09-13, bilden är en genererad SVG (verktyg/bilder-svg.js)
         'periodiska-systemet-forenklat.svg': { aktiv: ['enkel', 'standard'], enkel: 'siffra som kallas **atomnummer**', standard: 'och dess **atomnummer**',
           spec: { underdel: 'a', alt: 'Ett förenklat periodiskt system med de tre första perioderna. Väte och helium står ensamma i första raden. Grupp 1, 2, 17 och 18 är färgmarkerade, och varje ruta visar atomnummer och kemisk beteckning.',
             enkel: 'De tre första perioderna. Raderna är perioder, kolumnerna är grupper. De fyra färgade kolumnerna är de som har egna namn.',
             standard: 'Ett förenklat periodiskt system. Lägg märke till luckan i period 2 och 3 — i det fullständiga systemet sitter övergångsmetallerna där, men de tillkommer först i period 4.' } }
       } },
  3: { slug: 'kemiska-bindningar', titel: 'Kemiska bindningar', sub: 'vad som håller ihop ämnen',
       dd: [{ slug: 'koksalt-ofarligt', titel: 'Varför koksalt är ofarligt', ikon: '🧂' }],
       bilder: {
         'jonbindning-natrium-klor.webp': { fil: 'jonbindning-natrium-klor.svg', aktiv: ['enkel', 'standard'], enkel: 'Möts de passar det perfekt', standard: 'kallas\n**jonbindning**' },
         'elektronpar-vate.webp': { fil: 'elektronpar-vate.svg', aktiv: ['enkel', 'standard'], enkel: 'Resultatet är en vätemolekyl', standard: 'det är paret som håller samman' },
         'enkel-dubbel-trippel.webp': { aktiv: ['enkel', 'standard'], enkel: 'där varje atom saknar tre', standard: 'finns en\ntrippelbindning' },
         'molekylmodeller-vatten.webp': { fil: 'molekylmodeller-vatten.svg', aktiv: ['enkel', 'standard'], enkel: 'vilken man väljer beror på vad man vill visa', standard: 'Valet beror på vad som ska framgå' },   // bara Enkel + Standard (beslut 2026-09-13)
         'metallbindning.webp': { aktiv: ['enkel', 'standard'], enkel: 'jonerna ligger i ett hav av elektroner', standard: 'håller på så sätt samman metallen' },
         // underdel A, genererade SVG:er (bilder-svg.js); spec och bildguider levererade 2026-09-13
         'adelgasstruktur.svg': { aktiv: ['enkel', 'standard'], enkel: 'samma uppsättning som en ädelgas har', standard: 'reagerar därför mycket lite' },
         'tre-vagar.svg': { aktiv: ['enkel', 'standard'], enkel: 'jonbindning, kovalent bindning och metallbindning', standard: 'var i det periodiska systemet den står.' }
       } },
  4: { slug: 'vattnets-egenskaper', titel: 'Vattnets egenskaper', sub: 'därför beter sig vatten som det gör',
       dd: [{ slug: 'varfor-is-flyter', titel: 'Varför is flyter', ikon: '🧊' }, { slug: 'ytspanning', titel: 'Ytspänning i verkligheten', ikon: '💧' }],
       bilder: {
         'polar-vattenmolekyl.webp': { fil: 'polar-vattenmolekyl.svg', aktiv: ['enkel', 'standard'], enkel: 'medan vätesidorna blir **svagt positiva**', standard: 'mindre laddningsskillnader inom molekylen' },
         'vatebindning.webp': { fil: 'vatebindning.svg', aktiv: ['enkel', 'standard'], enkel: 'Den attraktionen\nkallas **vätebindning**', standard: 'Attraktionen mellan vattenmolekylerna kallas **vätebindning**' },   // SVG ersätter AI-bilden (tre H per molekyl) 2026-09-13
         'is-och-vatten.webp': { aktiv: ['enkel', 'standard'], enkel: 'plats som is än som flytande vatten.', standard: '**flyter därför på vatten**' }
       } },
  5: { slug: 'losningar', titel: 'Lösningar', sub: 'vad som händer när något löser sig', dd: [],
       bilder: {
         'jon-loses-i-vatten.webp': { aktiv: ['enkel', 'standard'], enkel: 'lossnar jonen\noch sprids ut i vattnet', standard: 'skiljas\nfrån varandra och spridas ut i vattnet' },
         'polart-och-opolart.webp': { aktiv: ['enkel', 'standard'], enkel: 'oljan trängs undan till ett\neget lager', standard: 'Därför blandas olja och vatten dåligt' },
         'mattad-losning.webp': { aktiv: ['enkel', 'standard'], enkel: 'oavsett hur mycket du\nrör om', standard: 'Om mer av ämnet tillsätts kommer det att bli kvar' }
       } }
};
// Syror: titel/slug/underrubrik ur leveransens huvud; alla bilder som kommentarsmarkup (beslut C, 2026-09-13)
// utom stark-och-svag-syra.webp som finns i img/. Inga djupdykningar levererade ännu.
const AVSNITT_SYROR = {
  1: { dd: [],
       bilder: { 'vatejon-och-oxoniumjon.svg': { aktiv: [], standard: 'H₂O + H⁺ → H₃O⁺' },   // endast Standard; efter reaktionsraden
                 'vatejonens-storlek.svg': { aktiv: ['enkel', 'standard'], enkel: 'är **bara en naken kärna**', standard: 'joner den ska samsas med i en lösning.' } },   // bildinventering 2026-09-14
       faktaruta: { standard: 'egentligen oxoniumjoner som' } },
  2: { dd: [{ slug: 'ph-och-mol', titel: 'pH-värdet: oxoniumjoner, hydroxidjoner och mol', ikon: '🧪' },   // Joachims text, doc/leveranser/syror/ph-vardet.md
            { slug: 'indikatorer', titel: 'Indikatorer och mätning av pH', ikon: '🎨' }],                       // Joachims text, indikatorer-och-matning.md (2 B)
       bilder: { 'ph-skalan.svg': { aktiv: [], enkel: 'en tvållösning kan ha 9 eller 10', standard: 'många tvållösningar är basiska' },
                 'indikatorfarger.svg': { aktiv: ['enkel', 'standard'], enkel: 'undersöka pH hemma i köket', standard: 'Därför går det att göra enkla undersökningar av pH även hemma' } } },   // efter rödkålsstycket
  3: { dd: [],
       bilder: { 'stark-och-svag-syra.webp': { aktiv: ['enkel', 'standard'], enkel: 'helt olika många vätejoner i vattnet', standard: 'partiklar som har avgett den' } } },
  4: { dd: [{ slug: 'mol', titel: 'Mol: en brygga mellan atomer och gram', ikon: '⚖️' },   // Joachims text, mol.md – länkas senare även från neutralisation/salter (byggs där ur samma fil)
            { slug: 'koncentration', titel: 'Koncentration och spädning', ikon: '💧' }],   // Joachims text, koncentration-och-spadning.md (4 A)
       bilder: { 'fyra-kombinationerna.svg': { aktiv: [], enkel: 'en syra som avger ogärna', standard: 'Utspädd ättiksyra är ett exempel' },
                 'siv-regeln.svg': { aktiv: ['enkel', 'standard'], enkel: 'Och häll långsamt, så att värmen', standard: '**Häll alltid syra i vatten — aldrig vatten i koncentrerad syra.**' } } },   // sist i 4 C
  5: { dd: [],
       bilder: { 'syra-och-metall.webp': { aktiv: ['enkel', 'standard'], staende: true, enkel: 'tillsammans en vätgasmolekyl', standard: 'metallatomerna avger elektroner' } } }   // grön bakgrund, nycklad 2026-09-13; stående provrör
};
// Baser (leverans 2026-09-13): titel/slug/underrubrik ur huvudet. tva-vagar-till-bas.svg genererad (bilder-svg.js);
// stark-och-svag-bas.webp och fortvalning.webp levererades med grön bakgrund (#00ff00) och nycklades
// 2026-09-13 med verktyg/nyckla-gron.js (filerna i img/ har alfa). Avsnitt 3 återanvänder syrornas
// ph-skalan.svg (fil med sökväg relativt img/; spec i konfigurationen eftersom leveransen inte har någon
// ### `fil`-rad – bildtexter och bildguide ur avsnitt-3.md). Djupdykningen Starka och svaga syror och baser
// (doc/leveranser/syror/starka-och-svaga.md) länkas från avsnitt 2 A via baser/djupdykningar.md.
const AVSNITT_BASER = {
  1: { dd: [],
       bilder: { 'tva-vagar-till-bas.svg': { aktiv: ['enkel', 'standard'], enkel: 'NH₃ + H₂O ⇌ NH₄⁺ + OH⁻', standard: 'NH₃ + H₂O ⇌ NH₄⁺ + OH⁻' },   // efter reaktionsraden
                 'hydroxid-plus-vate.svg': { aktiv: ['enkel', 'standard'], enkel: 'H⁺ + OH⁻ → H₂O', standard: 'H⁺ + OH⁻ → H₂O' } } },   // bildinventering 2026-09-14, efter formeln
  2: { dd: [{ slug: 'starka-och-svaga', titel: 'Starka och svaga syror och baser', ikon: '⚖️' }],
       bilder: { 'stark-och-svag-bas.webp': { aktiv: ['enkel', 'standard'], enkel: 'men helt olika många hydroxidjoner', standard: 'bara till en del med vattnet' },
                 'en-eller-tva-hydroxid.svg': { aktiv: ['enkel', 'standard'], enkel: 'Kalciumjonen har laddningen plus två', standard: 'Det beror på att kalciumjonen har' } } },   // bildinventering 2026-09-14
  3: { dd: [],
       bilder: { 'ph-skalan.svg': { fil: '../../syror/img/ph-skalan.svg', aktiv: ['enkel', 'standard'], enkel: 'Propplösare kan ligga över 13', standard: 'Ju större överskott av hydroxidjoner',
         spec: { underdel: 'a', alt: 'En pH-skala från 0 till 14, färglagd från rött vid låga värden genom grönt vid 7 till blått vid höga. Magsyra ligger vid 1,5, citronsaft vid 2,5, kaffe vid 5, rent vatten vid 7 och tvållösning vid 9,5. Under skalan står surt till vänster, neutralt vid 7 och basiskt till höger.',
           enkel: 'Basiska lösningar ligger till höger på skalan, över 7. Ju fler hydroxidjoner, desto högre pH.',
           standard: 'Samma skala, andra änden. Fler hydroxidjoner betyder färre oxoniumjoner — de två hänger ihop.',
           guide: '- Var på skalan tvållösningen ligger\n- Hur långt från 7 den ligger jämfört med citronsaften\n- Åt vilket håll lösningarna blir mer basiska' } } } },
  4: { dd: [],
       bilder: { 'fortvalning.webp': { aktiv: ['enkel', 'standard'], enkel: 'fast oavsiktlig och på\ndin hud', standard: 'till bland annat ämnen som fungerar som tvål' } } }
};
// Neutralisation (leverans 2026-09-13): två SVG:er (bilder-svg.js) och antacidum.webp (levererad som
// brustablett-i-glas.webp med grön bakgrund, nycklad + beskuren med nyckla-gron.js). Faktarutan i 1 A på
// alla nivåer. Djupdykningen (Joachims text) från 1 C. Alla fem underdelar har fördjupning.
const AVSNITT_NEUTRALISATION = {
  1: { dd: [{ slug: 'neutralisation', titel: 'Neutralisation: när syra och bas reagerar', ikon: '⚗️' }],
       bilder: {
         'neutralisation-partiklar.svg': { aktiv: ['enkel', 'standard'], enkel: 'H⁺ + OH⁻ → H₂O', standard: 'H₃O⁺ + OH⁻ → 2 H₂O' },   // efter reaktionsraden
         'vad-blir-kvar.svg': { aktiv: ['enkel', 'standard'], enkel: 'De simmar omkring precis som förut', standard: 'finns fortfarande kvar lösta i vattnet efteråt' },
         'ett-till-ett.svg': { aktiv: ['enkel', 'standard'], enkel: 'några av dem över, och lösningen blir basisk.', standard: 'Först när mängderna passar ihop kan de sura och basiska egenskaperna neutraliseras helt.' }   // bildinventering 2026-09-14
       },
       faktaruta: { enkel: 'handlar underdel C om', standard: 'kvar är den fortfarande basisk', fordjupning: 'Där finns också mol och mängdberäkningar' } },
  2: { dd: [{ slug: 'titrering', titel: 'Titrering: att bestämma en okänd koncentration', ikon: '🧫' }],   // Joachims text, titrering.md (2 B)
       bilder: { 'antacidum.webp': { aktiv: ['enkel', 'standard'], staende: true, enkel: 'kemi, inte absorption', standard: 'De reagerar kemiskt med den' } } }   // staende: max-height i kemi.css
};
// Försurning (leverans 2026-09-13). AI-bilderna levererade med grön bakgrund,
// nycklade + beskurna (nyckla-gron.js --beskar); diagrammen genererade i bilder-svg.js. Alla underdelar har fördjupning.
const AVSNITT_FORSURNING = {
  1: { dd: [],
       bilder: {
         'sur-nederbord.svg': { aktiv: ['enkel', 'standard'], enkel: 'fler vätejoner', standard: 'havssalt, stoft och naturliga organiska ämnen' },
         'forbranning-till-syra.svg': { aktiv: ['enkel', 'standard'], enkel: 'bara för att det är tillräckligt hett', standard: 'ökar mängden vätejoner och' },
         'grans-overskridande.webp': { aktiv: ['enkel', 'standard'], enkel: 'till stor del kommer utifrån', standard: 'hundratals kilometer från utsläppskällan' }   // levererad som 01_forsurning_utslapp_surt_nedfall
       },
       faktaruta: { enkel: 'inte en exakt gräns', standard: 'än naturen hinner neutralisera', fordjupning: 'samma i en regndroppe som i ett hav' } },
  2: { dd: [],
       bilder: {
         'buffert-tar-slut.svg': { aktiv: ['enkel', 'standard'], enkel: 'Skadan byggdes upp långt innan den syntes', standard: 'betydligt sämre buffertförmåga' },
         'aluminium-i-gal.webp': { aktiv: ['enkel', 'standard'], enkel: 'Sätter aluminiumet igen dem störs båda', standard: 'arter som är känsliga för försurning' },
         'vittrad-sten.webp': { aktiv: ['enkel', 'standard'], enkel: 'Skillnaden är bara hastigheten', standard: 'byggnader, gravstenar och andra' }
       } },
  3: { dd: [],
       bilder: {
         'kalkning.webp': { aktiv: ['enkel', 'standard'], enkel: 'i rinnande vatten finns särskilda doserare', standard: 'Många vatten behöver kalkas återkommande' },
         'svavelutslapp-diagram.svg': { aktiv: ['enkel', 'standard'], enkel: 'nära nivåerna före', standard: '80 procent och ligger nu nära' }
       } }
};
// Salter (leverans 2026-09-14: salter-avsnitt-1-2-komplett.md, -3-4-komplett.md + omarbetade Standard-texter, sammansatta till
// avsnitt-1..4.md). Sex SVG:er ur bilder-svg.js, två AI-bilder nycklade + beskurna. Alla tolv underdelar har fördjupning.
// Faktarutan i 1 C (molekyl och formelenhet, alla nivåer) levererad i chatten 2026-09-14.
const AVSNITT_SALTER = {
  1: { dd: [],
       bilder: {
         'molekyl-mot-gitter.svg': { aktiv: ['enkel', 'standard'], enkel: 'Mönstret kallas ett **jongitter**.', standard: 'gittret fortsätter tills kristallen tar slut' },
         'formelenhet.svg': { aktiv: ['enkel', 'standard'], enkel: 'Formeln säger ingenting om hur många', standard: 'sammansättningen, inte en beskrivning av något man kan plocka ut' }
       },
       faktaruta: { enkel: 'bokföringsbegrepp, inte en partikel', standard: 'Hos salter finns ingen sådan partikel vars innehåll', fordjupning: 'formelenheten är en utmärkt beskrivning av nästan alla salter' } },   // levererad i chatten 2026-09-14
  2: { dd: [],
       bilder: {
         'laddningsbalans.svg': { aktiv: ['enkel', 'standard'], enkel: 'Summan blir noll, och formeln blir **Al₂O₃**', standard: 'Därför blir formeln för aluminiumoxid **Al₂O₃**' },
         'sammansatt-jon.svg': { aktiv: ['enkel', 'standard'], enkel: 'är ett viktigt undantag.', standard: 'utan är utspridd över hela jonen' }
       } },
  3: { dd: [{ slug: 'fallningsreaktioner', titel: 'Fällningsreaktioner', ikon: '⚗️' }],   // Joachims text, fallningsreaktioner.md (3 C); ikon ⚗️ enligt Joachim 2026-09-14
       bilder: {
         'leder-eller-inte.webp': { aktiv: ['enkel', 'standard'], enkel: 'Samma joner, samma laddningar — men nu rörliga.', standard: 'transporteras laddning genom vätskan, och lösningen leder ström' },
         'fallning.webp': { aktiv: ['enkel', 'standard'], enkel: 'grumlig, och efter en stund ligger ett vitt lager på botten', standard: 'lägger sig fällningen som ett vitt lager på botten' }
       } },
  4: { dd: [],
       bilder: {
         'saltbildning.svg': { aktiv: ['enkel', 'standard'], enkel: 'HCl + NaOH → NaCl + H₂O', standard: 'HCl + NaOH → NaCl + H₂O' },   // efter reaktionsraden
         'havsvatten.svg': { aktiv: ['enkel', 'standard'], enkel: 'Räknar man alla lösta salter tillsammans', standard: 'Därutöver finns bland annat sulfatjoner, magnesiumjoner, kalciumjoner och' }
       } }
};
// Organisk kemi 1 Kolatomen (arbetsorder 1–2, 2026-09-14/15). Byggfilerna sätts ihop av verktyg/satt-ihop-kolatomen.js
// (doc/leveranser/kolatomen/bygg/) ur leveransens Standard-, Enkel/Fördjupnings- och bildrutor. Ankare per nivå: Standard =
// stycket före bildrutan i avsnitt-N.md, Enkel/Fördjupning = motsvarande ställe i respektive text (Code, ordern säger
// "samma placering på alla tre nivåerna"). Inga kärnpunkter/Öva förrän order 3.
const AVSNITT_KOLATOMEN = {
  1: { dd: [],
       bilder: {
         'k1-a1.svg': { aktiv: ['enkel', 'standard', 'fordjupning'], enkel: 'och att indelningen blev kvar.', standard: 'utan på hur kemin historiskt har', fordjupning: 'reaktionsmönster kemisterna tyckte hörde ihop.' },
         'k1-a3.svg': { aktiv: ['enkel', 'standard', 'fordjupning'], enkel: 'Den kan ha en enkel och en trippel.', standard: 'enkelbindning och en trippelbindning.', fordjupning: 'I tre dimensioner går det att komma längre isär än så.' },
         'k1-a2.svg': { aktiv: ['enkel', 'standard', 'fordjupning'], enkel: 'Propan blir CH₃CH₂CH₃.', standard: 'i stället för att ritas ut med tio streck.', fordjupning: 'bindningarna riktar sig.' },
         'k1-a4.svg': { aktiv: ['enkel', 'standard', 'fordjupning'], enkel: 'utan också hur de sitter.', standard: 'olika ämnen med olika egenskaper.', fordjupning: 'är större och kärnorna hamnar längre ifrån varandra.' }
       } },
  2: { dd: [{ slug: 'diamanten', titel: 'Diamanten som kom upp ur djupet', ikon: '💎' }],   // djupdykning från 2.2 (arbetsorder 2026-09-15); ikonen är Codes förslag
       bilder: {
         'k1-a5.svg': { aktiv: ['enkel', 'standard', 'fordjupning'], enkel: 'Man kan säga att hela diamanten är en enda molekyl.', standard: 'genom att kol utsätts för mycket högt tryck och hög', fordjupning: 'När man lägger på en spänning vandrar de, och det är elektrisk' },
         'k1-a6.webp': { aktiv: ['enkel', 'standard', 'fordjupning'], enkel: 'i magen innan kroppen hinner ta upp det.', standard: 'binder giftet i magen innan kroppen hinner ta upp det.', fordjupning: 'Molekylerna binder till porernas insida och tränger aldrig in i själva' },
         'k1-a7.svg': { aktiv: ['enkel', 'standard', 'fordjupning'], enkel: 'och det leder både ström och värme mycket bra.', standard: 'böjligt, och leder både ström och värme mycket bra.', fordjupning: 'skulle ha en yta på några kvadratcentimeter och vore i stort sett verkningslöst.' }
       } },
  3: { dd: [],
       bilder: {
         'k1-a8.svg': { aktiv: ['enkel', 'standard', 'fordjupning'], enkel: 'Sex in, sex ut. Inga kolatomer försvinner. De har bara flyttat.', standard: 'också sex. Inga kolatomer försvinner på vägen.', fordjupning: 'det behöver bara energin från det första.' },
         'k1-a9.svg': { aktiv: ['enkel', 'standard', 'fordjupning'], enkel: 'C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O + energi', standard: 'C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O + energi', fordjupning: 'En glukosmolekyl räcker till ungefär 30 ATP-molekyler.' },
         'k1-a10.svg': { aktiv: ['enkel', 'standard', 'fordjupning'], enkel: 'Det här kallas **kolets kretslopp**.', standard: 'medan cellandningen pågår i alla celler dygnet runt.', fordjupning: 'kol utan varje grundämne som ingår i levande material.' }
       } }
};
// Kolväten (Organisk kemi 2). Ankare per nivå: standard = sista raden i stycket före bildrutan i avsnitt-N.md (satt-ihop-kolvaten.js
// rapporterar dem), enkel/fordjupning valda av Code ur avsnitt-N-enkel-fordjupning.md (arbetsorder 5, 2026-09-16) – rapporterade.
const AVSNITT_KOLVATEN = {
  1: { dd: [],
       bilder: {
         'k2-b1.svg': { aktiv: ['enkel', 'standard', 'fordjupning'], enkel: 'hur många väteatomer molekylen har.', standard: 'hur kolatomerna sitter ihop.', fordjupning: 'på kolatomerna, inte på vätet.' },
         'k2-b2.svg': { aktiv: ['enkel', 'standard', 'fordjupning'], enkel: 'Det finns alkaner med tjugo kolatomer, och betydligt fler än så.', standard: 'är hela tiden densamma.', fordjupning: 'Regeln stämmer: 2 × 6 + 2 = 14.' },
         'k2-b3.svg': { aktiv: ['enkel', 'standard', 'fordjupning'], enkel: 'Den räknar, den ritar inte.', standard: 'Det undersöker vi i avsnitt 3.', fordjupning: 'oavsett hur den ritas.' },
         'k2-b4.svg': { aktiv: ['enkel', 'standard', 'fordjupning'], enkel: 'Det enda som ändras är hur många kolatomer du börjar med.', standard: 'kolatomer du börjar med.', fordjupning: 'det handlar om två olika ämnen.' }
       } },
  2: { dd: [],   // arbetsorder 2 Kolväten (2026-09-15): k2-b5 AI-bild (nycklad), k2-b6 och k2-b7 SVG
       bilder: {
         'k2-b5.webp': { aktiv: ['enkel', 'standard', 'fordjupning'], enkel: 'växten dog, och nu är kolet på väg', standard: 'från luften, genom fotosyntesen.', fordjupning: 'varit ur cirkulation.' },
         'k2-b6.svg': { aktiv: ['enkel', 'standard', 'fordjupning'], enkel: 'vätskan och ersätter gasen som försvann.', standard: 'gas ut, och ny vätska förångas för att ersätta den.', fordjupning: 'vårdag kan det.' },
         'k2-b7.svg': { aktiv: ['enkel', 'standard', 'fordjupning'], enkel: 'När kedjan växer ändras både formeln och', standard: 'formeln utan också ämnets egenskaper.', fordjupning: 'lika mycket attraktion.' }
       } },
  3: { dd: [{ slug: 'namnsystemet', titel: 'Språket som kemisterna byggde', ikon: '📖' }],   // djupdykning från 3.2 (arbetsorder 8, 2026-09-16); tre SVG specade i bildrutorna
       bilder: {
         'k2-c1.svg': { aktiv: ['enkel', 'standard', 'fordjupning'], enkel: 'Ämnen som har samma molekylformel men olika strukturformel kallas **isomerer**.', standard: 'Ämnen som har samma molekylformel men olika strukturformel kallas', fordjupning: 'klotformad, och ett klot har den minsta möjliga ytan för sin storlek.' },
         'k2-c2.svg': { aktiv: ['enkel', 'standard', 'fordjupning'], enkel: 'Alla tre ämnena har två kolatomer. De har ändå olika formler.', standard: 'Alla tre ämnena har två kolatomer, men olika molekylformler.', fordjupning: 'Molekylen är alltså **låst** kring sin dubbelbindning.' },
         'k2-c3.svg': { aktiv: ['enkel', 'standard', 'fordjupning'], enkel: 'bindningen kan du räkna ut hur många väteatomer som ryms.', standard: 'hur många väteatomer som ryms.', fordjupning: 'Först från **pent-** och uppåt är namnen rena räkneord.' }
       } },
  4: { dd: [],   // arbetsorder 4 Kolväten (2026-09-15): tre SVG, specade i bildrutorna
       bilder: {
         'k2-d1.svg': { aktiv: ['enkel', 'standard', 'fordjupning'], enkel: 'som gör det till en polymer.', standard: 'kopplade efter varandra blir en mycket lång kedja, och det är den kedjan som är polymermolekylen.', fordjupning: 'medellängd och en spridning.' },
         'k2-d2.svg': { aktiv: ['enkel', 'standard', 'fordjupning'], enkel: 'Processen kallas **polymerisation**.', standard: 'Processen kallas **polymerisation**.', fordjupning: 'En enda initiatormolekyl kan ge upphov till en kedja med tiotusentals enheter.' },
         'k2-d3.svg': { aktiv: ['enkel', 'standard', 'fordjupning'], enkel: 'Skillnaden sitter i monomeren.', standard: 'fibrer. Skillnaden ligger i monomeren.', fordjupning: 'Samma monomer. Samma bindningar. Samma polymer, kemiskt sett. Skillnaden är hur kedjorna ligger.' }
       } }
};
// Fossila bränslen och förbränning (Organisk kemi 3, arbetsorder 2026-09-16, hela delkapitlet). Bildspecar i
// doc/leveranser/fossila-branslen/original/dk3-bildspecar.md; standard-ankare = slutet av det stycke som specens
// "vid N:e rubriken" pekar på (F3, H2 och J1 efter innehållet i stället – rapporterat), enkel/fordjupning valda av Code.
const AVSNITT_FOSSILA = {
  1: { dd: [],
       bilder: {
         'k3-e1.svg': { aktiv: ['enkel', 'standard', 'fordjupning'], enkel: '**torv** och sedan **kol**.', standard: 'miljontals år.', fordjupning: 'börjar det avge kolväten.' },
         'k3-e2.svg': { aktiv: ['enkel', 'standard', 'fordjupning'], enkel: 'Det är **tiden**.', standard: 'det långsamma i miljoner år.', fordjupning: 'fyndigheter vi kallar fossila bränslen.' },
         'k3-e3.svg': { aktiv: ['enkel', 'standard', 'fordjupning'], enkel: 'Kol kommer från **växter på land**.', standard: 'ungefär som vatten i en tvättsvamp.', fordjupning: 'reserver följer priset.' }
       } },
  2: { dd: [],
       bilder: {
         'k3-f1.svg': { aktiv: ['enkel', 'standard', 'fordjupning'], enkel: 'ungefär som vatten inuti en tvättsvamp.', standard: 'ungefär som vatten i en tvättsvamp.', fordjupning: 'Grundare ger kerogen som aldrig mognat.' },
         'k3-f2.svg': { aktiv: ['enkel', 'standard', 'fordjupning'], enkel: 'Varje sådan del kallas en **fraktion**.', standard: 'Varje sådan uppsamlad del kallas en **fraktion**.', fordjupning: 'inte av vad den innehåller.' },
         'k3-f3.svg': { aktiv: ['enkel', 'standard', 'fordjupning'], enkel: 'råoljan bestämma.', standard: 'efter vad råoljan råkar innehålla.', fordjupning: 'just för att vi krackar olja.' }
       } },
  3: { dd: [{ slug: 'gront-stal', titel: 'Stålet som inte får ryka', ikon: '🔥' }],   // djupdykning från 3.2 (arbetsorder 2026-09-16)
       bilder: {
         'k3-g1.svg': { aktiv: ['enkel', 'standard', 'fordjupning'], enkel: 'är ju samma kol som brinner.', standard: 'det är samma kol som brinner.', fordjupning: 'lämnar kolet.' },
         'k3-g2.svg': { aktiv: ['enkel', 'standard', 'fordjupning'], enkel: 'flyktiga ämnena redan är borta.', standard: 'ämnena redan är borta.', fordjupning: 'en gas möter allt.' },
         'k3-g3.webp': { aktiv: ['enkel', 'standard', 'fordjupning'], enkel: 'släpper ifrån sig det kol den lagrat.', standard: 'släpper ifrån sig det kol den lagrat.', fordjupning: 'framför allt för skogsbruk och jordbruk.' }
       } },
  4: { dd: [{ slug: 'gasledningar', titel: 'Gas går bara dit röret går', ikon: '🗺️' }],   // djupdykning från 4.1
       bilder: {
         'k3-h1.svg': { aktiv: ['enkel', 'standard', 'fordjupning'], enkel: 'byggt något rörnät som täcker landet.', standard: 'rörnät som täcker landet.', fordjupning: 'än vad industrin själv rapporterat.' },
         'k3-h2.svg': { aktiv: ['enkel', 'standard', 'fordjupning'], enkel: 'CH₄ + 2 O₂ → CO₂ + 2 H₂O', standard: 'CH₄ + 2 O₂ → CO₂ + 2 H₂O', fordjupning: 'så att reaktionen kan ske vid lägre temperatur.' },
         'k3-h3.svg': { aktiv: ['enkel', 'standard', 'fordjupning'], enkel: 'kolmonoxiden och sotet.', standard: 'energin aldrig frigörs.', fordjupning: 'om platsen släpper kolmonoxiden till slut.' }
       } },
  5: { dd: [],
       bilder: {
         'k3-j1.svg': { aktiv: ['enkel', 'standard', 'fordjupning'], enkel: 'Jorden blir varmare än den annars hade varit.', standard: 'ökar och effekten **förstärks**.', fordjupning: 'därför spelar det roll vilken gas som tillförs.' },
         'k3-j2.svg': { aktiv: ['enkel', 'standard', 'fordjupning'], enkel: 'näringsämnen sköljs ur marken.', standard: 'och pH-värdet sjunker.', fordjupning: 'Men det botar inte orsaken, och måste upprepas.' },
         'k3-j3.svg': { aktiv: ['enkel', 'standard', 'fordjupning'], enkel: 'Många av dem är giftiga redan i mycket små mängder.', standard: 'får betydelse om de pågår länge.', fordjupning: 'sjövattnet i sig inte är farligt att dricka.' }
       } }
};
const DELKAPITEL = {
  // bank: id-prefix och avsnittsoffset i kapitlets begreppsbank (en fil per kapitel; id/avsnitt unika över delkapitlen)
  repetition: { titel: 'Bakgrund och repetition', avsnitt: AVSNITT_REPETITION, bank: { idPrefix: '', avsnittOffset: 0 } },
  // uteslut: grundläggande begreppskort som INTE går till banken (kortet finns kvar som flipcard), term → skäl
  syror: { titel: 'Syror', avsnitt: AVSNITT_SYROR, bank: { idPrefix: 'S', avsnittOffset: 5, uteslut: { 'koncentration': 'finns redan i repetition avsnitt 5, där eleven möter begreppet först (Joachim 2026-09-13)' } } },
  baser: { titel: 'Baser', avsnitt: AVSNITT_BASER, bank: { idPrefix: 'B', avsnittOffset: 10 } },
  neutralisation: { titel: 'Neutralisation', avsnitt: AVSNITT_NEUTRALISATION, bank: { idPrefix: 'N', avsnittOffset: 14, uteslut: { 'neutralisation': 'finns redan i baser avsnitt 4, där eleven möter begreppet först (Joachim 2026-09-13)' } } },
  forsurning: { titel: 'Försurning', avsnitt: AVSNITT_FORSURNING, bank: { idPrefix: 'F', avsnittOffset: 16 } },
  salter: { titel: 'Salter', avsnitt: AVSNITT_SALTER, bank: { idPrefix: 'Sa', avsnittOffset: 19, uteslut: {
    'salt': 'finns redan i neutralisation avsnitt 1, där eleven möter begreppet först (Joachim 2026-09-14)',
    'jonbindning': 'finns redan i repetition avsnitt 3, där eleven möter begreppet först (Joachim 2026-09-14)',
    'sammansatt jon': 'finns redan i repetition avsnitt 1, där eleven möter begreppet först (Joachim 2026-09-14)' } } },
  // Organisk kemi: eget kapitel (kapitel/organisk-kemi/), byggfiler i undermappen bygg/; bank läggs till i order 3
  kolatomen: { titel: 'Kolatomen', kapitel: { id: 'organisk-kemi', titel: 'Organisk kemi' }, byggmapp: 'bygg', avsnitt: AVSNITT_KOLATOMEN,
    // egen begreppsbank per kapitel (kapitel/organisk-kemi/data/). uteslut: kapitelöverskridande dubbletter mot Syror och baser
    // (repetition avsnitt 3) – Joachims regel 2026-09-15: lägg inte in en andra version, skriv inte om den befintliga
    bank: { idPrefix: '', avsnittOffset: 0, uteslut: {
      'dubbelbindning': 'finns redan i Syror och baser, repetition avsnitt 3 (Joachim 2026-09-15)',
      'trippelbindning': 'finns redan i Syror och baser, repetition avsnitt 3 (Joachim 2026-09-15)',
      'strukturformel': 'finns redan i Syror och baser, repetition avsnitt 3 (Joachim 2026-09-15)' } } },
  kolvaten: { titel: 'Kolväten', kapitel: { id: 'organisk-kemi', titel: 'Organisk kemi' }, byggmapp: 'bygg', avsnitt: AVSNITT_KOLVATEN,
    // kapitlets bank delas med Kolatomen: id-prefix v (kv1-b1 …) och avsnitt 4–7 så att id/avsnitt är unika. uteslut: dubblett mot
    // Syror och baser (Joachims regel 2026-09-15: lägg inte in en andra version). Kontroll 2026-09-16: 38 kandidater mot 26 + 167 – en träff.
    bank: { idPrefix: 'v', avsnittOffset: 3, uteslut: {
      'enkelbindning': 'finns redan i Syror och baser, repetition avsnitt 3 (arbetsorder 6 Kolväten, 2026-09-16)' } } },
  'fossila-branslen': { titel: 'Fossila bränslen och förbränning', kapitel: { id: 'organisk-kemi', titel: 'Organisk kemi' }, byggmapp: 'bygg', avsnitt: AVSNITT_FOSSILA,
    // kapitlets bank delas med Kolatomen och Kolväten: id-prefix f, avsnitt 8–12. Dubblettkontroll 2026-09-16 (arbetsorder flipcards
    // delkapitel 3): 46 kandidater mot 63 + 167 – sju träffar, uteslutna enligt Joachims regel (lägg inte in en andra version)
    bank: { idPrefix: 'f', avsnittOffset: 7, uteslut: {
      'det snabba kretsloppet': 'finns redan i Kolatomen avsnitt 3 (kapitlets bank)',
      'naturgas': 'finns redan i Kolväten avsnitt 2 (kapitlets bank)',
      'katalysator': 'finns redan i Syror och baser, försurning avsnitt 3',
      'svaveldioxid': 'finns redan i Syror och baser, försurning avsnitt 1',
      'svavelsyra': 'finns redan i Syror och baser, syror avsnitt 5',
      'kväveoxider': 'finns redan i Syror och baser, försurning avsnitt 1',
      'försurning': 'finns redan i Syror och baser, försurning avsnitt 1' } } }
};
module.exports = { DELKAPITEL };
