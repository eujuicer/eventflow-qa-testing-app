import { expect, test } from "@playwright/test";

// Une catégorie de billets (ex : "Standard", "VIP").
export class Categorie {
  constructor(ligne, infos) {
    this.ligne = ligne;
    this.nom = infos.nom;
    this.prix = infos.prix; // prix d'un billet en centimes
    this.dispo = infos.dispo; // places restantes
    this.boutonPlus = ligne.getByTestId("category-plus");
    this.boutonMoins = ligne.getByTestId("category-minus");
    this.quantite = ligne.getByTestId("category-qty");
  }

  async ajouter(n = 1) {
    for (let i = 0; i < n; i++) await this.boutonPlus.click();
  }

  async retirer(n = 1) {
    for (let i = 0; i < n; i++) await this.boutonMoins.click();
  }

  async verifierQuantite(n) {
    await expect(this.quantite).toHaveText(String(n));
  }

  async verifierAjoutBloque() {
    await expect(this.boutonPlus).toBeDisabled();
  }

  async verifierRetraitBloque() {
    await expect(this.boutonMoins).toBeDisabled();
  }
}

// Page Object du détail d'un événement avec son panier.
export class EventPage {
  constructor(page) {
    this.page = page;
    this.titre = page.getByTestId("event-title");
    this.lignes = page.getByTestId("category-row");
    this.libelleTotal = page.getByTestId("cart-total-label");
    this.prixTotal = page.getByTestId("cart-total-price");
    this.boutonPayer = page.getByTestId("reserve-button");
  }

  // ----- Actions -----
  async ouvrir(id) {
    await this.page.goto(`/events/${id}`);
  }

  async continuerVersPaiement() {
    await this.boutonPayer.click();
  }

  // ----- Lectures -----
  async categories() {
    await expect(this.lignes.first()).toBeVisible();
    const liste = [];
    for (let i = 0; i < (await this.lignes.count()); i++) {
      const ligne = this.lignes.nth(i);
      liste.push(
        new Categorie(ligne, {
          nom: (await ligne.getByTestId("category-name").innerText()).trim(),
          prix: Number(await ligne.getAttribute("data-price-cents")),
          dispo: Number(await ligne.getAttribute("data-available")),
        }),
      );
    }
    return liste;
  }

  // Renvoie `nombre` catégories qui respectent la condition.
  // Si l'événement ne s'y prête pas, le test est IGNORÉ (skip) avec la raison, pas en échec.
  async categoriesOuSkip(condition, nombre, raison) {
    const trouvees = (await this.categories()).filter(condition);
    test.skip(trouvees.length < nombre, raison);
    return trouvees.slice(0, nombre);
  }

  // Raccourcis : `nombre` catégories ayant au moins `places` places (message de skip généré).
  async categoriesAvecPlaces(nombre = 1, places = 1) {
    return this.categoriesOuSkip(
      (c) => c.dispo >= places,
      nombre,
      `Il faut ${nombre} catégorie(s) avec au moins ${places} place(s)`,
    );
  }

  async categorieAvecPlaces(places = 1) {
    const [categorie] = await this.categoriesAvecPlaces(1, places);
    return categorie;
  }

  // ----- Vérifications -----
  async verifierTitre(titre) {
    await expect(this.titre).toHaveText(titre);
  }

  async verifierAucuneCategorie() {
    await expect(this.lignes).toHaveCount(0);
  }

  async verifierTotaux({ billets, centimes }) {
    await expect(this.libelleTotal).toHaveAttribute("data-quantity", String(billets));
    await expect(this.prixTotal).toHaveAttribute("data-cents", String(centimes));
  }

  async verifierPaiementPossible(possible) {
    if (possible) await expect(this.boutonPayer).toBeEnabled();
    else await expect(this.boutonPayer).toBeDisabled();
  }

  async verifierRedirigeVersConnexion() {
    await expect(this.page).toHaveURL(/\/login/);
  }
}
