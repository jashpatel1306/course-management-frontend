import axiosInstance from "apiServices/axiosInstance";
import { Button, Spinner } from "components/ui";
import React, { useEffect, useState } from "react";
import ReactHtmlParser from "react-html-parser";
import { HiOutlineArrowLeft, HiOutlineArrowRight } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import openNotification from "views/common/notification";
const generateSecureUrl = (pptUrl) => {
  const token = generateRandomToken(16); // Generate a 16-byte token
  const expiryTime = Date.now() + 3600000; // Token valid for 1 hour

  // Generate the secure URL
  const secureUrl = `${pptUrl}?token=${token}&expiry=${expiryTime}`;

  return secureUrl;
};

// Generate a random hex token using Web Crypto API
const generateRandomToken = (length) => {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, (byte) => ("0" + byte.toString(16)).slice(-2)).join(
    ""
  );
};
const CommonViewer = ({ url }) => {
  const [isLoading, setIsLoading] = useState(true);
  const secureUrl = generateSecureUrl(url);
  return (
    <>
      <div>
        {isLoading && (
          <div className="flex justify-center items-center h-96">
            <Spinner className="mr-4" size="40px" />
          </div>
        )}
        <iframe
          src={`https://docs.google.com/viewer?url=${encodeURIComponent(
            secureUrl
          )}&embedded=true`}
          width="100%"
          height="700px"
          style={{ border: "none", backgroundColor: "white" }}
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </>
  );
};
const AssessmentView = ({ contentData }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [apiFlag, setApiFlag] = useState(false);
  const [assessmentData, setAssessmentData] = useState();
  const fetchAssessmentData = async () => {
    try {
      const response = await axiosInstance.get(
        `student/assessment/${contentData.id}`
      );
      if (response.success) {
        setAssessmentData(response.data);

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

      fetchAssessmentData();
    }
  }, [apiFlag]);

  useEffect(() => {
    setApiFlag(true);
  }, []);
  return (
    <>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        {contentData.title}
      </h2>
      {isLoading ? (
        <>
          <Spinner className="mr-4" size="40px" />
        </>
      ) : (
        <>
          <div className="flex justify-between items-center p-2 mt-4 text-lg font-bold">
            <p className="bg-blue-700 text-white p-2 px-4 rounded-md">
              Total Questions : {assessmentData.totalQuestions}
            </p>
            <p className="bg-blue-700 text-white p-2 px-4 rounded-md">
              Total Marks : {assessmentData.totalMarks}
            </p>
          </div>

          <div>
            {assessmentData.content.map((info) => {
              const content = info.data;
              const trackingData = assessmentData.trackingData?.filter(
                (data) => data.quizId === content._id
              );
              if (info.type === "quiz") {
                return (
                  <div
                    key={content?._id}
                    className="text-base font-medium rounded-lg mt-2 bg-blue-200 flex p-4 px-6 items-center justify-between"
                  >
                    <div>
                      <h3>{content.title}</h3>
                      <div className="flex gap-4 mt-2 text-lg">
                        <p>TotalMarks : {content.totalMarks}</p>
                        <p>TotalQuestions : {content.questions.length}</p>
                      </div>
                    </div>
                    <div>
                      <Button
                        variant="solid"
                        onClick={() => {
                          const url = `${
                            window.location.href.split("app")[0]
                          }app/student/quiz/${content?._id}`;
                          window.open(url, "_blank");
                        }}
                      >
                        Quiz Start
                      </Button>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </>
      )}
      <div className="text-lg text-gray-800 mb-2"></div>
    </>
  );
};
const ContentContainer = ({ contentData }) => {
  return (
    <>
      <div className="p-2 px-2">
        {contentData?.contentType === "text" && (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {contentData.title}
            </h2>
            <div className="text-lg text-gray-800 mb-2">
              {ReactHtmlParser(contentData.content)}
            </div>
          </>
        )}
        {contentData?.contentType === "file" && (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {contentData.title}
            </h2>
            <div className="text-lg text-gray-800 mb-2">
              <CommonViewer url={contentData.content} />
            </div>
          </>
        )}
        {contentData?.contentType === "video" && (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {contentData.title}
            </h2>
            <div className="text-lg text-gray-800 mb-2">
              <video controls>
                <source src={contentData.content} type="video/mp4" />
              </video>
            </div>
          </>
        )}
        {contentData?.contentType === "assessment" && (
          <>
            <AssessmentView contentData={contentData} />
          </>
        )}
        {!contentData?.contentType && (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              same Course Content
            </h2>
          </>
        )}
      </div>
    </>
  );
};
const ContentView = (props) => {
  const {
    isSidebarOpen,
    toggleSidebar,
    courseName,
    contentData,
    setActiveContent,
    activeContent,
    setApiFlag,
  } = props;
  const { courseId } = useParams();
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [currentContentIndex, setCurrentContentIndex] = useState(null);
  useEffect(() => {
    if (activeContent?.contentId) {
      setCurrentContentIndex(
        contentData.findIndex(
          (content) =>
            // content.lectureId === activeContent?.lectureId &&
            content.id === activeContent?.contentId
        )
      );
    }
  }, [activeContent?.lectureId, activeContent?.contentId]);
  const updateTrackingRecode = async () => {
    try {
      setIsLoading(true);
      const apiData = {
        totalcontent: contentData.length,
        trackingContent: {
          contentId: activeContent?.contentId,
          lectureId: activeContent?.lectureId
            ? activeContent?.lectureId
            : activeContent?.contentId,
        },
      };
      const response = await axiosInstance.put(
        `student/course/tracking/${courseId}`,
        apiData
      );

      if (response.success) {
        if (
          response.data.totalcontent === response.data.trackingContent.length
        ) {
          navigate("app/student/courses");
        } else {
          const nextContent = contentData[currentContentIndex + 1];
          setActiveContent({
            lectureId: nextContent.lectureId,
            contentId: nextContent.id,
          });
        }

        setApiFlag(true);
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
  return (
    <>
      <div className="flex-1 relative bg-white">
        <div className="flex justify-start gap-4 items-center bg-blue-600 p-[1.12rem] shadow-customheader	">
          <button className="text-gray-700" onClick={toggleSidebar}>
            {isSidebarOpen ? (
              <>
                <Button
                  shape="circle"
                  size="sm"
                  variant="twoTone"
                  icon={<HiOutlineArrowLeft size={25} />}
                />
              </>
            ) : (
              <Button
                shape="circle"
                size="sm"
                variant="twoTone"
                icon={<HiOutlineArrowRight size={25} />}
              />
            )}
          </button>
          <h1 className="text-xl font-bold text-white capitalize">
            {courseName}
          </h1>
        </div>

        <div className="w-full max-h-[90vh] overflow-y-scroll hidden-scroll ">
          <div className="p-6">
            {currentContentIndex >= 0 && (
              <ContentContainer
                contentData={contentData[currentContentIndex]}
              />
            )}
          </div>
        </div>
        <div className="absolute bottom-0 w-full flex justify-between bg-white p-4 px-6 shadow-customfooter	">
          <Button
            variant="twoTone"
            className={`bg-${themeColor}-200`}
            onClick={() => {
              const previousContent = contentData[currentContentIndex - 1];
              setActiveContent({
                lectureId: previousContent.lectureId,
                contentId: previousContent.id,
              });
            }}
          >
            Previous
          </Button>
          <Button
            variant="solid"
            loading={isLoading}
            onClick={() => {
              const currentContent = contentData[currentContentIndex];
              console.log("currentContent:  ", currentContent);
              if (!currentContent.status) {
                updateTrackingRecode();
              } else {
                const nextContent = contentData[currentContentIndex + 1];
                if (nextContent?.id) {
                  setActiveContent({
                    lectureId: nextContent?.lectureId,
                    contentId: nextContent?.id,
                  });
                } else {
                  navigate("app/student/courses");
                }
              }
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default ContentView;
