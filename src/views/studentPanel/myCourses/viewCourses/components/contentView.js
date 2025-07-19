/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/iframe-has-title */
import axiosInstance from "apiServices/axiosInstance";
import "assets/styles/components/_custom-doc-viewer.css";
import { Button, Spinner } from "components/ui";
import { useEffect, useState } from "react";
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

  const isPptx =
    url.toLowerCase().endsWith(".pptx") || url.toLowerCase().endsWith(".ppt");

  const getSrcURL = (url) => {
    if (isPptx) {
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
        url
      )}`;
    }
    return `https://docs.google.com/viewer?url=${encodeURIComponent(
      url
    )}&embedded=true`;
  };

  return (
    <>
      <div
        className="doc-viwer-container"
        style={{
          position: "relative",
          width: "100%",
          height: "calc(100vh - 200px)"
        }}
      >
        {isLoading && (
          <div className="flex justify-center items-center h-full w-full absolute z-10">
            <Spinner className="mr-4" size="40px" />
          </div>
        )}
        <iframe
          src={getSrcURL(secureUrl)}
          width="100%"
          height="100%"
          style={{
            border: "none",
            backgroundColor: "white",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
          onLoad={() => setIsLoading(false)}
        />

        <div className="ppt-viewer-overlay"></div>
        <div className="doc-viwer-overlay"></div>
      </div>
    </>
  );
};
const AssessmentView = ({ contentData }) => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [apiFlag, setApiFlag] = useState(false);
  const [assessmentData, setAssessmentData] = useState();
  const [trackingData, setTrackingData] = useState();
  const fetchAssessmentData = async () => {
    try {
      const response = await axiosInstance.get(
        `student/assessment/${contentData.id}`
      );
      if (response.success) {
        setAssessmentData(response.data);
        setTrackingData(response.data.trackingData);

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
      <h2 className="text-xl font-semibold text-gray-800 mb-2 capitalize">
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

              if (info.type === "quiz") {
                const trackingQuizData =
                  assessmentData.trackingQuizData?.filter(
                    (data) => data.quizId === content._id
                  );
                return (
                  <div
                    key={content?._id}
                    className={`text-base font-medium rounded-lg mt-2 ${
                      trackingQuizData?.length
                        ? "bg-blue-100 border-2 border-blue-500"
                        : "border-2 border-blue-500"
                    } flex p-4 px-6 items-center justify-between`}
                  >
                    <div>
                      <h3>{content.title}</h3>
                      <div className="flex gap-4 mt-2 text-lg">
                        <p>TotalMarks : {content.totalMarks}</p>
                        <p>TotalQuestions : {content.questionsLength}</p>
                      </div>
                    </div>
                    <div>
                      {trackingQuizData?.length ? (
                        <>
                          <Button
                            variant="solid"
                            onClick={() => {
                              navigate("/app/student/attempted-coding-exercises");
                            }}
                          >
                            Result
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="twoTone"
                          onClick={() => {
                            const url = `${
                              window.location.href.split("app")[0]
                            }app/student/${assessmentData?._id}/exercise/${
                              content?._id
                            }`;
                            window.open(url, "_blank");
                          }}
                          className="border border-blue-500"
                        >
                          Quiz Start
                        </Button>
                      )}
                    </div>
                  </div>
                );
              }
              if (info.type === "exercise") {
                const trackingExerciseData =
                  assessmentData?.trackingExerciseData?.filter(
                    (data) => data.exerciseId === content._id
                  );
                return (
                  <div
                    key={content?._id}
                    className={`mb-4 text-base font-medium rounded-lg mt-2 ${
                      trackingExerciseData?.length
                        ? "bg-blue-100 border-2 border-blue-500"
                        : "border-2 border-blue-500"
                    } flex p-4 px-6 items-center justify-between`}
                  >
                    <div>
                      <h3>{content.title}</h3>
                      <div className="flex gap-4 mt-2 text-lg">
                        <p>TotalMarks : {content.totalMarks}</p>
                        <p>TotalQuestions : {content.questions.length}</p>
                      </div>
                    </div>
                    <div>
                      {trackingExerciseData?.length ? (
                        <>
                          <Button
                            variant="solid"
                            onClick={() => {
                              navigate("/app/student/attempted-coding-exercises");
                            }}
                          >
                            Result
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="twoTone"
                          onClick={() => {
                            const url = `${
                              window.location.href.split("app")[0]
                            }app/student/${assessmentData?._id}/exercise/${
                              content?._id
                            }`;
                            window.open(url, "_blank");
                          }}
                          className="border border-blue-500"
                        >
                          Start
                        </Button>
                      )}
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
          <div className="flex justify-center items-center h-full w-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              No Content Available
            </h2>
          </div>
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
    setApiFlag
  } = props;
  const { courseId } = useParams();
  const themeColor = useSelector((state) => state?.theme?.themeColor);
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
            : activeContent?.contentId
        }
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
            contentId: nextContent.id
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
      <div className="w-full flex flex-col h-screen bg-white">
        <div className="flex justify-start gap-4 items-center bg-blue-600 p-[1.12rem] shadow-customheader">
          <button className="text-gray-700" onClick={toggleSidebar}>
            {isSidebarOpen ? (
              <Button
                shape="circle"
                size="sm"
                variant="twoTone"
                icon={<HiOutlineArrowLeft size={25} />}
              />
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

        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-6 hidden-scroll">
            {currentContentIndex >= 0 &&
            contentData?.length &&
            contentData[currentContentIndex] ? (
              <ContentContainer
                contentData={contentData[currentContentIndex]}
              />
            ) : (
              <>
                <div className="flex justify-center items-center h-full w-full">
                  <p className="text-xl font-semibold text-gray-800 mb-2">
                    No Content Available
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="w-full flex justify-between bg-white p-4 px-6 shadow-customfooter">
          <Button
            variant="twoTone"
            className={`bg-${themeColor}-200`}
            onClick={() => {
              if (currentContentIndex > 0) {
                const previousContent = contentData[currentContentIndex - 1];
                setActiveContent({
                  lectureId: previousContent.lectureId,
                  contentId: previousContent.id
                });
              }
            }}
            disabled={currentContentIndex <= 0}
          >
            Previous
          </Button>
          <Button
            variant="solid"
            disabled={
              isLoading || currentContentIndex >= contentData.length - 1
            }
            onClick={() => {
              const currentContent = contentData[currentContentIndex];
              if (!currentContent.status) {
                updateTrackingRecode();
              } else {
                const nextContent = contentData[currentContentIndex + 1];
                if (nextContent?.id) {
                  setActiveContent({
                    lectureId: nextContent?.lectureId,
                    contentId: nextContent?.id
                  });
                } else {
                  navigate("app/student/courses");
                }
              }
            }}
          >
            {isLoading ? "Loading..." : "Next"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default ContentView;
