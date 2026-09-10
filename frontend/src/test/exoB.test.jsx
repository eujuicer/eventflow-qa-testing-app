import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { MemoryRouter } from "react-router";
import Logo from "../components/Logo";
import Avatar from "../components/Avatar";
import EventCard from "../components/EventCard";



test('Intro test', () => {
    expect(true).toBe(true)
})

test('B1 Logo - Render ', () => {
    render(<Logo />);
    const logo = screen.getByLabelText("eventflow");
    expect(logo).toBeInTheDocument();
});

test('B2 Logo - Nom accessible', () => {
    render(<Logo />);
    const logo = screen.getByLabelText("eventflow");
    expect(logo).toHaveAttribute("aria-label");
});

test('B3 Logo - Largeur par défaut', () => {
    render(<Logo />);
    const logo = screen.getByLabelText("eventflow");
    expect(logo).toHaveAttribute("width", "34");
});

test('B4 Avatar - initiales du nom ', () => {
    render(<Avatar user={{ full_name: "Camille Client" }} />)
    const avatar = screen.getByText("CC")
    expect(avatar).toBeInTheDocument()
});

test('B5 Avatar - repli sur email', () => {
    render(<Avatar user={{ email: "client@eventflow.test" }} />)
    const avatar = screen.getByText("C")
    expect(avatar).toBeInTheDocument()
});

test('B6 EventCard - rendre la carte', () => {
    const event = {
        id: 1,
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
    const title = screen.getByText("Brussels Testing Days");
    expect(title).toBeInTheDocument();
});

test('B7 EventCard - titre', () => {
    const event = {
        id: 2,
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
    expect(screen.getByText("Brussels Testing Days")).toBeInTheDocument();
});

test('B8 EventCard - ville', () => {
    const event = {
        id: 3,
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
    const city = screen.getByText("Bruxelles");
    expect(city).toBeInTheDocument();
});

test('B9 EventCard - lieu', () => {
    const event = {
        id: 4,
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
    const venue = screen.getByText("Tour & Taxis");
    expect(venue).toBeInTheDocument();
});

test('B10 EventCard - lien', () => {        
    const event = {
        id: 5,
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
    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
});

test('B11 EventCard - destination', () => {
    const event = {
        id: 7,
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
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `/events/${event.id}`);
});

test('B12 EventCard - textes fixes', () => {
    const event = {
        id: 8,
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
    const billets = screen.getByText("Billets");
    const voir = screen.getByText("Voir");
    expect(billets).toBeInTheDocument();
    expect(voir).toBeInTheDocument();
});


