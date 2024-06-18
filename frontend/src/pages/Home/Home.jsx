import React from "react";
import "./Home.css";
import Header from "../../components/Header/Header";
import AppDownload from "../../components/AppDownload/AppDownload";
import Offers from "../../components/Offers/Offers";

const Home = () => {
  return (
    <div>
      <Header />
      <Offers />
      <AppDownload />
    </div>
  );
};

export default Home;
