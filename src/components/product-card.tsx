import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  showCategory?: boolean;
  showRemoveButton?: boolean;
  onRemove?: (id: string) => void;
  onEdit?: (product: Product) => void; // New prop for edit action
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showCategory = true,
  showRemoveButton = false,
  onRemove,
  onEdit // Destructure the new onEdit prop
}) => {
  // Handle both _id and id properties
  const productId = product._id || product.id || '';

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default link behavior
    e.stopPropagation(); // Stop event propagation to prevent link from being triggered
    if (onRemove && productId) {
      onRemove(productId);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default link behavior
    e.stopPropagation(); // Stop event propagation to prevent link from being triggered
    if (onEdit) {
      onEdit(product);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col items-center p-4 hover:shadow-lg transition-shadow">
      {/* The Link wraps the product image and details for navigation */}
      <Link
        to={`/product-details/${productId}`}
        state={{ product }}
        className="w-full flex flex-col items-center flex-grow" // Ensure link takes available space
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
      </Link>

      {/* Buttons are placed outside the Link to prevent conflict */}
      <div className="flex flex-col gap-2 mt-4 w-full px-2"> {/* Added padding for better spacing */}
        {onEdit && ( // Only show edit button if onEdit prop is provided
          <Button
            variant="default" // You can choose a different variant if needed
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={handleEditClick}
          >
            Edit Product
          </Button>
        )}
        {showRemoveButton && onRemove && (
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleRemoveClick}
          >
            Remove
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
