import React from "react";
import Graph from "../../components/Graph/Graph";
import Piechart from "../../components/Piechart/Piechart";
import "./Dashboard.css";

const Dashboard = ({ url }) => {
  return (
    <div className="dashboard-container">
      <div className="main-content">
        <Graph url={url} xAxisType="months" />
      </div>
      <div className="sidebarr">
        <Piechart url={url} />
      </div>
    </div>
  );
};

export default Dashboard;
