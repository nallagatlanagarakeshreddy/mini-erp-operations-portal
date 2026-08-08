import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

const PurchaseOrders = () => {
  const [pos, setPos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPos = async () => {
    setLoading(true);
    try {
      const response = await api.get("/purchase-orders");
      setPos(response.data.data);
    } catch (error) {
      console.error("Failed to fetch purchase orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPos();
  }, []);

  const receivePo = async (id: string) => {
    if (!window.confirm("Are you sure you want to RECEIVE this PO? This will automatically increment your inventory stock for all items in the PO.")) return;
    try {
      await api.post(`/purchase-orders/${id}/receive`);
      alert("Purchase Order Received! Stock updated.");
      fetchPos();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to receive PO");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Purchase Orders</h1>
        <button className="btn btn-primary" onClick={() => alert("Create PO form is not built yet in this demo!")}>
          <Plus size={18} /> Create PO
        </button>
      </div>

      <div className="glass-panel" style={{ padding: "24px" }}>
        {loading ? (
          <div className="loading-state">Loading purchase orders...</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>PO Number</th>
                  <th>Supplier</th>
                  <th>Quantity</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pos.length > 0 ? (
                  pos.map((po: any) => (
                    <tr key={po.id}>
                      <td style={{ fontWeight: 600 }}>{po.poNumber}</td>
                      <td>{po.supplier?.supplierName || "Unknown"}</td>
                      <td>{po.totalQuantity} items</td>
                      <td style={{ fontWeight: 600, color: "var(--primary-color)" }}>${po.totalAmount.toFixed(2)}</td>
                      <td>
                        <span className={`status-badge status-${po.status.toLowerCase()}`}>
                          {po.status}
                        </span>
                      </td>
                      <td>{new Date(po.createdAt).toLocaleDateString()}</td>
                      <td>
                        {(po.status === "DRAFT" || po.status === "SENT") && (
                          <button onClick={() => receivePo(po.id)} className="btn btn-primary" style={{ padding: "6px", fontSize: "0.8rem", background: "var(--secondary-color)" }}>
                            Receive PO
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "32px", color: "var(--text-muted)" }}>
                      No purchase orders found.
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

export default PurchaseOrders;
