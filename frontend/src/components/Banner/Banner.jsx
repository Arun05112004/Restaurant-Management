import React from "react";
import "./Banner.css";
import { assets } from "../../assets/assets";

const Banner = () => {
  return (
    <div className="banner">
      <div className="banner__image">
        <img src={assets.burger} alt="Banner" />
      </div>
      <div className="banner__content">
        <h1>Delicious Food, Delivered Fast</h1>
        <p>Order your favorite meals online and enjoy exclusive deals.</p>
        <button className="banner__button">Order Now</button>
      </div>
    </div>
  );
};

export default Banner;
