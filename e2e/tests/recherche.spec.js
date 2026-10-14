import { test } from "../fixtures.js";
import { RECHERCHE_SANS_RESULTAT } from "../data/regles.js";

test.describe("Recherche d'événements (visiteur)", () => {
  test("le catalogue affiche au moins un événement", async ({ catalogue }) => {
    await catalogue.verifierAuMoinsUnEvenement();
  });

  // Même scénario pour plusieurs façons d'écrire le terme.
  const variantes = [
    ["tel qu'il apparaît dans le titre", (mot) => mot],
    ["en majuscules", (mot) => mot.toUpperCase()],
    ["en minuscules", (mot) => mot.toLowerCase()],
  ];
  for (const [nom, transformer] of variantes) {
    test(`un mot du titre ${nom} ne garde que les événements qui le contiennent`, async ({ catalogue }) => {
      const mot = await catalogue.motDeRecherche();

      await catalogue.rechercher(transformer(mot));

      await catalogue.verifierTitresContiennent(mot);
    });
  }

  // Même résultat attendu, que l'on valide par le bouton ou par la touche Entrée.
  for (const avecEntree of [false, true]) {
    test(`une recherche sans résultat affiche un message (${avecEntree ? "touche Entrée" : "bouton"})`, async ({ catalogue }) => {
      await catalogue.rechercher(RECHERCHE_SANS_RESULTAT, { avecEntree });

      await catalogue.verifierAucunEvenement();
    });
  }

  test("vider la recherche réaffiche tous les événements", async ({ catalogue }) => {
    const avant = await catalogue.nombreEvenements();
    await catalogue.rechercher(RECHERCHE_SANS_RESULTAT);
    await catalogue.verifierAucunEvenement();

    await catalogue.rechercher("");

    await catalogue.verifierNombreEvenements(avant);
  });
});
