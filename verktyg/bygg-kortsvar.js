// bygg-kortsvar.js – kortsvarsfiler för avsnitt 2–5 ur leveransen 2026-09-13 (doc/kortsvar-avsnitt-2-5.md).
// Kör: node verktyg/bygg-kortsvar.js   → kapitel/syror-och-baser/data/kortsvar/avsnitt-N-{slug}.json
// Schema: KEMI-TILLAGG §8. Formler i förklaringar som \(\ce{…}\) (String.raw → JSON.stringify dubblar).
// Flerval: första alternativet i leveransen är det rätta (svar: 0); kortsvar.js blandar alternativen.
'use strict';
const fs = require('fs'), path = require('path');
const G = require('../js/kortsvar-gradering.js');
const ROT = path.join(__dirname, '..');
const ce = s => String.raw`\(\ce{` + s + String.raw`}\)`;
const SLUG = { 2: 'periodiska-systemet', 3: 'kemiska-bindningar', 4: 'vattnets-egenskaper', 5: 'losningar' };
const TITEL = { 2: 'Det periodiska systemet', 3: 'Kemiska bindningar', 4: 'Vattnets egenskaper', 5: 'Lösningar' };

const tal = (fraga, svar, forklaring) => ({ typ: 'tal', fraga, svar, forklaring });
const ord = (fraga, svar, forklaring) => ({ typ: 'ord', fraga, svar, forklaring });
const formel = (fraga, svar, forklaring) => ({ typ: 'formel', fraga, svar: [svar], forklaring });
const flerval = (fraga, alternativ, forklaring) => ({ typ: 'flerval', fraga, alternativ, svar: 0, forklaring });

