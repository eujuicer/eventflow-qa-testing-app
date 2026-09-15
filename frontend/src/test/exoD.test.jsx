import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { MemoryRouter } from "react-router";
import Logo from "../components/Logo";
import Avatar from "../components/Avatar";
import EventCard from "../components/EventCard";
import { AuthProvider } from "../auth";
import Login from "../pages/Login";



test('D1 Logo - par label', () => {
    render(<Logo />);
    // aria-label fonctionne ici parce que getByLabelText reconnait aussi l'attribut
    // aria-label porte directement par l'element, sans avoir besoin d'un <label> associe.
    // Le <svg> ne recoit pas automatiquement le role "img" (il n'a pas de role implicite),
    // mais aria-label suffit pour que Testing Library le retrouve.
    const logo = screen.getByLabelText("eventflow");
    expect(logo).toBeInTheDocument();
});

test('D2 EventCard - par titre (heading niveau 3)', () => {
    const event = {
        id: 10,
        title: "Brussels Testing Days",
        city: "Bruxelles",
        venue: "Tour & Taxis",
        starts_at: "2024-06-15T19:00:00Z",
        cover_color: "#6C4DF6",
    };
    render(
        <MemoryRouter>
            <EventCard ev={event} />
        </MemoryRouter>
    );
    const title = screen.getByRole("heading", { level: 3, name: "Brussels Testing Days" });
    expect(title).toBeInTheDocument();
});

test('D3 - compter les liens', () => {
    const eventA = {
        id: 11,
        title: "Brussels Testing Days",
        city: "Bruxelles",
        venue: "Tour & Taxis",
        starts_at: "2024-06-15T19:00:00Z",
        cover_color: "#6C4DF6",
    };
    const eventB = {
        id: 12,
        title: "Namur QA Night",
        city: "Namur",
        venue: "Halles",
        starts_at: "2024-09-10T19:00:00Z",
        cover_color: "#6C4DF6",
    };
    render(
        <MemoryRouter>
            <EventCard ev={eventA} />
            <EventCard ev={eventB} />
        </MemoryRouter>
    );
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
});

test('D4 Avatar - absent', () => {
    render(<Avatar user={{ full_name: "Camille Client" }} />);
    // queryBy... renvoie null au lieu d'echouer : adapte pour verifier une absence.
    const image = screen.queryByRole("img");
    expect(image).not.toBeInTheDocument();
});

test('D5 - Login : defaut d\'accessibilite', () => {
    render(
        <MemoryRouter>
            <AuthProvider>
                <Login />
            </AuthProvider>
        </MemoryRouter>
    );

    // Le <label>Email</label> n'a pas de "htmlFor" pointant vers l'id du champ :
    // aucune association label <-> input n'existe dans le DOM, donc getByLabelText echoue.
    // Diagnostic : defaut du PRODUIT (accessibilite), pas du test.
    expect(() => screen.getByLabelText("Email")).toThrow();

    // Moyen temporaire, sans selecteur CSS, en attendant la correction produit :
    // le champ email a une valeur par defaut connue et unique.
    const emailField = screen.getByDisplayValue("client@eventflow.test");
    expect(emailField).toBeInTheDocument();
});
