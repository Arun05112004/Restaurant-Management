import React, { useContext, useEffect, useMemo } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";
import Paginator from "../Paginator/Paginator";

const FoodDisplay = ({ category, sort, setSort }) => {
  const { food_list, currentPage, totalPages, fetchFoodList } =
    useContext(StoreContext);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      fetchFoodList(currentPage - 1, category, sort);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      fetchFoodList(currentPage + 1, category, sort);
    }
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
    fetchFoodList(1, category, event.target.value);
  };

  useMemo(() => {
    window.scrollTo({ top: 0 });
  }, [currentPage]);

  useEffect(() => {
    fetchFoodList(1, category, sort);
  }, [category, sort]);

  console.log(food_list);

  return (
    <div className="food-display" id="food-display">
      <h2>Top dishes near you</h2>
      <div>
        <label htmlFor="sort">Sort by Price: </label>
        <select id="sort" value={sort} onChange={handleSortChange}>
          <option value="asc">low to high</option>
          <option value="desc">high to low</option>
        </select>
      </div>
      <div className="food-display-list">
        {food_list.map((item, index) => {
          if (category === "All" || category === item.category) {
            return (
              <FoodItem
                key={item._id}
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
              />
            );
          }
          return null;
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

export default FoodDisplay;
