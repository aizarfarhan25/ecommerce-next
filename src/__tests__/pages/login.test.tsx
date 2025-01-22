import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "@/pages/login";
import { useAuth } from "@/contex/AuthContex";
import { useRouter } from "next/router";

// Mock the dependencies
jest.mock("next/router", () => ({
  useRouter: jest.fn()
}));

jest.mock("@/contex/AuthContex", () => ({
  useAuth: jest.fn()
}));

jest.mock("@/components/Header", () => ({
  __esModule: true,
  default: () => <div data-testid="header">Header</div>
}));

jest.mock("@/components/Footer", () => ({
  __esModule: true,
  default: () => <div data-testid="footer">Footer</div>
}));

describe("Login Page", () => {
  const mockLogin = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ login: mockLogin });
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it("should render login form correctly", () => {
    render(<Login />);

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/don't have an account\?/i)).toBeInTheDocument();
  });

  it("should show validation error when submitting empty form", async () => {
    render(<Login />);

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(screen.getByText("Email and password are required")).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("should handle successful login", async () => {
    mockLogin.mockResolvedValueOnce(true);
    render(<Login />);

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" }
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123");
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  it("should handle login failure", async () => {
    const errorMessage = "Invalid email or password";
    mockLogin.mockRejectedValueOnce({ 
      response: { 
        status: 401,
        data: { message: errorMessage } 
      } 
    });

    render(<Login />);

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpassword" }
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it("should toggle password visibility", () => {
    render(<Login />);
    
    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.click(screen.getByRole("button", { name: "" })); // Toggle button
    expect(passwordInput).toHaveAttribute("type", "text");

    fireEvent.click(screen.getByRole("button", { name: "" })); // Toggle button again
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("should clear error when user starts typing", () => {
    render(<Login />);

    // Trigger error first
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    expect(screen.getByText("Email and password are required")).toBeInTheDocument();

    // Start typing
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "t" }
    });

    expect(screen.queryByText("Email and password are required")).not.toBeInTheDocument();
  });
}); 