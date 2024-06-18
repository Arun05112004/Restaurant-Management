import React, { useEffect, useState } from "react";
import axios from "axios";
import ReplyForm from "../../components/ReplyForm/ReplyForm";
import "./Query.css";

const Query = ({ url }) => {
  const [queries, setQueries] = useState([]);
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState(null);

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const response = await axios.get(`${url}/api/user/queries`);
        setQueries(response.data);
      } catch (error) {
        console.error("Error fetching queries:", error);
      }
    };

    fetchQueries();
  }, [url]);

  const handleSort = () => {
    const sortedQueries = [...queries].sort((a, b) => {
      if (sortAsc) {
        return new Date(a.date) - new Date(b.date);
      } else {
        return new Date(b.date) - new Date(a.date);
      }
    });
    setQueries(sortedQueries);
    setSortAsc(!sortAsc);
  };

  const handleReply = (email) => {
    setSelectedEmail(email);
  };

  const closeReplyForm = () => {
    setSelectedEmail(null);
  };

  return (
    <div className="query-container">
      <h2>Admin Queries</h2>

      <button className="sort-button" onClick={handleSort}>
        Sort by Date {sortAsc ? "↑" : "↓"}
      </button>

      <table>
        <thead>
          <tr>
            <th>Serial No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Date</th>
            <th>Message</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {queries.map((query, index) => (
            <tr key={query._id}>
              <td>{index + 1}</td>
              <td>{query.name}</td>
              <td>{query.emailId}</td>
              <td>{new Date(query.date).toLocaleString()}</td>
              <td>{query.message}</td>
              <td>
                <button onClick={() => handleReply(query.emailId)}>
                  Reply
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedEmail && (
        <ReplyForm url={url} email={selectedEmail} onClose={closeReplyForm} />
      )}
    </div>
  );
};

export default Query;
