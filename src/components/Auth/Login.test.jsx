import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "./Login";
import { loginRequest } from "../../apis/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

jest.mock("../../apis/auth", () => ({
    loginRequest: jest.fn(),
}));

jest.mock("react-redux", () => ({
    useDispatch: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
    useNavigate: jest.fn(),
    Link: ({ to, children }) => <a href={to}>{children}</a>,
}));

describe("Login Component", () => {
    const mockNavigate = jest.fn();
    const mockDispatch = jest.fn();

    beforeEach(() => {
        useNavigate.mockReturnValue(mockNavigate);
        useDispatch.mockReturnValue(mockDispatch);
        jest.clearAllMocks();
    });

    test("renders login form correctly", () => {
        render(<Login />);
        expect(screen.getByText("Login Form")).toBeInTheDocument();
        expect(screen.getByLabelText(/Phone No./i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Log in/i })).toBeInTheDocument();
    });

    test("shows validation error when phone is empty", async () => {
        render(<Login />);
        const loginButton = screen.getByRole("button", { name: /Log in/i });
        await userEvent.click(loginButton);
        expect(screen.getByText("Phone number is required.")).toBeInTheDocument();
    });

    test("shows validation error when phone number is invalid", async () => {
        render(<Login />);
        await userEvent.type(screen.getByLabelText(/Phone No./i), "123");
        await userEvent.type(screen.getByLabelText(/Password/i), "password123");
        const loginButton = screen.getByRole("button", { name: /Log in/i });
        await userEvent.click(loginButton);
        expect(screen.getByText("Please enter a valid 10-digit phone number.")).toBeInTheDocument();
    });

    test("shows validation error when password is missing", async () => {
        render(<Login />);
        await userEvent.type(screen.getByLabelText(/Phone No./i), "1234567890");
        const loginButton = screen.getByRole("button", { name: /Log in/i });
        await userEvent.click(loginButton);
        expect(screen.getByText("Password is required.")).toBeInTheDocument();
    });

    test("handles successful login", async () => {
        loginRequest.mockResolvedValueOnce({ token: "abc123", _id: "user123" });
        render(<Login />);

        await userEvent.type(screen.getByLabelText(/Phone No./i), "1234567890");
        await userEvent.type(screen.getByLabelText(/Password/i), "password123");

        const loginButton = screen.getByRole("button", { name: /Log in/i });
        await userEvent.click(loginButton);

        expect(loginRequest).toHaveBeenCalledWith({
            phone: "1234567890",
            password: "password123",
        });

        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith({
                type: "auth/setToken",
                payload: { token: "abc123", user: "user123" },
            });
        });

    });

    test("handles login failure gracefully", async () => {
        loginRequest.mockRejectedValueOnce(new Error("Invalid credentials"));
        render(<Login />);

        await userEvent.type(screen.getByLabelText(/Phone No./i), "1234567890");
        await userEvent.type(screen.getByLabelText(/Password/i), "password123");
        await userEvent.click(screen.getByRole("button", { name: /Log in/i }));

        await waitFor(() => {
            expect(screen.getByText("Login failed. Please try again.")).toBeInTheDocument();
        });
    });
});
