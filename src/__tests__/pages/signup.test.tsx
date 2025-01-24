import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignUp from "@/pages/signup";
import { useRouter } from "next/router";
import axiosInstance from "@/utils/axiosInstance";

// mock dependencies
jest.mock("next/router", () => ({
  useRouter: jest.fn()
}));

jest.mock("@/utils/axiosInstance", () => ({
  post: jest.fn()
}));

jest.mock("@/components/Header", () => ({
  __esModule: true,
  default: () => <div data-testid="header">Header</div>
}));

jest.mock("@/components/Footer", () => ({
  __esModule: true,
  default: () => <div data-testid="footer">Footer</div>
}));

describe("SignUp Page", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it("should render signup form correctly", () => {
    render(<SignUp />);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByText(/already have an account\?/i)).toBeInTheDocument();
  });

  it("should show validation error when submitting empty form", () => {
    render(<SignUp />);

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    expect(screen.getByText("All fields are required")).toBeInTheDocument();
  });

  it("should validate email format", () => {
    render(<SignUp />);

    // test input email yang salah atau tidak valid
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: "Test User" }
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "invalid-email" }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "Password123" }
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    expect(screen.getByText("Please enter a valid email address")).toBeInTheDocument();
  });

  it("should validate password requirements", async () => {
    render(<SignUp />);

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: "Test User" }
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" }
    });

    // test input pass yg pendek
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "short" }
    });
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters long/i)).toBeInTheDocument();
    });

    // test input pass tanpa hufur beassr
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" }
    });
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
    await waitFor(() => {
      expect(screen.getByText(/password must contain at least one uppercase letter/i)).toBeInTheDocument();
    });

    // Test number requirement
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "PasswordTest" }
    });
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
    await waitFor(() => {
      expect(screen.getByText(/password must contain at least one number/i)).toBeInTheDocument();
    });
  });

  it("should handle successful registration", async () => {
    (axiosInstance.post as jest.Mock).mockResolvedValueOnce({
      data: { id: 1 }
    });

    render(<SignUp />);

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: "Test User" }
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "Password123" }
    });
    
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith("/users", {
        name: "Test User",
        email: "test@example.com",
        password: "Password123",
        avatar: "https://api.lorem.space/image/face?w=150&h=150"
      });
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });

  it("should handle registration failure", async () => {
    (axiosInstance.post as jest.Mock).mockRejectedValueOnce({
      response: {
        status: 409,
        data: { message: "Email is already registered" }
      }
    });

    render(<SignUp />);

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: "Test User" }
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "Password123" }
    });
    
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText("Email is already registered")).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it("should toggle password visibility", () => {
    render(<SignUp />);
    
    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.click(screen.getByRole("button", { name: "" }));
    expect(passwordInput).toHaveAttribute("type", "text");

    fireEvent.click(screen.getByRole("button", { name: "" }));
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("should clear error when user starts typing", () => {
    render(<SignUp />);

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
    expect(screen.getByText("All fields are required")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: "t" }
    });

    expect(screen.queryByText("All fields are required")).not.toBeInTheDocument();
  });
}); 