const FRAGOR = {
  2: [
    tal('Kol har atomnummer 6. Hur många protoner har en kolatom?', 6, 'Atomnumret är alltid samma sak som antalet protoner.'),
    tal('Hur många valenselektroner har ett atomslag i grupp 1?', 1, 'Gruppnumret säger antalet valenselektroner i huvudgrupperna. Grupp 1 har en.'),
    tal('Hur många valenselektroner har ett atomslag i grupp 17?', 7, 'Grupp 17 har sju — de saknar alltså bara en för att nå åtta.'),
    tal('Ett atomslag står i period 2. Hur många elektronskal använder det?', 2, 'Perioden talar om hur många skal atomen använder. Period 2 betyder två skal.'),
    ord('Vad kallas de vågräta raderna i det periodiska systemet?', ['period', 'perioder'], 'Raderna kallas perioder. Kolumnerna kallas grupper.'),
    ord('Vad kallas de lodräta kolumnerna i det periodiska systemet?', ['grupp', 'grupper'], 'Kolumnerna kallas grupper. Atomslag i samma grupp har lika många valenselektroner.'),
    ord('Vad kallas elektronerna i atomens yttersta skal?', ['valenselektroner', 'valenselektron'], 'De kallas valenselektroner, och det är de som avgör hur atomen reagerar.'),
    ord('Vad kallas ämnena i grupp 18, som nästan inte reagerar alls?', ['ädelgaser', 'ädelgas'], 'Ädelgaserna har fullt yttersta skal och behöver varken avge eller ta upp elektroner.'),
    ord('Vad kallas ämnena i grupp 1, som har en enda valenselektron?', ['alkalimetaller', 'alkalimetall'], 'Alkalimetallerna avger lätt sin enda valenselektron och blir positiva joner.'),
    formel('Natrium avger sin enda valenselektron. Skriv jonen som bildas.', 'Na+', `Natrium tappar en elektron, så det blir ett plus över: ${ce('Na+')}.`),
    formel('Klor tar upp en elektron. Skriv jonen som bildas.', 'Cl-', `Klor tar upp en elektron, så det blir ett minus över: ${ce('Cl-')}.`),
    flerval('Var i det periodiska systemet finns de flesta metallerna?', ['Till vänster och i mitten', 'Till höger', 'Längst upp', 'Längst ner'], 'Metallerna finns till vänster och i mitten. Icke-metallerna finns till höger.')
  ],
  3: [
    ord('Vad kallas bindningen mellan en positiv och en negativ jon?', ['jonbindning'], 'Jonbindning är den elektriska attraktionen mellan joner med olika laddning.'),
    ord('Vad kallas bindningen där två atomer delar på elektroner?', ['kovalent bindning', 'elektronparbindning'], 'Kovalent bindning, som också kallas elektronparbindning. Atomerna delar i stället för att ge bort.'),
    ord('Vad kallas bindningen som håller ihop atomerna i en metall?', ['metallbindning'], 'Metallbindning. Positiva metalljoner omgivna av fria elektroner.'),
    ord('Vad kallas de två elektroner som två atomer delar på?', ['elektronpar'], 'Ett elektronpar. Båda atomerna räknar de två elektronerna som sina.'),
    ord('Vad kallas det när en atom har fullt yttersta elektronskal?', ['ädelgasstruktur'], 'Ädelgasstruktur, eftersom det är samma elektronuppsättning som en ädelgas har.'),
    tal('Hur många elektronpar delar atomerna i en dubbelbindning?', 2, 'Två elektronpar. Ett par ger enkelbindning, tre ger trippelbindning.'),
    tal('Hur många elektronpar delar atomerna i en trippelbindning?', 3, 'Tre elektronpar. Det gör trippelbindningen mycket stark.'),
    formel('Skriv formeln för en vattenmolekyl.', 'H2O', `Två väteatomer och en syreatom: ${ce('H2O')}.`),
    formel('Skriv formeln för en koldioxidmolekyl.', 'CO2', `En kolatom och två syreatomer: ${ce('CO2')}.`),
    formel('Skriv formeln för en syremolekyl.', 'O2', `Två syreatomer: ${ce('O2')}.`),
    flerval('Natrium är en metall och klor en icke-metall. Vilken bindning bildar de?', ['Jonbindning', 'Kovalent bindning', 'Metallbindning'], 'Jonbindning. Metallen avger en elektron, icke-metallen tar upp den, och jonerna attraherar varandra.'),
    flerval('Två icke-metaller reagerar med varandra. Vilken bindning blir det?', ['Kovalent bindning', 'Jonbindning', 'Metallbindning'], 'Kovalent bindning. Båda saknar elektroner, så ingen kan avge — de måste dela.')
  ],
  4: [
    ord('Vad kallas en molekyl som har en svagt positiv och en svagt negativ sida?', ['polär'], 'Polär. Vattenmolekylen är polär, och det förklarar nästan alla dess egenskaper.'),
    ord('Vad kallas ett ämnes massa i förhållande till dess volym?', ['densitet'], 'Densitet. Ett ämne med hög densitet har mycket massa på liten plats.'),
    ord('Vad kallas det när vattenytan dras ihop och blir så liten som möjligt?', ['ytspänning'], 'Ytspänning. Den uppstår eftersom molekylerna vid ytan saknar grannar ovanför sig.'),
    ord('Vad kallas attraktionen mellan vattenmolekyler?', ['vätebindning', 'vätebindningar'], 'Vätebindning. Den är svagare än bindningarna inuti molekylen, men de är många.'),
    tal('Vid vilken temperatur i celsius har flytande vatten sin högsta densitet?', 4, 'Vid 4 °C. Kyls vattnet ytterligare minskar densiteten igen.'),
    tal('Hur många väteatomer finns i en vattenmolekyl?', 2, `Två. Tvåan i ${ce('H2O')} står efter H och betyder två väteatomer.`),
    formel('Skriv formeln för en vattenmolekyl.', 'H2O', `Två väteatomer och en syreatom: ${ce('H2O')}.`),
    flerval('Vilken sida av vattenmolekylen är svagt negativ?', ['Syresidan', 'Vätesidan', 'Ingen av dem'], 'Syresidan. Syret drar hårdare i de delade elektronerna än väteatomerna gör.'),
    flerval('Vad händer med vattnets densitet när det fryser till is?', ['Den minskar', 'Den ökar', 'Den är oförändrad'], 'Den minskar. Molekylerna ordnar sig i ett mönster med tomrum i, så vattnet tar större plats.'),
    flerval('Varför flyter is på vatten?', ['Isen har lägre densitet än vattnet', 'Isen är kallare', 'Isen innehåller luft'], 'Isen har lägre densitet. Samma mängd vatten väger lika mycket men tar större plats som is.'),
    flerval('Vad gör diskmedel med vattnets ytspänning?', ['Sänker den', 'Höjer den', 'Påverkar den inte'], 'Sänker den. Därför sjunker ett gem som vilat på vattenytan när man tillsätter diskmedel.'),
    flerval('Varför kan fiskar överleva vintern i en igenfrusen sjö?', ['Isen flyter och isolerar, så vattnet under förblir flytande', 'Fiskarna gräver ner sig', 'Vattnet under isen är saltare'], 'Isen flyter och bildar ett isolerande lock. Under det är vattnet fortfarande flytande.')
  ],
  5: [
    ord('Vad kallas det ämne som löser ett annat ämne?', ['lösningsmedel'], 'Lösningsmedel. Det är oftast det ämne det finns mest av, och oftast vatten.'),
    ord('Vad kallas det ämne som löses i ett lösningsmedel?', ['löst ämne'], 'Löst ämne. Löser du socker i vatten är sockret det lösta ämnet.'),
    ord('Vad kallas ett mått på hur mycket löst ämne en lösning innehåller?', ['koncentration'], 'Koncentration. Mycket löst ämne betyder koncentrerad, lite betyder utspädd.'),
    ord('Vad kallas en lösning där inget mer av ämnet kan lösas?', ['mättad', 'mättad lösning'], 'Mättad. Allt som tillsätts därefter blir liggande olöst.'),
    ord('Vad kallas hur mycket av ett ämne som går att lösa i ett lösningsmedel?', ['löslighet'], 'Löslighet. Den beror på ämnet, lösningsmedlet och temperaturen.'),
    formel('Skriv formeln för koksalt.', 'NaCl', 'Natrium och klor: NaCl.'),
    flerval('Varför kan vatten lösa så många ämnen?', ['Vattenmolekylen är polär', 'Vatten är flytande', 'Vatten är genomskinligt'], 'Vattenmolekylen är polär och kan vända rätt sida mot laddade eller polära partiklar.'),
    flerval('Vad händer med jonerna när koksalt löses i vatten?', ['De skiljs åt och sprids ut i vattnet', 'De försvinner', 'De blir till molekyler'], 'De skiljs åt och sprids ut. Jonerna finns kvar — de är bara inte längre bundna till varandra.'),
    flerval('Varför leder en saltlösning ström, men inte en sockerlösning?', ['Saltlösningen innehåller fria joner', 'Salt är saltare', 'Socker är sötare'], 'Saltlösningen innehåller fria joner som kan röra sig. Socker blir inte joner när det löses.'),
    flerval('Varför blandar sig inte olja med vatten?', ['Olja är opolärt och attraheras inte av vattenmolekylerna', 'Olja är lättare', 'Olja är fet'], 'Olja är opolärt, så vattenmolekylerna har inget att haka tag i. De håller hellre ihop med varandra.'),
    flerval('Vad händer med koncentrationen om man tillsätter mer lösningsmedel?', ['Den minskar', 'Den ökar', 'Den är oförändrad'], 'Den minskar. Samma mängd löst ämne fördelas i mer lösningsmedel.'),
    flerval('Löser sig socker bäst i varmt eller kallt vatten?', ['Varmt', 'Kallt', 'Ingen skillnad'], 'Varmt. För de flesta fasta ämnen ökar lösligheten när temperaturen stiger.')
  ]
};

