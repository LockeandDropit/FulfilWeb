import { useState, useEffect } from "react";

import DoerHeader from "./components/DoerHeader";
import { useUserStore } from "./Chat/lib/userStore";
import { db } from "../../firebaseConfig";
import { getDoc, doc, updateDoc } from "firebase/firestore";

const Resources = () => {
  const { currentUser } = useUserStore();

  const [resources, setResources] = useState(null);
  const [selected, setSelected] = useState(null)

  //sort could be done loosely on "contains" while mapping over services of resources

  const filterResources = () => {
    let filteredResources = [];

    resources.map((x) => {
      x.services.forEach((service) => {
        console.log("befpre", service.toLowerCase(), selected)
        if (service.toLowerCase().includes(selected)) {
          filteredResources.push(x);
          console.log("got one", x)
        }
      });
    });

    setResources(filteredResources);
  };

  useEffect(() => {
    if (currentUser) {
      console.log("state");

      const docRef = doc(
        db,
        "ResourcesByState",
        currentUser.state.toLowerCase()
      );

      getDoc(docRef).then((snapshot) => {
        // console.log(snapshot.data());
        setResources(snapshot.data().resources);
      });
    } else {
      console.log("oops!");
    }
  }, []);

  const handleOpen = (x) => {
    window.open(x);
  };

  const images = [
    "/landingImages/threepersonmeeting.jpg",
    "/landingImages/mediumWarehouse.jpg",
    "/landingImages/apronsmeeting.jpg",
    "/landingImages/womansmiling.jpg",
    "/landingImages/people-working-as-team-company.jpg",
    "/landingImages/1.jpg",
    "/landingImages/2.jpg",
    "/landingImages/3.jpg",
    "/landingImages/4.jpg",
    "/landingImages/5.jpg",
    "/landingImages/6.jpg",
    "/landingImages/mediumMechanic.jpg",
    "/landingImages/7.jpg",
    "/landingImages/8.jpg",
    "/landingImages/9.jpg",
    "/landingImages/10.jpg",
    "/landingImages/forklift.jpg",
    "/landingImages/warehouse2.jpg",
    "/landingImages/elderlyman.jpg",
    "/landingImages/warehouseresource.jpg",
  ];

  return (
    <div className="w-full">
      <DoerHeader />

      <div className="w-full bg-sky-400 py-6 py-12 mt-16">
        <div class="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 ">
          <div class="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center ">
            <div className="">
              <h1 class="block text-3xl font-semibold text-white sm:text-2xl lg:text-3xl lg:leading-tight ">
                Resources in {currentUser?.state}
              </h1>
              <p class="mt-2 text text-white">
                Browse free resources that will help you find and prepare for a
                great career!
              </p>
              {/* <select onChange={(e) => setSelected(e.target.value)} className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none">
                <option >Open this select menu</option>
                <option value="job training">Job skills/training</option>
                <option value="resume">Resume Help</option>
                <option value="job search">Job search</option>
                <option value="financial">Financial Guidance</option>
                <option value="Career Guidance">Career Guidance</option>
              </select>
              <button
                onClick={() => filterResources()}
                className="bg-white text-black"
              >
                {" "}
                filter
              </button> */}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row mt-4 md:mt-6">
            <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources?.map((resource, index) => (
                  <div className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl">
                    <div className="h-58 flex flex-col justify-center items-center bg-blue-600 rounded-t-xl">
                      <img
                        src={images[index]}
                        loading="lazy"
                        className="h-full w-full flex flex-col justify-center items-center bg-blue-600 rounded-t-xl"
                      />
                    </div>
                    <div className="p-4 md:p-6">
                      <span className="block mb-1 text-xs font-semibold uppercase text-gray-500">
                        Resource
                      </span>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {resource.name}
                      </h3>
                      <p className="mt-3 text-gray-700 font-medium">
                        What they offer
                      </p>
                      <p className=" text-gray-500">{resource.description}</p>
                    </div>
                    <div className="mt-auto flex border-t border-gray-200 divide-x divide-gray-200">
                      <a
                        className="cursor-pointer w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                        onClick={() => handleOpen(resource.website)}
                      >
                        Visit Site
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
