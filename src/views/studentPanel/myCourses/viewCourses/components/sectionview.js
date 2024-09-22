import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import LectureView from "./lectureView";
const SectionView = (props) => {
  const { data } = props;
  const [sectionOpenFlag, setSectionOpenFlag] = useState(false);
  return (
    <>
      <div
        className={`flex justify-between items-center ${
          data.index + 1 ? "border-b-2" : "border-y-2"
        } p-4 px-4 bg-gray-100`}
      >
        <div className="flex flex-col">
          <p className="text-base font-semibold capitalize">
            Section {data.index + 1} : {data.title}
          </p>
        </div>
        <p className="text-lg font-semibold">
          {" "}
          <IoIosArrowDown
            className={`${sectionOpenFlag ? "transform rotate-180" : ""}`}
            size={25}
            onClick={() => {
              setSectionOpenFlag(!sectionOpenFlag);
            }}
          />
        </p>
      </div>
      {sectionOpenFlag && (
        <>
          {data.lectures?.map((info, index) => {
            if (info.type === "lecture") {
              return <LectureView data={info} />;
            }
          })}
        </>
      )}
    </>
  );
};

export default SectionView;
