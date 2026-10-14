import { test } from "../fixtures.js";
import { MAX_BILLETS_PAR_COMMANDE as MAX } from "../data/regles.js";

const MOITIE = MAX / 2;

test.describe("Panier (visiteur)", () => {
  test("au départ : 0 billet, 0 € et paiement impossible", async ({ evenement }) => {
    await evenement.verifierTotaux({ billets: 0, centimes: 0 });
    await evenement.verifierPaiementPossible(false);
  });

  test("1 billet : total = prix de la catégorie", async ({ evenement }) => {
    const cat = await evenement.categorieAvecPlaces(1);

    await cat.ajouter(1);

    await cat.verifierQuantite(1);
    await evenement.verifierTotaux({ billets: 1, centimes: cat.prix });
    await evenement.verifierPaiementPossible(true);
  });

  test("prix total = prix × quantité", async ({ evenement }) => {
    const cat = await evenement.categorieAvecPlaces(3);

    await cat.ajouter(3);

    await evenement.verifierTotaux({ billets: 3, centimes: cat.prix * 3 });
  });

  test("le total additionne plusieurs catégories", async ({ evenement }) => {
    const [a, b] = await evenement.categoriesAvecPlaces(2, 2);

    await a.ajouter(2);
    await b.ajouter(1);

    await evenement.verifierTotaux({ billets: 3, centimes: a.prix * 2 + b.prix });
  });

  test("retirer un billet remet le total à 0 et bloque le -", async ({ evenement }) => {
    const cat = await evenement.categorieAvecPlaces(1);

    await cat.verifierRetraitBloque();
    await cat.ajouter(1);
    await cat.retirer(1);

    await cat.verifierQuantite(0);
    await cat.verifierRetraitBloque();
    await evenement.verifierTotaux({ billets: 0, centimes: 0 });
  });

  test(`maximum ${MAX} billets par commande`, async ({ evenement }) => {
    const cat = await evenement.categorieAvecPlaces(MAX + 1);

    await cat.ajouter(MAX);

    await cat.verifierQuantite(MAX);
    await cat.verifierAjoutBloque();
    await evenement.verifierTotaux({ billets: MAX, centimes: cat.prix * MAX });
  });

  test(`le maximum de ${MAX} vaut pour toutes les catégories ensemble`, async ({ evenement }) => {
    const [a, b] = await evenement.categoriesAvecPlaces(2, MOITIE);

    await a.ajouter(MOITIE);
    await b.ajouter(MOITIE);

    await evenement.verifierTotaux({ billets: MAX, centimes: (a.prix + b.prix) * MOITIE });
    await a.verifierAjoutBloque();
    await b.verifierAjoutBloque();
  });

  test("maximum disponible : pas plus de billets que de places restantes", async ({ evenement }) => {
    const [cat] = await evenement.categoriesOuSkip(
      (c) => c.dispo >= 1 && c.dispo < MAX,
      1,
      `Aucune catégorie avec moins de ${MAX} places`,
    );

    await cat.ajouter(cat.dispo);

    await cat.verifierQuantite(cat.dispo);
    await cat.verifierAjoutBloque();
  });

  test("une catégorie complète est bloquée", async ({ evenement }) => {
    const [cat] = await evenement.categoriesOuSkip((c) => c.dispo === 0, 1, "Aucune catégorie complète");

    await cat.verifierAjoutBloque();
  });

  test("un visiteur est envoyé vers la connexion au moment de payer", async ({ evenement }) => {
    const cat = await evenement.categorieAvecPlaces(1);
    await cat.ajouter(1);

    await evenement.continuerVersPaiement();

    await evenement.verifierRedirigeVersConnexion();
  });
});
