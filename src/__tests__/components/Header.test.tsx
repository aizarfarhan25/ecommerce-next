import { render, screen, fireEvent, waitFor } from "@testing-library/react"  
import "@testing-library/jest-dom"  
import { useRouter } from "next/router"  
import Header from "@/components/Header"  
import { useAuth } from "@/contex/AuthContex"  
import { useCart } from "@/contex/CartContex"  

// Mock the next/router  
jest.mock("next/router", () => ({  
  useRouter: jest.fn(),  
}))  

// Mock the context hooks  
jest.mock("@/contex/AuthContex", () => ({  
  useAuth: jest.fn(),  
}))  

jest.mock("@/contex/CartContex", () => ({  
  useCart: jest.fn(),  
}))  

// Fix the next/link mock implementation  
jest.mock("next/link", () => {  
  return jest.fn().mockImplementation(({ children, href }) => {  
    return (  
      <a href={href} onClick={(e) => e.preventDefault()}>  
        {children}  
      </a>  
    )  
  })  
})  

// Mock react-icons  
jest.mock("react-icons/fa", () => ({  
  FaShoppingCart: () => <svg data-testid="cart-icon" />  
}))  

describe("Header Component", () => {  
  const mockPush = jest.fn()  
  const mockLogout = jest.fn()  

  beforeEach(() => {  
    jest.clearAllMocks()  
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })  
  })   

  it("renders the logo", () => {
    // Mock authentication and cart state
    ;(useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      logout: mockLogout,
    })
    ;(useCart as jest.Mock).mockReturnValue({ cart: [] })

    render(<Header />)
    const logo = screen.getByText("GegeShop")
    expect(logo).toBeInTheDocument()
  })

  it("renders login link when not authenticated", () => {

    ;(useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      logout: mockLogout,
    })
    ;(useCart as jest.Mock).mockReturnValue({ cart: [] })

    render(<Header />)
    
    // cek login ada atau tidak
    const loginLinks = screen.getAllByText(/Login/i)
    expect(loginLinks.length).toBeGreaterThan(0)
    
    const loginLink = loginLinks[0].closest('a')
    expect(loginLink).toHaveAttribute("href", "/login")
  })

  it("renders logout button and cart when authenticated", () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      logout: mockLogout,
    })
    ;(useCart as jest.Mock).mockReturnValue({ cart: [{ quantity: 2 }] })

    render(<Header />)

    const logoutButtons = screen.getAllByText("Logout")
    expect(logoutButtons[0]).toBeInTheDocument()

    const cartLinks = screen.getAllByRole("link", { name: /cart/i })
    expect(cartLinks[0]).toBeInTheDocument()
  })

  it("displays correct cart item count", () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      logout: mockLogout,
    })
    ;(useCart as jest.Mock).mockReturnValue({
      cart: [{ quantity: 2 }, { quantity: 3 }],
    })

    render(<Header />)
    const cartCount = screen.getAllByText("5")[0]
    expect(cartCount).toBeInTheDocument()
  })

  it("toggles mobile menu on button click", () => {
    // Mock authentication state
    ;(useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      logout: mockLogout,
    })
    ;(useCart as jest.Mock).mockReturnValue({ cart: [] })

    render(<Header />)

    // cek burger buttom untuk mobile
    const menuButton = screen.getByTestId('menu-toggle-button')

    // cek burger button itu terhidden secara default
    const mobileMenu = screen.getByTestId('mobile-menu')
    expect(mobileMenu).toHaveClass('hidden')

    // click untuk membuka burger button
    fireEvent.click(menuButton)

    expect(mobileMenu).not.toHaveClass('hidden')
  })

  it("calls logout function and redirects on logout click", async () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      logout: mockLogout,
    })
    ;(useCart as jest.Mock).mockReturnValue({ cart: [] })

    render(<Header />)
    const logoutButton = screen.getAllByText("Logout")[0]

    fireEvent.click(logoutButton)

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled()
      expect(mockPush).toHaveBeenCalledWith("/")
    })
  })

  it("renders About Us link correctly", () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      logout: mockLogout,
    })
    ;(useCart as jest.Mock).mockReturnValue({ cart: [] })

    render(<Header />)
    const aboutLinks = screen.getAllByText("About Us")
    const aboutLink = aboutLinks[0] // Get the desktop version
    expect(aboutLink).toBeInTheDocument()
    expect(aboutLink.closest("a")).toHaveAttribute("href", "/about")
  })

  // it("renders cart link in mobile menu when authenticated", () => {  
  //   // Mock authenticated state with cart
  //   ;(useAuth as jest.Mock).mockReturnValue({
  //     isAuthenticated: true,
  //     logout: mockLogout,
  //   })
  //   ;(useCart as jest.Mock).mockReturnValue({ 
  //     cart: [{ quantity: 2 }]
  //   })

  //   render(<Header />)  

  //   // Find and click the mobile menu toggle button  
  //   const menuButton = screen.getByTestId('menu-toggle-button')  
  //   fireEvent.click(menuButton)  

  //   // Find cart link in mobile menu
  //   const cartLinks = screen.getAllByText(/Cart/i)
  //   const mobileCartLink = cartLinks.find(link => 
  //     link.closest('div')?.classList.contains('md:hidden')
  //   )
    
  //   expect(mobileCartLink).toBeInTheDocument()
    
  //   const cartLinkElement = mobileCartLink?.closest('a')
  //   expect(cartLinkElement).toHaveAttribute('href', '/cart')

  //   // Check cart count
  //   const cartCount = screen.getByText('2')
  //   expect(cartCount).toBeInTheDocument()
  // })   
})