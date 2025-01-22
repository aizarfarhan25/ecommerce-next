import React, { useState } from "react";
import { BiCategory } from "react-icons/bi";

interface Category {
  id: number;
  name: string;
}

interface Props {
  categories: Category[];
  selectedCategory: number | null;
  onCategorySelect: (categoryId: number | null) => void;
}

const CategoryFilter: React.FC<Props> = ({
  categories,
  selectedCategory,
  onCategorySelect,
}) => {
  const allowedCategories = [
    "electronics",
    "furniture",
    "shoes",
    "miscellaneous",
    "clothes",
  ];

  const cleanCategoryName = (name: string) => {
    return name.trim().replace(/clothessss/i, "clothes");
  };

  const filteredCategories = categories.filter((category) => {
    const normalizedCategoryName = category.name.toLowerCase().trim();
    return allowedCategories.includes(normalizedCategoryName);
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleCategorySelect = (categoryId: number | null) => {
    onCategorySelect(categoryId);
    setIsSidebarOpen(false);
  };

  return (
    <div className="sticky top-16 bg-white z-40">
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden transition-transform duration-300 transform ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      <div className="w-full shadow-sm border-gray-100 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4 lg:hidden">
          <div className="flex items-center gap-1">
            <BiCategory size={20} />
            <h2 className="text-lg font-semibold">Category</h2>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-600 focus:outline-none"
          >
            {isSidebarOpen ? "Close" : "Open"}
          </button>
        </div>

        <div
          className={`fixed top-16 left-0 h-[calc(100%-4rem)] bg-white w-64 transform transition-transform duration-300 lg:hidden z-[60] ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Categories</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              Close
            </button>
          </div>
          
          <div className="p-4 pt-2 overflow-y-auto h-full">
            <button
              onClick={() => handleCategorySelect(null)}
              className={`w-full px-4 py-2 text-left ${
                selectedCategory === null
                  ? "text-black font-bold border-l-4 border-black"
                  : "text-gray-700 hover:bg-gray-100 border-l-4 border-transparent hover:border-black"
              } transition-all duration-200`}
            >
              All
            </button>
            {filteredCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`w-full px-4 py-2 text-left ${
                  selectedCategory === category.id
                    ? "text-black font-bold border-l-4 border-black"
                    : "text-gray-700 hover:bg-gray-100 border-l-4 border-transparent hover:border-black"
                } transition-all duration-200`}
              >
                {cleanCategoryName(category.name)}
              </button>
            ))}
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="flex items-center gap-1 mb-4 text-black">
            <BiCategory size={20} />
            <h2 className="text-lg font-semibold">Category</h2>
          </div>
          <div className="w-full max-w-[200px]">
            <button
              onClick={() => handleCategorySelect(null)}
              className={`w-full px-4 py-2 text-left border-l-4 ${
                selectedCategory === null
                  ? "text-black font-bold border-black"
                  : "text-gray-700 hover:bg-gray-200 border-transparent hover:border-black"
              } transition-all duration-200`}
            >
              All
            </button>
            {filteredCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`w-full px-4 py-2 text-left border-l-4 ${
                  selectedCategory === category.id
                    ? "text-black font-bold border-black"
                    : "text-gray-700 hover:bg-gray-200 border-transparent hover:border-black"
                } transition-all duration-200`}
              >
                {cleanCategoryName(category.name)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
