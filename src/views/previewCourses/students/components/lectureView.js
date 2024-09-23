import React, { useState } from "react";
import {
  HiCheckCircle,
  HiMinus,
  HiPlus,
} from "react-icons/hi";
import { Button } from "components/ui";
import { FaRegCircleCheck } from "react-icons/fa6";
import { FiPlayCircle } from "react-icons/fi";
import { useSelector } from "react-redux";
import { RiArticleFill } from "react-icons/ri";
import { FaFileAlt } from "react-icons/fa";
const LectureView = (props) => {
  const { data, setActiveContent, activeContent } = props;

  const [lectureOpenFlag, setLectureOpenFlag] = useState(true);
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
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
            <p className="text-sm font-medium w-64 line-clamp-1  capitalize">
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
              if (content.type === "content") {
                return (
                  <div
                    className={`flex justify-between items-center border-b-2  p-2 px-4 cursor-pointer ${
                      activeContent.contentId === content.id
                        ? `text-${themeColor}-${primaryColorLevel}`
                        : ""
                    }`}
                    onClick={() => {
                      setActiveContent({
                        lectureId: data.id,
                        contentId: content.id,
                      });
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
                        <HiCheckCircle
                          className={`text-xl mr-2 text-${themeColor}-${primaryColorLevel}`}
                        />
                      ) : (
                        <>
                          <FaRegCircleCheck  />
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