for (const N of [2, 3, 4, 5]) {
  const fragor = FRAGOR[N].map((f, i) => Object.assign({ id: `k${N}-s${i + 1}` }, f));
  if (fragor.length !== 12) { throw new Error(`avsnitt ${N}: ${fragor.length} frågor, väntade 12`); }
  const data = { avsnitt: N, titel: TITEL[N], delkapitel: 'repetition', version: '1.0',
    _kommentar: `Kortsvar för avsnitt ${N} (${TITEL[N]}), leverans 2026-09-13. 12 frågor, 10 per omgång. Regel: frågan får inte innehålla svaret (KEMI-TILLAGG §8).`,
    antal_per_omgang: 10, fragor };
  const fel = G.validera(data);
  if (fel.length) { throw new Error(`avsnitt ${N}: ${fel.join('; ')}`); }
  // facit-självtest: rätt svar ska ge ratt
  const RATT = { tal: f => String(f.svar), flerval: f => String(f.svar), ord: f => f.svar[0], formel: f => f.svar[0] };
  fragor.forEach(f => { if (G.gradera(f, RATT[f.typ](f)).status !== 'ratt') { throw new Error(`avsnitt ${N} ${f.id}: facit rättas inte som rätt`); } });
  // §8: facit i frågetexten?
  fragor.forEach(f => {
    const facit = (Array.isArray(f.svar) ? f.svar : [f.svar]).map(String);
    if (f.typ === 'flerval') { return; }
    const traff = facit.filter(s => new RegExp('(^|[^a-zåäö0-9])' + s.replace(/[+\-^]/g, '\\$&') + '([^a-zåäö0-9]|$)', 'i').test(f.fraga));
    if (traff.length) { console.log(`  ⚠ ${f.id} (${f.typ}): facit "${traff[0]}" förekommer i frågetexten – "${f.fraga}"`); }
  });
  const ut = path.join(ROT, 'kapitel', 'syror-och-baser', 'data', 'kortsvar', `avsnitt-${N}-${SLUG[N]}.json`);
  fs.writeFileSync(ut, JSON.stringify(data, null, 2) + '\n');
  const typer = fragor.reduce((a, f) => (a[f.typ] = (a[f.typ] || 0) + 1, a), {});
  console.log(`avsnitt ${N}: 12 frågor`, JSON.stringify(typer), '| formler i förklaringar:', fragor.filter(f => /\\ce\{/.test(f.forklaring)).length);
}
