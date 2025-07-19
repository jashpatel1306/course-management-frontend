import { Card } from "components/ui";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import StudentList from "./components/studentList";
import axiosInstance from "apiServices/axiosInstance";
import openNotification from "views/common/notification";
import { CSVExport } from "./components/csvExport";

const Students = () => {
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const [exportData, setExportData] = useState([]);
  const [exportLoading, setExportLoading] = useState(false);
  const getExportfetchData = async () => {
    try {
      let formData = {
        pageNo: 1,
        perPage: 10000
      };
      const response = await axiosInstance.post(
        `user/course-completion-reports`,
        formData
      );
      if (response.success) {
        console.log("response.data : ", response.data);
        setExportData(response.data);

        setExportLoading(false);
      } else {
        openNotification("danger", response.message);
        setExportLoading(false);
      }
    } catch (error) {
      console.log("get-all-publicResult error:", error);
      openNotification("danger", error.message);
      setExportLoading(false);
    }
  };
  useEffect(() => {
    getExportfetchData();
  }, []);

  return (
    <>
      <Card className="mt-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between ">
          <h3
            className={`font-bold text-${themeColor}-${primaryColorLevel} dark:text-white`}
          >
            Course Completion Summary
          </h3>
          <div className="w-full md:w-auto flex justify-between md:justify-end gap-x-4 mt-2 md:mt-0">
            <CSVExport
              searchedData={exportData}
              exportLoading={exportLoading}
              fileName={"Course Completion Summary"}
            />
          </div>
        </div>
        <div>
          <StudentList />
        </div>
      </Card>
    </>
  );
};

export default Students;
