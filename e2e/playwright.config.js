import { defineConfig, devices } from "@playwright/test";

const enCI = !!process.env.CI;

// L'application doit déjà tourner (docker compose up) : front sur 5173.
// Autre environnement : BASE_URL=http://staging.exemple.fr npm test
export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  expect: { timeout: 7_000 },
  fullyParallel: true,
  forbidOnly: enCI, // un test.only oublié fait échouer la CI
  retries: enCI ? 2 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:5173", // permet d'écrire page.goto("/")
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
