# Kortsvar — delkapitel Bakgrund och repetition

> Återskapad 2026-09-13 ur de byggda kortsvar-JSON:erna (avsnitt 1 är Codes utkast ur modellkorten,
> 2–5 innehållschattens leverans). Bygg: node verktyg/bygg-kortsvar.js läser denna fil.
> Format per fråga: rubrikrad `## id · typ`, sedan F: (fråga), A: (alternativ, | mellan), S: (svar; för
> ord/formel flera accepterade med |, för markera/tal-par index/tal med komma), E: (förklaring, obligatorisk),
> O: (valfria fält som JSON: tolerans, enhet, oordnad, skiftlage). Formler i Unicode.

---

# AVSNITT 1 — Atomer, molekyler och joner
antal_per_omgang: 10
> UTKAST – ersätts när innehållschatten levererar.

## k1-s1 · tal
F: Hur många atomer finns det i en molekyl H₂O?
S: 3
E: Två väteatomer och en syreatom. Tvåan gäller bara vätet — står ingen siffra efter O menas en.

## k1-s2 · ord
F: Vilket ämne har atomnummer 7?
S: kväve | N
E: Atomnumret är antalet protoner, och 7 protoner är alltid kväve. Vilket ämne det är avgörs av antalet protoner — inget annat.

## k1-s3 · ord
F: En atom har 8 protoner i kärnan. Vilket ämne är det?
S: syre
E: Antalet protoner avgör vilket atomslag det är — inget annat. 8 protoner är alltid syre.

## k1-s4 · flerval
F: Är CO₂ ett grundämne eller en kemisk förening?
A: Grundämne | Kemisk förening
S: 1
E: Koldioxid innehåller två olika atomslag, kol och syre — därför en kemisk förening.

## k1-s5 · formel
F: En litiumatom tappar sin yttersta elektron. Skriv jonen som bildas, med laddning.
S: Li+
E: Protonerna är kvar (3 plus) men elektronerna blir bara 2 (2 minus). Ett plus över: Li⁺.

## k1-s6 · flerval
F: Vad händer med antalet protoner när en atom blir en jon?
A: Det ökar | Det minskar | Ingenting
S: 2
E: Antalet protoner ändras aldrig — det är bara elektronerna som kommer och går.

## k1-s7 · formel
F: Skriv formeln för en vattenmolekyl.
S: H2O
E: Två väteatomer och en syreatom: H₂O.

## k1-s8 · ord
F: Vad kallas elektronerna som sitter längst ut i atomen?
S: valenselektron
E: Valenselektronerna sitter i det yttersta skalet och avgör hur atomen reagerar med andra atomer.

## k1-s9 · markera
F: Vilka av följande är grundämnen?
A: O₂ | H₂O | N₂ | CO₂
S: 0, 2
E: Ett grundämne innehåller bara ett atomslag. O₂ och N₂ har två atomer men en sort; vatten och koldioxid har två sorter.

## k1-s10 · tal-par
F: Hur många protoner har en väteatom, och hur många har en kolatom?
S: 1, 6
E: Väte har atomnummer 1 och kol atomnummer 6 — atomnumret är antalet protoner.

## k1-s11 · ord
F: Vad kallas atomer av samma atomslag som har olika antal neutroner?
S: isotop
E: Isotoper har samma antal protoner och är därför samma ämne, men olika antal neutroner.

## k1-s12 · formel
F: En kloratom tar upp en elektron. Skriv jonen som bildas, med laddning.
S: Cl-
E: Klor får då fler minus än plus — en negativ jon, kloridjonen Cl⁻.

---

# AVSNITT 2 — Det periodiska systemet
antal_per_omgang: 10

## k2-s1 · ord
F: Vilket ämne har atomnummer 6?
S: kol | C
E: Atomnumret är antalet protoner, och sex protoner betyder alltid kol.

## k2-s2 · tal
F: Natrium har en enda valenselektron. Vilken grupp står natrium i?
S: 1
E: Gruppnumret säger antalet valenselektroner i huvudgrupperna. En valenselektron betyder grupp 1.

## k2-s3 · tal
F: Hur många valenselektroner har ett atomslag i grupp 17?
S: 7
E: Grupp 17 har sju — de saknar alltså bara en för att nå åtta.

## k2-s4 · tal
F: En atom använder tre elektronskal. Vilken period står den i?
S: 3
E: Perioden talar om hur många skal atomen använder. Tre skal betyder period 3.

## k2-s5 · ord
F: Vad kallas de vågräta raderna i det periodiska systemet?
S: period | perioder
E: Raderna kallas perioder. Kolumnerna kallas grupper.

## k2-s6 · ord
F: Vad kallas de lodräta kolumnerna i det periodiska systemet?
S: grupp | grupper
E: Kolumnerna kallas grupper. Atomslag i samma grupp har lika många valenselektroner.

