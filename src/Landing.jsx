import React, { useState, useEffect } from "react";
import Header from "./components/Header.jsx";
import HeroMd from "./images/HeroMd.jpg";
import Categories from "./components/Categories.jsx";
import { useNavigate } from "react-router-dom";
import { Input, Button, Text, Box, Container, Image } from "@chakra-ui/react";
import { Center, Flex } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Stack,
  InputAddon,
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import Planning from "./images/Planning.jpg";
import ManWorking from "./images/ManWorking.jpg";
import house from "./images/house.jpg";
import rotar from "./images/rotar.jpg";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebaseConfig";

import { doc, getDoc } from "firebase/firestore";

import { Spinner } from "@chakra-ui/react";

import Hero from "./components/Hero.jsx";
import LandingPageMap from "./components/LandingPageMap.jsx";
import Footer from "./components/Footer.jsx";
import LoggedOutHeader from "./components/Landing/LoggedOutHeader.jsx";
import MainHero from "./components/Landing/MainHero.jsx";
import MapHero from "./components/Landing/MapHero.jsx";
import MainCategories from "./components/Landing/MainCategories.jsx";
import MainUserJourney from "./components/Landing/MainUserJourney.jsx";


const Landing = () => {
  // navigation Ibad Shaikh https://stackoverflow.com/questions/37295377/how-to-navigate-from-one-page-to-another-in-react-js
  const navigate = useNavigate();
  //background image https://www.freecodecamp.org/news/react-background-image-tutorial-how-to-set-backgroundimage-with-inline-css-style/
  //image from Photo by Nate Johnson https://unsplash.com/photos/a-group-of-men-standing-around-a-white-sheet-of-paper-DowtEyavqsY

  return (
    <>
<LoggedOutHeader />
<MainHero />

<MapHero />
<MainUserJourney />
<MainCategories />

      <Footer />



   
    </>
  );
};

export default Landing;
