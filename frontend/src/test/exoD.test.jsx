import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import Logo from "../components/Logo";



test('D1 Logo - par label', () => {
    render(<Logo />);
    const logo = screen.getByLabelText("eventflow");
    expect(logo).toBeInTheDocument();
});

test