## k2-s7 · ord
F: Vad kallas elektronerna i atomens yttersta skal?
S: valenselektroner | valenselektron
E: De kallas valenselektroner, och det är de som avgör hur atomen reagerar.

## k2-s8 · ord
F: Vad kallas ämnena i grupp 18, som nästan inte reagerar alls?
S: ädelgaser | ädelgas
E: Ädelgaserna har fullt yttersta skal och behöver varken avge eller ta upp elektroner.

## k2-s9 · ord
F: Vad kallas ämnena i grupp 1, som har en enda valenselektron?
S: alkalimetaller | alkalimetall
E: Alkalimetallerna avger lätt sin enda valenselektron och blir positiva joner.

## k2-s10 · formel
F: Natrium avger sin enda valenselektron. Skriv jonen som bildas.
S: Na+
E: Natrium tappar en elektron, så det blir ett plus över: Na⁺.

## k2-s11 · formel
F: Klor tar upp en elektron. Skriv jonen som bildas.
S: Cl-
E: Klor tar upp en elektron, så det blir ett minus över: Cl⁻.

## k2-s12 · flerval
F: Var i det periodiska systemet finns de flesta metallerna?
A: Till vänster och i mitten | Till höger | Längst upp | Längst ner
S: 0
E: Metallerna finns till vänster och i mitten. Icke-metallerna finns till höger.

---

# AVSNITT 3 — Kemiska bindningar
antal_per_omgang: 10

## k3-s1 · ord
F: Vad kallas bindningen mellan en positiv och en negativ jon?
S: jonbindning
E: Jonbindning är den elektriska attraktionen mellan joner med olika laddning.

## k3-s2 · ord
F: Vad kallas bindningen där två atomer delar på elektroner?
S: kovalent bindning | elektronparbindning
E: Kovalent bindning, som också kallas elektronparbindning. Atomerna delar i stället för att ge bort.

## k3-s3 · ord
F: Vad kallas bindningen som håller ihop atomerna i en metall?
S: metallbindning
E: Metallbindning. Positiva metalljoner omgivna av fria elektroner.

## k3-s4 · ord
F: Vad kallas de två elektroner som två atomer delar på?
S: elektronpar
E: Ett elektronpar. Båda atomerna räknar de två elektronerna som sina.

## k3-s5 · ord
F: Vad kallas det när en atom har fullt yttersta elektronskal?
S: ädelgasstruktur
E: Ädelgasstruktur, eftersom det är samma elektronuppsättning som en ädelgas har.

## k3-s6 · tal
F: Hur många elektronpar delar atomerna i en dubbelbindning?
S: 2
E: Två elektronpar. Ett par ger enkelbindning, tre ger trippelbindning.

## k3-s7 · tal
F: Hur många elektronpar delar atomerna i en trippelbindning?
S: 3
E: Tre elektronpar. Det gör trippelbindningen mycket stark.

## k3-s8 · formel
F: Skriv formeln för en vattenmolekyl.
S: H2O
E: Två väteatomer och en syreatom: H₂O.

## k3-s9 · formel
F: Skriv formeln för en koldioxidmolekyl.
S: CO2
E: En kolatom och två syreatomer: CO₂.

## k3-s10 · formel
F: Skriv formeln för en syremolekyl.
S: O2
E: Två syreatomer: O₂.

## k3-s11 · flerval
F: Natrium är en metall och klor en icke-metall. Vilken bindning bildar de?
A: Jonbindning | Kovalent bindning | Metallbindning
S: 0
E: Jonbindning. Metallen avger en elektron, icke-metallen tar upp den, och jonerna attraherar varandra.

## k3-s12 · flerval
F: Två icke-metaller reagerar med varandra. Vilken bindning blir det?
A: Kovalent bindning | Jonbindning | Metallbindning
S: 0
E: Kovalent bindning. Båda saknar elektroner, så ingen kan avge — de måste dela.

---

# AVSNITT 4 — Vattnets egenskaper
antal_per_omgang: 10

## k4-s1 · ord
F: Vad kallas en molekyl som har en svagt positiv och en svagt negativ sida?
S: polär
E: Polär. Vattenmolekylen är polär, och det förklarar nästan alla dess egenskaper.

## k4-s2 · ord
F: Vad kallas ett ämnes massa i förhållande till dess volym?
S: densitet
E: Densitet. Ett ämne med hög densitet har mycket massa på liten plats.

## k4-s3 · ord
F: Vad kallas det när vattenytan dras ihop och blir så liten som möjligt?
S: ytspänning
E: Ytspänning. Den uppstår eftersom molekylerna vid ytan saknar grannar ovanför sig.

## k4-s4 · ord
F: Vad kallas attraktionen mellan vattenmolekyler?
S: vätebindning | vätebindningar
E: Vätebindning. Den är svagare än bindningarna inuti molekylen, men de är många.

