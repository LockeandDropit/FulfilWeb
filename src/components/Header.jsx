import {
  Input,
  Button,
  Text,
  Box,
  Container,
  Textarea,
} from "@chakra-ui/react";
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
        <Button backgroundColor="white" onClick={() => navigate("/NeederEmailRegister")}>Post A Job</Button>
        {/* <Button backgroundColor="white">Categories</Button> */}
        <Button backgroundColor="white" onClick={() => navigate(`/DoerEmailRegister`)}>Become A Doer</Button>
      
       
       
        <Button backgroundColor="#01A2E8" color="white"     _hover={{ bg: "#018ecb", textColor: "white" }} onClick={() => navigate(`/Login`)} marginRight="12" width="160px">Log In</Button>
      </div>
    </div>
  );
};

export default Header;
