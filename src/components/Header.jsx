import React from "react";

import fulfil180 from "../images/fulfil180.jpg";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="header">
      <div className="headerLogo" onClick={() => navigate(`/`)}>
        <img src={fulfil180} alt="Fulfil Logo"></img>
      </div>

      <div className="headerRight">
        <ul className="boldHeaderText" onClick={() => navigate(`/Login`)}>
          Post A Job
        </ul>
        <ul className="boldHeaderText">Categories</ul>
        <ul className="boldHeaderText" onClick={() => navigate(`/DoerAccountCreation`)}>
          Become A Doer
        </ul>

        <button
          className="solidButtonHeader"
          onClick={() => navigate(`/Login`)}
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default Header;
