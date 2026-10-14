import { test, expect } from "../fixtures.js";
import { EVENEMENT_INEXISTANT } from "../data/regles.js";

test.describe("Ouvrir un événement (visiteur)", () => {
  test("cliquer sur une carte ouvre la page de cet événement", async ({ catalogue, pageEvenement }) => {
    const titre = await catalogue.titre();

    await catalogue.ouvrirEvenement();

    await pageEvenement.verifierTitre(titre);
  });

  test("l'événement propose des catégories avec un prix et des places", async ({ evenement }) => {
    const categories = await evenement.categories();

    expect(categories.length).toBeGreaterThan(0);
    for (const categorie of categories) {
      expect(categorie.nom).not.toBe("");
      expect(categorie.prix).toBeGreaterThanOrEqual(0);
      expect(categorie.dispo).toBeGreaterThanOrEqual(0);
    }
  });

  test("un événement qui n'existe pas n'affiche aucun billet", async ({ pageEvenement }) => {
    await pageEvenement.ouvrir(EVENEMENT_INEXISTANT);

    await pageEvenement.verifierAucuneCategorie();
  });
});
