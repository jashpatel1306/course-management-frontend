import React, { useEffect, useState } from "react";
import SideBar from "./components/sideBar";
import ContentView from "./components/contentView";
import axiosInstance from "apiServices/axiosInstance";
import openNotification from "views/common/notification";

const ViewCourses = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [apiFlag, setApiFlag] = useState(false);
  const [courseData, setCourseData] = useState([]);
  const [sidebarData, setSidebarData] = useState();
  const [contentData, setContentData] = useState();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(
        `student/courses-sidebar-data/66eb0b0283414c5773e3999e/66eb0c5383414c5773e39a6b`
      );
      if (response.success) {
        setCourseData(response.data);
        setSidebarData(response.data.sidebarData);
        setContentData(response.data.contentData);
        setIsLoading(false);
      } else {
        openNotification("danger", response.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("get-all-course error:", error);
      openNotification("danger", error.message);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (apiFlag) {
      setApiFlag(false);
      setIsLoading(true);

      fetchData();
    }
  }, [apiFlag]);

  useEffect(() => {
    setApiFlag(true);
  }, []);
  return (
    <>
      {/* <div className="flex h-full">
        <div className="w-1/5 bg-red-100">
          <SideBar />
        </div>
        <div className="w-full bg-green-100">
         
        </div>
      </div> */}
      <div className="flex h-screen">
        {isLoading ? (
          <div>isLoading</div>
        ) : (
          <>
            <SideBar isSidebarOpen={isSidebarOpen} sidebarData={sidebarData} />

            <ContentView
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
              contentData={contentData}
              courseName={courseData.courseName}
            />
          </>
        )}
      </div>
    </>
  );
};

export default ViewCourses;