## k4-s5 · tal
F: Vid vilken temperatur i celsius har flytande vatten sin högsta densitet?
S: 4
E: Vid 4 °C. Kyls vattnet ytterligare minskar densiteten igen.

## k4-s6 · tal
F: Hur många väteatomer finns i en vattenmolekyl?
S: 2
E: Två. Tvåan i H₂O står efter H och betyder två väteatomer.

## k4-s7 · formel
F: Skriv formeln för en vattenmolekyl.
S: H2O
E: Två väteatomer och en syreatom: H₂O.

## k4-s8 · flerval
F: Vilken sida av vattenmolekylen är svagt negativ?
A: Syresidan | Vätesidan | Ingen av dem
S: 0
E: Syresidan. Syret drar hårdare i de delade elektronerna än väteatomerna gör.

## k4-s9 · flerval
F: Vad händer med vattnets densitet när det fryser till is?
A: Den minskar | Den ökar | Den är oförändrad
S: 0
E: Den minskar. Molekylerna ordnar sig i ett mönster med tomrum i, så vattnet tar större plats.

## k4-s10 · flerval
F: Varför flyter is på vatten?
A: Isen har lägre densitet än vattnet | Isen är kallare | Isen innehåller luft
S: 0
E: Isen har lägre densitet. Samma mängd vatten väger lika mycket men tar större plats som is.

## k4-s11 · flerval
F: Vad gör diskmedel med vattnets ytspänning?
A: Sänker den | Höjer den | Påverkar den inte
S: 0
E: Sänker den. Därför sjunker ett gem som vilat på vattenytan när man tillsätter diskmedel.

## k4-s12 · flerval
F: Varför kan fiskar överleva vintern i en igenfrusen sjö?
A: Isen flyter och isolerar, så vattnet under förblir flytande | Fiskarna gräver ner sig | Vattnet under isen är saltare
S: 0
E: Isen flyter och bildar ett isolerande lock. Under det är vattnet fortfarande flytande.

---

# AVSNITT 5 — Lösningar
antal_per_omgang: 10

## k5-s1 · ord
F: Vad kallas det ämne som löser ett annat ämne?
S: lösningsmedel
E: Lösningsmedel. Det är oftast det ämne det finns mest av, och oftast vatten.

## k5-s2 · ord
F: Vad kallas det ämne som löses i ett lösningsmedel?
S: löst ämne
E: Löst ämne. Löser du socker i vatten är sockret det lösta ämnet.

## k5-s3 · ord
F: Vad kallas ett mått på hur mycket löst ämne en lösning innehåller?
S: koncentration
E: Koncentration. Mycket löst ämne betyder koncentrerad, lite betyder utspädd.

## k5-s4 · ord
F: Vad kallas en lösning där inget mer av ämnet kan lösas?
S: mättad | mättad lösning
E: Mättad. Allt som tillsätts därefter blir liggande olöst.

## k5-s5 · ord
F: Vad kallas hur mycket av ett ämne som går att lösa i ett lösningsmedel?
S: löslighet
E: Löslighet. Den beror på ämnet, lösningsmedlet och temperaturen.

## k5-s6 · formel
F: Skriv formeln för koksalt.
S: NaCl
E: Natrium och klor: NaCl.

## k5-s7 · flerval
F: Varför kan vatten lösa så många ämnen?
A: Vattenmolekylen är polär | Vatten är flytande | Vatten är genomskinligt
S: 0
E: Vattenmolekylen är polär och kan vända rätt sida mot laddade eller polära partiklar.

## k5-s8 · flerval
F: Vad händer med jonerna när koksalt löses i vatten?
A: De skiljs åt och sprids ut i vattnet | De försvinner | De blir till molekyler
S: 0
E: De skiljs åt och sprids ut. Jonerna finns kvar — de är bara inte längre bundna till varandra.

## k5-s9 · flerval
F: Varför leder en saltlösning ström, men inte en sockerlösning?
A: Saltlösningen innehåller fria joner | Salt är saltare | Socker är sötare
S: 0
E: Saltlösningen innehåller fria joner som kan röra sig. Socker blir inte joner när det löses.

## k5-s10 · flerval
F: Varför blandar sig inte olja med vatten?
A: Olja är opolärt och attraheras inte av vattenmolekylerna | Olja är lättare | Olja är fet
S: 0
E: Olja är opolärt, så vattenmolekylerna har inget att haka tag i. De håller hellre ihop med varandra.

## k5-s11 · flerval
F: Vad händer med koncentrationen om man tillsätter mer lösningsmedel?
A: Den minskar | Den ökar | Den är oförändrad
S: 0
E: Den minskar. Samma mängd löst ämne fördelas i mer lösningsmedel.

## k5-s12 · flerval
F: Löser sig socker bäst i varmt eller kallt vatten?
A: Varmt | Kallt | Ingen skillnad
S: 0
E: Varmt. För de flesta fasta ämnen ökar lösligheten när temperaturen stiger.
