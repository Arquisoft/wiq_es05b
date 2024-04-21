import reportWebVitals from "../../scripts/reportWebVitals";
import * as webVitals from "web-vitals";
import {waitFor} from "@testing-library/react";

describe("reportWebVitals function", () => {
    test("calls web-vitals functions with onPerfEntry callback", () => {
        const mockOnPerfEntry = jest.fn();
        const webVitalsMock = jest.spyOn(webVitals, "getCLS").mockImplementation((cb) => cb({ name: "CLS", value: 0.25 }));
        reportWebVitals(mockOnPerfEntry);
        waitFor(() => {
            reportWebVitals(mockOnPerfEntry);
            expect(webVitalsMock).toHaveBeenCalledWith(mockOnPerfEntry);

        })
        webVitalsMock.mockRestore();
    });

    test("does not call web-vitals functions if onPerfEntry is not a function", () => {
        const webVitalsMock = jest.spyOn(webVitals, "getCLS").mockImplementation((cb) => cb({ name: "CLS", value: 0.25 }));
        reportWebVitals(null);
        expect(webVitalsMock).not.toHaveBeenCalled();
        webVitalsMock.mockRestore();
    });
});
