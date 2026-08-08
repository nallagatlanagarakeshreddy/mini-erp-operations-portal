import React, { useState, useEffect } from "react";
import api from "../services/api";
import { ArrowLeft, Edit2, MapPin, Phone, Mail, Building2, Calendar, FileText } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";

const CustomerDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchCustomer = async () => {
    try {
      const response = await api.get(`/customers/${id}`);
      setCustomer(response.data.data);
    } catch (error) {
      console.error("Failed to load customer", error);
      alert("Failed to load customer details");
      navigate("/customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [id, navigate]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    
    setUpdating(true);
    try {
      const updatedNotes = customer.notes ? `${customer.notes}\n---\n[${new Date().toLocaleDateString()}] ${newNote}` : `[${new Date().toLocaleDateString()}] ${newNote}`;
      
      await api.put(`/customers/${id}`, { notes: updatedNotes });
      setNewNote("");
      await fetchCustomer();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to add note");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div style={{ padding: '24px' }}>Loading...</div>;
  if (!customer) return null;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link to="/customers" className="btn" style={{ background: "rgba(255,255,255,0.05)" }}>
            <ArrowLeft size={18} />
          </Link>
          <h1 className="page-title" style={{ marginBottom: 0 }}>Customer Details</h1>
        </div>
        <Link to={`/customers/${id}/edit`} className="btn btn-primary">
          <Edit2 size={18} /> Edit Customer
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        <div className="glass-panel" style={{ padding: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
            <div>
              <h2 style={{ fontSize: "1.5rem", marginBottom: "4px" }}>{customer.customerName}</h2>
              {customer.businessName && <div style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "8px" }}><Building2 size={16}/> {customer.businessName}</div>}
            </div>
            <span className={`status-badge status-${customer.status.toLowerCase()}`}>
              {customer.status}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Phone size={18} style={{ color: "var(--text-muted)" }}/>
              <span>{customer.mobile}</span>
            </div>
            {customer.email && (
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Mail size={18} style={{ color: "var(--text-muted)" }}/>
                <span>{customer.email}</span>
              </div>
            )}
            {customer.address && (
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <MapPin size={18} style={{ color: "var(--text-muted)" }}/>
                <span>{customer.address}</span>
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FileText size={18} style={{ color: "var(--text-muted)" }}/>
              <span>Type: {customer.customerType} | GST: {customer.gstNumber || "N/A"}</span>
            </div>
            {customer.followUpDate && (
              <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--secondary-color)" }}>
                <Calendar size={18} />
                <span>Follow-up: {new Date(customer.followUpDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "32px" }}>
          <h3 style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <FileText size={20} /> Follow-up Notes
          </h3>
          
          <div style={{ 
            background: "rgba(0,0,0,0.2)", 
            padding: "16px", 
            borderRadius: "8px", 
            minHeight: "150px", 
            whiteSpace: "pre-wrap",
            marginBottom: "24px",
            color: "var(--text-color)",
            fontSize: "0.95rem"
          }}>
            {customer.notes || "No notes available."}
          </div>

          <form onSubmit={handleAddNote}>
            <div className="form-group">
              <label className="form-label">Add New Note</label>
              <textarea 
                className="form-input" 
                value={newNote} 
                onChange={(e) => setNewNote(e.target.value)} 
                rows={3}
                placeholder="Type your follow-up note here..."
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary" disabled={updating}>
              {updating ? "Saving..." : "Append Note"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
