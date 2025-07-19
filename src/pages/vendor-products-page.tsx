// pages/vendor-products-page.tsx
import React, { useEffect, useState } from 'react';
import Header from '../components/header';
import Footer from '@/components/footer';
import ProductCard from '@/components/product-card';
import EditProductModal from '@/components/edit-product-modal'; // Import the new modal
import axios from 'axios';
import { useAuth } from '@/context/authContext';

// Interface for a single product
interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  vendorId: string;
}

const VendorProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // To store the product being edited
  const { user } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    const loadVendorProducts = async () => {
      if (!user || !user.id) {
        if (!loading) {
          setLoading(false);
        }
        return;
      }

      setError(null);
      setLoading(true);

      try {
        const { data } = await axios.get<Product[]>(`${API_URL}/products`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const vendorProducts = data.filter(product => product.vendorId === user.id);
        setProducts(vendorProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadVendorProducts();
  }, [user, API_URL]);

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null); // Clear selected product when closing
  };

  const handleProductUpdated = (updatedProduct: Product) => {
    // Update the product in the state to reflect the changes immediately
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === updatedProduct._id ? updatedProduct : product
      )
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header page="vendor-products" />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 mt-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Your Products</h1>
        {loading ? (
          <p className="text-gray-600">Loading your products...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : products.length === 0 ? (
          <p className="text-gray-600">You have not listed any products yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onEdit={handleEditProduct}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />

      {/* Render the EditProductModal */}
      <EditProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct} // Pass the selected product to the modal
        onProductUpdated={handleProductUpdated}
      />
    </div>
  );
};

export default VendorProductsPage;