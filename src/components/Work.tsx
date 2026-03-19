import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import "./styles/Work.css";
import WorkImage from "./WorkImage";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import { useAuthContext } from "../context/AuthProvider";
import { FaEdit, FaTrash } from "react-icons/fa";

export interface Project {
  title: string;
  category: string;
  tools: string;
  image: string;
  github?: string;
}

const defaultProjects: Project[] = [
  {
    title: "House Pricing Prediction Model",
    category: "Machine Learning",
    tools: "Python, Scikit-learn, Pandas",
    image: "/images/house_pricing_preview_1773686044260.png",
    github: "https://github.com/letscodesatish/House-pricing-prediction-model"
  },
  {
    title: "Ecommerce Website",
    category: "Full Stack App",
    tools: "Web Development",
    image: "/images/ecommerce_website_preview_1773686195017.png",
    github: "https://github.com/letscodesatish/Ecommerce-website"
  },
  {
    title: "Movie Recommendation System",
    category: "Machine Learning",
    tools: "Python, ML",
    image: "/images/movie_recommendation_preview_1773686166515.png",
    github: "https://github.com/letscodesatish/Movie_Recommendation_System"
  },
  {
    title: "Netflix Clone",
    category: "Frontend Web Application",
    tools: "HTML, CSS, JavaScript",
    image: "/images/netflix_clone_preview_1773686078376.png",
    github: "https://github.com/letscodesatish/Netflix-Clone"
  },
  {
    title: "Accident Hotspots",
    category: "Data Science",
    tools: "Data Mapping",
    image: "/images/accident_hotspots_preview_1773686129136.png",
    github: "https://github.com/letscodesatish/Accident_hotspots"
  },
  {
    title: "CodeRunner",
    category: "Code Execution Platform",
    tools: "Java, Node",
    image: "/images/coderunner_preview_1773686213513.png",
    github: "https://github.com/letscodesatish/CodeRunner"
  },
  {
    title: "Student Performance Analyzer",
    category: "Data Analysis",
    tools: "Python, Pandas, NumPy, Seaborn",
    image: "/images/student_performance_preview_1773686062378.png",
    github: "https://github.com/letscodesatish/Student-performance-analyzer"
  },
  {
    title: "Resume Coverletter Builder",
    category: "Automation",
    tools: "Python",
    image: "/images/resume_builder_preview_1773686107773.png",
    github: "https://github.com/letscodesatish/Resume_Coverletter_Builder"
  },
  {
    title: "Air Pollution Predictor",
    category: "Data Science",
    tools: "Python, Data Analysis",
    image: "/images/air_pollution_preview_1773686147378.png",
    github: "https://github.com/letscodesatish/Air_Pollution_Predictor"
  },
  {
    title: "Snake Water Gun Game",
    category: "Game Development",
    tools: "Python",
    image: "/images/snake_water_gun_preview_1773686021372.png",
    github: "https://github.com/letscodesatish/Snake-Water-Gun"
  }
];

