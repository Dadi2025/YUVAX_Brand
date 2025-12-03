import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/layout/Navbar';
import Toast from './components/common/Toast';
import Home from './pages/Home';
import Footer from './components/layout/Footer';

// Lazy load pages for better performance
const Shop = lazy(() => import('./pages/shop/Shop'));
const ProductDetail = lazy(() => import('./pages/shop/ProductDetail'));
const Cart = lazy(() => import('./pages/shop/Cart'));
const Wishlist = lazy(() => import('./pages/shop/Wishlist'));
const Checkout = lazy(() => import('./pages/shop/Checkout'));
const OrderConfirmation = lazy(() => import('./pages/shop/OrderConfirmation'));
const Login = lazy(() => import('./pages/auth/Login'));
const Signup = lazy(() => import('./pages/auth/Signup'));
const Profile = lazy(() => import('./pages/user/Profile'));
const Feedback = lazy(() => import('./pages/user/Feedback'));
const TrackOrder = lazy(() => import('./pages/order/TrackOrder'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const DeliveryLogin = lazy(() => import('./pages/delivery/DeliveryLogin'));
const DeliveryDashboard = lazy(() => import('./pages/delivery/DeliveryDashboard'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const StyleWall = lazy(() => import('./pages/StyleWall'));

// Loading component
const PageLoader = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚡</div>
      <p style={{ color: 'var(--accent-cyan)' }}>Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <AppProvider>
      <Router>
        <div style={{ background: 'var(--bg-dark)', minHeight: '100vh', color: 'var(--text-main)' }}>
          <Navbar />
          <Toast />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/track-order/:orderId" element={<TrackOrder />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

              {/* Delivery Agent Routes */}
              <Route path="/delivery/login" element={<DeliveryLogin />} />
              <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />

              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/style-wall" element={<StyleWall />} />
            </Routes>
          </Suspense>
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
