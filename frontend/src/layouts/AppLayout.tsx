import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Archive, 
  FileText, 
  LogOut,
  Truck,
  ShoppingCart,
  CreditCard
} from "lucide-react";

const AppLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} />, roles: ["ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"] },
    { name: "Customers", path: "/customers", icon: <Users size={20} />, roles: ["ADMIN", "SALES", "ACCOUNTS"] },
    { name: "Suppliers", path: "/suppliers", icon: <Truck size={20} />, roles: ["ADMIN", "WAREHOUSE", "ACCOUNTS"] },
    { name: "Products", path: "/products", icon: <Package size={20} />, roles: ["ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"] },
    { name: "Inventory", path: "/inventory", icon: <Archive size={20} />, roles: ["ADMIN", "WAREHOUSE", "SALES"] },
    { name: "Stock Log", path: "/inventory/movements", icon: <FileText size={20} />, roles: ["ADMIN", "WAREHOUSE"] },
    { name: "Purchase Orders", path: "/purchase-orders", icon: <ShoppingCart size={20} />, roles: ["ADMIN", "WAREHOUSE", "SALES", "ACCOUNTS"] },
    { name: "Sales Challans", path: "/challans", icon: <FileText size={20} />, roles: ["ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"] },
    { name: "Invoices", path: "/invoices", icon: <CreditCard size={20} />, roles: ["ADMIN", "ACCOUNTS", "SALES"] },
  ];

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div style={{ width: 32, height: 32, background: 'var(--primary-color)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>M</div>
          Mini ERP
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            if (!user || !item.roles.includes(user.role)) return null;
            const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
            
            return (
              <Link 
                key={item.name} 
                to={item.path} 
                className={`nav-item ${isActive ? "active" : ""}`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-navbar">
          <div>
            {/* Can put breadcrumbs or search here */}
          </div>
          <div className="navbar-user">
            <span className="role-badge">{user?.role}</span>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user?.name}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{user?.email}</span>
            </div>
            <button 
              onClick={logout} 
              className="btn" 
              style={{ padding: '8px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', marginLeft: '12px' }}
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <div className="page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
