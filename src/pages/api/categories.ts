import axiosInstance from "@/utils/axiosInstance";

// untuk get all category
export const getCategories = async () => {
  const response = await axiosInstance.get("/categories");
  return response.data;
};

// untuk get product by category
export const getProductsByCategory = async (categoryId: number) => {
  const response = await axiosInstance.get(`/products/?categoryId=${categoryId}`);
  return response.data;
};
