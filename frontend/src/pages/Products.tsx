import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Plus, Search, Edit2 } from "lucide-react";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/products?search=${searchTerm}`);
      setProducts(response.data.data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Products</h1>
        <Link to="/products/create" className="btn btn-primary">
          <Plus size={18} /> Add Product
        </Link>
      </div>

      <div className="glass-panel" style={{ padding: "24px" }}>
        <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
          <div style={{ position: "relative", flex: 1, maxWidth: "400px" }}>
            <Search size={18} style={{ position: "absolute", left: "12px", top: "14px", color: "var(--text-muted)" }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search products by name or SKU..."
              style={{ paddingLeft: "40px" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Loading products...</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Product Details</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Current Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((p: any) => (
                    <tr key={p.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{p.productName}</div>
                        <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>SKU: {p.sku}</div>
                      </td>
                      <td>{p.category}</td>
                      <td>${p.unitPrice.toFixed(2)}</td>
                      <td>
                        <span className={`status-badge ${p.currentStock <= p.minimumStock ? 'status-inactive' : 'status-active'}`}>
                          {p.currentStock} Units
                        </span>
                      </td>
                      <td>
                        <Link to={`/products/${p.id}/edit`} className="btn" style={{ padding: "6px", background: "rgba(255,255,255,0.1)" }}>
                          <Edit2 size={16} />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "32px", color: "var(--text-muted)" }}>
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
