import '@testing-library/jest-dom';
import { fireEvent, screen } from "@testing-library/react";
import React from "react";
import InfoSnackBar from "../../views/components/InfoSnackBar";
import { customRender } from "../utils/customRenderer";

const render = customRender();

describe("InfoSnackBar component", () => {
    test("renders snackbar with provided info message", () => {
        const infoMsg = "important info";
        const setMsg = jest.fn();

        render(<InfoSnackBar msg={infoMsg} setMsg={setMsg} />);
        expect(screen.getByRole("alert")).toBeInTheDocument();
        expect(screen.getByText(`Info: ${infoMsg}`)).toBeInTheDocument();
        expect(screen.getByLabelText("close")).toBeInTheDocument();
        fireEvent.click(screen.getByLabelText("close"));
        expect(setMsg).toHaveBeenCalledWith("");
    });

    test("does not render Snackbar when no info message provided", () => {
        const setMsg = jest.fn();

        render(<InfoSnackBar msg="" setMsg={setMsg} />);
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
});
