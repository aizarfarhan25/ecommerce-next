import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"
import CategoryFilter from "@/components/CategoryFilter"

// Mock the react-icons/bi module
jest.mock("react-icons/bi", () => ({
  BiCategory: () => <div data-testid="mock-bi-category" />,
}))

const mockCategories = [
  { id: 1, name: "electronics" },
  { id: 2, name: "furniture" },
  { id: 3, name: "shoes" },
  { id: 4, name: "miscellaneous" },
  { id: 5, name: "clothes" },
  { id: 6, name: "books" },
  { id: 7, name: "fashions" },
  { id: 8, name: "not allowed category" },
]

const defaultProps = {
  categories: mockCategories,
  selectedCategory: null,
  onCategorySelect: jest.fn(),
  searchTerm: "",
  setSearchTerm: jest.fn(),
  minPrice: 0,
  setMinPrice: jest.fn(),
  maxPrice: 1000,
  setMaxPrice: jest.fn(),
}

describe("CategoryFilter", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders without crashing", () => {
    render(<CategoryFilter {...defaultProps} />)
    expect(screen.getByPlaceholderText("Search products...")).toBeInTheDocument()
  })

  it("displays search input and price range inputs", () => {
    render(<CategoryFilter {...defaultProps} />)
    expect(screen.getByPlaceholderText("Search products...")).toBeInTheDocument()
    // Using text content instead of label text since the labels are rendered as text
    expect(screen.getByText("Min Price")).toBeInTheDocument()
    expect(screen.getByText("Max Price")).toBeInTheDocument()
  })

  it("displays category icon and title", () => {
    render(<CategoryFilter {...defaultProps} />)
    // Find the icon within the mobile and desktop views
    const categoryIcons = screen.getAllByTestId("mock-bi-category")
    expect(categoryIcons.length).toBeGreaterThan(0)
    // Find Category text within the h2 elements
    const categoryHeadings = screen.getAllByText("Category", { selector: "h2" })
    expect(categoryHeadings.length).toBeGreaterThan(0)
  })

  it('displays "Open" button on mobile and opens sidebar when clicked', () => {
    render(<CategoryFilter {...defaultProps} />)
    // klik "Open" untuk membuka sidebar
    const openButton = screen.getByText("Open", { selector: "button" })
    fireEvent.click(openButton)
    // klik "Close" untuk menutup sidebar
    expect(screen.getAllByText("Close")[0]).toBeInTheDocument()
  })

  it("displays all allowed categories", () => {
    render(<CategoryFilter {...defaultProps} />)
    expect(screen.getAllByText("All")).toHaveLength(2)
    expect(screen.getAllByText("electronics")).toHaveLength(2)
    expect(screen.getAllByText("furniture")).toHaveLength(2)
    expect(screen.getAllByText("shoes")).toHaveLength(2)
    expect(screen.getAllByText("miscellaneous")).toHaveLength(2)
    expect(screen.getAllByText("clothes")).toHaveLength(2)
    expect(screen.getAllByText("books")).toHaveLength(2)
    expect(screen.getAllByText("fashions")).toHaveLength(2)
    expect(screen.queryByText("not allowed category")).not.toBeInTheDocument()
  })

  it("calls onCategorySelect when a category is clicked", () => {
    render(<CategoryFilter {...defaultProps} />)
    fireEvent.click(screen.getAllByText("electronics")[0])
    expect(defaultProps.onCategorySelect).toHaveBeenCalledWith(1)
  })

  it("highlights the selected category", () => {
    render(<CategoryFilter {...defaultProps} selectedCategory={2} />)
    const selectedButtons = screen.getAllByText("furniture")
    expect(selectedButtons[0]).toHaveClass("text-black font-bold border-black")
    expect(selectedButtons[1]).toHaveClass("text-black font-bold border-black")
  })

  it("updates search term when input changes", () => {
    render(<CategoryFilter {...defaultProps} />)
    const searchInput = screen.getByPlaceholderText("Search products...")
    fireEvent.change(searchInput, { target: { value: "elegant" } })
    expect(defaultProps.setSearchTerm).toHaveBeenCalledWith("elegant")
  })

  it("updates min price when input changes", () => {
    render(<CategoryFilter {...defaultProps} />)
    // Find the number input that follows the "Min Price" label
    const minPriceLabel = screen.getByText("Min Price")
    const minPriceInput = minPriceLabel.nextElementSibling as HTMLInputElement
    fireEvent.change(minPriceInput, { target: { value: "10" } })
    expect(defaultProps.setMinPrice).toHaveBeenCalledWith(10)
  })

  it("updates max price when input changes", () => {
    render(<CategoryFilter {...defaultProps} />)
    // Find all number inputs and get the second one (max price)
    const maxPriceInput = screen.getAllByRole('spinbutton')[1]
    fireEvent.change(maxPriceInput, { target: { value: "100" } })
    expect(defaultProps.setMaxPrice).toHaveBeenCalledWith(100)
  })

  it("cleans category name", () => {
    const propsWithClothessss = {
      ...defaultProps,
      categories: [...mockCategories, { id: 9, name: "clothessss" }],
    }
    render(<CategoryFilter {...propsWithClothessss} />)
    expect(screen.getAllByText("clothes")).toHaveLength(2)
    expect(screen.queryByText("clothessss")).not.toBeInTheDocument()
  })
})

