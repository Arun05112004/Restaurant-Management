import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [formData, setFormData] = useState({
    restaurantName: "",
    customerName: "",
    totalAmount: "",
    orderItems: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/generate-pdf",
        formData
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Generate Invoice</h1>
      <form onSubmit={handleSubmit}>
        <label>Restaurant Name:</label>
        <input
          type="text"
          name="restaurantName"
          value={formData.restaurantName}
          onChange={handleChange}
        />
        <br />
        <label>Customer Name:</label>
        <input
          type="text"
          name="customerName"
          value={formData.customerName}
          onChange={handleChange}
        />
        <br />
        <label>Total Amount:</label>
        <input
          type="text"
          name="totalAmount"
          value={formData.totalAmount}
          onChange={handleChange}
        />
        <br />
        <label>Order Items:</label>
        <textarea
          name="orderItems"
          value={formData.orderItems}
          onChange={handleChange}
        />
        <br />
        <button type="submit">Generate Invoice</button>
      </form>
    </div>
  );
};

export default App;
