import { Card } from "components/ui";
import React from "react";
import { useSelector } from "react-redux";

import StudentList from "./components/studentList";

const Students = () => {
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );

  return (
    <>
      <Card className="mt-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between ">
          <h3
            className={`font-bold text-${themeColor}-${primaryColorLevel} dark:text-white`}
          >
            Certificate Issuances{" "}
          </h3>
          <div className="w-full md:w-auto flex justify-between md:justify-end gap-x-4 mt-2 md:mt-0"></div>
        </div>
        <div>
          <StudentList />
        </div>
      </Card>
    </>
  );
};

export default Students;
