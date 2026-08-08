import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Plus, Search, Edit2 } from "lucide-react";
import { Link } from "react-router-dom";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/customers?search=${searchTerm}`);
      setCustomers(response.data.data);
    } catch (error) {
      console.error("Failed to fetch customers", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [searchTerm]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Customers</h1>
        <Link to="/customers/create" className="btn btn-primary">
          <Plus size={18} /> Add Customer
        </Link>
      </div>

      <div className="glass-panel" style={{ padding: "24px" }}>
        <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
          <div style={{ position: "relative", flex: 1, maxWidth: "400px" }}>
            <Search size={18} style={{ position: "absolute", left: "12px", top: "14px", color: "var(--text-muted)" }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search customers..."
              style={{ paddingLeft: "40px" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Loading customers...</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name / Business</th>
                  <th>Contact</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.length > 0 ? (
                  customers.map((c: any) => (
                    <tr key={c.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>
                          <Link to={`/customers/${c.id}`} style={{ color: "var(--text-color)", textDecoration: "none" }}>
                            {c.customerName}
                          </Link>
                        </div>
                        <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{c.businessName}</div>
                      </td>
                      <td>
                        <div>{c.mobile}</div>
                        <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{c.email}</div>
                      </td>
                      <td>{c.customerType}</td>
                      <td>
                        <span className={`status-badge status-${c.status.toLowerCase()}`}>
                          {c.status}
                        </span>
                      </td>
                      <td>
                        <Link to={`/customers/${c.id}/edit`} className="btn" style={{ padding: "6px", background: "rgba(255,255,255,0.1)" }}>
                          <Edit2 size={16} />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "32px", color: "var(--text-muted)" }}>
                      No customers found.
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

export default Customers;
