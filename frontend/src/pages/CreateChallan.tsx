import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const CreateChallan = () => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState([{ productId: "", quantity: 1, _tmpId: Date.now() }]);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [custRes, prodRes] = await Promise.all([
          api.get("/customers?limit=100"),
          api.get("/products?limit=100")
        ]);
        setCustomers(custRes.data.data);
        setProducts(prodRes.data.data);
      } catch (error) {
        console.error("Failed to fetch data for challan creation", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addItem = () => {
    setItems([...items, { productId: "", quantity: 1, _tmpId: Date.now() }]);
  };

  const removeItem = (id: number) => {
    if (items.length === 1) return;
    setItems(items.filter(item => item._tmpId !== id));
  };

  const updateItem = (id: number, field: string, value: any) => {
    setItems(items.map(item => item._tmpId === id ? { ...item, [field]: value } : item));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) return alert("Please select a customer");
    if (items.some(item => !item.productId || item.quantity < 1)) {
      return alert("Please select a product and valid quantity for all items");
    }

    setSubmitting(true);
    try {
      const payload = {
        customerId,
        items: items.map(item => ({ productId: item.productId, quantity: Number(item.quantity) }))
      };
      await api.post("/challans", payload);
      navigate("/challans");
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to create challan");
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate totals
  const totalQuantity = items.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);
  const totalAmount = items.reduce((acc, curr) => {
    const product = products.find((p: any) => p.id === curr.productId) as any;
    return acc + (product ? product.unitPrice * (Number(curr.quantity) || 0) : 0);
  }, 0);

  if (loading) return <div className="loading-state">Loading...</div>;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
        <Link to="/challans" className="btn" style={{ background: "rgba(255,255,255,0.05)" }}>
          <ArrowLeft size={18} />
        </Link>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Create Draft Challan</h1>
      </div>

      <div className="glass-panel" style={{ padding: "32px", maxWidth: "800px" }}>
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label className="form-label">Select Customer</label>
            <select 
              className="form-select" 
              value={customerId} 
              onChange={(e) => setCustomerId(e.target.value)}
              required
            >
              <option value="">-- Choose a Customer --</option>
              {customers.map((c: any) => (
                <option key={c.id} value={c.id}>{c.customerName} ({c.businessName || "No Business"})</option>
              ))}
            </select>
          </div>

          <div style={{ marginTop: "32px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600 }}>Products List</h3>
            <button type="button" onClick={addItem} className="btn btn-primary" style={{ padding: "6px 12px", fontSize: "0.85rem" }}>
              <Plus size={16} /> Add Item
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px" }}>
            {items.map((item, index) => {
              const product = products.find((p: any) => p.id === item.productId) as any;
              return (
                <div key={item._tmpId} style={{ display: "flex", gap: "16px", alignItems: "flex-end", background: "rgba(15, 23, 42, 0.4)", padding: "16px", borderRadius: "8px" }}>
                  <div style={{ flex: 2 }}>
                    <label className="form-label">Product</label>
                    <select 
                      className="form-select" 
                      value={item.productId} 
                      onChange={(e) => updateItem(item._tmpId, "productId", e.target.value)}
                      required
                    >
                      <option value="">-- Select Product --</option>
                      {products.map((p: any) => (
                        <option key={p.id} value={p.id}>{p.productName} (Stock: {p.currentStock}) - ${p.unitPrice}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <label className="form-label">Qty</label>
                    <input 
                      type="number" 
                      min="1" 
                      className="form-input" 
                      value={item.quantity}
                      onChange={(e) => updateItem(item._tmpId, "quantity", e.target.value)}
                      required
                    />
                  </div>

                  <div style={{ width: "120px" }}>
                    <label className="form-label">Subtotal</label>
                    <div style={{ padding: "12px 16px", background: "rgba(255,255,255,0.05)", borderRadius: "8px", color: "var(--secondary-color)", fontWeight: 600 }}>
                      ${product ? (product.unitPrice * item.quantity).toFixed(2) : "0.00"}
                    </div>
                  </div>

                  <button 
                    type="button" 
                    onClick={() => removeItem(item._tmpId)} 
                    className="btn btn-danger" 
                    style={{ padding: "12px", height: "46px" }}
                    disabled={items.length === 1}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )
            })}
          </div>

          <div style={{ background: "rgba(79, 70, 229, 0.1)", border: "1px solid rgba(79, 70, 229, 0.2)", padding: "20px", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
            <div style={{ fontSize: "1.1rem" }}>
              Total Items: <span style={{ fontWeight: 700, marginLeft: "8px" }}>{totalQuantity}</span>
            </div>
            <div style={{ fontSize: "1.25rem" }}>
              Estimated Total: <span style={{ fontWeight: 700, color: "var(--primary-color)", marginLeft: "8px" }}>${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "14px", fontSize: "1.05rem" }} disabled={submitting}>
            {submitting ? "Saving Draft..." : "Save Draft Challan"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateChallan;
