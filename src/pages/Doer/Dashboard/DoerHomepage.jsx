import React from "react";
import DoerHeader from "../components/DoerHeader";
import Greeting from "./Greeting";
import HomepageJobs from "./HomepageJobs";
import HomepageEducation from "./HomepageEducation";
import Footer from "../../../components/Footer"
import Tools from "./Tools";

const DoerHomepage = () => {
  return (
    <div className="w-full">
      <DoerHeader />
      <Greeting />
      <HomepageJobs />
      <HomepageEducation />
    
    </div>
  );
};

export default DoerHomepage;
