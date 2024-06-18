import React, { useContext, useMemo, useState } from "react";
import axios from "axios";
import "./ContactUs.css";
import { StoreContext } from "../../context/StoreContext";

const ContactUs = () => {
  const { url } = useContext(StoreContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/api/user/send-query`, formData);
      alert("Your message has been sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      alert("There was an error sending your message. Please try again later.");
    }
  };

  useMemo(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="form-container">
      <h2>Contact us</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Message"
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>
        <button type="submit">Send </button>
      </form>
    </div>
  );
};

export default ContactUs;
