/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/iframe-has-title */
import { Button, Spinner } from "components/ui";
import React, { useEffect, useState } from "react";
import { HiOutlineArrowLeft, HiOutlineArrowRight } from "react-icons/hi";
import { useSelector } from "react-redux";
import "assets/styles/components/_custom-doc-viewer.css";

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
    return Array.from(array, (byte) =>
        ("0" + byte.toString(16)).slice(-2)
    ).join("");
};
const CommonViewer = ({ url }) => {
    const [isLoading, setIsLoading] = useState(true);
    const secureUrl = generateSecureUrl(url);

    const isPptx =
        url.toLowerCase().endsWith(".pptx") ||
        url.toLowerCase().endsWith(".ppt");

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
                    height: "calc(100vh - 200px)",
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
                        bottom: 0,
                    }}
                    onLoad={() => setIsLoading(false)}
                />

                <div className="ppt-viewer-overlay"></div>
                <div className="doc-viwer-overlay"></div>
            </div>
        </>
    );
};
const ContentContainer = ({ contentData }) => {
    return (
        <>
            <div className="h-full p-2 px-2">
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
    } = props;
    const themeColor = useSelector((state) => state?.theme?.themeColor);

    const [isLoading] = useState(false);

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
    return (
        <>
            <div className="w-full flex flex-col h-screen bg-white">
                <div className="flex justify-start gap-4 items-center bg-blue-600 p-[1.12rem] shadow-customheader">
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

                <div className="flex-1 overflow-hidden">
                    <div className="h-full overflow-y-auto p-6 hidden-scroll">
                        {currentContentIndex >= 0 ? (
                            <ContentContainer
                                contentData={contentData[currentContentIndex]}
                            />
                        ) : (
                            <div className="flex justify-center items-center h-full w-full">
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                    No Content Available
                                </h2>
                            </div>
                        )}
                    </div>
                </div>

                <div className="w-full flex justify-between bg-white p-4 px-6 shadow-customfooter">
                    <Button
                        variant="twoTone"
                        className={`bg-${themeColor}-200`}
                        onClick={() => {
                            if (currentContentIndex > 0) {
                                const previousContent =
                                    contentData[currentContentIndex - 1];
                                setActiveContent(previousContent._id);
                            }
                        }}
                        disabled={currentContentIndex <= 0}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="solid"
                        loading={isLoading}
                        disabled={isLoading || currentContentIndex >= contentData.length - 1}
                        onClick={() => {
                            const nextContent =
                                contentData[currentContentIndex + 1];
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
