import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { certificates, Certificate } from "../data/certificatesData";
import { useAuthContext } from "../context/AuthProvider";
import { FaEdit, FaTrash } from "react-icons/fa";
import { supabase } from "../utils/supabaseClient";
import "./styles/Certificates.css";

gsap.registerPlugin(ScrollTrigger);

const Certificates = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const { user } = useAuthContext();
  const isAdmin = user?.role === "admin";

  const [localCerts, setLocalCerts] = useState<Certificate[]>([]);
  const [isFormMode, setIsFormMode] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Certificate>>({});
  const [isInitialized, setIsInitialized] = useState(true);

  const fetchCertificates = async () => {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching certificates:', error);
      setLocalCerts(certificates);
    } else if (data && data.length > 0) {
      setLocalCerts(data);
      setIsInitialized(true);
    } else {
      // If data is empty, we check if it was explicitly emptied or just never used.
      // For now, if it's empty, we'll show an empty state to the admin so they know it's working.
      setLocalCerts([]);
      setIsInitialized(false);
    }
  };

  const syncToSupabase = async () => {
    if (!window.confirm("This will upload all 10 default certificates to your database. Continue?")) return;
    
    const formatted = certificates.map(c => ({
      title: c.title,
      issuer: c.issuer,
      date: c.date,
      description: c.description,
      link: c.link || null
    }));

    const { error } = await supabase.from('certificates').insert(formatted);
    if (error) {
      alert("Error syncing: " + error.message);
    } else {
      alert("Successfully synced defaults to Supabase!");
      fetchCertificates();
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // (same GSAP logic)
      gsap.from(".certificates-title span", {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".certificates-title",
          start: "top 80%",
        },
      });

      cardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.from(card, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
            },
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [localCerts]);

  const openAddForm = () => {
    setEditingIndex(null);
    setFormData({});
    setIsFormMode(true);
  };

  const openEditForm = (e: React.MouseEvent, index: number, cert: Certificate) => {
    e.stopPropagation();
    setEditingIndex(index);
    setFormData(cert);
    setIsFormMode(true);
  };

  const deleteCertificate = async (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    const certToDelete = localCerts[index];
    if (window.confirm("Are you sure you want to delete this certificate?")) {
      if ((certToDelete as any).id) {
        const { error } = await supabase
          .from('certificates')
          .delete()
          .eq('id', (certToDelete as any).id);

        if (error) {
          alert('Error deleting certificate: ' + error.message);
          return;
        }
      }
      
      const updated = localCerts.filter((_, i) => i !== index);
      setLocalCerts(updated);
      setTimeout(() => ScrollTrigger.refresh(), 100);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.issuer || !formData.date || !formData.description) return;
    
    const submittedCert = {
      title: formData.title,
      issuer: formData.issuer,
      date: formData.date,
      description: formData.description,
      link: formData.link || null,
    };

    let error;
    if (editingIndex !== null) {
      const certToUpdate = localCerts[editingIndex];
      if ((certToUpdate as any).id) {
        const res = await supabase
          .from('certificates')
          .update(submittedCert)
          .eq('id', (certToUpdate as any).id);
        error = res.error;
      } else {
        const res = await supabase
          .from('certificates')
          .insert([submittedCert]);
        error = res.error;
      }
    } else {
      const res = await supabase
        .from('certificates')
        .insert([submittedCert]);
      error = res.error;
    }
    
    if (error) {
      alert('Error saving certificate: ' + error.message);
    } else {
      fetchCertificates();
      setIsFormMode(false);
      setFormData({});
      setEditingIndex(null);
      setTimeout(() => ScrollTrigger.refresh(), 100);
    }
  };

  return (
    <div className="certificates-section" id="certificates" ref={sectionRef}>
      <div className="certificates-container section-container">
        <h2 className="certificates-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>My <span>Certificates</span></span>
          {isAdmin && (
            <div style={{ display: 'flex', gap: '10px' }}>
              {!isInitialized && (
                <button 
                  onClick={syncToSupabase}
                  style={{ fontSize: '0.8rem', padding: '10px 15px', background: '#333', color: '#fff', border: '1px solid #555', borderRadius: '5px', cursor: 'pointer' }}
                >
                  🔄 Sync Defaults
                </button>
              )}
              <button 
                onClick={openAddForm}
                className="admin-add-btn"
                style={{ fontSize: '1rem', padding: '10px 20px', background: '#ff4b4b', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              >
                + Add Certificate
              </button>
            </div>
          )}
        </h2>

        <div className="certificates-grid">
          {localCerts.length > 0 ? (
            localCerts.map((cert, index) => (
              <div
                className={`certificate-card ${cert.link ? 'clickable-card' : ''}`}
                key={index}
                ref={(el) => (cardsRef.current[index] = el)}
                data-cursor="disable"
                onClick={() => {
                  if (cert.link) {
                    window.open(cert.link, "_blank", "noopener,noreferrer");
                  }
                }}
                style={cert.link ? { cursor: 'pointer', position: 'relative' } : { position: 'relative' }}
              >
                <div className="cert-header" style={{ position: 'relative' }}>
                  <span className="cert-date">{cert.date}</span>
                  <span className="cert-issuer">{cert.issuer}</span>
                </div>
                
                {isAdmin && (
                  <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '8px', zIndex: 10 }}>
                    <button 
                      onClick={(e) => openEditForm(e, index, cert)}
                      style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                      title="Edit"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button 
                      onClick={(e) => deleteCertificate(e, index)}
                      style={{ background: 'rgba(255,75,75,0.1)', color: '#ff4b4b', border: '1px solid rgba(255,75,75,0.3)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                      title="Delete"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                )}

                <div className="cert-body">
                  <h4>{cert.title}</h4>
                  <p>{cert.description}</p>
                </div>
                {cert.link && (
                  <a
                    onClick={(e) => e.stopPropagation()}
                    href={cert.link}
                    target="_blank"
                    rel="noreferrer"
                    className="cert-link"
                  >
                    View Certificate ↗
                  </a>
                )}
              </div>
            ))
          ) : (
             <p style={{ color: "rgba(255,255,255,0.5)", gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>
               {isInitialized ? "No certificates found in database." : "Database not yet initialized. Use 'Sync Defaults' to start."}
             </p>
          )}
        </div>
      </div>

      {/* Admin Form Modal */}
      {isFormMode && createPortal(
        <div className="cert-modal-overlay" style={{ zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="cert-modal-content" style={{ background: '#1a1a1a', padding: '30px', borderRadius: '10px', width: '90%', maxWidth: '500px', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: '#fff', marginBottom: '20px' }}>{editingIndex !== null ? 'Edit Certificate' : 'Add New Certificate'}</h3>
            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input required placeholder="Title" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #333', background: '#222', color: '#fff' }} />
              <input required placeholder="Issuer" value={formData.issuer || ''} onChange={e => setFormData({...formData, issuer: e.target.value})} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #333', background: '#222', color: '#fff' }} />
              <input required placeholder="Date (e.g., March 2026)" value={formData.date || ''} onChange={e => setFormData({...formData, date: e.target.value})} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #333', background: '#222', color: '#fff' }} />
              <textarea required placeholder="Description" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #333', background: '#222', color: '#fff', minHeight: '80px', resize: 'vertical' }} />
              <input placeholder="External Link URL" value={formData.link || ''} onChange={e => setFormData({...formData, link: e.target.value})} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #333', background: '#222', color: '#fff' }} />
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => { setIsFormMode(false); setEditingIndex(null); }} style={{ padding: '10px 20px', background: '#333', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', background: '#ff4b4b', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                  {editingIndex !== null ? 'Update' : 'Save'} Certificate
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Certificates;
