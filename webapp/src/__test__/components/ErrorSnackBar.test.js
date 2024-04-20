import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import ErrorSnackBar from "../../views/components/ErrorSnackBar";
import '@testing-library/jest-dom';

describe("ErrorSnackBar component", () => {
    test("renders snackbar with provided error message", () => {
        const errorMsg = "An error occurred!";
        const setMsg = jest.fn();

        render(<ErrorSnackBar msg={errorMsg} setMsg={setMsg} />);
        expect(screen.getByRole("alert")).toBeInTheDocument();
        expect(screen.getByText(`Error: ${errorMsg}`)).toBeInTheDocument();
        expect(screen.getByLabelText("close")).toBeInTheDocument();
        fireEvent.click(screen.getByLabelText("close"));
        expect(setMsg).toHaveBeenCalledWith("");
    });

    test("does not render Snackbar when no error message provided", () => {
        const setMsg = jest.fn();

        render(<ErrorSnackBar msg="" setMsg={setMsg} />);
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
});
