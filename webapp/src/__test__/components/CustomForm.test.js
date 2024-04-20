import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CustomForm from "../../views/components/CustomForm";
import '@testing-library/jest-dom';

describe("CustomForm component", () => {
    test("renders form with provided data", () => {
        const formData = {
            title: "Test Form",
            fields: [
                {
                    name: "name",
                    displayed: "Name",
                    required: true,
                    value: "",
                    changeHandler: jest.fn(),
                },
                {
                    name: "email",
                    displayed: "Email",
                    required: true,
                    value: "",
                    changeHandler: jest.fn(),
                },
            ],
            submitButtonTx: "Send",
            submit: jest.fn(),
        };

        const suggestion = {
            text: "Not sure what to do? Check out our",
            linkText: "FAQ",
            link: "/faq",
        };

        render(
            <MemoryRouter>
                <CustomForm formData={formData} suggestion={suggestion} />
            </MemoryRouter>
        );

        expect(screen.getByText("Test Form")).toBeInTheDocument();

        expect(screen.getByText("Name")).toBeInTheDocument();
        expect(screen.getByText("Email")).toBeInTheDocument();

        expect(screen.getByRole("button", { name: "Send" })).toBeInTheDocument();

        expect(screen.getByText("Not sure what to do? Check out our")).toBeInTheDocument();
        expect(screen.getByText("FAQ")).toBeInTheDocument();
    });

});
