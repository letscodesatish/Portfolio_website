import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { certificates } from "../data/certificatesData";
import "./styles/Certificates.css";

gsap.registerPlugin(ScrollTrigger);

const Certificates = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
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
  }, []);

  const openModal = (image: string) => {
    console.log("Opening modal for image:", image);
    setSelectedImage(image);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    console.log("Closing modal");
    setSelectedImage(null);
    document.body.style.overflow = "auto";
  };

  return (
    <div className="certificates-section" id="certificates" ref={sectionRef}>
      <div className="certificates-container section-container">
        <h2 className="certificates-title">
          My <span>Certificates</span>
        </h2>

        <div className="certificates-grid">
          {certificates.map((cert, index) => (
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
              style={cert.link ? { cursor: 'pointer' } : {}}
            >
              <div className="cert-header">
                <span className="cert-date">{cert.date}</span>
                <span className="cert-issuer">{cert.issuer}</span>
              </div>
              <div className="cert-body">
                <h4>{cert.title}</h4>
                <p>{cert.description}</p>
              </div>
              {cert.link ? (
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noreferrer"
                  className="cert-link"
                >
                  View Certificate ↗
                </a>
              ) : cert.image ? (
                <button
                  onClick={() => openModal(cert.image!)}
                  className="cert-link"
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  View Certificate ↗
                </button>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {/* Modal - Rendered via Portal */}
      {selectedImage && createPortal(
        <div className="cert-modal-overlay" onClick={closeModal} style={{ zIndex: 999999 }}>
          <div className="cert-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="cert-modal-close" onClick={closeModal}>
              &times;
            </button>
            <img src={selectedImage} alt="Certificate Full View" style={{ display: 'block' }} />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Certificates;
