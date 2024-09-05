import { Button, Card, Switcher } from "components/ui";
import React, { useState } from "react";
import {
  HiArrowNarrowLeft,
  HiOutlinePencil,
  HiPlusCircle,
} from "react-icons/hi";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { IoIosArrowDown } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FaCheckCircle, FaFile, FaPlus, FaVideo } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import { RiArticleFill } from "react-icons/ri";

const CourseContentForm = () => {
  const navigate = useNavigate();
  const { course_id } = useParams();
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const [sectionOpenFlag, setSectionOpenFlag] = useState(false);
  const [sectionData, setSectionData] = useState([]);
  return (
    <>
      <div className="flex items-center mb-4">
        <div className="text-xl font-semibold text-center mr-4">
          <Button
            className={`back-button px-1 font-bold text-${themeColor}-${primaryColorLevel} border-2 border-${themeColor}-${primaryColorLevel} dark:text-white`}
            size="sm"
            icon={<HiArrowNarrowLeft size={30} />}
            onClick={async () => {
              navigate("/app/admin/colleges");
            }}
          />
        </div>
        <h4
          className={`text-2xl font-semibold text-${themeColor}-${primaryColorLevel} dark:text-white`}
        >
          Course Content Details
        </h4>
      </div>

      <Card>
        <div className="flex justify-between items-center">
          <div
            className={`text-lg font-bold text-${themeColor}-${primaryColorLevel} dark:text-white`}
          >
            Bachelor of Visual Communication (B.V.C)
          </div>
          <Button
            variant="twoTone"
            icon={<HiOutlinePencil />}
            className={`border border-${themeColor}-${primaryColorLevel}`}
            onClick={async () => {
              navigate("/app/student/quiz");
            }}
          >
            <span>Edit</span>
          </Button>
        </div>
      </Card>

      <Card className="mt-4 bg-white">
        <div
          className={`flex justify-between items-center text-${themeColor}-${primaryColorLevel} text-lg font-semibold `}
        >
          <div className="flex justify-start items-center gap-2 ">
            <div>
              <IoIosArrowDown
                className={`${sectionOpenFlag ? "transform rotate-180" : ""}`}
                size={25}
                onClick={() => {
                  setSectionOpenFlag(!sectionOpenFlag);
                }}
              />
            </div>
            <div>Section 1 :</div>
            {/* <FaFile /> */}

            <div
              className="flex capitalize gap-4 items-center"
              onClick={() => {}}
            >
              Introduction to Visual Communication
              <div>
                <HiOutlinePencil />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div>
              Publish
              {/* Unpublish OR  */}
            </div>
            <Switcher defaultChecked />
          </div>
        </div>
        {sectionOpenFlag ? (
          <>
            <div className="m-6 mx-8">
              <div className="mt-4  bg-gray-100 border-2 border-gray-300 rounded-lg">
                <div className="bg-white w-full rounded-lg ">
                  <div
                    className={`flex justify-between items-center text-lg font-semibold gap-2 px-3 p-3`}
                  >
                    <div className="flex items-center gap-2">
                      <FaCheckCircle />

                      <div>Lecture 1 :</div>

                      <FaFile />

                      <div
                        className="flex capitalize gap-4 items-center"
                        onClick={() => {}}
                      >
                        Introduction for Course
                        <div className="flex items-center gap-4">
                          <MdEdit />
                          <MdDelete />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center items-center gap-4 ">
                      <Button
                        size="sm"
                        variant="plain"
                        className={`text-base hover:bg-${themeColor}-100 bg-gray-50 border-2 border-gray-400 rounded-lg  `}
                        icon={<HiPlusCircle size={20} />}
                        onClick={() => {
                          // setIsOpen(true);
                        }}
                      >
                        <span>Add Content</span>
                      </Button>
                      <IoIosArrowDown
                        className={`${
                          sectionOpenFlag ? "transform rotate-180" : ""
                        }`}
                        size={25}
                        onClick={() => {
                          setSectionOpenFlag(!sectionOpenFlag);
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-center bg-gray-100 rounded-b-lg p-4 w-full">
                    <div className="w-1/2 flex flex-col justify-center gap-y-4  items-center border-2 border-dashed border-gray-500  py-4 px-4 bg-gray-200 rounded-lg">
                      
                        <p className="text-gray-500 text-lg">
                          Select the main type of content. Files and links can
                          be added as resources.
                        </p>
                        <div className="flex justify-center gap-4 ">
                          {/* Video Button */}
                          <div className="border-2 border-gray-500 rounded-md flex flex-col items-center w-18 h-18 bg-white">
                            <div className="flex-grow flex justify-center items-center p-3 px-4 ">
                              <FaVideo size={25} />
                            </div>
                            <div className="bg-gray-400 w-full text-center py-1  text-white px-4 rounded-b-sm">
                              Video
                            </div>
                          </div>

                          {/* Article Button */}
                          <div className="border-2 border-gray-500 rounded-md flex flex-col items-center w-18 h-18 bg-white">
                            <div className="flex-grow flex justify-center items-center p-3 px-4 ">
                              <RiArticleFill size={25} />
                            </div>
                            <div className="bg-gray-400 w-full text-center py-1 text-white px-4 rounded-b-sm">
                              Article
                            </div>
                          </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <Button
                size="md"
                variant="plain"
                className={`text-lg hover:bg-${themeColor}-100 bg-gray-50 border-2 border-dashed border-gray-400 rounded-lg  `}
                icon={<HiPlusCircle size={20} />}
                onClick={() => {
                  // setIsOpen(true);
                }}
              >
                <span>Add Lecture</span>
              </Button>
            </div>
          </>
        ) : (
          <></>
        )}
      </Card>

      <Card className="mt-4">
        <div
          className={`flex justify-center p-2 text-${themeColor}-${primaryColorLevel} border-2 border-dashed border-gray-400 rounded-lg  bg-gray-50`}
        >
          <div>
            <Button
              size="md"
              variant="plain"
              className={`text-${themeColor}-${primaryColorLevel} text-lg hover:bg-${themeColor}-100`}
              icon={<HiPlusCircle size={20} />}
              onClick={() => {
                // setIsOpen(true);
              }}
            >
              <span>Add New Section</span>
            </Button>
            {/* <Button
              size="md"
              variant="plain"
              className={`text-${themeColor}-${primaryColorLevel} text-lg hover:bg-${themeColor}-100`}
              icon={<HiPlusCircle size={20} />}
              onClick={() => {}}
            >
              <span>Coding Exercise</span>
            </Button> */}
          </div>
        </div>
      </Card>
    </>
  );
};

export default CourseContentForm;
