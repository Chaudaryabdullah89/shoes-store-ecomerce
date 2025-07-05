import { Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import Home from './Pages/Home'
import About from './Pages/About'
import Navbar from './Components/Navbar'
import CartDrawer from './Components/CartDrawer';
import Wishlist from './Pages/Wishlist';
import Cart from './Pages/Cart';
import Checkout from './Pages/Checkout';
// import OrderConfirmation from './Pages/OrderConfirmation';
import Orders from './Pages/Orders';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Product from './Pages/Product';
// import Blog from './Pages/Blog';
import Blog from './Pages/Blog';
import BlogRead from './Pages/BlogRead';
import Shop from './Pages/Shop';
import Footer from './Components/Footer';
import OrderConfirmation from './Pages/OrderConfirmation';
import YourAccount from './Pages/YourAccount';
import OrderTracking from './Pages/OrderTracking';
import Sitemap from './Pages/Sitemap';
// import PrivacyPolicy from './Pages/PrivacyPolicy';
import TermsAndConditions from './Pages/TermsAndConditions';
import ContactUs from './Pages/ContactUs';
import AdvancedSearch from './Pages/AdvancedSearch';
import FAQ from './Pages/FAQ';
import DeliveryInformation from './Pages/DeliveryInformation';
import Events from './Pages/Events';
import Popular from './Pages/Popular';
import Discount from './Pages/Discount';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import AdminProducts from './admin/AdminProducts';
import AdminOrders from './admin/AdminOrders';
import AdminCustomers from './admin/AdminCustomers';
import AdminBlogs from './admin/AdminBlogs';
import AdminSettings from './admin/AdminSettings';
import AddProduct from './admin/AddProduct';
import EditProduct from './admin/EditProduct';
import EditCustomer from './admin/EditCustomer';
import AdminEmails from './admin/AdminEmails';
import AdminOrderDetail from './admin/AdminOrderDetail';
import AdminProtectedRoute from './admin/components/AdminProtectedRoute';


function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  return (
    <>
      {!isAdminRoute && <Navbar/>}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/shop" element={<Shop />} />
      
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orderConfirmation" element={<OrderConfirmation />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/blog" element={<Blog />} /> */}
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogRead />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path='/yourAccount' element={<YourAccount />} />
        <Route path='/ordertracking' element={<OrderTracking />} />
        <Route path='/order-tracking/:orderNumber' element={<OrderTracking />} />
        <Route path='/sitemap' element={<Sitemap />} />
        {/* <Route path='/privacypolicy' element={<PrivacyPolicy />} /> */}
        <Route path='/termsandconditions' element={<TermsAndConditions />} />
        <Route path='/Contact' element={<ContactUs />} />
        <Route path='/advancedsearch' element={<AdvancedSearch />} />
        <Route path='/faq' element={<FAQ />} />
        <Route path='/deliveryinformation' element={<DeliveryInformation />} />
        <Route path='/events' element={<Events />} />
        <Route path='/popular' element={<Popular />} />
        <Route path='/discount' element={<Discount />} />
     
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        } />
        <Route path="/admin/products" element={
          <AdminProtectedRoute>
            <AdminProducts />
          </AdminProtectedRoute>
        } />
        <Route path="/admin/orders" element={
          <AdminProtectedRoute>
            <AdminOrders />
          </AdminProtectedRoute>
        } />
        <Route path="/admin/orders/number/:orderNumber" element={
          <AdminProtectedRoute>
            <AdminOrderDetail />
          </AdminProtectedRoute>
        } />

        <Route path="/admin/customers" element={
          <AdminProtectedRoute>
            <AdminCustomers />
          </AdminProtectedRoute>
        } />
        <Route path="/admin/customers/edit/:id" element={
          <AdminProtectedRoute>
            <EditCustomer />
          </AdminProtectedRoute>
        } />
        <Route path="/admin/blogs" element={
          <AdminProtectedRoute>
            <AdminBlogs />
          </AdminProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <AdminProtectedRoute>
            <AdminSettings />
          </AdminProtectedRoute>
        } />
        <Route path="/admin/products/add" element={
          <AdminProtectedRoute>
            <AddProduct />
          </AdminProtectedRoute>
        } />
        <Route path="/admin/products/edit/:id" element={
          <AdminProtectedRoute>
            <EditProduct />
          </AdminProtectedRoute>
        } />
        <Route path="/admin/emails" element={
          <AdminProtectedRoute>
            <AdminEmails />
          </AdminProtectedRoute>
        } />
      </Routes>
      <CartDrawer />
      <Footer />
    </>
  )
}

export default App
