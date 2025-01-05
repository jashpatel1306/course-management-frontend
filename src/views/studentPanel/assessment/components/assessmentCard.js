import React from "react";
import { useSelector } from "react-redux";
import {
  FaQuestionCircle,
  FaRegClock,
  FaCalendarAlt,
} from "react-icons/fa";
import { Button, Card } from "components/ui";
const formatDateRange = (startDate, endDate) => {
  // Create options for formatting
  const options = { day: "numeric", month: "short" };

  // Format the start and end dates
  const start = new Date(startDate).toLocaleDateString("en-GB", options);
  const end = new Date(endDate).toLocaleDateString("en-GB", options);

  // Combine the formatted dates
  return `${start} - ${end}`;
};
const AssessmentCard = ({ variant = "full", assessmentData }) => {
  
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );

  const cardClasses = ` border-2 border-${themeColor}-${primaryColorLevel} text-${themeColor}-${primaryColorLevel} rounded-xl shadow-lg ${
    variant === "full" ? "w-full" : "w-56"
  }`;

  return (
    <>
      <Card className={cardClasses}>
        <div
          className={`flex flex-col ${
            variant === "full" ? "md:flex-row md:justify-between" : ""
          }`}
        >
          <div className={`${variant === "full" ? "" : "mb-4"}`}>
            <div className="text-lg font-extrabold mb-2">
              {assessmentData?.assessmentId?.title}
            </div>
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
                  <span className="text-base font-semibold">
                    {assessmentData?.assessmentId?.totalQuestions} Questions
                  </span>
                </div>
                <div className="flex gap-4 items-center">
                  <div
                    className={`bg-white p-2 rounded-full shadow-md border-2 border-${themeColor}-${primaryColorLevel}`}
                  >
                    <FaRegClock
                      className={`text-xl text-${themeColor}-${primaryColorLevel}`}
                    />
                  </div>
                  <span className="text-base font-semibold">
                    {assessmentData?.assessmentId?.totalMarks} Marks
                  </span>
                </div>
                <div className="flex gap-4 items-center">
                  <div
                    className={`bg-white p-2 rounded-full shadow-md border-2 border-${themeColor}-${primaryColorLevel}`}
                  >
                    <FaCalendarAlt
                      className={`text-xl text-${themeColor}-${primaryColorLevel}`}
                    />
                  </div>
                  <span className="text-base font-semibold">
                    {formatDateRange(
                      assessmentData?.startDate,
                      assessmentData?.endDate
                    )}
                  </span>
                </div>
                {/* <div className="flex gap-4 items-center">
                  <div
                    className={`bg-white p-2 rounded-full shadow-md border-2 border-${themeColor}-${primaryColorLevel}`}
                  >
                    <FaUserFriends
                      className={`text-xl text-${themeColor}-${primaryColorLevel}`}
                    />
                  </div>
                  <span className="text-base font-semibold">
                    {assessmentData?.batches?.length} Batches
                  </span>
                </div> */}
              </div>
            </div>
          </div>
          <div className={`mt-4  gap-3 items-center`}>
            <Button
              size="sm"
              variant="solid"
              className=" px-2 "
              onClick={() => {
                // navigate(`/app/admin/assessment/form/${assessmentData._id}`, {
                //   state: assessmentData,
                // });
              }}
            >
              View
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
};

export default AssessmentCard;
