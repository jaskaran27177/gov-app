import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./Login";
import HomePage from "./Home";
import RegisterPage from "./Register";
import OrdersPage from "./Orders";
import PaintPage from "./Paints";
import withAuthCheck from "./AuthCheck";

function App() {
  const AuthenticatedHomePage = withAuthCheck(HomePage);
  const AuthenticatedOrdersPage = withAuthCheck(OrdersPage);
  const AuthenticatedPaintPage = withAuthCheck(PaintPage);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<AuthenticatedHomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/orders" element={<AuthenticatedOrdersPage />} />
        <Route path="/paints" element={<AuthenticatedPaintPage />} />
      </Routes>
    </Router>
  );
}

export default App;
