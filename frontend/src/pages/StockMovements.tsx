import React, { useState, useEffect } from "react";
import api from "../services/api";

const StockMovements = () => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMovements = async () => {
    setLoading(true);
    try {
      // Assuming we need a new route in the backend for this, 
      // but let's check if we can fetch it via /products/stock-movements
      const response = await api.get(`/products/stock-movements`);
      setMovements(response.data.data);
    } catch (error) {
      console.error("Failed to fetch stock movements", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovements();
  }, []);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Stock Movement Log</h1>
      </div>

      <div className="glass-panel" style={{ padding: "24px" }}>
        {loading ? (
          <div className="loading-state">Loading stock movements...</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity Changed</th>
                  <th>Movement Type</th>
                  <th>Reason</th>
                  <th>Created By</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {movements.length > 0 ? (
                  movements.map((m: any) => (
                    <tr key={m.id}>
                      <td style={{ fontWeight: 600 }}>{m.product?.productName} <br/><span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{m.product?.sku}</span></td>
                      <td style={{ fontWeight: 600, color: m.movementType === 'IN' ? 'var(--secondary-color)' : 'var(--primary-color)' }}>
                        {m.movementType === 'IN' ? '+' : '-'}{m.quantityChanged}
                      </td>
                      <td>
                        <span className={`status-badge ${m.movementType === 'IN' ? 'status-active' : 'status-inactive'}`}>
                          {m.movementType}
                        </span>
                      </td>
                      <td>{m.reason || "-"}</td>
                      <td>{m.createdBy}</td>
                      <td>{new Date(m.createdAt).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "32px", color: "var(--text-muted)" }}>
                      No stock movements found.
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

export default StockMovements;
