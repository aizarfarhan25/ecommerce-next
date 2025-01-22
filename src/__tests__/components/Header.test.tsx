import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "@/components/Header";
import { AuthProvider } from "@/contex/AuthContex";
import { CartProvider } from "@/contex/CartContex";


const mockPush = jest.fn();
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: mockPush,
    pathname: "/",
  }),
}));

jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return (
      <a href={href} data-testid="link">
        {children}
      </a>
    );
  };
});

// ini untuk test autentikasi bagian user login dan logout
interface User {
  name: string;
}

const mockAuthContext = {
  isAuthenticated: false,
  user: null as User | null,
  login: jest.fn(),
  logout: jest.fn(),
  isLoading: false,
};

jest.mock("@/contex/AuthContex", () => ({
  ...jest.requireActual("@/contex/AuthContex"),
  useAuth: () => mockAuthContext,
}));


interface CartItem {
  id: number;
  quantity: number;
}

const mockCartContext = {
  cart: [] as CartItem[],
  total: 0,
  addToCart: jest.fn(),
  removeFromCart: jest.fn(),
  setQuantity: jest.fn(),
  clearCart: jest.fn(),
  getTotal: jest.fn(() => 0),
};

jest.mock("@/contex/CartContex", () => ({
  ...jest.requireActual("@/contex/CartContex"),
  useCart: () => mockCartContext,
}));

describe("Header Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthContext.isAuthenticated = false;
    mockCartContext.cart = [];
  });

  const renderHeader = () => {
    return render(
      <AuthProvider>
        <CartProvider>
          <Header />
        </CartProvider>
      </AuthProvider>
    );
  };

  // untuk test tampilan dan responsivitas dari component header
  describe("Layout and Responsiveness", () => {
    it("renders with correct layout structure", () => {
      renderHeader();
      const logo = screen.getByText("GegeShop");
      expect(logo).toHaveClass("text-2xl", "font-bold", "text-black");
    });

    it("maintains layout integrity on mobile viewport", () => {
      global.innerWidth = 375;
      global.dispatchEvent(new Event("resize"));
      renderHeader();
    });
  });

  describe("Authentication States", () => {
    it("shows login link in unauthenticated state", () => {
      renderHeader();
      const loginLink = screen.getByText(/login/i);
      expect(loginLink).toBeInTheDocument();
      expect(loginLink.closest("a")).toHaveAttribute("href", "/login");
    });

    it("shows user menu and cart in authenticated state", async () => {
      mockAuthContext.isAuthenticated = true;
      mockAuthContext.user = { name: "Test User" };
      renderHeader();

      expect(screen.getByText(/log out/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/shopping cart/i)).toBeInTheDocument();
    });

    it("handles logout action correctly", async () => {
      mockAuthContext.isAuthenticated = true;
      renderHeader();

      const logoutButton = screen.getByText(/log out/i);
      await userEvent.click(logoutButton);

      expect(mockAuthContext.logout).toHaveBeenCalledTimes(1);
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/");
      });
    });
  });

  // ini untuk test bafian cartnya sudah berfungsi atau belum
  describe("Cart Functionality", () => {
    beforeEach(() => {
      mockAuthContext.isAuthenticated = true;
    });

    it("displays correct cart item count", () => {
      mockCartContext.cart = [
        { id: 1, quantity: 2 },
        { id: 2, quantity: 3 },
      ];
      renderHeader();

      const cartCount = screen.getByLabelText(/cart items/i);
      expect(cartCount).toHaveTextContent("5");
    });

    it("navigates to cart page on cart icon click", async () => {
      renderHeader();
      const cartButton = screen.getByLabelText(/shopping cart/i);
      await userEvent.click(cartButton);
      expect(mockPush).toHaveBeenCalledWith("/cart");
    });
  });

  describe("Error Handling", () => {
    it("handles auth context errors gracefully", () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      mockAuthContext.logout.mockRejectedValueOnce(new Error("Logout failed"));

      renderHeader();
      // test bagian error handling

      consoleSpy.mockRestore();
    });
  });

  // untuk test performance kalo ada banyak item di cart
  describe("Performance", () => {
    it("maintains performance with many cart items", () => {
      mockCartContext.cart = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        quantity: 1,
      }));

      const startTime = performance.now();
      renderHeader();
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100); // test kecepatan waktu render
    });
  });
});
