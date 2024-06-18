import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend, XAxis } from "recharts";
import "./Piechart.css";

const Piechart = ({ url }) => {
  const [data, setData] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    categorySales: [],
  });

  useEffect(() => {
    axios
      .get(`${url}/api/dashboard/pie`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [url]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

  return (
    <div className="dashboardd">
      <h1>By Category</h1>
      <div className="statss">
        <div>Total Orders: {data.totalOrders}</div>
        <div>Total Revenue: {data.totalRevenue}</div>
      </div>
      <div className="chart-container">
        <PieChart width={480} height={400}>
          <Pie
            data={data.categorySales}
            cx={240}
            cy={200}
            labelLine={false}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={120}
            innerRadius={80}
            fill="#8884d8"
            dataKey="value"
            paddingAngle={5}
          >
            {data.categorySales.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
  );
};

export default Piechart;
