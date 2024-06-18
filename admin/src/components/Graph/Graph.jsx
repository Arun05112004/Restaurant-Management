import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import "./Graph.css";

const Graph = ({ url }) => {
  const [data, setData] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    weeklyRevenue: [],
  });

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/dashboard/list`);
    console.log(response.data);
    if (response.data.success) {
      setList(response.data.data);
    } else {
      toast.error("An error occurred");
    }
  };

  useEffect(() => {
    axios
      .get(`${url}/api/dashboard/list`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const chartData = Object.keys(data.weeklyRevenue).map((week) => ({
    week,
    revenue: data.weeklyRevenue[week],
  }));

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>
      <div className="stats">
        <div className="stat-item">
          <div className="stat-title">Total Orders</div>
          <div className="stat-value">{data.totalOrders}</div>
        </div>
        <div className="stat-item">
          <div className="stat-title">Total Revenue</div>
          <div className="stat-value">{data.totalRevenue}</div>
        </div>
      </div>
      <div className="chart">
        <LineChart width={600} height={300} data={chartData}>
          <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </div>
    </div>
  );
};

export default Graph;
