import React, { useState } from "react";
import axios from "axios";
import "./ReplyForm.css";

const ReplyForm = ({ url, email, onClose }) => {
  const [replyMessage, setReplyMessage] = useState("");

  const handleSendReply = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/api/dashboard/send-reply`, {
        email,
        message: replyMessage,
      });
      alert(response.data.message);
      setReplyMessage("");
      onClose();
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("Failed to send reply. Please try again later.");
    }
  };

  return (
    <div className="reply-form-container">
      <div className="reply-form-backdrop" onClick={onClose}></div>
      <div className="reply-form">
        <h2>Reply to {email}</h2>
        <form onSubmit={handleSendReply}>
          <textarea
            name="message"
            placeholder="Your reply..."
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            required
          ></textarea>
          <button type="submit">Send Reply</button>
          <button type="button" className="close-button" onClick={onClose}>
            Close
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReplyForm;
