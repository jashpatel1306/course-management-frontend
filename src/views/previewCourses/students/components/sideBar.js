import React, { useState } from "react";
import SectionView from "./sectionview";

const SideBar = (props) => {
  const { isSidebarOpen, sidebarData, setActiveContent, activeContent } = props;
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
                  />
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
