import useSWR from "swr";
import axiosInstance from "@/utils/axiosInstance";

const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);

export function useProduct(id: string) {
  const { data, error, isLoading } = useSWR(
    id ? `/products/${id}` : null,
    fetcher
  );

  return {
    product: data,
    isLoading,
    isError: error,
  };
}
