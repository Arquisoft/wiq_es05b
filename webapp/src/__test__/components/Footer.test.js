import React from "react";
import { customRender } from "../utils/customRenderer";
import { screen } from "@testing-library/react";
import Footer from "../../views/components/Footer";
import '@testing-library/jest-dom';

const render = customRender();

describe("Footer component", () => {
    test("renders current year and text", () => {
        render(<Footer />);

        const currentYear = new Date().getFullYear();
        expect(screen.getByText(`© ${currentYear} ASW - WIQ05b`)).toBeInTheDocument();
        expect(screen.getByTestId("footer")).toBeInTheDocument();
        const appBar = screen.getByTestId("footer");
        expect(appBar).toHaveStyle({ backgroundColor: "primary" });
    });

    test("has fixed position at the bottom of the page", () => {
        render(<Footer />);
        const appBar = screen.getByTestId("footer");
        expect(appBar).toHaveStyle({ top: "auto", bottom: 0, position: "fixed" });
    });

    test("has centered text", () => {
        render(<Footer />);
        const toolbar = screen.getByRole("toolbar");
        expect(toolbar).toHaveStyle({ justifyContent: "center" });
    });
});
