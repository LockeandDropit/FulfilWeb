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
import CDLDriverDrawer from "./cdl_drawers/CDLDriverDrawer";
import HubManagerDrawer from "./cdl_drawers/HubManagerDrawer";
import OwnerOperatorDrawer from "./cdl_drawers/OwnerOperatorDrawer";
import CDLStarterDrawer from "./cdl_drawers/CDLStarterDrawer";

const CDLTree = () => {
  const shouldRecenterTreeRef = useRef(true);
  const [treeTranslate, setTreeTranslate] = useState({ x: 0, y: 0 });
  const treeContainerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true)



  useEffect(() => {
    if (treeContainerRef.current && shouldRecenterTreeRef.current) {
      shouldRecenterTreeRef.current = false;
      const dimensions = treeContainerRef.current.getBoundingClientRect();

      setTreeTranslate({
        x: dimensions.width / 2,
        // x: dimensions.width / 3,
        y: dimensions.height - 50,
      });


      // isLoading is here because the div ref to center the container is not set in time 
      // and results in a split second flash of the Start Here blue button on the left side of the screen.
      // sorry :/.
      setIsLoading(false)
    }

  }, []);


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
              
              yOffset: 20
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
            name: "$250k+/year",
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



  const [popOverVisible, setPopOverVisible] = useState(false);
  const [selectedNodeName, setSelectedNodeName] = useState(null);

  const handleClick = (x) => {
    setPopOverVisible(!popOverVisible);
    console.log("pspsps", popOverVisible, x);
    handleOpenDrawer(x);
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
const [open, setOpen] = useState(false)
const toggleModal = () => {
  setOpen(!open)
}
  const [selectedNodeNameDrawer, setSelectedNodeNameDrawer] = useState(null);

  const handleOpenDrawer = (x) => {
    setSelectedNodeNameDrawer(x);
    // onOpenDrawer();
    setOpen(!open)
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
          {nodeDatum.name === selectedNodeNameDrawer && selectedNodeNameDrawer === "Start Here" ? (
         <CDLStarterDrawer open={open} toggle={toggleModal}/>
          ) : nodeDatum.name === selectedNodeNameDrawer && selectedNodeNameDrawer === "$70k/year" ? (
         <CDLDriverDrawer open={open} toggle={toggleModal}/>
          ) : nodeDatum.name === selectedNodeNameDrawer && selectedNodeNameDrawer === "$120k/year" ? (
         <CDLDriverDrawer open={open} toggle={toggleModal}/>
          ) : nodeDatum.name === selectedNodeNameDrawer && selectedNodeNameDrawer === "$150k/year" ? (<HubManagerDrawer open={open} toggle={toggleModal}/>) 
        
        : nodeDatum.name === selectedNodeNameDrawer && selectedNodeNameDrawer === "$250k+/year" ? (<OwnerOperatorDrawer open={open} toggle={toggleModal}/>) : null}
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


  const preprocessNodeData = (node, depth = 0, xPosition = 0) => {
    // Assign custom x and y coordinates based on depth and xPosition
    node.x = xPosition; // Custom horizontal position
    node.y = depth * 200; // Custom vertical spacing (200 is an example)
  
    if (node.children) {
      node.children.forEach((child, index) => {
        // Adjust xPosition for children (e.g., spacing them out horizontally)
        preprocessNodeData(child, depth + 50, xPosition + index * 200);
      });
    }
    console.log("here", node)
    return node;
  };
  
  const processedData = preprocessNodeData(orgChart);

  // const customPathFunc = (linkData, orientation) => {
  //   const { source, target } = linkData;
  
  //   // Example of using offsets
  //   const xOffset = target.data.attributes?.xOffset || 0;
  //   const yOffset = target.data.attributes?.yOffset || 0;
  
  //   return `M${source.x},${source.y} 
  //           C${source.x + xOffset},${(source.y + target.y) / 2 + yOffset} 
  //           ${target.x - xOffset},${(source.y + target.y) / 2 - yOffset} 
  //           ${target.x},${target.y}`;
  // };




  return (
    <>

      <div ref={treeContainerRef} className="md:h-[calc(100vh*.75)] w-full">
        {isLoading ?  (<p></p>) : (
           <Tree
           separation={nodeSeparation}
           translate={treeTranslate}
           data={processedData}
           // data={orgChart}
           collapsible={false}
           zoomable={false}
           draggable={false}
           orientation="vertical"
           depthFactor={-300}
           // pathFunc={customPathFunc}
           pathClassFunc={() => "custom-link"}
           onNodeClick={handleClick}
           renderCustomNodeElement={(rd3tProps) =>
             renderForeignObjectNode({ ...rd3tProps, foreignObjectProps })
           }
         />
        )}
       
      </div>
      </>
    
  );
};

export default CDLTree;
