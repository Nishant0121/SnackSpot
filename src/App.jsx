import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/login/page.jsx";
import RegisterPage from "./pages/auth/register/page.jsx";
import HomePage from "./pages/home/home.jsx";
import MenuDisplay from "./pages/menu/MenuDisplay.jsx";
import Layout from "./components/Layout";
import ProfilePage from "./pages/profile/Profile.jsx";
import UserCart from "./components/UserCart.jsx";
import AdminOrdersPage from "./pages/admin/Orders.admin.jsx";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/auth.context.jsx";
import OrderHistory from "./components/OrderHistory.jsx";

function App() {
  const { currentUser } = useAuth();
  const userId = currentUser?.uid;

  return (
    <Routes>
      {/* Auth routes without navbar */}
      <Route
        path="/login"
        element={currentUser ? <Navigate to={"/"} /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={currentUser ? <Navigate to={"/"} /> : <RegisterPage />}
      />

      {/* Routes with navbar */}
      <Route
        path="/"
        element={
          currentUser ? (
            <Layout>
              <HomePage />
            </Layout>
          ) : (
            <Navigate to={"/login"} />
          )
        }
      />
      <Route
        path="/menu"
        element={
          currentUser ? (
            <Layout>
              <MenuDisplay />
            </Layout>
          ) : (
            <Navigate to={"/login"} />
          )
        }
      />
      <Route
        path="/profile"
        element={
          currentUser ? (
            <Layout>
              <ProfilePage />
            </Layout>
          ) : (
            <Navigate to={"/login"} />
          )
        }
      />
      <Route
        path="/cart"
        element={
          currentUser ? (
            <Layout>
              <UserCart />
            </Layout>
          ) : (
            <Navigate to={"/login"} />
          )
        }
      />
      <Route
        path="/orders"
        element={
          currentUser ? (
            <Layout>
              <AdminOrdersPage />
            </Layout>
          ) : (
            <Navigate to={"/login"} />
          )
        }
      />
    </Routes>
  );
}

export default App;
