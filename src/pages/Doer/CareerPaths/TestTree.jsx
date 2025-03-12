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
import { getDoc, doc, snapshot } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { useUserStore } from "../Chat/lib/userStore";

import "./treeStyles.css"; // Custom CSS for thicker lines

import MachinistStarterDrawer from "./machinist_drawers/MachinistStarterDrawer";

import MaintenanceTechnicianDrawer from "./industrial_mechanic_drawers/MaintenanceTechnicianDrawer";
import MachineryMechanicDrawer from "./industrial_mechanic_drawers/MachineryMechanicDrawer";
import MachinerySpecialistDrawer from "./industrial_mechanic_drawers/MachinerySpecialistDrawer";
import MaintenanceSupervisorDrawer from "./industrial_mechanic_drawers/MaintenanceSupervisorDrawer";
import BusinessOwner from "./industrial_mechanic_drawers/BusinessOwner";
import MechanicStarterDrawer from "./industrial_mechanic_drawers/MechanicStarterDrawer";
import EntryLevelEquipmentOperatorDrawer from "./construction_equipment_operator_drawers/EntryLevelEquipmentOperatorDrawer";
import ExperiencedEquipmentOperatorDrawer from "./construction_equipment_operator_drawers/ExperiencedEquipmentOperatorDrawer";
import SpecializedEquipmentOperatorDrawer from "./construction_equipment_operator_drawers/SpecializedEquipmentOperatorDrawer";
import LeadOperatorForemanDrawer from "./construction_equipment_operator_drawers/LeadOperatorForemanDrawer";
import StarterDrawer from "./construction_equipment_operator_drawers/StarterDrawer";
import MyDrawer from "./MyDrawer";

