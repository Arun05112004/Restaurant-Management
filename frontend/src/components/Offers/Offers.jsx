import React from "react";
import "./Offers.css";
import { assets } from "../../assets/assets";

const offers = [
  {
    image: assets.food_6,
    title: "Buy 2, Get 1 Free",
    description: "Treat yourself to an extra roll with every purchase of two.",
  },
  {
    image: assets.food_26,
    title: "20% OFF!",
    description: "20% off on all pasta dishes today!.",
  },
  {
    image: assets.hakka,
    title: " Delicious Discount on Noodles!",
    description: "10% off your next noodles order.",
  },
];

const Offers = () => {
  return (
    <section className="offers-section">
      <h2 className="offers-title">Offers & Promotions</h2>
      <div className="offers-container">
        {offers.map((offer, index) => (
          <div key={index} className="offer-card">
            <img src={offer.image} alt={offer.title} className="offer-image" />
            <div className="offer-content">
              <h3 className="offer-title">{offer.title}</h3>
              <p className="offer-description">{offer.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Offers;
