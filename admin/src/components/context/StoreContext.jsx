import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [food_list, setFoodList] = useState([]);
  const postsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const url = "http://localhost:4000";

  const fetchFoodList = async (page = 1, category = "All") => {
    setFoodList([]);
    const response = await axios.get(
      url + `/api/food/list?page=${page}&category=${category}`
    );
    setFoodList(response.data.data);
    console.log(food_list);
    setCurrentPage(page);
    setTotalPages(response.data.pagination.totalPages);
  };

  const contextValue = {
    food_list,
    fetchFoodList,
    currentPage,
    totalPages,
    url,
    postsPerPage,
    setCurrentPage,
  };
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
