import { useState, useEffect } from "react";
import { useProducts } from "@/hooks/useProducts";
import CategoryFilter from "@/components/CategoryFilter";
import ProductList from "@/components/ProductList";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import axiosInstance from "@/utils/axiosInstance";

interface Category {
  id: number;
  name: string;
}

export async function getServerSideProps() {
  try {
    const categoriesResponse = await axiosInstance.get("/categories");

    return {
      props: {
        initialCategories: categoriesResponse.data,
      },
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      props: {
        initialCategories: [],
      },
    };
  }
}

const HomePage = ({ initialCategories }: { initialCategories: Category[] }) => {
  const [categories] = useState<Category[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000000); // Set default max price

  const { products = [], isLoading } = useProducts(selectedCategory);

  const filteredProducts = products.filter(product => {
    const isInPriceRange = product.price >= minPrice && product.price <= maxPrice;
    const matchesSearchTerm = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    return isInPriceRange && matchesSearchTerm;
  });

  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://embed.tawk.to/67a203eb825083258e0fe388/1ij8duki5";
    script.async = true;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (isLoading) {
    return (
      <div>
        <Header />
        <div className="flex flex-col lg:flex-row justify-center lg:space-x-6 mt-10">
          <div className="w-full lg:w-1/4 p-4">
            <div className="bg-gray-300 h-12 mb-4 animate-pulse"></div>
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-300 h-8 mb-4 animate-pulse"
              ></div>
            ))}
          </div>

          <div className="w-full lg:w-3/4 p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-300 h-64 animate-pulse rounded-md"
                ></div>
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
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
        />
        <ProductList products={filteredProducts || []} />
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
