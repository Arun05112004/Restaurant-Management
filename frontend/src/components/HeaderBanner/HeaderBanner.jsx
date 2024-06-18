import React from "react";
import "./HeaderBanner.css";
import { assets } from "../../assets/assets";

const HeaderBanner = () => {
  return (
    <div className="banner">
      <div className="banner__image">
        <img src={assets.burger} alt="Banner" />
      </div>
      <div className="banner__content">
        <h1>Delicious Food Awaits</h1>
        <p>Discover our menu and order your favorites online.</p>
        <button className="banner__button">Order Now</button>
      </div>
    </div>
  );
};

export default HeaderBanner;
