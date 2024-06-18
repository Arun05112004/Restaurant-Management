import React from "react";
import "./Footer.css";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img width="120px" height="40px" src={assets.logo} alt="" />
          <p>
            BlinkBite is dedicated to providing an exceptional dining experience
            with a diverse menu that showcases the best of local and
            international cuisine. Our commitment to quality ingredients,
            outstanding service, and a welcoming atmosphere ensures that every
            visit is memorable.
          </p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="" />
            <img src={assets.twitter_icon} alt="" />
            <img src={assets.linkedin_icon} alt="" />
          </div>
        </div>
        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <Link to="/">
              <li>Home</li>
            </Link>
            <Link to="/about-us">
              <li>About us</li>
            </Link>

            <Link to="/contact">
              <li>Contact us</li>
            </Link>
            <Link to="/privacy">
              <li>Privacy policy</li>
            </Link>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>+91-982244525</li>
            <Link to="/contact">
              <li>blinkbite14@gmail.com</li>
            </Link>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        Copyright 2024 © blinkbite.com - All Right Reserved.
      </p>
    </div>
  );
};

export default Footer;
