import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; 
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword'; // ✅ Route added
import AdminDashboard from './pages/AdminDashboard';
import Orders from './pages/Orders';
import MyOrders from './pages/MyOrders';
import BudgetSection from './components/BudgetSection';
import Footer from './components/Footer';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import ChatBot from './components/Chatbot'; 

// ✅ Naye Policy Pages Import karein
import ShippingPolicy from './pages/ShippingPolicy';
import ReturnsPolicy from './pages/ReturnsPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';

function App() {
  const auth = useAuth(); 
  const user = auth?.user;

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<><Hero /><BudgetSection /></>} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* ✅ Forgot Password Route */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        <Route path="/orders" element={<Orders />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />

        {/* ✅ Policy Routes */}
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/returns-policy" element={<ReturnsPolicy />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />

        {/* ✅ Admin Dashboard (Sahi Path) */}
        {user?.isAdmin && (
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        )}
      </Routes>
      
      <ChatBot /> 
      <Footer/>
    </>
  );
}

export default App;