import { Card } from "components/ui";
import React from "react";
import { useSelector } from "react-redux";

import AssessmentResult from "./components/assessmentResultList";

const Students = () => {
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );

  return (
    <>
      <Card className="mt-4" bodyClass="p-3 sm:p-[1.25rem]">
        <div className="flex items-center justify-between ">
          <div
            className={`text-xl font-bold text-${themeColor}-${primaryColorLevel} dark:text-white`}
          >
            Assessment Result Details
          </div>
          <div className="flex gap-x-4"></div>
        </div>
      </Card>
      <Card className="mt-6" bodyClass="p-3 sm:p-[1.25rem]">
        <AssessmentResult />
      </Card>
    </>
  );
};

export default Students;