const TestTree = ({ category }) => {
  const shouldRecenterTreeRef = useRef(true);
  const [treeTranslate, setTreeTranslate] = useState({ x: 0, y: 0 });
  const treeContainerRef = useRef(null);

  const { currentUser } = useUserStore();

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
        // x: dimensions.width / 2,
        x: dimensions.width / 2,
        y: dimensions.height - 50,
      });
    }
  }, []);

  const [newOrg, setNewOrg] = useState(null);
  const [drawers, setDrawers] = useState(null);

  useEffect(() => {
    if (category) {
    const docRef = doc(db, "Career Paths", category);
    getDoc(docRef).then((snapshot) => {
      console.log("new career path node", snapshot.data().nodes);
      setNewOrg(snapshot.data().nodes);
      // setDrawers(snapshot.data().drawers)
    }); }
  }, [category]);

  const [newNodes, setNewNodes] = useState(null);

  const [processedData, setProcessedData] = useState(null);

  useEffect(() => {
    if (newOrg) {
      // all credit Nick 4/21/22 https://stackoverflow.com/questions/71950276/create-hierarchy-from-flat-array-with-children-ids
      const nodemap = new Map(newOrg.map((n) => [n.attributes.id, n]));

      const tree = (node) => {
        nodemap.delete(node.attributes.id);
        return node.children.length
          ? {
              id: node.id,
              attributes: node.attributes,
              salary: node.salary,
              name: node.name,
              children: node.children.map((c) => tree(nodemap.get(c))),
            }
          : node;
      };

      let result = [];

      newOrg.forEach((node) => {
        if (nodemap.has(node.attributes.id)) result.push(tree(node));
      });

      console.log("bingo", result);

      setNewNodes(result);

      setProcessedData(preprocessNodeData(result));
    }
  }, [newOrg]);


  const [popOverVisible, setPopOverVisible] = useState(false);
  const [selectedNodeName, setSelectedNodeName] = useState(null);

  const handleClick = (x) => {
    setPopOverVisible(!popOverVisible);
    console.log("pspsps", popOverVisible, x);
    // handleOpenDrawer(x);
  };

  const [isHovering, setIsHovering] = useState(false);
  const handleMouseOver = (x) => {
    setSelectedNodeName(x);
    setIsHovering(true);
    console.log("mouser over");
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
    console.log("open drawer id", x);
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
        onMouseOut={() => handleMouseOut(nodeDatum.attributes.id)}
        onClick={() => handleOpenDrawer(nodeDatum.attributes.id)}
      >
        <>
          <div
            onMouseOver={() => handleMouseOver(nodeDatum.attributes.id)}
            className="z-50 w-[140px]  py-2 px-3 inline-flex items-center justify-center gap-x-2 text-md font-medium rounded-lg border border-transparent bg-sky-500 text-white hover:bg-sky-600"
            //  className="w-[100px]  py-1 px-2 inline-flex items-center justify-center gap-x-2 text-md font-medium rounded-full border border-sky-500 bg-white text-sky-500 hover:text-sky-600 hover:border-sky-600"
          >
            {nodeDatum.salary}
          </div>

          {/* hovering credit https://codesandbox.io/p/sandbox/react-hover-example-hooks-0to7u?file=%2Findex.js%3A34%2C3-41%2C11 */}
          {isHovering & (nodeDatum.attributes.id === selectedNodeName) ? (
            <>
              <div
                onMouseOver={() => handleMouseOver(nodeDatum.attributes.id)}
                onClick={() => handleOpenDrawer(nodeDatum.attributes.id)}
                class=" items-center  flex flex-col bg-white "
              >
                <div
                  onMouseOver={() => handleMouseOver(nodeDatum.attributes.id)}
                  class=" mt-2 items-center  flex flex-col bg-white border shadow-sm rounded-xl "
                >
                  <div class="p-2 md:p-2">
                    <h3 class=" font-bold text-gray-800 ">
                      {nodeDatum.attributes.jobTitle}
                    </h3>
                    <p className="text-sm">{nodeDatum.attributes.bullet1}</p>
                    {/* <div className="flex flex-row">
                      <p className="text-sm text-gray-800">Experience:</p>
                      <p className="ml-1 text-sm text-gray-600">
                        {nodeDatum.attributes.timeCommitment}
                      </p>
                    </div> */}
                    {/* <ul className="list-disc px-3 text-sm">
                      <li class="mt-1 text-gray-700">
                        <p className="text-sm">
                          {nodeDatum.attributes.bullet1}
                        </p>
                      </li>
                    </ul> */}
                    <a
                      class="w-full mt-2 py-1 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-sky-500 text-white hover:bg-sky-600 focus:outline-none focus:bg-blue-700 "
                      href="#"
                      onClick={() => handleOpenDrawer(nodeDatum.attributes.id)}
                    >
                      Explore path
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className="size-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m8.25 4.5 7.5 7.5-7.5 7.5"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </>
          ) : null}

          {nodeDatum.attributes.id === selectedNodeNameDrawer ? (
            <MyDrawer
              open={open}
              toggle={toggleModal}
              nodeId={nodeDatum.attributes.id}
              category={category}
              nodeData={nodeDatum}
            />
          ) : null}
        </>
      </foreignObject>
    </>
  );

  const nodeSize = { x: 200, y: 200 };

  //   const foreignObjectProps = { width: nodeSize.x, height: nodeSize.y, x: -75 };

  const foreignObjectProps = {
    width: nodeSize.x + 100,
    height: nodeSize.y,
    x: -70,
  };

  const nodeSeparation = {
    siblings: 2.5,
  };

  //almost all code for centering the tree comes from amberv0 2/13/2021 https://github.com/bkrem/react-d3-tree/issues/272

  const preprocessNodeData = (node, depth = 0, xPosition = 0) => {
    // Assign custom x and y coordinates based on depth and xPosition
    node.x = xPosition; // Custom horizontal position
    node.y = depth * 100; // Custom vertical spacing (200 is an example)

    if (node.children) {
      node.children.forEach((child, index) => {
        // Adjust xPosition for children (e.g., spacing them out horizontally)
        preprocessNodeData(child, depth + 50, xPosition + index * 100);
      });
    }
    console.log("here", node);
    return node;
  };

  // const processedData = preprocessNodeData(newNodes);

  const customPathFunc = (linkData) => {
    const { source, target } = linkData;
    // Increase the xOffset value to shift the line to the right
    const xOffset = 0;
    const yOffset = target.data.attributes?.yOffset || 0;
    return `M${source.x + xOffset},${source.y}
            C${source.x + xOffset},${(source.y + target.y) / 2 + yOffset}
             ${target.x + xOffset},${(source.y + target.y) / 2 - yOffset}
             ${target.x + xOffset},${target.y}`;
  };

  return (
    <div ref={treeContainerRef} className="h-dvh md:h-[860px] w-full">
      {newNodes && (
        <Tree
          separation={nodeSeparation}
          translate={treeTranslate}
          data={processedData}
          // data={orgChart}
          collapsible={false}
          zoomable={false}
          draggable={false}
          orientation="vertical"
          depthFactor={-200}
          // pathFunc={customPathFunc}
          pathClassFunc={() => "custom-link"}
          onNodeClick={handleClick}
          renderCustomNodeElement={(rd3tProps) =>
            renderForeignObjectNode({ ...rd3tProps, foreignObjectProps })
          }
        />
      )}
    </div>
  );
};

export default TestTree;
