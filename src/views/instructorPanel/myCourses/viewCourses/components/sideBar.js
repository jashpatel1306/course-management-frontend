import React from "react";
import { useSelector } from "react-redux";
import { FaFileAlt } from "react-icons/fa";

const SideBar = (props) => {
  const { isSidebarOpen, sidebarData, setActiveContent, activeContent } = props;
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  console.log("sidebarData :", sidebarData);
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
              return (
                <div
                  className={`flex justify-between items-center cursor-pointer ${
                    index ? "border-b-2" : "border-y-2"
                  } ${
                    activeContent === info._id
                      ? `text-${themeColor}-${primaryColorLevel}`
                      : ""
                  } p-4 px-4 bg-gray-100`}
                  onClick={() => {
                    setActiveContent(info._id);
                  }}
                >
                  <div className={`flex items-center`}>
                    <FaFileAlt size={18} />
                    <p className="text-base font-medium ml-2 w-56 line-clamp-1">
                      {info.title}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default SideBar;
