import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// Interface for a product that can be used in both listing and wishlist
interface Product {
  _id?: string;
  id?: string;
  name: string;
  category?: string;
  price: number;
  imageUrl: string;
}

interface ProductCardProps {
  product: Product;
  showCategory?: boolean;
  showRemoveButton?: boolean;
  onRemove?: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  showCategory = true, 
  showRemoveButton = false, 
  onRemove 
}) => {
  // Handle both _id and id properties
  const productId = product._id || product.id || '';

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRemove && productId) {
      onRemove(productId);
    }
  };

  return (
    <Link
      to={`/product-details/${productId}`}
      state={{ product }}
      className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col items-center p-4 hover:shadow-lg transition-shadow"
    >
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-48 object-cover rounded-md mb-4"
        onError={(e) => {
          // Fallback image in case the original image fails to load
          (e.currentTarget as HTMLImageElement).src = `https://placehold.co/200x200/cccccc/333333?text=${product.name.replace(/\s/g, '+')}`;
        }}
      />
      <h3 className="text-lg font-semibold text-gray-800 text-center">
        {product.name}
      </h3>
      {showCategory && product.category && (
        <p className="text-sm text-gray-500 text-center mb-2">{product.category}</p>
      )}
      <p className="text-lg font-bold text-gray-900 text-center">
        ${product.price.toFixed(2)}
      </p>
      {showRemoveButton && onRemove && (
        <Button
          variant="secondary"
          className="mt-4 w-full"
          onClick={handleRemoveClick}
        >
          Remove
        </Button>
      )}
    </Link>
  );
};

export default ProductCard; 