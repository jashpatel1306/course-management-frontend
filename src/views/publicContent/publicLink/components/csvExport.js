/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { CgExport } from "react-icons/cg";
import { Button } from "components/ui";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { formatTimestampToReadableDate } from "views/common/commonFuntion";

export const CSVExport = ({ searchedData, exportLoading, fileName }) => {
    const [row, setRow] = useState([]);
    const dynamicHeaders = new Set(); // To store dynamic keys for headers
    const sectionHeaders = new Set();

    useEffect(() => {
        if (searchedData && searchedData.length) {
            const csvData = [];
            for (let index = 0; index < searchedData.length; index++) {
                const info = searchedData[index];
                const row = [
                    `${index + 1}`, // Serial Number
                ];
                // csvData.push([
                //   `${index + 1}`,
                //   `${info?.createdAt}`,
                //   `${info?.correctAnswers}`,
                //   `${info?.wrongAnswers}`,
                //   `${info?.totalMarks}`,
                //   `${Math.ceil(info?.totalTime / 60)} Min`
                // ]);

                if (info.specificField) {
                    info.specificField = Object.keys(info?.specificField)
                        .sort() // sorts keys alphabetically
                        .reduce((acc, key) => {
                            acc[key] = info?.specificField[key];
                            return acc;
                        }, {});

                    Object.keys(info.specificField).forEach((key) => {
                        row.push(`${info.specificField[key] || ""}`);
                        dynamicHeaders.add(key); // Collect header names dynamically
                    });
                }

                if (info?.quizData?.quizzes && info?.quizData?.quizzes.length) {
                    for (let i = 0; i < info?.quizData?.quizzes.length; i++) {
                        const quiz = info?.quizData?.quizzes[i];
                        sectionHeaders.add(`Section${i + 1}`);
                        row.push(`${quiz.title}`);

                        // Add the total number of questions for each section
                        sectionHeaders.add(`Section${i + 1} TQ`);
                        row.push(`${quiz?.totalQuestions}`);

                        // Add the total number of correct answers for each section
                        sectionHeaders.add(`Section${i + 1} TC`);
                        row.push(`${quiz?.correctAnswers}`);

                        // Add the total number of wrong answers for each section
                        sectionHeaders.add(`Section${i + 1} TW`);
                        row.push(`${quiz?.wrongAnswers}`);

                        // Add the total marks for each section
                        sectionHeaders.add(`Section${i + 1} TM`);
                        row.push(`${quiz?.totalMarks}`);
                    }
                }

                row.push(`${formatTimestampToReadableDate(info?.createdAt)}`); // Date
                row.push(`${info?.quizData?.totalQuestions}`); // Total Questions
                row.push(`${info?.correctAnswers}`); // Correct Answers
                row.push(`${info?.wrongAnswers}`); // Wrong Answers
                row.push(`${info?.totalMarks} / ${info?.quizData?.totalMarks}`); // Total Marks
                row.push(
                    `${(
                        (Number(info?.totalMarks ?? 0) /
                            Number(info?.quizData?.totalMarks ?? 1)) *
                        100
                    ).toFixed(2)}%`
                ); // Accuracy
                row.push(`${Math.ceil(info?.totalTime / 60)} Min`); // Total Time)
                csvData.push(row);
            }
            const staticHeaders = [
                "Date",
                "Total Questions",
                "Correct Answers",
                "Wrong Answers",
                "Total Marks",
                "Accuracy",
                "Total Time	(Min)",
            ];
            const headers = ["No", ...dynamicHeaders, ...sectionHeaders, ...staticHeaders];

            setRow([headers, ...csvData]);
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
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        });
        FileSaver.saveAs(data, fileName + fileExtension);
    };
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
