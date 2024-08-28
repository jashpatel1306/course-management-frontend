import React from "react";
import { useSelector } from "react-redux";
import {
    FaQuestionCircle,
    FaRegClock,
    FaUserFriends,
    FaCalendarAlt,
  } from "react-icons/fa";
import { Button, Card } from "components/ui";
const AssessmentCard = ({ variant = "full" }) => {
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );

  const cardClasses = ` border-2 border-${themeColor}-${primaryColorLevel} text-${themeColor}-${primaryColorLevel} rounded-xl shadow-lg ${
    variant === "full" ? "w-full" : "w-56"
  }`;

  return (
    <Card className={cardClasses}>
      <div
        className={`flex flex-col ${
          variant === "full" ? "md:flex-row md:justify-between" : ""
        }`}
      >
        <div className={`${variant === "full" ? "" : "mb-4"}`}>
          <div className="text-lg font-extrabold mb-2">CS Python - 12</div>
          <div
            className={`flex flex-col md:flex-row gap-3 justify-between items-center`}
          >
            <div
              className={`${
                variant === "full"
                  ? "flex flex-row gap-6 items-center"
                  : "flex flex-col mb-4 gap-y-2 "
              } `}
            >
              <div className="flex gap-4 items-center">
                <div
                  className={`bg-white p-2 rounded-full shadow-md border-2 border-${themeColor}-${primaryColorLevel}`}
                >
                  <FaQuestionCircle
                    className={`text-xl text-${themeColor}-${primaryColorLevel}`}
                  />
                </div>
                <span className="text-base font-semibold">30 Questions</span>
              </div>
              <div className="flex gap-4 items-center">
                <div
                  className={`bg-white p-2 rounded-full shadow-md border-2 border-${themeColor}-${primaryColorLevel}`}
                >
                  <FaRegClock
                    className={`text-xl text-${themeColor}-${primaryColorLevel}`}
                  />
                </div>
                <span className="text-base font-semibold">150 Marks</span>
              </div>
              <div className="flex gap-4 items-center">
                <div
                  className={`bg-white p-2 rounded-full shadow-md border-2 border-${themeColor}-${primaryColorLevel}`}
                >
                  <FaCalendarAlt
                    className={`text-xl text-${themeColor}-${primaryColorLevel}`}
                  />
                </div>
                <span className="text-base font-semibold">20/6/2024</span>
              </div>
              <div className="flex gap-4 items-center">
                <div
                  className={`bg-white p-2 rounded-full shadow-md border-2 border-${themeColor}-${primaryColorLevel}`}
                >
                  <FaUserFriends
                    className={`text-xl text-${themeColor}-${primaryColorLevel}`}
                  />
                </div>
                <span className="text-base font-semibold">12 Batches</span>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`mt-4 md:mt-0 items-center gap-3  ${
            variant === "full"
              ? "flex flex-col justify-center"
              : "flex justify-center md:justify-start"
          }`}
        >
          <Button
            size="sm"
            block={variant !== "full"}
            variant="solid"
            className=" md:w-auto py-2 rounded-lg font-semibold shadow-md mb-2 md:mb-0"
          >
            Assign
          </Button>
          <Button
            size="sm"
            block={variant !== "full"}
            className="md:w-auto py-2 rounded-lg font-semibold shadow-md"
          >
            View
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AssessmentCard;
