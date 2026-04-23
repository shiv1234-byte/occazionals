import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; 
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About'
import Cart from './pages/Cart';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import Orders from './pages/Orders';
import MyOrders from './pages/MyOrders';
import BudgetSection from './components/BudgetSection';
import Footer from './components/Footer';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';

// 1. IS LINE KO ADD KAREIN (Ensure the path is correct)
import ChatBot from './components/Chatbot'; 

function App() {
  const auth = useAuth(); 
  const user = auth?.user;

  return (
    <>
      <Navbar />
      <Routes>
        <Route 
    path="/" 
    element={
      <>
        <Hero />
        <BudgetSection />
      </>
    } 
  />
        <Route path='/BudgetSection' element={<BudgetSection/>}/>
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />
        {user?.isAdmin && (
          <Route path="/admin" element={<AdminDashboard />} />

        )}
      </Routes>
     

      {/* 2. ChatBot yahan render ho raha hai */}
      <ChatBot /> 
      <Footer/>
    </>
  );
}

export default App;
