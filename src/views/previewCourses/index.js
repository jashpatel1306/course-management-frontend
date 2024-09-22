import React, { useEffect, useState } from "react";
import SideBar from "./components/sideBar";
import ContentView from "./components/contentView";
import axiosInstance from "apiServices/axiosInstance";
import openNotification from "views/common/notification";
import { useParams } from "react-router-dom";

const ViewCourses = () => {
  const { courseId } = useParams();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [apiFlag, setApiFlag] = useState(false);
  const [courseData, setCourseData] = useState([]);
  const [sidebarData, setSidebarData] = useState();
  const [contentData, setContentData] = useState();
  const [activeContent, setActiveContent] = useState({
    lectureId: null,
    contentId: null,
  });
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(
        `user/courses-preview/${courseId}`
      );
      if (response.success) {
        setCourseData(response.data);
        setSidebarData(response.data?.sidebarData);
        setContentData(response.data?.contentData);
        const firstContent = response.data?.contentData[0];
        setActiveContent({
          lectureId: firstContent?.lectureId,
          contentId: firstContent?.id,
        });
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
          <div>isLoading</div>
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
              contentData={contentData}
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
