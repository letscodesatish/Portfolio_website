import { useState, useCallback } from "react";
import "./styles/Work.css";
import WorkImage from "./WorkImage";
import { MdArrowBack, MdArrowForward } from "react-icons/md";

const projects = [
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating]
  );

  const goToPrev = useCallback(() => {
    const newIndex =
      currentIndex === 0 ? projects.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  const goToNext = useCallback(() => {
    const newIndex =
      currentIndex === projects.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>

        <div className="carousel-wrapper">
          {/* Navigation Arrows */}
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

          {/* Slides */}
          <div className="carousel-track-container">
            <div
              className="carousel-track"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {projects.map((project, index) => (
                <div className="carousel-slide" key={index}>
                  <div className="carousel-content">
                    <div className="carousel-info">
                      <div className="carousel-number">
                        <h3>{index + 1}</h3>
                      </div>
                      <div className="carousel-details">
                        <h4>{project.title}</h4>
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

          {/* Dot Indicators */}
          <div className="carousel-dots">
            {projects.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentIndex ? "carousel-dot-active" : ""
                  }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to project ${index + 1}`}
                data-cursor="disable"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
