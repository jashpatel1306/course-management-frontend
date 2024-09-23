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
const ContentContainer = ({ contentData }) => {
  return (
    <>
      <div className="p-2 px-2">
        {contentData?.type === "file" && (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {contentData.title}
            </h2>
            <div className="text-lg text-gray-800 mb-2">
              <CommonViewer url={contentData.content} />
            </div>
          </>
        )}

        {!contentData?.type && (
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
    if (activeContent) {
      setCurrentContentIndex(
        contentData.findIndex(
          (content) =>
            // content.lectureId === activeContent?.lectureId &&
            content._id === activeContent
        )
      );
    }
  }, [activeContent]);
  console.log("currentContentIndex: ", contentData[currentContentIndex]);
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
              setActiveContent(previousContent._id);
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

              const nextContent = contentData[currentContentIndex + 1];
              console.log("nextContent:  ", nextContent);

              if (nextContent?._id) {
                setActiveContent(nextContent._id);
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
