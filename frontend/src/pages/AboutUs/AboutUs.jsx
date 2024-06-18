import React, { useMemo } from "react";
import "./AboutUs.css";

const AboutUs = () => {
  useMemo(() => {
    window.scrollTo({ top: 0 });
  }, []);
  return (
    <div className="about-us-container">
      <div className="opening-hours">
        <h2>Opening Hours</h2>
        <p>
          <strong>Monday - Friday:</strong> 10:00 AM - 10:00 PM
        </p>
        <p>
          <strong>Saturday - Sunday:</strong> 11:00 AM - 11:00 PM
        </p>
      </div>

      <div className="about-us-content">
        <h1>About Us</h1>
        <p>
          Welcome to BlinkBite, your favorite destination for delicious food! At
          BlinkBite, we take pride in serving you the best culinary delights
          made from fresh, locally sourced ingredients. Our menu features a wide
          range of dishes to tantalize your taste buds, from mouthwatering
          appetizers to sumptuous main courses and decadent desserts.
        </p>
        <p>
          Our chefs are passionate about creating innovative and flavorful
          dishes that cater to all tastes and dietary preferences. Whether
          you're a meat lover, vegetarian, or vegan, you'll find something
          delightful to enjoy at BlinkBite.
        </p>
        <p>
          At BlinkBite, we believe in providing exceptional dining experiences
          that leave a lasting impression. Whether you're dining in with friends
          and family or ordering takeout for a cozy night in, we strive to
          ensure that every meal is memorable and satisfying.
        </p>
        <p>
          Thank you for choosing BlinkBite. We look forward to serving you soon!
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
