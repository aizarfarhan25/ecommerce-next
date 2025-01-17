import { useEffect, useState } from "react";
import axios from "axios";
import CategoryFilter from "@/components/CategoryFilter";
import ProductList from "@/components/ProductList";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: { id: number; name: string };
}

interface Category {
  id: number;
  name: string;
}

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axios.get(
        "https://api.escuelajs.co/api/v1/categories"
      );
      setCategories(response.data);
    };

    const fetchProducts = async () => {
      const response = await axios.get(
        "https://api.escuelajs.co/api/v1/products"
      );
      setProducts(response.data);
      setFilteredProducts(response.data);
      setLoading(false);
    };

    fetchCategories();
    fetchProducts();
  }, []);

  const handleCategorySelect = async (categoryId: number | null) => {
    setSelectedCategory(categoryId);

    if (categoryId) {
      const response = await axios.get(
        `https://api.escuelajs.co/api/v1/products/?categoryId=${categoryId}`
      );
      setFilteredProducts(response.data);
    } else {
      setFilteredProducts(products);
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="flex flex-col lg:flex-row justify-center lg:space-x-6 mt-10">
          <div className="w-full lg:w-1/4 p-4">
            <div className="bg-gray-300 h-12 mb-4 animate-pulse"></div>
            {[...Array(5)].map((_, index) => (
              <div key={index} className="bg-gray-300 h-8 mb-4 animate-pulse"></div>
            ))}
          </div>
          
          <div className="w-full lg:w-3/4 p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-gray-300 h-64 animate-pulse rounded-md"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="flex flex-col lg:flex-row justify-center lg:space-x-6 mt-10">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />
        <ProductList products={filteredProducts} />
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;

