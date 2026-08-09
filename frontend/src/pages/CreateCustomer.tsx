import React, { useState } from "react";
import api from "../services/api";
import { ArrowLeft, User, Briefcase, Phone, Mail, MapPin, Hash, Calendar, Tags, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const CreateCustomer = () => {
  const [customerName, setCustomerName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [customerType, setCustomerType] = useState("RETAIL");
  const [address, setAddress] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [status, setStatus] = useState("LEAD");
  const [followUpDate, setFollowUpDate] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await api.post("/customers", {
        customerName,
        businessName,
        mobile,
        email,
        customerType,
        address,
        gstNumber,
        status,
        followUpDate: followUpDate || undefined,
        notes
      });
      navigate("/customers");
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to create customer");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
        <Link to="/customers" className="btn" style={{ background: "rgba(255,255,255,0.05)", padding: "10px" }}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="page-title" style={{ marginBottom: "4px", fontSize: "2rem" }}>Add New Customer</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>Create a new customer record</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: "40px", maxWidth: "800px" }}>
        <form onSubmit={handleSubmit}>
          
          <h3 className="form-section-title">
            <User size={20} /> Basic Details
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Customer Name *</label>
              <div className="input-icon-wrapper">
                <User size={18} className="input-icon" />
                <input 
                  type="text" 
                  className="form-input" 
                  value={customerName} 
                  onChange={(e) => setCustomerName(e.target.value)} 
                  required 
                  placeholder="e.g. John Doe"
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Business Name</label>
              <div className="input-icon-wrapper">
                <Briefcase size={18} className="input-icon" />
                <input 
                  type="text" 
                  className="form-input" 
                  value={businessName} 
                  onChange={(e) => setBusinessName(e.target.value)} 
                  placeholder="e.g. Acme Corp"
                />
              </div>
            </div>
          </div>

          <h3 className="form-section-title">
            <Phone size={20} /> Contact Information
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Mobile Number *</label>
              <div className="input-icon-wrapper">
                <Phone size={18} className="input-icon" />
                <input 
                  type="text" 
                  className="form-input" 
                  value={mobile} 
                  onChange={(e) => setMobile(e.target.value)} 
                  required 
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email Address</label>
              <div className="input-icon-wrapper">
                <Mail size={18} className="input-icon" />
                <input 
                  type="email" 
                  className="form-input" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="john@example.com"
                />
              </div>
            </div>
            
            <div className="form-group" style={{ gridColumn: "1 / -1", marginBottom: 0 }}>
              <label className="form-label">Address</label>
              <div className="input-icon-wrapper">
                <MapPin size={18} className="input-icon" />
                <input 
                  type="text" 
                  className="form-input" 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  placeholder="Full physical address"
                />
              </div>
            </div>
          </div>

          <h3 className="form-section-title">
            <Tags size={20} /> Additional Information
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">GST Number</label>
              <div className="input-icon-wrapper">
                <Hash size={18} className="input-icon" />
                <input 
                  type="text" 
                  className="form-input" 
                  value={gstNumber} 
                  onChange={(e) => setGstNumber(e.target.value)} 
                  placeholder="e.g. 22AAAAA0000A1Z5"
                />
              </div>
            </div>
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Follow-up Date</label>
              <div className="input-icon-wrapper">
                <Calendar size={18} className="input-icon" />
                <input 
                  type="date" 
                  className="form-input" 
                  value={followUpDate} 
                  onChange={(e) => setFollowUpDate(e.target.value)} 
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Customer Type</label>
              <div className="input-icon-wrapper">
                <Tags size={18} className="input-icon" />
                <select 
                  className="form-select" 
                  value={customerType} 
                  onChange={(e) => setCustomerType(e.target.value)}
                >
                  <option value="RETAIL">Retail</option>
                  <option value="WHOLESALE">Wholesale</option>
                  <option value="DISTRIBUTOR">Distributor</option>
                </select>
              </div>
            </div>
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Status</label>
              <div className="input-icon-wrapper">
                <CheckCircle size={18} className="input-icon" />
                <select 
                  className="form-select" 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="LEAD">Lead</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea 
              className="form-input" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              rows={3}
              placeholder="Any special requirements or notes..."
              style={{ paddingLeft: "18px", resize: "vertical" }}
            ></textarea>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "32px" }}>
            <button type="submit" className="btn btn-primary" style={{ padding: "14px 32px", fontSize: "1.05rem" }} disabled={submitting}>
              {submitting ? "Saving..." : "Save Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCustomer;
