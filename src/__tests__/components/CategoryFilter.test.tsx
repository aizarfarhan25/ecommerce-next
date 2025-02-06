import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CategoryFilter from "@/components/CategoryFilter";

const mockCategories = [
  { id: 1, name: "Electronics" },
  { id: 2, name: "Fashions" },
];

describe("CategoryFilter", () => {
  const setSearchTerm = jest.fn();
  const setMinPrice = jest.fn();
  const setMaxPrice = jest.fn();
  const onCategorySelect = jest.fn();

  beforeEach(() => {
    render(
      <CategoryFilter
        categories={mockCategories}
        selectedCategory={null}
        onCategorySelect={onCategorySelect}
        searchTerm=""
        setSearchTerm={setSearchTerm}
        minPrice={0}
        setMinPrice={setMinPrice}
        maxPrice={1000000}
        setMaxPrice={setMaxPrice}
      />
    );
  });

  test("renders search input", () => {
    const searchInput = screen.getByPlaceholderText(/search products.../i);
    expect(searchInput).toBeInTheDocument();
  });

  test("calls setSearchTerm on input change", () => {
    const searchInput = screen.getByPlaceholderText(/search products.../i);
    fireEvent.change(searchInput, { target: { value: "Laptop" } });
    expect(setSearchTerm).toHaveBeenCalledWith("Laptop");
  });

  test("renders price range inputs", () => {
    const minPriceInput = screen.getByLabelText(/min price/i);
    const maxPriceInput = screen.getByLabelText(/max price/i);
    expect(minPriceInput).toBeInTheDocument();
    expect(maxPriceInput).toBeInTheDocument();
  });

  test("calls setMinPrice on min price input change", () => {
    const minPriceInput = screen.getByLabelText(/min price/i);
    fireEvent.change(minPriceInput, { target: { value: 100 } });
    expect(setMinPrice).toHaveBeenCalledWith(100);
  });

  test("calls setMaxPrice on max price input change", () => {
    const maxPriceInput = screen.getByLabelText(/max price/i);
    fireEvent.change(maxPriceInput, { target: { value: 500 } });
    expect(setMaxPrice).toHaveBeenCalledWith(500);
  });

  test("renders category buttons", () => {
    mockCategories.forEach((category) => {
      expect(screen.getByText(category.name)).toBeInTheDocument();
    });
  });

  test("calls onCategorySelect when a category is clicked", () => {
    const categoryButton = screen.getByText("Electronics");
    fireEvent.click(categoryButton);
    expect(onCategorySelect).toHaveBeenCalledWith(1);
  });
});