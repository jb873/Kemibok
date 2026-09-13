// bygg-avsnitt-konfig.js – per-avsnitt konfiguration för bygg-avsnitt.js och bygg-djupdykning.js
// (det leveransen inte säger maskinläsbart: slug/titel, djupdykningar, bildankare, faktaruta-ankare).
'use strict';
const AVSNITT_REPETITION = {
  1: { slug: 'atomer-molekyler-joner', titel: 'Atomer, molekyler och joner', sub: 'materiens minsta byggstenar',
       dd: [{ slug: 'kvarkar', titel: 'Kvarkar', ikon: '⚛️' }],
       bilder: {
         'atommodell-litium.webp': { aktiv: ['enkel', 'standard'], enkel: 'protoner och neutroner inne i kärnan, elektroner utanför', standard: 'I atomkärnan finns **protoner** och **neutroner**' },
         'attrahera-repellera.webp': { aktiv: ['enkel', 'standard'], enkel: 'snäpper de ihop', standard: 'Vi säger att de **attraherar** varandra' },
         'grundamne-forening.webp': { aktiv: ['enkel', 'standard'], enkel: 'bara genom att titta på formeln', standard: 'Genom att titta på vilka atomslag som ingår' },
         'litium-atom-och-jon.webp': { aktiv: ['enkel', 'standard'], enkel: 'Det lilla plustecknet visar att laddningen är positiv', standard: 'Plustecknet visar att partikeln har en positiv laddning' }
       },
       // faktarutan (leveransens ## FAKTARUTA-sektion) läggs efter ankarstycket och den figur som följer det
       faktaruta: { enkel: 'snäpper de ihop', standard: 'Vi säger att de **attraherar** varandra' } },
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
         'tre-vagar.svg': { aktiv: ['enkel', 'standard'], enkel: 'jonbindning, kovalent bindning och metallbindning', standard: 'på var i det periodiska systemet den' }
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
       bilder: { 'vatejon-och-oxoniumjon.svg': { aktiv: [], standard: 'H₂O + H⁺ → H₃O⁺' } },   // endast Standard; efter reaktionsraden
       faktaruta: { standard: 'egentligen oxoniumjoner som' } },
  2: { dd: [{ slug: 'ph-och-mol', titel: 'pH-värdet: oxoniumjoner, hydroxidjoner och mol', ikon: '🧪' }],   // Joachims text, doc/leveranser/syror/ph-vardet.md
       bilder: { 'ph-skalan.svg': { aktiv: [], enkel: 'en tvållösning kan ha 9 eller 10', standard: 'många tvållösningar är basiska' } } },
  3: { dd: [],
       bilder: { 'stark-och-svag-syra.webp': { aktiv: ['enkel', 'standard'], enkel: 'helt olika många vätejoner i vattnet', standard: 'partiklar som har avgett den' } } },
  4: { dd: [{ slug: 'mol', titel: 'Mol: en brygga mellan atomer och gram', ikon: '⚖️' }],   // Joachims text, mol.md – länkas senare även från neutralisation/salter (byggs där ur samma fil)
       bilder: { 'fyra-kombinationerna.svg': { aktiv: [], enkel: 'en syra som avger ogärna', standard: 'Utspädd ättiksyra är ett exempel' } } },
  5: { dd: [],
       bilder: { 'syra-och-metall.webp': { aktiv: [], enkel: 'tillsammans en vätgasmolekyl', standard: 'metallatomerna avger elektroner' } } }
};
const DELKAPITEL = {
  repetition: { titel: 'Bakgrund och repetition', avsnitt: AVSNITT_REPETITION },
  syror: { titel: 'Syror', avsnitt: AVSNITT_SYROR }
};
module.exports = { DELKAPITEL };