const Work = () => {
  const { user } = useAuthContext();
  const isAdmin = user?.role === "admin";

  const [localProjects, setLocalProjects] = useState<Project[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFormMode, setIsFormMode] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({});

  useEffect(() => {
    const saved = localStorage.getItem("admin_projects");
    if (saved) {
      try {
        setLocalProjects(JSON.parse(saved));
      } catch (e) {
        setLocalProjects(defaultProjects);
      }
    } else {
      setLocalProjects(defaultProjects);
    }
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating || localProjects.length === 0) return;
      setIsAnimating(true);
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating, localProjects.length]
  );

  const goToPrev = useCallback(() => {
    if (localProjects.length === 0) return;
    const newIndex = currentIndex === 0 ? localProjects.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide, localProjects.length]);

  const goToNext = useCallback(() => {
    if (localProjects.length === 0) return;
    const newIndex = currentIndex === localProjects.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide, localProjects.length]);

  const openAddForm = () => {
    setEditingIndex(null);
    setFormData({});
    setIsFormMode(true);
  };

  const openEditForm = (index: number, project: Project) => {
    setEditingIndex(index);
    setFormData(project);
    setIsFormMode(true);
  };

  const deleteProject = (index: number) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      const updated = localProjects.filter((_, i) => i !== index);
      setLocalProjects(updated);
      localStorage.setItem("admin_projects", JSON.stringify(updated));
      if (currentIndex >= updated.length && updated.length > 0) {
        setCurrentIndex(updated.length - 1);
      } else if (updated.length === 0) {
        setCurrentIndex(0);
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.tools || !formData.image) return;
    
    const submittedProject: Project = {
      title: formData.title,
      category: formData.category,
      tools: formData.tools,
      image: formData.image,
      github: formData.github || undefined,
    };

    let updated = [...localProjects];
    if (editingIndex !== null) {
      updated[editingIndex] = submittedProject;
    } else {
      updated = [submittedProject, ...updated];
      setCurrentIndex(0); // Optional: go to the newly added project
    }
    
    setLocalProjects(updated);
    localStorage.setItem("admin_projects", JSON.stringify(updated));
    setIsFormMode(false);
    setFormData({});
    setEditingIndex(null);
  };

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <span>My <span>Work</span></span>
          {isAdmin && (
            <button 
              onClick={openAddForm}
              className="admin-add-btn"
              style={{ fontSize: '1rem', padding: '10px 20px', background: '#ff4b4b', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              + Add Project
            </button>
          )}
        </h2>

        {localProjects.length > 0 ? (
          <div className="carousel-wrapper">
            <button
              className="carousel-arrow carousel-arrow-left"
              onClick={goToPrev}
              aria-label="Previous project"
              data-cursor="disable"
            >
              <MdArrowBack />
            </button>
            <button
              className="carousel-arrow carousel-arrow-right"
              onClick={goToNext}
              aria-label="Next project"
              data-cursor="disable"
            >
              <MdArrowForward />
            </button>

            <div className="carousel-track-container">
              <div
                className="carousel-track"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                }}
              >
                {localProjects.map((project, index) => (
                  <div className="carousel-slide" key={index}>
                    <div className="carousel-content">
                      <div className="carousel-info">
                        <div className="carousel-number">
                          <h3>{index + 1}</h3>
                        </div>
                        <div className="carousel-details" style={{ position: 'relative' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h4>{project.title}</h4>
                            {isAdmin && (
                              <div style={{ display: 'flex', gap: '8px', zIndex: 10 }}>
                                <button 
                                  onClick={() => openEditForm(index, project)}
                                  style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                                  title="Edit"
                                >
                                  <FaEdit size={16} />
                                </button>
                                <button 
                                  onClick={() => deleteProject(index)}
                                  style={{ background: 'rgba(255,75,75,0.1)', color: '#ff4b4b', border: '1px solid rgba(255,75,75,0.3)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                                  title="Delete"
                                >
                                  <FaTrash size={14} />
                                </button>
                              </div>
                            )}
                          </div>
                          
                          <p className="carousel-category">
                            {project.category}
                          </p>
                          <div className="carousel-tools">
                            <span className="tools-label">Tools & Features</span>
                            <p>{project.tools}</p>
                          </div>
                          {project.github && (
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noreferrer"
                              className="contact-social"
                              style={{ display: "inline-flex", marginTop: "20px", textDecoration: "none", alignItems: "center", gap: "5px", color: "var(--accentColor)", border: "1px solid var(--accentColor)", padding: "10px 20px", borderRadius: "50px" }}
                              data-cursor="disable"
                            >
                              View on GitHub ↗
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="carousel-image-wrapper">
                        <WorkImage image={project.image} alt={project.title} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="carousel-dots">
              {localProjects.map((_, index) => (
                <button
                  key={index}
                  className={`carousel-dot ${index === currentIndex ? "carousel-dot-active" : ""}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to project ${index + 1}`}
                  data-cursor="disable"
                />
              ))}
            </div>
          </div>
        ) : (
          <p style={{ color: "rgba(255,255,255,0.5)", marginTop: "40px" }}>No projects available.</p>
        )}
      </div>

      {/* Admin Form Modal */}
      {isAdmin && isFormMode && createPortal(
        <div className="cert-modal-overlay" style={{ zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="cert-modal-content" style={{ background: '#1a1a1a', padding: '30px', borderRadius: '10px', width: '90%', maxWidth: '500px', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: '#fff', marginBottom: '20px' }}>{editingIndex !== null ? 'Edit Project' : 'Add New Project'}</h3>
            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input required placeholder="Project Title" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #333', background: '#222', color: '#fff' }} />
              <input required placeholder="Category (e.g. Machine Learning)" value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #333', background: '#222', color: '#fff' }} />
              <input required placeholder="Tools (e.g. Python, Pandas)" value={formData.tools || ''} onChange={e => setFormData({...formData, tools: e.target.value})} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #333', background: '#222', color: '#fff' }} />
              <input required placeholder="Image URL (/images/... or http...)" value={formData.image || ''} onChange={e => setFormData({...formData, image: e.target.value})} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #333', background: '#222', color: '#fff' }} />
              <input placeholder="GitHub Link (Optional)" value={formData.github || ''} onChange={e => setFormData({...formData, github: e.target.value})} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #333', background: '#222', color: '#fff' }} />
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => { setIsFormMode(false); setEditingIndex(null); }} style={{ padding: '10px 20px', background: '#333', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', background: '#ff4b4b', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                  {editingIndex !== null ? 'Update' : 'Save'} Project
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

export default Work;
