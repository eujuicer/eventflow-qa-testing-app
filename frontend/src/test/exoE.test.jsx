import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import EventDetail from "../pages/EventDetail";
import { AuthProvider } from "../auth";
import api from "../api";

const event = {
    id: 7,
    title: "Brussels Testing Days",
    city: "Bruxelles",
    venue: "Tour & Taxis",
    starts_at: "2024-06-15T19:00:00Z",
    cover_color: "#6C4DF6",
    description: "Un evenement de test.",
    categories: [
        { id: 1, name: "Standard", price_cents: 2500, available: 10 },
    ],
};

function renderEventDetail() {
    return render(
        <MemoryRouter initialEntries={["/events/7"]}>
            <AuthProvider>
                <Routes>
                    <Route path="/events/:id" element={<EventDetail />} />
                </Routes>
            </AuthProvider>
        </MemoryRouter>
    );
}

beforeEach(() => {
    vi.spyOn(api, "get").mockResolvedValue({ data: event });
});

afterEach(() => {
    vi.restoreAllMocks();
});



test('E1 - quantite initiale', async () => {
    renderEventDetail();
    await screen.findByText("Brussels Testing Days");
    expect(screen.getByText("0")).toBeInTheDocument();
});

test('E2 - boutons de quantite : etat initial', async () => {
    renderEventDetail();
    await screen.findByText("Brussels Testing Days");
    const minusButton = screen.getByRole("button", { name: "-" });
    const plusButton = screen.getByRole("button", { name: "+" });
    const continueButton = screen.getByRole("button", { name: /Continuer vers le paiement/ });
    expect(minusButton).toBeDisabled();
    expect(plusButton).toBeEnabled();
    expect(continueButton).toBeDisabled();
});

test('E3 - un clic sur +', async () => {
    const user = userEvent.setup();
    renderEventDetail();
    await screen.findByText("Brussels Testing Days");
    const plusButton = screen.getByRole("button", { name: "+" });

    await user.click(plusButton);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Total (1 billet)")).toBeInTheDocument();
});

test('E4 - double clic sur +', async () => {
    const user = userEvent.setup();
    renderEventDetail();
    await screen.findByText("Brussels Testing Days");
    const plusButton = screen.getByRole("button", { name: "+" });

    await user.dblClick(plusButton);

    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Total (2 billets)")).toBeInTheDocument();
});

test('E5 - triple clic sur +', async () => {
    const user = userEvent.setup();
    renderEventDetail();
    await screen.findByText("Brussels Testing Days");
    const plusButton = screen.getByRole("button", { name: "+" });

    await user.tripleClick(plusButton);

    expect(screen.getByText("3")).toBeInTheDocument();
    // 3 billets a 2500 centimes -> 75,00 EUR
    expect(screen.getByText(/75,00/)).toBeInTheDocument();
});

test('E6 - decrementer', async () => {
    const user = userEvent.setup();
    renderEventDetail();
    await screen.findByText("Brussels Testing Days");
    const plusButton = screen.getByRole("button", { name: "+" });
    const minusButton = screen.getByRole("button", { name: "-" });

    await user.dblClick(plusButton);
    await user.click(minusButton);

    expect(screen.getByText("1")).toBeInTheDocument();
});

test('E7 - plafond de six', async () => {
    const user = userEvent.setup();
    renderEventDetail();
    await screen.findByText("Brussels Testing Days");
    const plusButton = screen.getByRole("button", { name: "+" });

    for (let i = 0; i < 6; i += 1) {
        await user.click(plusButton);
    }

    expect(screen.getByText("6")).toBeInTheDocument();
    expect(plusButton).toBeDisabled();
});

test('E8 - code promo en majuscules', async () => {
    const user = userEvent.setup();
    renderEventDetail();
    await screen.findByText("Brussels Testing Days");
    const promoField = screen.getByPlaceholderText("WELCOME10");

    await user.type(promoField, "welcome10");
    expect(promoField).toHaveValue("WELCOME10");

    await user.clear(promoField);
    await user.type(promoField, "vip25");
    expect(promoField).toHaveValue("VIP25");
});
