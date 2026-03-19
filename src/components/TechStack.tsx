
import "./styles/TechStack.css";
import { 
  FaJava, FaPython, FaJsSquare, FaHtml5, FaCss3Alt, FaReact, FaNodeJs, FaGitAlt, FaGithub, FaNetworkWired 
} from "react-icons/fa";
import { 
  SiC, SiJupyter, SiGooglecolab, SiScikitlearn, SiNumpy, SiPandas 
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import { MdOutlinePsychology } from "react-icons/md";
import { BsBarChartFill } from "react-icons/bs";

const techCategories = [
  {
    category: "Programming Languages",
    items: [
      { name: "Java", icon: <FaJava /> },
      { name: "Python", icon: <FaPython /> },
      { name: "C", icon: <SiC /> },
      { name: "JavaScript", icon: <FaJsSquare /> },
    ]
  },
  {
    category: "Web Development",
    items: [
      { name: "HTML", icon: <FaHtml5 /> },
      { name: "CSS", icon: <FaCss3Alt /> },
      { name: "React", icon: <FaReact /> },
      { name: "Node.js", icon: <FaNodeJs /> },
    ]
  },
  {
    category: "Artificial Intelligence & Machine Learning",
    items: [
      { name: "Machine Learning", icon: <FaPython /> },
      { name: "NumPy", icon: <SiNumpy /> },
      { name: "Pandas", icon: <SiPandas /> },
      { name: "Scikit-learn", icon: <SiScikitlearn /> },
      { name: "Matplotlib", icon: <BsBarChartFill /> },
      { name: "Seaborn", icon: <BsBarChartFill /> },
      { name: "Jupyter", icon: <SiJupyter /> },
      { name: "Google Colab", icon: <SiGooglecolab /> },
    ]
  },
  {
    category: "Computer Science Fundamentals",
    items: [
      { name: "DSA (Java)", icon: <FaNetworkWired /> },
      { name: "Problem Solving", icon: <MdOutlinePsychology /> },
    ]
  },
  {
    category: "Tools & Platforms",
    items: [
      { name: "Git", icon: <FaGitAlt /> },
      { name: "GitHub", icon: <FaGithub /> },
      { name: "VS Code", icon: <VscVscode /> },
      { name: "Google Colab", icon: <SiGooglecolab /> },
    ]
  }
];

const TechStack = () => {
  return (
    <div className="tech-stack-section" id="tech">
      <div className="tech-stack-container section-container">
        <h2>
          My <span>Tech Stack</span>
        </h2>
        
        <div className="tech-grid">
          {techCategories.map((techCat, index) => (
            <div className="tech-category" key={index}>
              <h3>{techCat.category}</h3>
              <div className="tech-items">
                {techCat.items.map((item, itemIndex) => (
                  <div className="tech-item" key={itemIndex} data-cursor="disable">
                    <div className="tech-icon">{item.icon}</div>
                    <span className="tech-name">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechStack;
