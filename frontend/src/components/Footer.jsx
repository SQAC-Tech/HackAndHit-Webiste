import "./Footer.css";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        {/* Left Section */}
        <div className="footer-brand">
          {/* Logo from public folder */}
          <img
            src="/Logo.png"
            alt="Hack and Hit USA Logo"
            className="footer-logo"
          />

          <p>
            Get the latest updates on Hack and Hit USA events and
            announcements.
          </p>

          <div className="subscribe">
            <input type="email" placeholder="Your email" />
            <button>Subscribe</button>
          </div>

          <small>
            By subscribing you agree to our{" "}
            <span>Privacy Policy</span> and consent to receive updates.
          </small>
        </div>

        {/* Navigation */}
        <div className="footer-links">
          <h4>Navigation</h4>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/team">Team</a>
          <a href="/schedule">Schedule</a>
          <a href="/register">Registration</a>
        </div>

        {/* Resources */}
        <div className="footer-links">
          <h4>Resources</h4>
          <a href="/faq">FAQ</a>
          <a href="/rules">Rules</a>
          <a href="/judges">Judges</a>
          <a href="/sponsors">Sponsors</a>
          <a href="/contact">Contact</a>
        </div>

        {/* Social */}
        <div className="footer-links">
          <h4>Follow us</h4>
          <div className="social-links">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaXTwitter /></a>
            <a href="#"><FaLinkedinIn /></a>
            <a href="#"><FaYoutube /></a>
          </div>
        </div>
      </div>

      <hr />

      {/* Bottom */}
      <div className="footer-bottom">
        <p>© 2025 Hack and Hit USA. All rights reserved.</p>
        <div className="footer-policy">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of service</a>
          <a href="/cookies">Cookies settings</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
