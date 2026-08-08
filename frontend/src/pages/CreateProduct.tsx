import React, { useState } from "react";
import api from "../services/api";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const CreateProduct = () => {
  const [productName, setProductName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [currentStock, setCurrentStock] = useState("0");
  const [minimumStock, setMinimumStock] = useState("10");
  const [warehouseLocation, setWarehouseLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await api.post("/products", {
        productName,
        sku,
        category,
        unitPrice: Number(unitPrice),
        currentStock: Number(currentStock),
        minimumStock: Number(minimumStock),
        warehouseLocation
      });
      navigate("/products");
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to create product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
        <Link to="/products" className="btn" style={{ background: "rgba(255,255,255,0.05)" }}>
          <ArrowLeft size={18} />
        </Link>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Add New Product</h1>
      </div>

      <div className="glass-panel" style={{ padding: "32px", maxWidth: "600px" }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Product Name *</label>
            <input 
              type="text" 
              className="form-input" 
              value={productName} 
              onChange={(e) => setProductName(e.target.value)} 
              required 
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">SKU (Stock Keeping Unit) *</label>
              <input 
                type="text" 
                className="form-input" 
                value={sku} 
                onChange={(e) => setSku(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <input 
                type="text" 
                className="form-input" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">Unit Price ($) *</label>
              <input 
                type="number" 
                step="0.01" 
                min="0"
                className="form-input" 
                value={unitPrice} 
                onChange={(e) => setUnitPrice(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Initial Stock</label>
              <input 
                type="number" 
                min="0"
                className="form-input" 
                value={currentStock} 
                onChange={(e) => setCurrentStock(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Minimum Stock</label>
              <input 
                type="number" 
                min="0"
                className="form-input" 
                value={minimumStock} 
                onChange={(e) => setMinimumStock(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Warehouse Location</label>
            <input 
              type="text" 
              className="form-input" 
              value={warehouseLocation} 
              onChange={(e) => setWarehouseLocation(e.target.value)} 
              placeholder="e.g. A1-Bin12"
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "16px" }} disabled={submitting}>
            {submitting ? "Saving..." : "Save Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
