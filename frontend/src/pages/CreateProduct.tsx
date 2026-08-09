import React, { useState } from "react";
import api from "../services/api";
import { ArrowLeft, Package, Tag, DollarSign, Layers, Hash, MapPin, Box } from "lucide-react";
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
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
        <Link to="/products" className="btn" style={{ background: "rgba(255,255,255,0.05)", padding: "10px" }}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="page-title" style={{ marginBottom: "4px", fontSize: "2rem" }}>Add New Product</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>Enter product details and inventory info</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: "40px", maxWidth: "800px" }}>
        <form onSubmit={handleSubmit}>
          
          <h3 className="form-section-title">
            <Package size={20} /> Basic Information
          </h3>
          <div className="form-group" style={{ marginBottom: "24px" }}>
            <label className="form-label">Product Name *</label>
            <div className="input-icon-wrapper">
              <Package size={18} className="input-icon" />
              <input 
                type="text" 
                className="form-input" 
                value={productName} 
                onChange={(e) => setProductName(e.target.value)} 
                required 
                placeholder="e.g. Premium Widget 2000"
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">SKU (Stock Keeping Unit) *</label>
              <div className="input-icon-wrapper">
                <Hash size={18} className="input-icon" />
                <input 
                  type="text" 
                  className="form-input" 
                  value={sku} 
                  onChange={(e) => setSku(e.target.value)} 
                  required 
                  placeholder="e.g. WIDG-2000-PRM"
                />
              </div>
            </div>
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Category *</label>
              <div className="input-icon-wrapper">
                <Tag size={18} className="input-icon" />
                <input 
                  type="text" 
                  className="form-input" 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  required 
                  placeholder="e.g. Electronics"
                />
              </div>
            </div>
          </div>

          <h3 className="form-section-title">
            <Layers size={20} /> Pricing & Inventory
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Unit Price ($) *</label>
              <div className="input-icon-wrapper">
                <DollarSign size={18} className="input-icon" />
                <input 
                  type="number" 
                  step="0.01" 
                  min="0"
                  className="form-input" 
                  value={unitPrice} 
                  onChange={(e) => setUnitPrice(e.target.value)} 
                  required 
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Initial Stock</label>
              <div className="input-icon-wrapper">
                <Box size={18} className="input-icon" />
                <input 
                  type="number" 
                  min="0"
                  className="form-input" 
                  value={currentStock} 
                  onChange={(e) => setCurrentStock(e.target.value)} 
                  required 
                />
              </div>
            </div>
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Minimum Stock</label>
              <div className="input-icon-wrapper">
                <Layers size={18} className="input-icon" />
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
          </div>

          <div className="form-group">
            <label className="form-label">Warehouse Location</label>
            <div className="input-icon-wrapper">
              <MapPin size={18} className="input-icon" />
              <input 
                type="text" 
                className="form-input" 
                value={warehouseLocation} 
                onChange={(e) => setWarehouseLocation(e.target.value)} 
                placeholder="e.g. A1-Bin12"
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "32px" }}>
            <button type="submit" className="btn btn-primary" style={{ padding: "14px 32px", fontSize: "1.05rem" }} disabled={submitting}>
              {submitting ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
