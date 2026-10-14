import { test as base, expect } from "@playwright/test";
import { CatalogPage } from "./pages/CatalogPage.js";
import { EventPage } from "./pages/EventPage.js";

export { expect };

// Fixtures : le test reçoit directement les pages déjà prêtes.
// - catalogue : le catalogue ouvert
// - pageEvenement : la page événement, non ouverte (pour ouvrir un id précis ou après un clic)
// - evenement : le détail du 1er événement déjà ouvert (le panier est utilisable tout de suite)
export const test = base.extend({
  catalogue: async ({ page }, use) => {
    const catalogue = new CatalogPage(page);
    await catalogue.ouvrir();
    await use(catalogue);
  },

  pageEvenement: async ({ page }, use) => {
    await use(new EventPage(page));
  },

  evenement: async ({ catalogue, pageEvenement }, use) => {
    await catalogue.ouvrirEvenement();
    await use(pageEvenement);
  },
});
