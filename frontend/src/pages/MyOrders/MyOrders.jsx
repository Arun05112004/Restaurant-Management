import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/assets";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    const response = await axios.get(`${url}/api/order/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const sortedData = response.data.data.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    setData(sortedData);
  };

  const generatePDF = async (order) => {
    try {
      const response = await axios.post(
        `${url}/api/order/pdf`,
        {
          customerName: order.address.firstName,
          customerAddress: order.address.street,
          customerAddress2: order.address.city,
          orderId: order._id,
          customerPhone: order.address.phone,
          orderItems: order.items.map((item) => ({
            name: item.name,
            description: item.description,
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount: order.amount,
          email: order.address.email,
          date: order.status.date,
        },
        { responseType: "blob" }
      );

      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", `invoice_${order._id}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {data.map((order, index) => (
          <div className="my-orders-order" key={index}>
            <img src={assets.parcel_icon} alt="" />
            <p>
              {order.items.map((item, index) => {
                if (index === order.items.length - 1) {
                  return item.name + " x " + item.quantity;
                } else {
                  return item.name + " x " + item.quantity + ",  ";
                }
              })}
            </p>
            <p>₹{order.amount}.00</p>
            <p>Items: {order.items.length}</p>
            <p>
              <span>&#x25cf; </span>
              <b> {order.status}</b>
            </p>
            <button onClick={() => generatePDF(order)}>Download Invoice</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
