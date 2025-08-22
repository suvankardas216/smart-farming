import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";

// Components
import ProtectedRoute from "../components/ProtectedRoute";
import Navbar from "../components/Navbar";

// Pages
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import AdvisoryPage from "../pages/AdvisoryPage";
import Weather from "../pages/Weather";
import PestDetection from "../pages/PestDetection";
import Marketplace from "../pages/Marketplace";
import ProductDetails from "../pages/ProductDetails";
import Forum from "../pages/Forum";
import ForumPostDetails from "../pages/ForumPostDetails";
import CreateForumPost from "../pages/CreateForumPost";
import ResourcesPage from "../pages/ResourcesPage";
import NotFound from "../pages/NotFound";
import Schemes from "../pages/Schemes";
import CartPage from "../pages/CartPage";
import GoogleTranslate from "../components/GoogleTranslate";
import LogoutHome from "../pages/LogoutHome";
import { AuthContext } from "../context/AuthContext";
import SoilTestForm from "../pages/SoilTestForm";
import CheckoutPage from "../pages/CheckoutPage";
import MyOrdersPage from "../pages/MyOrdersPage";
import Location from "../pages/Location";
import FarmAnalytics from "../pages/FarmAnalytics";

import Users from "../pages/admin/Users";
import AdminSchemes from "../pages/admin/AdminSchemes";
import AdminHome from "../pages/admin/AdminHome";
import MainPage from "../pages/admin/MainPage";
import Products from "../pages/admin/Products";
import Orders from "../pages/admin/Orders";
import Advisories from "../pages/admin/Advisories";
import Resources from "../pages/admin/Resources";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <div className="flex flex-col h-screen">
        {/* Show Navbar only if logged in */}
        {user && user.role !== "admin" && <Navbar />}
        <main className="flex-grow overflow-y-auto">

          <Routes>
            {/* Public Routes */}
            <Route path="/logout-home" element={<LogoutHome />} />
            <Route
              path="/login"
              element={user ? <Navigate to="/" replace /> : <Login />}
            />
            <Route
              path="/register"
              element={user ? <Navigate to="/" replace /> : <Register />}
            />


            {/* Protected Routes */}

            {/* Admin routes */}

            <Route path='/admin' element={
              <ProtectedRoute adminOnly={true}>
                <MainPage />
              </ProtectedRoute>
            } >

              {/* index = /admin */}
              <Route index element={<AdminHome />} />

              {/* /admin/users */}
              <Route path="users" element={<Users />} />

              {/* /admin/schemes */}
              <Route path="schemes" element={<AdminSchemes />} />

              {/* /admin/products */}
              <Route path="products" element={<Products />} />

              {/* /admin/orders */}
              <Route path="orders" element={<Orders />} />

              {/* /admin/advisories */}
              <Route path="advisories" element={<Advisories />} />

              {/* /admin/resources */}
              <Route path="resources" element={<Resources />} />

            </Route>



            {/* User routes */}
            <Route
              path="/farm-analytics"
              element={
                <ProtectedRoute>
                  <FarmAnalytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/location"
              element={
                <ProtectedRoute>
                  <Location />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-orders"
              element={
                <ProtectedRoute>
                  <MyOrdersPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/soil-tests"
              element={
                <ProtectedRoute>
                  <SoilTestForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />

            <Route
              path="/schemes"
              element={
                <ProtectedRoute>
                  <Schemes />
                </ProtectedRoute>
              } />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/advisory"
              element={
                <ProtectedRoute>
                  <AdvisoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/weather"
              element={
                <ProtectedRoute>
                  <Weather />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pest-detection"
              element={
                <ProtectedRoute>
                  <PestDetection />
                </ProtectedRoute>
              }
            />
            <Route
              path="/marketplace"
              element={
                <ProtectedRoute>
                  <Marketplace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/marketplace/:id"
              element={
                <ProtectedRoute>
                  <ProductDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/forum"
              element={
                <ProtectedRoute>
                  <Forum />
                </ProtectedRoute>
              }
            />
            <Route
              path="/forum/new"
              element={
                <ProtectedRoute>
                  <CreateForumPost />
                </ProtectedRoute>
              }
            />
            <Route
              path="/forum/:id"
              element={
                <ProtectedRoute>
                  <ForumPostDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resources"
              element={
                <ProtectedRoute>
                  <ResourcesPage />
                </ProtectedRoute>
              }
            />

            <Route path="/cart"
              element={
                <ProtectedRoute >
                  <CartPage />
                </ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>

      <GoogleTranslate />

    </Router>
  );
}

export default App;
