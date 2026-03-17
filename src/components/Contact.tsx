import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Email</h4>
            <p>
              <a href="mailto:satish.kum.14.sk@gmail.com" data-cursor="disable">
                satish.kum.14.sk@gmail.com
              </a>
            </p>
          </div>
          <div className="contact-box">
            <h2>Education</h2>
            <a data-cursor="disable" className="contact-social">
              BTech in Computer Science
            </a>
          </div>
          <div className="contact-box">
            <h2>Social</h2>
            <div className="contact-links">
              <ul>
                <li>
                  <a
                    data-cursor="disable"
                    className="contact-social"
                    href="https://github.com/letscodesatish"
                    target="_blank"
                  >
                    Github <MdArrowOutward />
                  </a>
                </li>
                <li>
                  <a
                    data-cursor="disable"
                    className="contact-social"
                    href="https://www.linkedin.com/in/satishkumarsharma14/"
                    target="_blank"
                  >
                    Linkedin <MdArrowOutward />
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="contact-box">
            <h2>
              Designed and Developed <br /> by <span>Satish Kumar Sharma</span>
            </h2>
            <h5>
              <MdCopyright /> 2026
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
