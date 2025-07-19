import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from "./pages/login";
import Signup from './pages/signup';
import ProductDetails from './pages/product-details';
import ProductListingPage from './pages/product-listing-page';
import SearchPage from './pages/search';
import VendorHomePage from './pages/vendor-home';
import Contact from './pages/contact';
import Profile from './pages/profile';
import About from './pages/about';
import Wishlist from './pages/wishlist';
import UploadProductPage from './pages/upload-product';
import VendorProductsPage from './pages/vendor-products-page';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/product-details/:id" element={<ProductDetails/>} />
        <Route path="/product-listing" element={<ProductListingPage/>} />
        <Route path="/search" element={<SearchPage/>} />
        <Route path="/vendor-home" element={<VendorHomePage/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/wishlist" element={<Wishlist/>} />
        <Route path='/upload-product' element={<UploadProductPage/>} />
        <Route path='/vendor-products' element={<VendorProductsPage/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
