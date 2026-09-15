# Rättelse — bild B2, delkapitel 2 avsnitt 1

> Levererad av Joachim 2026-09-15 (klistrad i chatten), sparad ordagrant. Texterna (alt, bildtexter, Titta efter) i
> avsnitt-1.md är oförändrade; bilden ritas av verktyg/bilder-svg-kolvaten.js (avsnitt B2, med kontrollerna i
> "Kontroller att rapportera" inbyggda). Byggd med fyra rader; beslut om två rader tas efter granskning.

B3 fungerar och byggs inte om. B2 är för plottrig och byggs om.

Placeringen är oförändrad: **1.2, vid första rubriken.**

---

## Grundprincipen: rita som B3

Strukturformlerna i B2 ska ritas **exakt som i B3** — samma teckengrad, samma bindningslängd,
samma luft mellan atomerna.

I den nuvarande versionen sitter atomerna tätare och bindningsstrecken mellan kolatomerna är
kortare. Det är den enskilt största orsaken till att bilden känns trång. Återanvänd
ritrutinen från B3 i stället för att rita om.

---

## Markeringen av den tillkomna CH₂-gruppen

De gröna rutorna utgår. En ruta runt tre atomer skapar ett eget grafiskt objekt som konkurrerar
med strukturformeln, och när det upprepas i tre rader blir det rörigt.

Markera i stället **atomerna själva**: den tillkomna kolatomen och dess två väteatomer ritas i
signaturfärg `#5a9668`, tillsammans med de tre bindningsstreck som hör till dem. Övriga atomer
och streck står kvar i vanlig färg.

Ingen ram, ingen bakgrundsplatta, ingen kontur. Bara färgen.

Metanraden har ingen markering, som tidigare.

---

## Texten i och runt bilden

Bilden säger i dag samma sak tre gånger: `+ CH₂` under varje molekylformel, en fetad rad längst
ner, och en kursiv bildtext under den.

**Behåll molekylformlerna till höger** — CH₄, C₂H₆, C₃H₈, C₄H₁₀ — men **ta bort `+ CH₂`** under
dem.

**Ta bort den fetade raden** "Varje steg i serien: en kolatom och två väteatomer till."

**Behåll bildtexten.** Den är bildtext och renderas utanför SVG:n.

Kvar i bilden blir då: namnen till vänster, strukturformlerna i mitten med de gröna atomerna,
och molekylformlerna till höger. Tre kolumner, ingenting annat.

---

## Kontroller att rapportera

- Bindningslängd och teckengrad är identiska med B3 — jämför värdena i de två filerna.
- Grön markering omfattar exakt 1 C + 2 H i raderna för etan, propan och butan. Metanraden
  saknar markering.
- Inga rutor, ramar eller bakgrundsplattor förekommer.
- Ingen `+ CH₂`-text och ingen fetad rad förekommer i SVG:n.
- Atomantal per rad oförändrade: 1+4, 2+6, 3+8, 4+10.

---

## Texterna är oförändrade

Alt-text, bildtext Enkel, bildtext Standard och de tre Titta efter-punkterna står kvar som de
är i leveransfilen.

---

## Om bilden ändå känns överflödig

B2 och B3 visar samma fyra ämnen. Skillnaden är att B3 visar **hur man skriver** en molekyl och
B2 visar **hur serien växer**. Det är två olika frågor, och därför förordar jag att båda står
kvar.

Men om den omgjorda B2 fortfarande känns som en blekare kopia av B3 när du ser den, är den
enkla utvägen att korta B2 till **två rader** — etan och propan. Två rader räcker för att visa
ett mönster, och då blir de två bilderna omöjliga att förväxla.

Bygg fyra rader först. Vi avgör efter att du sett den.
