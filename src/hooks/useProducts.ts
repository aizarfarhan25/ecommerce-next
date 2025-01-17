import useSWR from "swr";
import axiosInstance from "@/utils/axiosInstance";

export interface Product {
  id: number;
  title: string;
  price: number;
  images: string[];
  category: {
    id: number;
    name: string;
  };
}

const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);

export function useProducts(categoryId?: number | null) {
  const url = categoryId ? `/products/?categoryId=${categoryId}` : "/products";

  const { data, error, isLoading, mutate } = useSWR<Product[]>(url, fetcher);

  return {
    products: data,
    isLoading,
    isError: error,
    mutate,
  };
}
