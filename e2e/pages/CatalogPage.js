import { expect } from "@playwright/test";

// Page Object du catalogue. Les tests parlent "métier" (rechercher, ouvrir...) :
// toute la technique (repérage des éléments) reste dans ce fichier.
export class CatalogPage {
  constructor(page) {
    this.page = page;
    this.champRecherche = page.getByTestId("search-input");
    this.boutonRecherche = page.getByTestId("search-button");
    this.cartes = page.getByTestId("event-card");
    this.titres = page.getByTestId("event-card-title");
    this.messageVide = page.getByTestId("catalog-empty");
  }

  // ----- Actions -----
  async ouvrir() {
    await this.page.goto("/");
    await expect(this.cartes.first().or(this.messageVide)).toBeVisible();
  }

  async rechercher(terme, { avecEntree = false } = {}) {
    await this.champRecherche.fill(terme);
    if (avecEntree) await this.champRecherche.press("Enter");
    else await this.boutonRecherche.click();
  }

  // Ouvre le n-ième événement (0 = le premier).
  async ouvrirEvenement(index = 0) {
    await this.cartes.nth(index).click();
    await expect(this.page).toHaveURL(/\/events\/\d+/);
  }

  // ----- Lectures -----
  async titre(index = 0) {
    return (await this.titres.nth(index).innerText()).trim();
  }

  // Premier mot du titre : un terme de recherche garanti de donner au moins un résultat.
  async motDeRecherche(index = 0) {
    return (await this.titre(index)).split(" ")[0];
  }

  async nombreEvenements() {
    return this.cartes.count();
  }

  // ----- Vérifications -----
  async verifierAuMoinsUnEvenement() {
    await expect(this.cartes.first()).toBeVisible();
  }

  async verifierAucunEvenement() {
    await expect(this.messageVide).toBeVisible();
    await expect(this.cartes).toHaveCount(0);
  }

  async verifierNombreEvenements(n) {
    await expect(this.cartes).toHaveCount(n);
  }

  async verifierTitresContiennent(mot) {
    await this.verifierAuMoinsUnEvenement();
    for (const titre of await this.titres.allInnerTexts()) {
      expect(titre.toLowerCase()).toContain(mot.toLowerCase());
    }
  }
}
