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
         'vad-blir-kvar.svg': { aktiv: ['enkel', 'standard'], enkel: 'De simmar omkring precis som förut', standard: 'finns fortfarande kvar lösta i vattnet efteråt' }
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
    'sammansatt jon': 'finns redan i repetition avsnitt 1, där eleven möter begreppet först (Joachim 2026-09-14)' } } }
};
module.exports = { DELKAPITEL };
