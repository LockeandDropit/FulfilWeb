import React from "react";
import LoggedOutHeaderAbout from "../Landing/LoggedOutHeaderAbout.jsx";
import AboutHero from "./AboutHero";
import WhatUsersGet from "./WhatUsersGet";
import TylerFeature from "./TylerFeature";
import Footer from "../../components/Footer.jsx";

const About = () => {
  return (
    <>
      <LoggedOutHeaderAbout />

      <AboutHero />
      <WhatUsersGet />
      <TylerFeature />

      <Footer />
    </>
  );
};

export default About;
