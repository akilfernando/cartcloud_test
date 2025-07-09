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
import UploadProductPage from './pages/upload-product';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/product-details" element={<ProductDetails/>} />
        <Route path="/product-listing" element={<ProductListingPage/>} />
        <Route path="/search" element={<SearchPage/>} />
        <Route path="/vendor-home" element={<VendorHomePage/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path='/upload-product' element={<UploadProductPage/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
