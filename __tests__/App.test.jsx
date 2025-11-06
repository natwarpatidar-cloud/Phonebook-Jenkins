import { render } from "@testing-library/react";
import { useDispatch } from "react-redux";
import App from "../src/App";
import { initializeAuth } from "../src/context/authSlice";

jest.mock("react-redux", () => ({
    useDispatch: jest.fn(),
}));

jest.mock("../src/context/authSlice", () => ({
    initializeAuth: jest.fn(),
}));

jest.mock("../src/Routes", () => jest.fn(() => <div>Mocked Routes</div>));

describe("App Component", () => {
    it("dispatches initializeAuth on mount", () => {
        const mockDispatch = jest.fn();
        useDispatch.mockReturnValue(mockDispatch);

        render(<App />);

        expect(mockDispatch).toHaveBeenCalledTimes(1);
        expect(initializeAuth).toHaveBeenCalledTimes(1);
        expect(mockDispatch).toHaveBeenCalledWith(initializeAuth());
    });

    it("renders AppRoutes", () => {
        const mockDispatch = jest.fn();
        useDispatch.mockReturnValue(mockDispatch);

        const { getByText } = render(<App />);
        expect(getByText("Mocked Routes")).toBeInTheDocument();
    });
});
