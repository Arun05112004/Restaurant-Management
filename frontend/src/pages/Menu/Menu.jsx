import React, { useState } from "react";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import AppDownload from "../../components/AppDownload/AppDownload";

const Menu = () => {
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("asc");

  return (
    <>
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} sort={sort} setSort={setSort} />
      <AppDownload />
    </>
  );
};

export default Menu;
