import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { MemoryRouter } from "react-router";
import Logo from "../components/Logo";
import Avatar from "../components/Avatar";
import EventCard from "../components/EventCard";



test('C1 Logo - taille 60', () => {
    render(<Logo size={60} />);
    const logo = screen.getByLabelText("eventflow");
    expect(logo).toHaveAttribute("width", "60");
    expect(logo).toHaveAttribute("height", "60");
});

test('C2 Logo - taille 18', () => {
    render(<Logo size={18} />);
    const logo = screen.getByLabelText("eventflow");
    expect(logo).toHaveAttribute("width", "18");
    expect(logo).toHaveAttribute("height", "18");
});

test('C3 Avatar - taille 50', () => {
    render(<Avatar user={{ full_name: "Camille Client" }} size={50} />);
    const avatar = screen.getByText("CC");
    expect(avatar).toHaveStyle({ width: "50px", height: "50px" });
});

test('C4 Avatar - deux initiales maximum', () => {
    render(<Avatar user={{ full_name: "Alice Bob Charlie" }} />);
    const avatar = screen.getByText("AB");
    expect(avatar).toBeInTheDocument();
});

test('C5 Avatar - image si URL', () => {
    render(<Avatar user={{ full_name: "Camille Client", avatar: "/camille.png" }} />);
    const image = screen.getByRole("img", { name: "Camille Client" });
    expect(image).toHaveAttribute("src", "/camille.png");
});

test('C6 EventCard - un autre titre', () => {
    const event = {
        id: 9,
        title: "Namur QA Night",
        city: "Namur",
        venue: "Halles",
        starts_at: "2024-09-10T19:00:00Z",
        cover_color: "#6C4DF6",
    };
    render(
        <MemoryRouter>
            <EventCard ev={event} />
        </MemoryRouter>
    );
    expect(screen.getByText("Namur QA Night")).toBeInTheDocument();
});

test('C7 EventCard - un autre id', () => {
    const event = {
        id: 42,
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
    expect(link).toHaveAttribute("href", "/events/42");
});

test('C8 Avatar - avec image', () => {
    render(<Avatar user={{ full_name: "Camille Client", avatar: "/camille.png" }} />);
    const image = screen.getByRole("img");
    expect(image).toBeInTheDocument();
});

test('C8 Avatar - sans image', () => {
    render(<Avatar user={{ full_name: "Camille Client" }} />);
    const image = screen.queryByRole("img");
    expect(image).not.toBeInTheDocument();
});
