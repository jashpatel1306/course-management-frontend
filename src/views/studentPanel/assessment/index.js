import { Card } from "components/ui";
import React from "react";

import { useSelector } from "react-redux";

import AssessmentList from "./components/assessmentList";
const Assessment = () => {
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );

  return (
    <>
      <div>
        <AssessmentList />
      </div>
    </>
  );
};

export default Assessment;
