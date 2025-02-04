import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AboutPage = () => {
  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">About Us</h1>
        <p className="text-lg text-gray-700 mb-4">
          Welcome to GegeShop! We are an e-commerce platform dedicated to providing the best shopping experience for our customers.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          Our mission is to offer a wide range of high-quality products at competitive prices. We strive to ensure customer satisfaction through excellent service and a seamless shopping experience.
        </p>
        <p className="text-lg text-gray-700">
          Thank you for choosing GegeShop. We hope you enjoy your shopping experience with us!
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;