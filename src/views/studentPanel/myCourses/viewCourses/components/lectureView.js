/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  HiCheckCircle,
  HiMinus,
  HiOutlineLockClosed,
  HiPlus,
} from "react-icons/hi";
import { Button } from "components/ui";
import { FaRegCircleCheck } from "react-icons/fa6";
import { FiPlayCircle } from "react-icons/fi";
import { useSelector } from "react-redux";
import { RiArticleFill } from "react-icons/ri";
import { FaFileAlt } from "react-icons/fa";
import { GrTest } from "react-icons/gr";

const LectureView = (props) => {
  const { data, setActiveContent, activeContent, contentData } = props;

  const [lectureOpenFlag, setLectureOpenFlag] = useState(
    activeContent.lectureId === data.id
      ? true
      : activeContent.lectureId === activeContent.contentId
      ? true
      : false
  );
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  // const [currentContentIndex, setCurrentContentIndex] = useState(null);
  useEffect(() => {
    if (activeContent?.contentId) {
      setLectureOpenFlag(
        activeContent.lectureId === data.id
          ? true
          : activeContent.lectureId === activeContent.contentId
          ? true
          : false
      );
      // const contentIndex = contentData.findIndex(
      //   (content) =>
      //     // content.lectureId === activeContent?.lectureId &&
      //     content.id === activeContent?.contentId
      // );
      // setCurrentContentIndex(contentIndex);
    }
  }, [activeContent?.lectureId, activeContent?.contentId]);
  return (
    <>
      <div className="bg-gray-50">
        <div className="flex justify-between items-center border-b-2  p-3 px-4 ">
          <div
            className={`flex gap-4 items-center ${
              activeContent.lectureId === data.id
                ? `text-${themeColor}-${primaryColorLevel}`
                : ""
            }`}
          >
            <p className="text-base font-medium w-64 line-clamp-1  capitalize">
              Lecture {data.lectureIndex + 1} : {data.title}
            </p>
            {/* <p className="text-xs">1 / 9</p> */}
          </div>
          <p
            className="text-lg font-semibold"
            onClick={() => {
              setLectureOpenFlag(!lectureOpenFlag);
            }}
          >
            {" "}
            {!lectureOpenFlag ? (
              <Button
                shape="circle"
                variant="plain"
                size="xs"
                className={` ${
                  activeContent.lectureId === data.id
                    ? `text-${themeColor}-${primaryColorLevel}`
                    : ""
                }`}
                icon={<HiPlus size={20} />}
              />
            ) : (
              <Button
                shape="circle"
                variant="plain"
                size="xs"
                className={` ${
                  activeContent.lectureId === data.id
                    ? `text-${themeColor}-${primaryColorLevel}`
                    : ""
                }`}
                icon={<HiMinus size={20} />}
              />
            )}
          </p>
        </div>
        {lectureOpenFlag && (
          <>
            {data.content?.map((content, index) => {
              const contentIndex = contentData.findIndex(
                (info) =>
                  // content.lectureId === activeContent?.lectureId &&
                  info.id === content?.id
              );
              const previousContent =
                contentData[contentIndex > 0 ? contentIndex - 1 : contentIndex];
         
              const readStatus = previousContent?.status ? true : false;
              // setReadStatus(previousContent?.status ? true : false);
              if (content.type === "content") {
                return (
                  <div
                    className={`flex justify-between items-center border-b-2  p-2 px-6 cursor-pointer ${
                      activeContent.contentId === content.id
                        ? `text-${themeColor}-${primaryColorLevel}`
                        : ""
                    }`}
                    onClick={() => {
                      if (readStatus) {
                        setActiveContent({
                          lectureId: data.id,
                          contentId: content.id,
                        });
                      }
                    }}
                  >
                    <div className="flex items-center">
                      {content.contentType === "video" ? (
                        <FiPlayCircle size={18} />
                      ) : content.contentType === "text" ? (
                        <RiArticleFill size={18} />
                      ) : (
                        <FaFileAlt size={18} />
                      )}
                      <p className="text-sm ml-2 w-56 line-clamp-1">
                        {content.title}
                      </p>
                    </div>
                    <p className="text-lg font-semibold">
                      {content.status ? (
                        <>
                          {" "}
                          <HiCheckCircle
                            className={`text-xl text-${themeColor}-${primaryColorLevel}`}
                          />
                        </>
                      ) : (
                        <>
                          {/* <FaRegCircleCheck /> */}

                          {!readStatus ? (
                            <HiOutlineLockClosed />
                          ) : (
                            <>
                              <FaRegCircleCheck />
                            </>
                          )}
                        </>
                      )}
                    </p>
                  </div>
                );
              }
              if (content.type === "assessment") {
                return (
                  <div
                    className={`flex justify-between items-center border-b-2  p-2 px-6 cursor-pointer ${
                      activeContent.contentId === content.id
                        ? `text-${themeColor}-${primaryColorLevel}`
                        : ""
                    }`}
                    onClick={() => {
                      if (readStatus) {
                        setActiveContent({
                          lectureId: content.id,
                          contentId: content.id,
                        });
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <GrTest size={18} />

                      <p className="text-base ml-2 w-56 line-clamp-1">
                        {content.title}
                      </p>
                    </div>
                    <p className="text-lg font-semibold">
                      {content.status ? (
                        <>
                        <HiCheckCircle
                          className={`text-xl mr-2 text-${themeColor}-${primaryColorLevel}`}
                        />
                        </>
                      ) : (
                        <>
                          {/* <FaRegCircleCheck /> */}

                          {!readStatus ? (
                            <HiOutlineLockClosed />
                          ) : (
                            <>
                              <FaRegCircleCheck />
                            </>
                          )}
                        </>
                      )}
                    </p>
                  </div>
                );
              }
            })}
          </>
        )}
      </div>
    </>
  );
};

export default LectureView;
