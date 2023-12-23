import React from "react";
import "./style.css";
import { BiSearch } from "react-icons/bi";

const Searchbox = () => {
  return (
    <>
      <div className="search">
        <div className="search-icon">
          <BiSearch />
        </div>
        <div className="search-field">
          <input type="text" placeholder="Write Here..." />
        </div>
      </div>
    </>
  );
};

export default Searchbox;
