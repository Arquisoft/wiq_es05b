import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "../../views/components/Footer";
import '@testing-library/jest-dom/extend-expect';

describe("Footer component", () => {
    test("renders without crashing", () => {
        render(<Footer />);
        const footer = screen.getByTestId("footer");
        expect(footer).toBeInTheDocument();
    });

    test("uses Material-UI components", () => {
        render(<Footer />);
        expect(screen.getByTestId("footer")).toBeInTheDocument();
        expect(screen.getByRole("toolbar")).toBeInTheDocument();
    });

    test("renders current year and text", () => {        render(<Footer />);
        const currentYear = new Date().getFullYear();
        expect(screen.getByText(`© ${currentYear} ASW - WIQ05b`)).toBeInTheDocument();
    });

    test("has fixed position at the bottom of the page", () => {
        render(<Footer />);
        const appBar = screen.getByTestId("footer");
        expect(appBar).toHaveStyle({ top: "auto", bottom: 0, position: "fixed" });
    });

    test("has fixed position at the bottom of the page", () => {
        render(<Footer />);
        const footer = screen.getByTestId("footer");
        expect(footer).toHaveStyle({ top: "auto", bottom: 0, position: "fixed" });
    });

    test("has centered text", () => {
        render(<Footer />);
        const toolbar = screen.getByRole("toolbar");
        expect(toolbar).toHaveStyle({ justifyContent: "center" });
    });

    test("has primary background color", () => {
        render(<Footer />);
        const footer = screen.getByTestId("footer");
        expect(footer).toHaveStyle({ backgroundColor: "primary" });
    });

    test("is accessible", async () => {
        render(<Footer />);
        screen.getByTestId("footer");
        expect(await screen.findByTestId("footer")).toBeVisible();
    });
});
