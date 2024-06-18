import React, { useState } from "react";
import "./Update.css";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { useParams } from "react-router-dom";
import { assets } from "../../assets/assets";
function Update({ url }) {
  const { id } = useParams();
  const cleanId = id.replace(":", "");
  console.log("in update id ", id);

  const [list, setList] = useState([]);

  const fetchList = async () => {
    const response = await axios.post(`${url}/api/food/foodItem`, {
      id: cleanId,
    });
    console.log(response.data.data);

    if (response.data.success) {
      setList(response.data.data);
      console.log("name: ", list.name);
    } else {
      toast.error("An error occurred");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
  });

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setList((prev) => ({ ...prev, [name]: value }));
    console.log(list);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("id", cleanId);
    formData.append("name", list.name);
    formData.append("description", list.description);
    formData.append("price", Number(list.price));
    formData.append("image", image); // append the image file

    try {
      const response = await axios.post(`${url}/api/food/update`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error("An error occurred");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred");
    }
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };
  return (
    <div className="container">
      <h1>Edit Product</h1>
      <form onSubmit={handleSubmit}>
        <div className="add-img-upload flex-col file-upload">
          <p>Upload image</p>

          <input
            onChange={handleFileChange}
            name="image"
            type="file"
            id="image"
          />
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              className="upload-area"
            />
          </label>
        </div>

        <label>
          Name:
          <input
            type="text"
            name="name"
            value={list.name}
            onChange={handleChange}
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            rows="2"
            cols={20}
            value={list.description}
            onChange={handleChange}
          />
        </label>
        <label>
          Price:
          <input
            type="number"
            name="price"
            value={list.price}
            onChange={handleChange}
          />
        </label>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default Update;
