import React, { useState, useEffect } from "react";
import api from "../services/api";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await api.get("/invoices");
      setInvoices(response.data.data);
    } catch (error) {
      console.error("Failed to fetch invoices", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const markPaid = async (id: string) => {
    if (!window.confirm("Mark this invoice as fully PAID?")) return;
    try {
      await api.put(`/invoices/${id}/status`, { status: "PAID" });
      fetchInvoices();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to update invoice");
    }
  };

  return (
    <div>
      <h1 className="page-title">Invoices</h1>

      <div className="glass-panel" style={{ padding: "24px" }}>
        {loading ? (
          <div className="loading-state">Loading invoices...</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Invoice No</th>
                  <th>Challan No</th>
                  <th>Customer</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.length > 0 ? (
                  invoices.map((inv: any) => (
                    <tr key={inv.id}>
                      <td style={{ fontWeight: 600 }}>{inv.invoiceNumber}</td>
                      <td>{inv.challan?.challanNumber}</td>
                      <td>{inv.challan?.customer?.customerName}</td>
                      <td style={{ fontWeight: 600, color: "var(--primary-color)" }}>${inv.totalAmount.toFixed(2)}</td>
                      <td>
                        <span className={`status-badge status-${inv.status.toLowerCase()}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td>{new Date(inv.createdAt).toLocaleDateString()}</td>
                      <td>
                        {inv.status !== "PAID" && (
                          <button onClick={() => markPaid(inv.id)} className="btn btn-primary" style={{ padding: "6px", fontSize: "0.8rem" }}>
                            Mark Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "32px", color: "var(--text-muted)" }}>
                      No invoices found. (Invoices are auto-generated when Challans are confirmed).
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

export default Invoices;
