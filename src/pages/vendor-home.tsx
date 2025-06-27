import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Header from '@/components/header';
import Footer from '@/components/footer';

const VendorExample = {
  storeName: "Store Example",
  storeSlug: "https://cdn2.picryl.com/photo/2017/10/16/the-econo-grocery-store-is-fully-stocked-with-food-85b675-1024.jpg",
  isActive: true
};


const VendorHomePage = () => {
  

  return (
    <>
      <Header page="vendor-home" role="vendor"/>
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 mt-16">
        <div className="bg-white rounded-lg shadow-md overflow-hidden p-4 md:p-8 flex flex-col lg:flex-row gap-4 lg:gap-8">
        </div>
      </main>
      <Footer />
    </>
  );
};

export default VendorHomePage;
