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
import HVACApprenticeDrawer from "./hvac_drawers/HVACApprenticeDrawer";
import HVACTechnicianDrawer from "./hvac_drawers/HVACTechnicianDrawer";
import HVACSpecialistInstallerDrawer from "./hvac_drawers/HVACSpecialistInstallerDrawer";
import HVACSupervisorManagerDrawer from "./hvac_drawers/HVACSupervisorManagerDrawer";
import HVACEngineerDesignerDrawer from "./hvac_drawers/HVACEngineerDesignerDrawer";
import HVACBusinessOwner from "./hvac_drawers/HVACBusinessOwner";
import HVACStarterDrawer from "./hvac_drawers/HVACStarterDrawer";
import PlumberStarterDrawer from "./plumber_drawers/PlumberStarterDrawer";
import PlumberApprenticeDrawer from "./plumber_drawers/PlumberApprenticeDrawer";
import PlumberJourneymanDrawer from "./plumber_drawers/PlumberJourneymanDrawer";
import PlumberMasterDrawer from "./plumber_drawers/PlumberMasterDrawer";
import PlumberSpecialistDrawer from "./plumber_drawers/PlumberSpecialistDrawer";
import PlumberBusinessOwner from "./plumber_drawers/PlumberBusinessOwner";
import EntryLevelCarpenterDrawer from "./carpenter_drawers/CarpenterApprenticeDrawer";
import CarpenterApprenticeDrawer from "./carpenter_drawers/CarpenterApprenticeDrawer";
import CarpenterJourneymanDrawer from "./carpenter_drawers/CarpenterJourneymanDrawer";
import CarpenterMasterDrawer from "./carpenter_drawers/CarpenterMasterDrawer";
import CarpenterSpecialistDrawer from "./carpenter_drawers/CarpenterSpecialistDrawer";
import CarpenterBusinessOwner from "./carpenter_drawers/CarpenterBusinessOwner";
import CarpenterStarterDrawer from "./carpenter_drawers/CarpenterStarterDrawer";

const CarpenterTree = () => {
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
        name: "$35k/year",
        attributes: {
          jobTitle: "Carpenter Apprentice",
          bullet1: "Apprentices learn foundational carpentry skills while working under experienced professionals.",
          bullet2: "Learn to read blueprints and understand plumbing systems.",

          timeCommitment: "None, some education",
        },
        children: [
          {
            name: "$45k-60k/year",
            attributes: {
              jobTitle: "Journeyman Carpenter",
              bullet1:
                "Journeyman carpenters can work independently on construction, renovation, and finishing tasks.",
             
              timeCommitment: "3-4 years",

              yOffset: 20,
            },
            children: [
              {
              
                  name: "$70k-90k/year",
                  attributes: {
                    jobTitle: "Master Carpenter",
                    bullet1:
                      "Master carpenters are experts in the trade who lead teams, manage projects, and work on complex or high-value tasks.",
                   
                    timeCommitment: "7-10+ years",
      
                    yOffset: 20,
                  },
              },
            ],
          },

          {
              
            name: "$55k-75k/year",
            attributes: {
              jobTitle: "Specialist Roles",
              bullet1:
                "Finish Carpentry, Framing Carpentry, Cabinetmaking, Commercial.",
             
              timeCommitment: "5+ years ",

              yOffset: 20,
            },
        },
          {
            name: "$80k-150k+/year",
            attributes: {
              jobTitle: "Business Owner/Contractor",
              bullet1: "Carpenters with entrepreneurial skills may start their own construction or carpentry businesses, taking on large-scale contracts or custom projects.",
              bullet2:
                "Provide quotes, bid on contracts, and oversee large-scale plumbing installations.",
              timeCommitment: "5+ years (reccomended)",
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
  const [open, setOpen] = useState(false);
  const toggleModal = () => {
    setOpen(!open);
  };
  const [selectedNodeNameDrawer, setSelectedNodeNameDrawer] = useState(null);

  const handleOpenDrawer = (x) => {
    setSelectedNodeNameDrawer(x);
    // onOpenDrawer();
    setOpen(!open);
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
          {nodeDatum.name === selectedNodeNameDrawer &&
          selectedNodeNameDrawer === "Start Here" ? (
            <CarpenterStarterDrawer open={open} toggle={toggleModal} />
          ) : nodeDatum.name === selectedNodeNameDrawer &&
            selectedNodeNameDrawer === "$35k/year" ? (
            <CarpenterApprenticeDrawer open={open} toggle={toggleModal} />
          ) : nodeDatum.name === selectedNodeNameDrawer &&
            selectedNodeNameDrawer === "$45k-60k/year" ? (
            <CarpenterJourneymanDrawer open={open} toggle={toggleModal} />
          ) : nodeDatum.name === selectedNodeNameDrawer &&
            selectedNodeNameDrawer === "$70k-90k/year" ? (
            <CarpenterMasterDrawer open={open} toggle={toggleModal} />
          ) : nodeDatum.name === selectedNodeNameDrawer &&
            selectedNodeNameDrawer === "$55k-75k/year" ? (
            <CarpenterSpecialistDrawer open={open} toggle={toggleModal} />
          ) : nodeDatum.name === selectedNodeNameDrawer &&
            selectedNodeNameDrawer === "$80k-150k+/year" ? (
            <CarpenterBusinessOwner open={open} toggle={toggleModal} />
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
    siblings: 1.5,
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
    console.log("here", node);
    return node;
  };

  const processedData = preprocessNodeData(orgChart);

  // const customPathFunc = (linkData, orientation) => {
  //   const { source, target } = linkData;
  // Example of using offsets

  //   const xOffset = target.data.attributes?.xOffset || 0;
  //   const yOffset = target.data.attributes?.yOffset || 0;

  //   return `M${source.x},${source.y}
  //           C${source.x + xOffset},${(source.y + target.y) / 2 + yOffset}
  //           ${target.x - xOffset},${(source.y + target.y) / 2 - yOffset}
  //           ${target.x},${target.y}`;
  //  };

  return (
    <div ref={treeContainerRef} className="md:h-[860px] w-full">
      <Tree
        separation={nodeSeparation}
        translate={treeTranslate}
        data={processedData}
        // data={orgChart}
        collapsible={false}
        zoomable={false}
        draggable={false}
        orientation="vertical"
        depthFactor={-260}
        // pathFunc={customPathFunc}
        pathClassFunc={() => "custom-link"}
        onNodeClick={handleClick}
        renderCustomNodeElement={(rd3tProps) =>
          renderForeignObjectNode({ ...rd3tProps, foreignObjectProps })
        }
      />
    </div>
  );
};

export default CarpenterTree;
