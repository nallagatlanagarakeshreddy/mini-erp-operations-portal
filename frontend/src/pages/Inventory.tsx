import React, { useState, useEffect } from "react";
import api from "../services/api";
import { ArrowDown, ArrowUp } from "lucide-react";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState("");
  
  // Stock Movement Form
  const [movementType, setMovementType] = useState<"IN" | "OUT">("IN");
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data.data);
      if (response.data.data.length > 0 && !selectedProduct) {
        setSelectedProduct(response.data.data[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleStockMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/products/stock-movements", {
        productId: selectedProduct,
        quantityChanged: Number(quantity),
        movementType,
        reason
      });
      alert(`Stock ${movementType} recorded successfully`);
      setQuantity(1);
      setReason("");
      fetchProducts(); // Refresh stock
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to record stock movement");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">Inventory Management</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        
        {/* Record Movement Panel */}
        <div className="glass-panel" style={{ padding: "24px" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "20px" }}>Record Stock Movement</h2>
          <form onSubmit={handleStockMovement}>
            <div className="form-group">
              <label className="form-label">Select Product</label>
              <select 
                className="form-select" 
                value={selectedProduct} 
                onChange={(e) => setSelectedProduct(e.target.value)}
                required
              >
                {products.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.productName} (Current Stock: {p.currentStock})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">Movement Type</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button 
                    type="button"
                    onClick={() => setMovementType("IN")}
                    className="btn" 
                    style={{ flex: 1, background: movementType === "IN" ? "rgba(16, 185, 129, 0.2)" : "rgba(255,255,255,0.05)", color: movementType === "IN" ? "var(--secondary-color)" : "inherit", border: movementType === "IN" ? "1px solid var(--secondary-color)" : "1px solid transparent" }}
                  >
                    <ArrowDown size={18} /> IN
                  </button>
                  <button 
                    type="button"
                    onClick={() => setMovementType("OUT")}
                    className="btn" 
                    style={{ flex: 1, background: movementType === "OUT" ? "rgba(239, 68, 68, 0.2)" : "rgba(255,255,255,0.05)", color: movementType === "OUT" ? "var(--danger-color)" : "inherit", border: movementType === "OUT" ? "1px solid var(--danger-color)" : "1px solid transparent" }}
                  >
                    <ArrowUp size={18} /> OUT
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Quantity</label>
                <input 
                  type="number" 
                  min="1" 
                  className="form-input" 
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Reason / Notes</label>
              <input 
                type="text" 
                className="form-input" 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., Stock refill, Damage, Sample"
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={submitting}>
              {submitting ? "Recording..." : "Record Movement"}
            </button>
          </form>
        </div>

        {/* Current Stock Overview */}
        <div className="glass-panel" style={{ padding: "24px" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "20px" }}>Current Stock Status</h2>
          {loading ? (
            <div className="loading-state" style={{ height: "auto", padding: "40px 0" }}>Loading...</div>
          ) : (
            <div className="table-container" style={{ maxHeight: "400px" }}>
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Stock</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p: any) => (
                    <tr key={p.id}>
                      <td>{p.productName}</td>
                      <td style={{ fontWeight: 600 }}>{p.currentStock}</td>
                      <td>
                        {p.currentStock <= p.minimumStock ? (
                          <span className="status-badge status-inactive">Low Stock</span>
                        ) : (
                          <span className="status-badge status-active">Optimal</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Inventory;
