import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          Education <span>&</span>
          <br /> Experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>CS Engineering (B.E.)</h4>
                <h5>Chhatrapati Shahu Ji Maharaj University</h5>
              </div>
              <h3>2028</h3>
            </div>
            <p>
              Pursuing Bachelor of Engineering in Computer Science. Currently in 1st year with a CGPA of 8.2. Actively self exploring and participating in events.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Python Programmer</h4>
                <h5>CodeSoft</h5>
              </div>
              <h3>Exp</h3>
            </div>
            <p>
              Built projects like a Calculator, Contact Book, Password Generator, Rock-Paper-Scissors game, and a To-Do List application.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Class 12th & 10th (CBSE)</h4>
                <h5>Kendriya Vidyalaya PDDU Nagar, U.P</h5>
              </div>
              <h3>Past</h3>
            </div>
            <p>
              Completed Class 12th with 90% and Class 10th with 95% from CBSE board. Built a strong foundation in science and mathematics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
