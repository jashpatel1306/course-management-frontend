/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import moment from "moment";
import { CgExport } from "react-icons/cg";
import { Button } from "components/ui";
import { htmlToText } from "html-to-text";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
const convertToHHMM = (hours, minutes) => {
  const HH = String(hours).padStart(2, "0");
  const MM = String(minutes).padStart(2, "0");
  return `${HH}:${MM}`;
};
export const CSVExport = ({ searchedData, exportLoading, fileName }) => {
  const [row, setRow] = useState([]);
  useEffect(() => {
    if (searchedData && searchedData.length) {
      const csvData = [];
      for (let index = 0; index < searchedData.length; index++) {
        const info = searchedData[index];
        csvData.push([
          `${index + 1}`,
          `${info.userName}`,
          `${info.userEmail?.toLowerCase()}`,
          `${info.quizTitle}`,
          `${info?.correctAnswers} / ${info?.quizQuestionsLength}`,
          `${info?.wrongAnswers} / ${info?.quizQuestionsLength}`,
          `${info?.totalMarks} / ${info?.quizTotalMarks}`,
          `${(
            (Number(info?.totalMarks) / Number(info?.quizTotalMarks)) *
            100
          ).toFixed(2)}%`,
          `${Math.floor(info?.totalTime / 60)} / ${info?.quizTime}`
        ]);
      }
      setRow([
        [
          "Roll No",
          "Name",
          "Email",
          "Quiz Name",
          "Correct Answers",
          "Wrong Answers",
          "Total Marks",
          "Accuracy",
          "Total Time"
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
  console.log("row: ",row)
  return (
    <>
      <div>
        {/* <CSVLink data={row} filename="TrackHour.csv" asyncOnClick={true}>
          <Button
            variant="solid"
            block
            size="sm"
            icon={<CgExport />}
            loading={exportLoading}
          >
            
          </Button>
        </CSVLink> */}
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
