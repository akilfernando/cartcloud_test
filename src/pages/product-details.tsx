import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Header from '@/components/header';
import Footer from '@/components/footer';

// Defines the structure of product data.
interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  images: string[];
  variants: { label: string; value: string }[];
  description: {
    info: string;
    details: string;
    delivery: string;
  };
  attributes: {
    material: string;
    fit: string;
    neckline: string;
    care: string;
    fabricWeight?: string;
    stitching?: string;
    sleeveStyle?: string;
    origin?: string;
    standardDelivery?: string;
    expressDelivery?: string;
    returnsPolicy?: string;
    returnCondition?: string;
  };
}

// Hardcoded product data; this will be replaced by a backend API call.
const productData: Product = {
  id: 'basic-t-shirt-123',
  name: 'Basic T-Shirt',
  price: 10,
  currency: '$',
  images: [
    'https://placehold.co/400x400/A0A0A0/333333?text=Main+Product+1',
    'https://placehold.co/400x400/B0B0B0/333333?text=Main+Product+2',
    'https://placehold.co/400x400/C0C0C0/333333?text=Main+Product+3',
    'https://placehold.co/400x400/D0D0D0/333333?text=Main+Product+4',
  ],
  variants: [
    { label: 'XS', value: 'XS' },
    { label: 'S', value: 'S' },
    { label: 'M', value: 'M' },
    { label: 'L', value: 'L' },
    { label: 'XL', value: 'XL' },
  ],
  description: {
    info: 'Basic T-shirt with a relaxed fit makes it a versatile staple for everyday wear. Features a classic crew neck and clean hemline. Crafted from soft, breathable fabric for all-day comfort. Minimal design with subtle detailing for easy layering or stand-alone style.',
    details: 'This section would contain more technical details about the product, such as:',
    delivery: 'Information regarding delivery options and return policy:',
  },
  attributes: {
    material: '100% Cotton',
    fit: 'Relaxed',
    neckline: 'Crew Neck',
    care: 'Machine wash cold',
    fabricWeight: '180 GSM',
    stitching: 'Double-stitched seams',
    sleeveStyle: 'Short sleeve',
    origin: 'Made in Bangladesh',
    standardDelivery: '3-5 business days',
    expressDelivery: '1-2 business days',
    returnsPolicy: 'Free returns within 30 days of purchase.',
    returnCondition: 'Item must be unworn and in original condition with tags.',
  },
};

interface MessageModalProps {
  message: string;
  onClose: () => void;
}

const MessageModal: React.FC<MessageModalProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center rounded-lg">
        <p className="text-lg font-semibold text-gray-800 mb-4">{message}</p>
        <Button onClick={onClose} variant="secondary">Close</Button>
      </div>
    </div>
  );
};

