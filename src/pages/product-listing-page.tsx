import React from 'react';
import Header from '../components/header'
import Footer from '@/components/footer';

// Interface for a single product
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
}

// ProductCard component to display individual product details
interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col items-center p-4">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-48 object-cover rounded-md mb-4"
        onError={(e) => {
          // Fallback image in case the original image fails to load
          e.currentTarget.src = `https://placehold.co/200x200/cccccc/333333?text=${product.name.replace(/\s/g, '+')}`;
        }}
      />
      <h3 className="text-lg font-semibold text-gray-800 text-center">{product.name}</h3>
      <p className="text-sm text-gray-500 text-center mb-2">{product.category}</p>
      <p className="text-lg font-bold text-gray-900 text-center">${product.price.toFixed(2)}</p>
    </div>
  );
};

const ProductListingPage: React.FC = () => {
  // Hardcoded product data - this would be fetched from a backend
  const products: Product[] = [
    { id: '1', name: 'Basic Shirt', category: 'Apparel', price: 19.99, imageUrl: 'https://placehold.co/200x200/E0E0E0/333333?text=Basic+Shirt' },
    { id: '2', name: 'Toys', category: 'Kids', price: 19.99, imageUrl: 'https://placehold.co/200x200/D0D0D0/333333?text=Toys' },
    { id: '3', name: 'Basic Utensils', category: 'Kitchen', price: 19.99, imageUrl: 'https://placehold.co/200x200/C0C0C0/333333?text=Basic+Utensils' },
    { id: '4', name: 'Tv Remote', category: 'Electronics', price: 19.99, imageUrl: 'https://placehold.co/200x200/B0B0B0/333333?text=Tv+Remote' },
    { id: '5', name: 'Basic Shirt', category: 'Apparel', price: 19.99, imageUrl: 'https://placehold.co/200x200/E0E0E0/333333?text=Basic+Shirt' },
    { id: '6', name: 'Toys', category: 'Kids', price: 19.99, imageUrl: 'https://placehold.co/200x200/D0D0D0/333333?text=Toys' },
    { id: '7', name: 'Basic Utensils', category: 'Kitchen', price: 19.99, imageUrl: 'https://placehold.co/200x200/C0C0C0/333333?text=Basic+Utensils' },
    { id: '8', name: 'Tv Remote', category: 'Electronics', price: 19.99, imageUrl: 'https://placehold.co/200x200/B0B0B0/333333?text=Tv+Remote' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header page="products" /> 
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 mt-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductListingPage;
