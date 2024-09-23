import React, { useState } from "react";
import SectionView from "./sectionview";
import { useSelector } from "react-redux";
import { HiCheckCircle } from "react-icons/hi";
import { FaRegCircleCheck } from "react-icons/fa6";
import { FaFileAlt } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { GrTest } from "react-icons/gr";

const SideBar = (props) => {
  const {
    isSidebarOpen,
    sidebarData,
    setActiveContent,
    activeContent,
    contentData,
  } = props;
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  return (
    <div
      className={`transition-all duration-100 z-10 ${
        isSidebarOpen ? "w-96 border-r-2" : "w-0"
      } h-full flex-shrink-0  bg-[#f9f9ff]   `}
    >
      {isSidebarOpen && (
        <>
          <div className="flex justify-between items-center p-4 py-5 z-10 ">
            <h2 className="font-bold text-2xl ">Course Content</h2>
          </div>
          <div className="max-h-[90vh] overflow-y-scroll hidden-scroll">
            {sidebarData?.map((info, index) => {
              if (info.type === "section") {
                return (
                  <SectionView
                    data={info}
                    setActiveContent={setActiveContent}
                    activeContent={activeContent}
                    contentData={contentData}
                  />
                );
              }
              if (info.type === "assessment") {
                return (
                  <div
                    className={`flex justify-between items-center cursor-pointer ${
                      index ? "border-b-2" : "border-y-2"
                    } ${
                      activeContent.contentId === info.id
                        ? `text-${themeColor}-${primaryColorLevel}`
                        : ""
                    } p-4 px-4 bg-gray-100`}
                    onClick={() => {
                      setActiveContent({
                        lectureId: info.id,
                        contentId: info.id,
                      });
                    }}
                  >
                    <div className={`flex items-center`}>
                      <GrTest size={18} />
                      <p className="text-base ml-2 w-56 line-clamp-1">
                        {info.title}
                      </p>
                    </div>
                    <p className="text-lg font-semibold">
                      {info.status ? (
                        <HiCheckCircle
                          className={`text-xl mr-2 text-${themeColor}-${primaryColorLevel}`}
                        />
                      ) : (
                        <>
                          <FaRegCircleCheck />
                        </>
                      )}
                    </p>
                  </div>
                );
              }
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default SideBar;
