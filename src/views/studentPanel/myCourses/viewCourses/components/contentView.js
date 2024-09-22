import { Button } from "components/ui";
import React, { useState } from "react";
import ReactHtmlParser from "react-html-parser";
import ReactPlayer from "react-player";
import { HiOutlineArrowLeft, HiOutlineArrowRight } from "react-icons/hi";
const AssessmentContainer = () => {
  return (
    <>
      <div>assessmentContainer</div>
    </>
  );
};
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
  const secureUrl = generateSecureUrl(url);
  return (
    <>
      <iframe
        src={`https://docs.google.com/viewer?url=${encodeURIComponent(
          secureUrl
        )}&embedded=true`}
        width="100%"
        height="700px"
        style={{ border: "none" }}
      />
    </>
  );
};
const ContentContainer = ({ contentData }) => {
  return (
    <>
      <div className="p-2 px-2">
        {contentData.contentType === "text" && (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {contentData.title}
            </h2>
            <div className="text-lg text-gray-800 mb-2">
              {ReactHtmlParser(contentData.content)}
            </div>
          </>
        )}
        {contentData.contentType === "file" && (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {contentData.title}
            </h2>
            <div className="text-lg text-gray-800 mb-2">
              <CommonViewer url={contentData.content} />
            </div>
          </>
        )}
        {contentData.contentType === "video" && (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {contentData.title}
            </h2>
            <div className="text-lg text-gray-800 mb-2">
              {/* <ReactPlayer
                url={contentData.content}
                controls={true}
                // playing={playing}
                muted={true}
                // onPause={() => {
                //   setPlaying(!playing);
                // }}
                className="w-full h-full p-2"
              /> */}
              <video controls>
                <source src={contentData.content} type="video/mp4" />
              </video>
            </div>
          </>
        )}
      </div>
      <div className="flex justify-between mt-6">
        <Button variant="twoTone">Previous</Button>
        <Button variant="solid">Next</Button>
      </div>
    </>
  );
};
const ContentView = (props) => {
  const { isSidebarOpen, toggleSidebar, courseName, contentData } = props;
  console.log("courseName : ", courseName);
  console.log("contentData : ", contentData);
  return (
    <>
      <div className="flex-1 bg-white">
        <div className="flex justify-start gap-4 items-center bg-blue-600 p-[1.12rem]">
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
        <div className="p-6 max-h-[90vh] overflow-y-scroll hidden-scroll">
          <div className="">
            {contentData.map((info) => {
              return (
                <>
                  {info.type === "assessment" ? (
                    <>
                      <AssessmentContainer />
                    </>
                  ) : (
                    <>
                      <ContentContainer contentData={info} />
                    </>
                  )}
                </>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContentView;
