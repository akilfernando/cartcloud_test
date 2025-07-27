import React, { useEffect, useState, useRef, useCallback } from 'react';
import Header from '../components/header';
import Footer from '@/components/footer';
import ProductCard from '@/components/product-card';
import axios from 'axios';
import type { Product } from '@/types/product'; // Assuming Product type is correctly defined

const ProductListingPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true); // Indicates if more products can be loaded
  const observerRef = useRef<HTMLDivElement>(null); // Ref for the element to observe for infinite scrolling

  // API base URL from environment variables
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const PRODUCTS_PER_PAGE = 12; // Define how many products to load per request

  // Function to fetch products based on the current page
  const fetchProducts = useCallback(async (pageNum: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<Product[]>(`${API_URL}/products`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        params: {
          page: pageNum,
          limit: PRODUCTS_PER_PAGE,
        },
      });

      // Update products, appending new ones
      setProducts((prevProducts) => [...prevProducts, ...response.data]);
      // Determine if there are more products to load
      setHasMore(response.data.length === PRODUCTS_PER_PAGE);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Failed to load products. Please try again later.");
      setHasMore(false); // Stop trying to load more if there's an error
    } finally {
      setLoading(false);
    }
  }, [API_URL, PRODUCTS_PER_PAGE]); // Depend on API_URL and PRODUCTS_PER_PAGE

  // Effect to load initial products and subsequent pages
  useEffect(() => {
    // Load initial products when component mounts
    if (page === 1) {
      fetchProducts(1);
    }
  }, [fetchProducts, page]);

  // Set up Intersection Observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // If the observed element is visible and we are not already loading and there are more products
        if (entries[0].isIntersecting && !loading && hasMore) {
          setPage((prevPage) => prevPage + 1); // Increment page to trigger next fetch
        }
      },
      { threshold: 0.5 } // Trigger when 50% of the element is visible
    );

    // Start observing the ref element
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    // Clean up the observer when component unmounts
    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [loading, hasMore]); // Re-run effect if loading or hasMore changes to re-evaluate observation

  // Prevent `useAuth` from being unused, if it's meant to be used later for auth checks,
  // otherwise it can be removed.
  // const { user, isLoading: authLoading } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header page="shop" />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 mt-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Products</h1>
        {error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
        {/* Element to observe for lazy loading */}
        {hasMore && (
          <div ref={observerRef} className="flex justify-center my-8">
            {loading && <p className="text-gray-600">Loading more products...</p>}
          </div>
        )}
        {/* Show a message if no more products are available after initial load */}
        {!hasMore && !loading && products.length > 0 && (
          <p className="text-center text-gray-500 my-8">You've reached the end of the product list.</p>
        )}
        {/* Show message for no products if initial load finds none */}
        {!loading && !hasMore && products.length === 0 && !error && (
            <p className="text-center text-gray-500 my-8">No products found.</p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductListingPage;