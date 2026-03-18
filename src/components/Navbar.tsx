import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap-trial/ScrollSmoother";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export let smoother: ScrollSmoother;

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth0();
  useEffect(() => {
    smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.7,
      speed: 1.7,
      effects: true,
      autoResize: true,
      ignoreMobileResize: true,
    });

    smoother.scrollTop(0);
    smoother.paused(true);

    let links = document.querySelectorAll(".header ul a");
    links.forEach((elem) => {
      let element = elem as HTMLAnchorElement;
      element.addEventListener("click", (e) => {
        let currentTarget = e.currentTarget as HTMLAnchorElement;
        let section = currentTarget.getAttribute("data-href");
        
        // Only prevent default and scroll if it's an internal section link
        if (window.innerWidth > 1024 && section && section.startsWith("#")) {
          e.preventDefault();
          smoother.scrollTo(section, true, "top top");
        }
      });
    });
    window.addEventListener("resize", () => {
      ScrollSmoother.refresh(true);
    });
  }, []);
  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title" data-cursor="disable">
          SK
        </a>
        <a
          href="mailto:satish.kum.14.sk@gmail.com"
          className="navbar-connect"
          data-cursor="disable"
        >
          satish.kum.14.sk@gmail.com
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#certificates" href="#certificates">
              <HoverLinks text="CERTIFICATES" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="CONTACT" />
            </a>
          </li>
          <li className="navbar-auth">
            {isAuthenticated ? (
              <button 
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} 
                className="logout-btn"
                data-cursor="disable"
              >
                <HoverLinks text="LOGOUT" />
              </button>
            ) : (
              <Link to="/login" className="login-btn" data-cursor="disable">
                <HoverLinks text="LOGIN" />
              </Link>
            )}
          </li>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
