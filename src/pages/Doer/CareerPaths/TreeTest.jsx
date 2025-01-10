import React from "react";
import Tree from "react-d3-tree";
import { useRef, useState, useEffect } from "react";
import Markdown from "react-markdown";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import "./treeStyles.css"; // Custom CSS for thicker lines

const TreeTest = () => {
  const shouldRecenterTreeRef = useRef(true);
  const [treeTranslate, setTreeTranslate] = useState({ x: 0, y: 0 });
  const treeContainerRef = useRef(null);

  const {
    isOpen: isOpenDrawer,
    onOpen: onOpenDrawer,
    onClose: onCloseDrawer,
  } = useDisclosure();

  useEffect(() => {
    if (treeContainerRef.current && shouldRecenterTreeRef.current) {
      shouldRecenterTreeRef.current = false;
      const dimensions = treeContainerRef.current.getBoundingClientRect();

      setTreeTranslate({
        x: dimensions.width / 2,
        // x: dimensions.width / 3,
        y: dimensions.height - 50,
      });
    }
  });
  const orgChart = {
    name: "Start Here",
    attributes: {
      jobTitle: "",
      snippet: "",
      timeCommitment: "",
    },
    children: [
      {
        name: "$70k/year",
        attributes: {
          jobTitle: "Class A CDL Driver",
          bullet1:
            "Transport goods from warehouse to warehouse or store locations.",
          bullet2: "Drive in a safe and efficient manner.",
          bullet3: "Navigate through unknown areas and interpret directions.",
          snippet:
            "Class A CDLs are in high demand in Minnesota, offer competitive pay, and a great career path.",
          timeCommitment: "1 month training",
        },
        children: [
          {
            name: "$120k/year",
            attributes: {
              jobTitle: "Class A CDL Driver",
              bullet1:
                "Transport goods from warehouse to warehouse or store locations.",
              bullet2: "Drive in a safe and efficient manner.",
              bullet3:
                "Navigate through unknown areas and interpret directions.",

              timeCommitment: "5-7 years",
            },
          },
          {
            name: "$150k/year",
            attributes: {
              jobTitle: "Hub Manager",
              bullet1: "Oversee logistics of truck dispatching.",
              bullet2: "Responsible for operations are running smoothly.",
              bullet3:
                "Communicate well with management and be clear about responsibilities.",
              timeCommitment: "5-7 years",
            },
          },
          {
            name: "$250K+/year",
            attributes: {
              jobTitle: "Owner/Operator",
              bullet1: "Hire good staff to operate the trucks.",
              bullet2:
                "Source profitable materials/goods for your drivers to transport.",
              bullet3: "Manage operations and expenses at a high-level.",
              timeCommitment: "5-7 years",
            },
          },
        ],
      },
    ],
  };

  const handleHover = () => {
    console.log("hovering");
  };

  const [popOverVisible, setPopOverVisible] = useState(false);
  const [selectedNodeName, setSelectedNodeName] = useState(null);

  const handleClick = (x) => {
    setPopOverVisible(!popOverVisible);
    console.log("pspsps", popOverVisible, x);
    handleOpenDrawer(x);
    // if (popOverVisible === false) {
    //   //   setSelectedNodeName(null);
    // } else {
    //   setSelectedNodeName(x);
    // }
  };

  //hover

  // const HoverableDiv = ({ handleMouseOver, handleMouseOut }) => {
  //   return (
  //   //   <div onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
  //   //     <span></span>
  //   //   </div>
  //   );
  // };

  const HoverText = () => {
    return (
      <div>
        Hovering right meow!
        <span role="img" aria-label="cat">
          🐱
        </span>
      </div>
    );
  };

  const [isHovering, setIsHovering] = useState(false);
  const handleMouseOver = (x) => {
    setSelectedNodeName(x);
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setSelectedNodeName(null);
    setIsHovering(false);
  };

  const [selectedNodeNameDrawer, setSelectedNodeNameDrawer] = useState(null);
  const handleOpenDrawer = (x) => {
    setSelectedNodeNameDrawer(x);
    onOpenDrawer();
  };

  // Here we're using `renderCustomNodeElement` render a component that uses
  // both SVG and HTML tags side-by-side.
  // This is made possible by `foreignObject`, which wraps the HTML tags to
  // allow for them to be injected into the SVG namespace.
  const renderForeignObjectNode = ({
    nodeDatum,
    toggleNode,
    foreignObjectProps,
  }) => (
    <>
      <foreignObject
        {...foreignObjectProps}
        onMouseOut={() => handleMouseOut(nodeDatum.name)}
        onClick={() => handleOpenDrawer(nodeDatum.name)}
      >
        <>
          <div
            onMouseOver={() => handleMouseOver(nodeDatum.name)}
            className="w-[160px]  py-2 px-3 inline-flex items-center justify-center gap-x-2 text-md font-medium rounded-lg border border-transparent bg-sky-500 text-white hover:bg-sky-600"
          >
            {nodeDatum.name}
          </div>

          {/* hovering credit https://codesandbox.io/p/sandbox/react-hover-example-hooks-0to7u?file=%2Findex.js%3A34%2C3-41%2C11 */}
          {isHovering & (nodeDatum.name === selectedNodeName) ? (
            <>
              <div
                onMouseOver={() => handleMouseOver(nodeDatum.name)}
                class=" items-center  flex flex-col bg-white "
              >
                <div
                  onMouseOver={() => handleMouseOver(nodeDatum.name)}
                  class=" mt-2 items-center  flex flex-col bg-white border shadow-sm rounded-xl "
                >
                  <div class="p-4 md:p-5">
                    <h3 class="text-lg font-bold text-gray-800 ">
                      {nodeDatum.attributes.jobTitle}
                    </h3>
                    <div className="flex flex-row">
                      <p className="text-sm text-gray-800">Experience:</p>
                      <p className="ml-1 text-sm text-gray-600">
                        {nodeDatum.attributes.timeCommitment}
                      </p>
                    </div>
                    <ul className="list-disc px-3 text-sm">
                      <li class="mt-1 text-gray-700">
                        <p className="text-sm">
                          {nodeDatum.attributes.bullet1}
                        </p>
                      </li>
                      <li class=" text-gray-700">
                        <p className="text-sm">
                          {nodeDatum.attributes.bullet2}
                        </p>
                      </li>
                      <li class=" text-gray-700">
                        <p className="text-sm">
                          {nodeDatum.attributes.bullet3}
                        </p>
                      </li>
                    </ul>
                    <a
                      class="w-full mt-2 py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-sky-500 text-white hover:bg-sky-600 focus:outline-none focus:bg-blue-700 "
                      href="#"
                      onClick={() => handleOpenDrawer(nodeDatum.name)}
                    >
                      Explore path
                    </a>
                  </div>
                </div>
              </div>
            </>
          ) : null}

          {nodeDatum.name === selectedNodeNameDrawer ? (
            // <Drawer
            //     onClose={onCloseDrawer}
            //     isOpen={isOpenDrawer}
            //     size={"xl"}
            //   >
            //     <DrawerOverlay />
            //     <DrawerContent>
            //       <DrawerCloseButton />
            //       <DrawerHeader>{nodeDatum.attributes.jobTitle}</DrawerHeader>
            //       <DrawerBody>
            //       </DrawerBody>
            //     </DrawerContent>
            //   </Drawer>

            <Drawer onClose={onCloseDrawer} isOpen={isOpenDrawer} size={"lg"}>
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader></DrawerHeader>
                <DrawerBody>
                  <div class="">
                    <div class="w-full max-h-full flex flex-col right-0 bg-white rounded-xl pointer-events-auto ">
                      <div class="overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ">
                        <div class="p-4">
                          <div class=" cursor-default">
                            <div className="flex">
                              <label
                                for="hs-pro-dactmt"
                                class="block mb-2 text-2xl font-medium text-gray-900"
                              >
                                Class A CDL Truck Driver
                              </label>
                            </div>

                            <div class="space-y-2 ">
                              <div class="flex align-items-center">
                                <p className="text-md font-medium ">
                                  Average Salary:
                                </p>
                                <p className="ml-1 text-md font-medium ">
                                  $80,000 - $
                                </p>
                                <label
                                  for="hs-pro-dactmt"
                                  class="block  text-md font-medium text-gray-800 "
                                >
                                  120,000
                                </label>
                              </div>
                            </div>
                            <div class="space-y-2 ">
                              <div class="flex align-center  items-center">
                                <p className="text-md font-medium ">
                                  Industry Growth:
                                </p>
                                <p className="ml-1 text-md font-medium text-green-600">
                                  4.5%
                                </p>

                                <svg
                                  class="shrink-0 size-5 ml-1"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="#48bb78"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                >
                                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                                  <polyline points="16 7 22 7 22 13"></polyline>
                                </svg>
                              </div>
                            </div>
                            <div class="space-y-2 ">
                              <div class="flex align-center items-center">
                                <p className="text-md font-medium ">
                                  Openings Near You:
                                </p>

                                <p
                                  className="ml-1 text-md text-gray-800 hover:text-gray-900 font-medium cursor-pointer hover:underline"
                                  onClick={() =>
                                    window.open(
                                      "https://www.indeed.com/jobs?q=class+a+cdl+driver&l=Minneapolis%2C+MN&from=searchOnDesktopSerp%2Cwhatautocomplete&vjk=cb01c123a1e663fa"
                                    )
                                  }
                                >
                                  2,490
                                </p>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke-width="1.25"
                                  stroke="currentColor"
                                  class="size-3 ml-1 hover:underline"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                                  />
                                </svg>
                              </div>
                            </div>

                            <div className="flex"></div>
                          </div>

                          <div class="space-y-2 mt-6 mb-4 ">
                            <label
                              for="dactmi"
                              class="block mb-2 text-lg font-medium text-gray-900 "
                            >
                              What you'll be doing
                            </label>
                            <div className="w-full prose prose-li  marker:text-black mb-4 ">
                              A Class A CDL Truck Driver operates large
                              vehicles, such as tractor-trailers, across local,
                              regional, or long-haul routes. They are
                              responsible for transporting goods efficiently and
                              safely while adhering to federal and state
                              regulations.
                            </div>
                          </div>

                          <div class="space-y-2 mt-6 mb-4">
                            <label
                              for="dactmi"
                              class="block mb-2 text-lg font-medium text-gray-800 "
                            >
                              Key Responsibilities
                            </label>

                            <div class="mb-4">
                              <ul className="list-disc px-3 ">
                                <li class="mt-1 text-gray-700">
                                  <p className="">
                                    <span className="font-medium mr-1">
                                      Driving and Transporting:
                                    </span>
                                    Operate tractor-trailers, tankers, or
                                    flatbed trucks to transport goods.
                                  </p>
                                </li>
                                <li class=" text-gray-700">
                                  <p className="">
                                    <span className="font-medium mr-1">
                                      Inspection and Maintenance:
                                    </span>
                                    Perform pre-trip and post-trip vehicle
                                    inspections to ensure safety compliance.
                                  </p>
                                </li>
                                <li class=" text-gray-700">
                                  <p className="">
                                    <span className="font-medium mr-1">
                                      Load Management:
                                    </span>
                                    Secure and manage cargo to prevent damage
                                    during transit.
                                  </p>
                                </li>
                                <li class=" text-gray-700">
                                  <p className="">
                                    <span className="font-medium mr-1">
                                      Documentation:
                                    </span>
                                    Maintain accurate records, including logs of
                                    hours driven and delivery receipts.
                                  </p>
                                </li>
                                <li class=" text-gray-700">
                                  <p className="">
                                    <span className="font-medium mr-1">
                                      Regulation Compliance:
                                    </span>
                                    Adhere to Department of Transportation (DOT)
                                    rules and safety standards, including HOS
                                    (Hours of Service) regulations.
                                  </p>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div class="space-y-2 mt-6 mb-4">
                            <label
                              for="dactmi"
                              class="block mb-2 text-lg font-medium text-gray-800 "
                            >
                              Qualifications
                            </label>

                            <div class="mb-4">
                              <ul className="list-disc px-3 ">
                                <li class="mt-1 text-gray-700">
                                  <p className="">
                                    <span className="font-medium mr-1">
                                      CDL Certification:
                                    </span>
                                    Obtain a Class A Commercial Driver's License
                                    (CDL) by completing: A truck driving program
                                    approved by the FMCSA (Federal Motor Carrier
                                    Safety Administration) CDL written and
                                    skills test (includes vehicle inspection and
                                    driving tests).
                                  </p>
                                </li>
                                <li class=" text-gray-700">
                                  <p className="">
                                    <span className="font-medium mr-1">
                                      Additional Requirements:
                                    </span>
                                    Minimum age: 18 for intrastate, 21 for
                                    interstate routes Clean driving record Pass
                                    a DOT physical and drug screening.
                                  </p>
                                </li>
                                <li class=" text-gray-700">
                                  <p className="">
                                    <span className="font-medium mr-1">
                                      Endorsements (optional):
                                    </span>
                                    Hazmat, Tanker, Doubles/Triples for
                                    specialized roles.
                                  </p>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </DrawerBody>
                <DrawerFooter>
                  <button
                    type="button"
                    class="py-3 px-6 inline-flex justify-center items-center gap-x-2 text-start bg-white hover:bg-gray-100 text-slate-800  lg:text-md font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300 "
                    data-hs-overlay="#hs-pro-datm"
                    // onClick={() => onOpen()}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                      />
                    </svg>
                    Save
                  </button>
                  <button
                    type="button"
                    class="py-2 px-8 inline-flex justify-center items-center gap-x-2 text-start bg-sky-400 hover:bg-sky-500 text-white lg:text-md font-medium rounded-lg shadow-sm align-middle  focus:outline-none focus:ring-1 focus:ring-blue-300 "
                    data-hs-overlay="#hs-pro-datm"
                    // onClick={() => onOpen()}
                  >
                    Get Started
                  </button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          ) : null}
        </>
      </foreignObject>
    </>
  );

  const nodeSize = { x: 200, y: 200 };
  //   const foreignObjectProps = { width: nodeSize.x, height: nodeSize.y, x: -75 };
  const foreignObjectProps = {
    width: nodeSize.x + 100,
    height: nodeSize.y + 70,
    x: -80,
  };
  const nodeSeparation = {
    siblings: 2.5,
  };

  //almost all code for centering the tree comes from amberv0 2/13/2021 https://github.com/bkrem/react-d3-tree/issues/272

  return (
    <div ref={treeContainerRef} style={{ height: "75vh", width: "100vw" }}>
      <Tree
        separation={nodeSeparation}
        translate={treeTranslate}
        data={orgChart}
        collapsible={false}
        zoomable={false}
        draggable={false}
        orientation="vertical"
        depthFactor={-300}
        pathClassFunc={() => "custom-link"}
        onNodeClick={handleClick}
        renderCustomNodeElement={(rd3tProps) =>
          renderForeignObjectNode({ ...rd3tProps, foreignObjectProps })
        }
      />
    </div>
  );
};

export default TreeTest;
