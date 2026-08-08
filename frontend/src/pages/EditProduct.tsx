import React, { useState, useEffect } from "react";
import api from "../services/api";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const [productName, setProductName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [minimumStock, setMinimumStock] = useState("10");
  const [warehouseLocation, setWarehouseLocation] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        const p = response.data.data;
        setProductName(p.productName || "");
        setSku(p.sku || "");
        setCategory(p.category || "");
        setUnitPrice(p.unitPrice?.toString() || "");
        setMinimumStock(p.minimumStock?.toString() || "10");
        setWarehouseLocation(p.warehouseLocation || "");
      } catch (error) {
        console.error("Failed to load product", error);
        alert("Failed to load product details");
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await api.put(`/products/${id}`, {
        productName,
        sku,
        category,
        unitPrice: Number(unitPrice),
        minimumStock: Number(minimumStock),
        warehouseLocation
      });
      navigate("/products");
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to update product");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: '24px' }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
        <Link to="/products" className="btn" style={{ background: "rgba(255,255,255,0.05)" }}>
          <ArrowLeft size={18} />
        </Link>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Edit Product</h1>
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

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
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
            {submitting ? "Saving..." : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
