import React, { useEffect, useState } from "react";
import SideBar from "./components/sideBar";
import ContentView from "./components/contentView";
import axiosInstance from "apiServices/axiosInstance";
import openNotification from "views/common/notification";
import { useParams } from "react-router-dom";
import { Spinner } from "components/ui";

const ViewCourses = () => {
  const { courseId } = useParams();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [apiFlag, setApiFlag] = useState(false);
  const [courseData, setCourseData] = useState([]);
  const [sidebarData, setSidebarData] = useState();
  const [contentData, setContentData] = useState();
  const [activeContent, setActiveContent] = useState(null);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(
        `instructor/instructor-courses/${courseId}`
      );
      if (response.success) {
        setCourseData(response.data);
        setSidebarData(response.data?.content);
        setContentData(response.data?.content);
        setActiveContent(response.data?.content[0]._id);
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
      <div className="flex h-screen">
        {isLoading ? (
          <div>
            {" "}
            <Spinner className="mr-4" size="40px" />
          </div>
        ) : (
          <>
            <SideBar
              isSidebarOpen={isSidebarOpen}
              sidebarData={sidebarData}
              setActiveContent={setActiveContent}
              activeContent={activeContent}
            />

            <ContentView
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
              contentData={sidebarData}
              courseName={courseData.courseName}
              setActiveContent={setActiveContent}
              activeContent={activeContent}
            />
          </>
        )}
      </div>
    </>
  );
};

export default ViewCourses;
