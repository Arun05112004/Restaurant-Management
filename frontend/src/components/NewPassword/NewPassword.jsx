import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./NewPassword.css"; // Import the CSS file

const NewPassword = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isValidToken, setIsValidToken] = useState(false);

  const [idUser, setId] = useState();

  useEffect(() => {
    const getId = async () => {
      const response = await axios.get(
        `http://localhost:4000/api/user/reset/id}`
      );
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      console.log("in newpassword.jsx password ", userId);
      const response = await axios.post(
        "http://localhost:4000/api/user/new-password",
        {
          password,
          userId,
        }
      );

      if (response.data.success) {
        setMessage("Password reset successful. Redirecting to login...");
        setTimeout(() => {
          navigate("/");
        }, 3000); // Redirect to login after 3 seconds
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="new-password-container">
      <>
        <h2>Set New Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Reset Password</button>
        </form>
      </>
    </div>
  );
};

export default NewPassword;
