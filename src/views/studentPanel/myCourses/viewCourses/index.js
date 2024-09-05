import React from "react";
import SideBar from "./components/sideBar";
import ContentView from "./components/contentView";

const ViewCourses = () => {
  return (
    <>
      <div className="flex h-full">
        <div className="w-1/5 bg-red-100">
          <SideBar />
        </div>
        <div className="w-full bg-green-100">
          <ContentView />
        </div>
      </div>
    </>
  );
};

export default ViewCourses;
