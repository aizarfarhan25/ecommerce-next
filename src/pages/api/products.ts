import axiosInstance from "@/utils/axiosInstance";

// untuk get all product
export const getProducts = async () => {
  const response = await axiosInstance.get("/products");
  return response.data;
};

// untuk get product by category
export const getProductByCategory = async (categoryId: number) => {
  const response = await axiosInstance.get(`/products/?categoryId=${categoryId}`);
  return response.data;
};

