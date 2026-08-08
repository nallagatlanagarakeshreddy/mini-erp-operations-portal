import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import CreateCustomer from "./pages/CreateCustomer";
import EditCustomer from "./pages/EditCustomer";
import CustomerDetails from "./pages/CustomerDetails";
import Suppliers from "./pages/Suppliers";
import Products from "./pages/Products";
import CreateProduct from "./pages/CreateProduct";
import EditProduct from "./pages/EditProduct";
import Inventory from "./pages/Inventory";
import StockMovements from "./pages/StockMovements";
import PurchaseOrders from "./pages/PurchaseOrders";
import Challans from "./pages/Challans";
import CreateChallan from "./pages/CreateChallan";
import Invoices from "./pages/Invoices";
import Register from "./pages/Register";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/customers/create" element={<CreateCustomer />} />
              <Route path="/customers/:id" element={<CustomerDetails />} />
              <Route path="/customers/:id/edit" element={<EditCustomer />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/create" element={<CreateProduct />} />
              <Route path="/products/:id/edit" element={<EditProduct />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/inventory/movements" element={<StockMovements />} />
              <Route path="/purchase-orders" element={<PurchaseOrders />} />
              <Route path="/challans" element={<Challans />} />
              <Route path="/challans/create" element={<CreateChallan />} />
              <Route path="/invoices" element={<Invoices />} />
            </Route>
          </Route>

          <Route path="/unauthorized" element={
            <div className="auth-container">
              <div className="glass-panel auth-card">
                <h1>Access Denied</h1>
                <p>You do not have permission to view this page.</p>
                <button onClick={() => window.location.href = "/"} className="btn btn-primary" style={{marginTop: '20px'}}>Go to Dashboard</button>
              </div>
            </div>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
