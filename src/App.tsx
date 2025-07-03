import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from "./pages/login";
import Signup from './pages/signup';
import ProductDetails from './pages/product-details';
import SearchPage from './pages/search';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/product-details" element={<ProductDetails/>} />
        <Route path="/search" element={<SearchPage/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
