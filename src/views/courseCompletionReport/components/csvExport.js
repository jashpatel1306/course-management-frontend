/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { CgExport } from "react-icons/cg";
import { Button } from "components/ui";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
export const CSVExport = ({ searchedData, exportLoading, fileName }) => {
  const [row, setRow] = useState([]);
  useEffect(() => {
    if (searchedData && searchedData.length) {
      const csvData = [];
      for (let index = 0; index < searchedData.length; index++) {
        const info = searchedData[index];
        csvData.push([
          `${index + 1}`,
          `${info.name}`,
          `${info.email?.toLowerCase()}`,
          `${info?.collegeId ? info?.collegeName : "--"}`,
          `${info?.departmentName ? info?.departmentName : "--"}`,
          `${info?.batchId ? info?.batchName : "--"}`,
          `${info?.courseId ? info?.courseName : "--"}`,
          `${info?.trackingStatus ? "Enrolled" : "UnEnrolled"}`,
          ` ${
            info?.trackingStatus
              ? info?.totalcontent === 0
                ? "0%"
                : info?.trackingContent === 0
                ? "0%"
                : `${((info.trackingContent / info.totalcontent) * 100).toFixed(
                    2
                  )}%`
              : "--"
          }`,
          `${(
            (Number(info?.totalMarks) / Number(info?.quizTotalMarks)) *
            100
          ).toFixed(2)}%`,
          `${Math.floor(info?.totalTime / 60)} / ${info?.quizTime}`
        ]);
      }
      setRow([
        [
          "Sr No",
          "Name",
          "Email",
          "College Name",
          "Departments",
          "Batch Name",
          "Course Name",
          "Status",
          "Percentage"
        ],
        ...csvData
      ]);
    }
  }, [searchedData]);
  // const fileType =
  //   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToCSV = (apiData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(apiData);

    // Automatically set column widths
    const columnWidths = [];
    apiData.forEach((row) => {
      Object.keys(row).forEach((key, index) => {
        const cellLength = String(row[key]).length;
        columnWidths[index] = columnWidths[index] || 0;
        if (cellLength > columnWidths[index]) {
          columnWidths[index] = cellLength;
        }
      });
    });
    ws["!cols"] = columnWidths.map((width) => ({ width }));

    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
    });
    FileSaver.saveAs(data, fileName + fileExtension);
  };
  console.log("row: ", row);
  return (
    <>
      <div>
        <Button
          variant="solid"
          block
          size="sm"
          icon={<CgExport />}
          loading={exportLoading}
          onClick={(e) => exportToCSV(row, fileName)}
        >
          Export
        </Button>
      </div>
    </>
  );
};
