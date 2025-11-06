import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Signup from "./Signup";
import { signupRequest } from "../../apis/auth";
import { useNavigate } from "react-router-dom";

jest.mock("../../apis/auth", () => ({
    signupRequest: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
    useNavigate: jest.fn(),
    Link: ({ to, children }) => <a href={to}>{children}</a>,
}));

describe("Signup Component", () => {
    const mockNavigate = jest.fn();

    beforeEach(() => {
        useNavigate.mockReturnValue(mockNavigate);
        jest.clearAllMocks();
    });

    test("renders signup form correctly", () => {
        render(<Signup />);
        expect(screen.getByText("Signup Form")).toBeInTheDocument();
        expect(screen.getByLabelText(/Phone No./i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Signup/i })).toBeInTheDocument();
    });

    test("shows validation error when phone number is missing", async () => {
        render(<Signup />);
        const button = screen.getByRole("button", { name: /Signup/i });
        await userEvent.click(button);
        expect(screen.getByText("Missing Required Field: Phone no.")).toBeInTheDocument();
    });

    test("shows validation error for invalid phone number", async () => {
        render(<Signup />);
        await userEvent.type(screen.getByLabelText(/Phone No./i), "123");
        await userEvent.type(screen.getByLabelText(/^Password$/i), "password123");
        await userEvent.type(screen.getByLabelText(/Confirm Password/i), "password123");

        await userEvent.click(screen.getByRole("button", { name: /Signup/i }));
        expect(
            screen.getByText("Invalid phone no: Please enter a 10 digit valid phone no.")
        ).toBeInTheDocument();
    });

    test("shows validation error when password is missing", async () => {
        render(<Signup />);
        await userEvent.type(screen.getByLabelText(/Phone No./i), "1234567890");
        await userEvent.click(screen.getByRole("button", { name: /Signup/i }));
        expect(screen.getByText("Missing Required Field: Password")).toBeInTheDocument();
    });

    test("shows validation error when confirm password is missing", async () => {
        render(<Signup />);
        await userEvent.type(screen.getByLabelText(/Phone No./i), "1234567890");
        await userEvent.type(screen.getByLabelText(/^Password$/i), "password123");
        await userEvent.click(screen.getByRole("button", { name: /Signup/i }));
        expect(screen.getByText("Missing Required Field: Confirm Password")).toBeInTheDocument();
    });

    test("shows validation error when passwords do not match", async () => {
        render(<Signup />);
        await userEvent.type(screen.getByLabelText(/Phone No./i), "1234567890");
        await userEvent.type(screen.getByLabelText(/^Password$/i), "password123");
        await userEvent.type(screen.getByLabelText(/Confirm Password/i), "differentPassword");

        await userEvent.click(screen.getByRole("button", { name: /Signup/i }));
        expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    });

    test("handles successful signup", async () => {
        signupRequest.mockResolvedValueOnce({ message: "Success" });

        render(<Signup />);
        await userEvent.type(screen.getByLabelText(/Phone No./i), "1234567890");
        await userEvent.type(screen.getByLabelText(/^Password$/i), "password123");
        await userEvent.type(screen.getByLabelText(/Confirm Password/i), "password123");

        const signupButton = screen.getByRole("button", { name: /Signup/i });
        await userEvent.click(signupButton);

        await waitFor(() => expect(signupButton).toBeDisabled());

        await waitFor(() => {
            expect(signupRequest).toHaveBeenCalledWith({
                phone: "1234567890",
                password: "password123",
                confirmPassword: "password123",
            });
        });

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/login"));

        jest.useRealTimers(); 
    });

    test("handles signup API fail   ure", async () => {
        signupRequest.mockRejectedValueOnce({
            response: { data: { error: "User already exists" } },
        });

        render(<Signup />);
        await userEvent.type(screen.getByLabelText(/Phone No./i), "1234567890");
        await userEvent.type(screen.getByLabelText(/^Password$/i), "password123");
        await userEvent.type(screen.getByLabelText(/Confirm Password/i), "password123");

        await userEvent.click(screen.getByRole("button", { name: /Signup/i }));

        await waitFor(() => {
            expect(screen.getByText("User already exists")).toBeInTheDocument();
        });
    });

    test("shows generic error message when API throws unknown error", async () => {
        signupRequest.mockRejectedValueOnce(new Error("Network Error"));

        render(<Signup />);
        await userEvent.type(screen.getByLabelText(/Phone No./i), "1234567890");
        await userEvent.type(screen.getByLabelText(/^Password$/i), "password123");
        await userEvent.type(screen.getByLabelText(/Confirm Password/i), "password123");

        await userEvent.click(screen.getByRole("button", { name: /Signup/i }));

        await waitFor(() => {
            expect(screen.getByText("Something went wrong. Please try again.")).toBeInTheDocument();
        });
    });
});
