# Tests Playwright — EventFlow

## Avant de lancer
1. L'application tourne : `docker compose up` à la racine du projet (front : http://localhost:5173).
2. Une seule fois :
```bash
cd e2e
npm install
npx playwright install chromium
```

## Lancer
```bash
npm run test:headed   # navigateur visible
npm test              # sans fenêtre
npm run report        # rapport HTML
```

## Organisation (3 couches)
```
e2e/
  tests/      les scénarios : phrases métier, aucun sélecteur
  pages/      Page Objects : seul endroit qui connaît les éléments (data-testid)
  fixtures.js pages prêtes à l'emploi (catalogue, evenement)
  data/       règles métier et données de test (max 6 billets, etc.)
```
Un test se lit comme une phrase :
```js
await cat.ajouter(3);
await evenement.verifierTotaux({ billets: 3, centimes: cat.prix * 3 });
```
Les éléments sont repérés par `data-testid` (ajoutés dans le front). Les montants sont en centimes.