const ProductDetails: React.FC = () => {
  const [selectedVariant, setSelectedVariant] = useState(productData.variants[0]?.value || '');
  const [activeTab, setActiveTab] = useState('info');
  const [modalMessage, setModalMessage] = useState('');
  const [mainImage, setMainImage] = useState(productData.images[0]);

  const handleVariantChange = (value: string) => {
    setSelectedVariant(value);
  };

  const handleAddToCart = () => {
    setModalMessage(`Added ${productData.name} (${selectedVariant}) to cart!`);
  };

  const closeModal = () => {
    setModalMessage('');
  };
//TODO Check user's role and use that for the role so that the appropriate header is displayed.
  return (
    <>
      <Header page="product-details" role="customer"/>
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 mt-16">
        <div className="bg-white rounded-lg shadow-md overflow-hidden p-4 md:p-8 flex flex-col lg:flex-row gap-4 lg:gap-8">
          <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-2/5">
            <div className="flex flex-row lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 overflow-x-auto lg:overflow-y-auto pb-2 lg:pb-0 justify-center flex-shrink-0 lg:w-24 lg:h-auto">
              {productData.images.map((img, index) => (
                <div
                  key={index}
                  className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-md border border-gray-200 overflow-hidden cursor-pointer hover:border-gray-400 transition-colors duration-200"
                  onClick={() => setMainImage(img)}
                >
                  <img src={img} alt={`${productData.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="flex-grow flex-shrink rounded-lg overflow-hidden border border-gray-200 w-full flex items-center justify-center">
              <img src={mainImage} alt={`Main image of ${productData.name}`} className="block w-full h-auto object-contain" />
            </div>
          </div>

          <div className="w-full lg:w-3/5 space-y-6 mt-6 lg:mt-0">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{productData.name}</h1>
            <p className="text-2xl text-gray-700 font-semibold">{productData.currency}{productData.price}</p>

            <div className="space-y-2">
              <label htmlFor="product-variant" className="block text-gray-700 text-sm font-medium mb-1">Select Size:</label>
              <RadioGroup
                value={selectedVariant}
                onValueChange={handleVariantChange}
                className="grid grid-cols-3 sm:grid-cols-5 gap-2"
              >
                {productData.variants.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`variant-${option.value}`} />
                    <label htmlFor={`variant-${option.value}`} className="text-sm font-medium leading-none cursor-pointer">
                      {option.label}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <Button onClick={handleAddToCart} className="w-full md:w-auto mt-4">
              Add to cart
            </Button>

            <div className="border-t border-gray-200 pt-6 mt-6">
              <div className="flex space-x-4 border-b border-gray-200 mb-4 overflow-x-auto whitespace-nowrap">
                <button
                  className={`py-2 px-4 text-sm font-medium rounded-t-md ${activeTab === 'info' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-600 hover:text-gray-800'}`}
                  onClick={() => setActiveTab('info')}
                >
                  Product Info
                </button>
                <button
                  className={`py-2 px-4 text-sm font-medium rounded-t-md ${activeTab === 'details' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-600 hover:text-gray-800'}`}
                  onClick={() => setActiveTab('details')}
                >
                  Details
                </button>
                <button
                  className={`py-2 px-4 text-sm font-medium rounded-t-md ${activeTab === 'delivery' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-600 hover:text-gray-800'}`}
                  onClick={() => setActiveTab('delivery')}
                >
                  Delivery & Returns
                </button>
              </div>

              {activeTab === 'info' && (
                <div className="text-gray-600 text-sm leading-relaxed p-2">
                  <p>{productData.description.info}</p>
                  <ul className="list-disc list-inside mt-4 space-y-1">
                    <li>Material: {productData.attributes.material}</li>
                    <li>Fit: {productData.attributes.fit}</li>
                    <li>Neckline: {productData.attributes.neckline}</li>
                    <li>Care: {productData.attributes.care}</li>
                  </ul>
                </div>
              )}
              {activeTab === 'details' && (
                <div className="text-gray-600 text-sm leading-relaxed p-2">
                  <p>{productData.description.details}</p>
                  <ul className="list-disc list-inside mt-4 space-y-1">
                    <li>Fabric Weight: {productData.attributes.fabricWeight}</li>
                    <li>Stitching: {productData.attributes.stitching}</li>
                    <li>Sleeve Style: {productData.attributes.sleeveStyle}</li>
                    <li>Origin: {productData.attributes.origin}</li>
                  </ul>
                </div>
              )}
              {activeTab === 'delivery' && (
                <div className="text-gray-600 text-sm leading-relaxed p-2">
                  <p>{productData.description.delivery}</p>
                  <ul className="list-disc list-inside mt-4 space-y-1">
                    <li>Standard Delivery: {productData.attributes.standardDelivery}</li>
                    <li>Express Delivery: {productData.attributes.expressDelivery}</li>
                    <li>{productData.attributes.returnsPolicy}</li>
                    <li>{productData.attributes.returnCondition}</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <MessageModal message={modalMessage} onClose={closeModal} />
      <Footer />
    </>
  );
};

export default ProductDetails;
