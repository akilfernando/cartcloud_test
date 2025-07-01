import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from "./pages/login";
import Signup from './pages/signup';
import ProductDetails from './pages/product-details';
import Profile from './pages/profile';
import About from './pages/about';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/product-details" element={<ProductDetails/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/profile" element={<Profile/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
