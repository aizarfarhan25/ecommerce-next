import { renderHook } from "@testing-library/react";
import { useProducts } from "@/hooks/useProducts";
import useSWR from "swr";

// mock swr ini supaya tidak melakukan request asli
jest.mock("swr");

describe("useProducts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch products without category", async () => {
    const mockProducts = [
      {
        id: 1,
        title: "Test Product",
        price: 100,
        images: ["test.jpg"],
        category: { id: 1, name: "Test Category" },
      },
    ];

    (useSWR as jest.Mock).mockReturnValue({
      data: mockProducts,
      error: undefined,
      isLoading: false,
    });

    const { result } = renderHook(() => useProducts());

    expect(result.current.products).toEqual(mockProducts);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBeUndefined();
  });

  it("should handle loading state", () => {
    (useSWR as jest.Mock).mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
    });

    const { result } = renderHook(() => useProducts());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.products).toBeUndefined();
  });

  it("should handle error state", () => {
    const error = new Error("Failed to fetch");

    (useSWR as jest.Mock).mockReturnValue({
      data: undefined,
      error,
      isLoading: false,
    });

    const { result } = renderHook(() => useProducts());

    expect(result.current.isError).toBe(error);
    expect(result.current.products).toBeUndefined();
  });
});
