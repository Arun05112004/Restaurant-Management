import React, { useContext, useState } from "react";
import axios from "axios";
import "./ResetPassword.css";
import { StoreContext } from "../../context/StoreContext";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const { url } = useContext(StoreContext);

  const onChangeHandler = (e) => {
    setEmail(e.target.value);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/api/user/reset`, { email });
      setMessage(response.data.message);
    } catch (error) {
      console.log(error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="reset-password-container">
      <form onSubmit={onSubmitHandler} className="reset-password-form">
        <h2>Reset Password</h2>
        <input
          type="email"
          name="email"
          value={email}
          onChange={onChangeHandler}
          placeholder="Enter your email"
          required
        />
        <button type="submit">Send Reset Link</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
