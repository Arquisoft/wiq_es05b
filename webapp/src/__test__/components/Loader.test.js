import React from "react";
import { render, screen } from "@testing-library/react";
import Loader from "../../views/components/Loader";
import '@testing-library/jest-dom';

describe("Loader component", () => {
    test("renders loading message and circular progress", () => {
        render(<Loader />);
        expect(screen.getByText("Loading, please wait...")).toBeInTheDocument();
        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });
});
