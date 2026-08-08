import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Plus, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Challans = () => {
  const [challans, setChallans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchChallans = async () => {
    setLoading(true);
    try {
      const response = await api.get("/challans");
      setChallans(response.data.data);
    } catch (error) {
      console.error("Failed to fetch challans", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallans();
  }, []);

  const handleConfirm = async (id: string) => {
    if (!window.confirm("Confirm this challan? Stock will be deducted immediately.")) return;
    try {
      await api.post(`/challans/${id}/confirm`);
      fetchChallans();
      alert("Challan confirmed successfully!");
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to confirm challan");
    }
  };

  const handleCancel = async (id: string) => {
    if (!window.confirm("Cancel this draft challan?")) return;
    try {
      await api.post(`/challans/${id}/cancel`);
      fetchChallans();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to cancel challan");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Sales Challans</h1>
        <Link to="/challans/create" className="btn btn-primary">
          <Plus size={18} /> Create Draft Challan
        </Link>
      </div>

      <div className="glass-panel" style={{ padding: "24px" }}>
        {loading ? (
          <div className="loading-state">Loading challans...</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Challan No</th>
                  <th>Customer</th>
                  <th>Total Qty</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {challans.length > 0 ? (
                  challans.map((c: any) => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 600 }}>{c.challanNumber}</td>
                      <td>{c.customer?.customerName}</td>
                      <td>{c.totalQuantity} items</td>
                      <td>
                        <span className={`status-badge status-${c.status.toLowerCase()}`}>
                          {c.status}
                        </span>
                      </td>
                      <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                      <td>
                        {c.status === "DRAFT" && (
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button onClick={() => handleConfirm(c.id)} className="btn btn-primary" style={{ padding: "6px", fontSize: "0.8rem" }}>
                              <CheckCircle size={14} /> Confirm
                            </button>
                            <button onClick={() => handleCancel(c.id)} className="btn btn-danger" style={{ padding: "6px", fontSize: "0.8rem" }}>
                              <XCircle size={14} /> Cancel
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "32px", color: "var(--text-muted)" }}>
                      No challans found.
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

export default Challans;
