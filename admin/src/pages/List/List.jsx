import React, { useContext, useMemo } from "react";
import "./List.css";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import Paginator from "../../components/Paginator/Paginator";
import { Link } from "react-router-dom";
import { StoreContext } from "../../components/context/StoreContext";

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const { food_list, currentPage, totalPages, fetchFoodList } =
    useContext(StoreContext);
  const [category, setCategory] = useState("All");

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      fetchFoodList(currentPage - 1, category);
    }
  };

  useMemo(() => {
    window.scrollTo({ top: 0 });
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      fetchFoodList(currentPage + 1, category);
    }
  };

  useEffect(() => {
    fetchFoodList(1, category);
  }, [category]);

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`);
    console.log(response.data);
    if (response.data.success) {
      console.log("Successss");
      setList(response.data.data);
    } else {
      toast.error("An error occurred");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const removeFood = async (foodId) => {
    const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
    await fetchList();
    if (response.data.success) {
      toast.success(response.data.message);
    } else {
      toast.error("Error");
    }
  };

  return (
    <div className="list add flex-col">
      <div>
        <label htmlFor="category">Choose a category:</label>
        <select
          id="category"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Salad">Salad</option>
          <option value="Deserts">Deserts</option>
          <option value="Pasta">Pasta</option>
          <option value="Noodles">Noodles</option>
          <option value="Cake">Cake</option>
          <option value="Pure Veg">Pure Veg</option>
        </select>
      </div>
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {food_list.map((item, index) => {
          return (
            <div key={index} className="list-table-format">
              <img src={`${url}/images/` + item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>₹{item.price}</p>
              <p onClick={() => removeFood(item._id)} className="cursor">
                X
              </p>
              <Link to={`/update/${item._id}`}>
                <button className="edit-button">Edit</button>
              </Link>
            </div>
          );
        })}
      </div>
      <Paginator
        currentPage={currentPage}
        totalPages={totalPages}
        handlePreviousPage={handlePreviousPage}
        handleNextPage={handleNextPage}
      />
    </div>
  );
};

export default List;
