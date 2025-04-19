/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Table, Dialog, Button, Pagination, Card } from "components/ui";
import { TableRowSkeleton } from "components/shared";
import { IoInformation } from "react-icons/io5";
import axiosInstance from "apiServices/axiosInstance";
import DataNoFound from "assets/svg/dataNoFound";
import appConfig from "configs/app.config";
import openNotification from "views/common/notification";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { CSVExport } from "./csvExport";
import { FaEye } from "react-icons/fa";
import { formatTimestampToReadableDate } from "views/common/commonFuntion";

const { Tr, Th, Td, THead, TBody } = Table;

const columns = [
    "No",
    "Date",
    "correct Answers",
    "wrong Answers",
    "total Marks",
    "accuracy",
    "total Time	(Min)",
    "Details",
];

const PublicResultList = () => {
    const { quiz_id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const themeColor = useSelector((state) => state?.theme?.themeColor);
    const primaryColorLevel = useSelector(
        (state) => state?.theme?.primaryColorLevel
    );
    const [exportLoading, setExportLoading] = useState(false);
    const [exportData, setExportData] = useState([]);

    const [publicResultData, setPublicResultData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectObject, setSelectObject] = useState();
    const [isOpen, setIsOpen] = useState(false);

    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [apiFlag, setApiFlag] = useState(false);
    const [resultTitle, setResultTitle] = useState(
        `Result 0 - ${appConfig.pagePerData} of ${appConfig.pagePerData}`
    );
    const onPaginationChange = (val) => {
        setPage(val);
        setApiFlag(true);
    };

    const fetchData = async () => {
        try {
            let formData = {
                search: "",
                pageNo: page,
                perPage: appConfig.pagePerData,
            };
            const response = await axiosInstance.post(
                `user/quiz-results-by-quizid/${quiz_id}`,
                formData
            );
            if (response.success) {
                setPublicResultData(response.data);
                setTotalPage(
                    response.pagination.total
                        ? Math.ceil(
                              response.pagination.total / appConfig.pagePerData
                          )
                        : 0
                );
                const start = appConfig.pagePerData * (page - 1);
                const end = start + response.data?.length;
                setResultTitle(
                    `Result ${start + 1} - ${end} of ${
                        response.pagination.total
                    }`
                );
                setIsLoading(false);
            } else {
                openNotification("danger", response.message);
                setIsLoading(false);
            }
        } catch (error) {
            console.log("get-all-publicResult error:", error);
            openNotification("danger", error.message);
            setIsLoading(false);
        }
    };
    const getExportfetchData = async () => {
        try {
            let formData = {
                search: "",
                pageNo: page,
                perPage: 10000,
            };
            const response = await axiosInstance.post(
                `user/quiz-results-by-quizid/${quiz_id}`,
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
        if (apiFlag) {
            setApiFlag(false);
            setIsLoading(true);
            setExportLoading(true);
            getExportfetchData();
            fetchData();
        }
    }, [apiFlag]);

    useEffect(() => {
        setPage(1);
        setApiFlag(true);
    }, []);
    console.log("location?.state : ", location?.state);
    return (
        <>
            <Card className="mb-8">
                <div className="flex justify-between items-center gap-2 ">
                    <div className="flex gap-2 items-center">
                        <div className="text-xl font-semibold text-center mr-4">
                            <Button
                                className={`back-button px-1 font-bold text-${themeColor}-${primaryColorLevel} border-2 border-${themeColor}-${primaryColorLevel} dark:text-white`}
                                size="sm"
                                icon={<HiArrowNarrowLeft size={30} />}
                                onClick={async () => {
                                    navigate("/app/admin/public-link");
                                }}
                            />
                        </div>
                        <div
                            className={`text-xl font-bold text-${themeColor}-${primaryColorLevel} dark:text-white`}
                        >
                            Quiz : {location?.state?.quizName}
                        </div>
                    </div>
                    <div>
                        {" "}
                        <CSVExport
                            searchedData={exportData}
                            exportLoading={exportLoading}
                            fileName={location?.state?.quizName}
                        />
                    </div>
                </div>
            </Card>
            <Card bodyClass="p-3 sm:p-[1.25rem]">
                <div className="w-[50%] p-1">
                    <div
                        className={`w-full lg:w-[35%]  text-center rounded-lg font-bold bg-${themeColor}-50 text-${themeColor}-${primaryColorLevel} text-base
                dark:bg-gray-700 dark:text-white dark:border-white px-4 border border-${themeColor}-${primaryColorLevel} py-2 px-2 md:w-[100%] lg:w-[50%] xl:w-[40%] sm:w-[100%]`}
                    >
                        {resultTitle}
                    </div>
                </div>

                <div className="mt-2">
                    {isLoading ? (
                        <>
                            <Table>
                                <THead>
                                    <Tr>
                                        {columns?.map((item) => {
                                            return <Th key={item}>{item}</Th>;
                                        })}
                                    </Tr>
                                </THead>
                                <TableRowSkeleton columns={9} rows={10} />
                            </Table>
                        </>
                    ) : publicResultData && publicResultData?.length ? (
                        <>
                            <Table>
                                <THead>
                                    <Tr>
                                        {columns?.map((item) => {
                                            return <Th key={item}>{item}</Th>;
                                        })}
                                    </Tr>
                                </THead>
                                <TBody>
                                    {publicResultData?.map((item, key) => {
                                        return (
                                            <Tr
                                                key={item?._id}
                                                className="capitalize"
                                            >
                                                <Td>{key + 1}</Td>
                                                <Td>
                                                    {formatTimestampToReadableDate(
                                                        item?.createdAt
                                                    )}
                                                </Td>
                                                <Td>{`${item?.correctAnswers} / ${item?.totalQuestions}`}</Td>{" "}
                                                <Td>
                                                    {`${item?.wrongAnswers} / ${item?.totalQuestions}`}
                                                </Td>
                                                <Td>{`${item?.totalMarks} / ${item?.quizTotalMarks}`}</Td>
                                                <Td>
                                                    {(
                                                        (Number(
                                                            item?.totalMarks
                                                        ) /
                                                            Number(
                                                                item?.quizTotalMarks
                                                            )) *
                                                        100
                                                    ).toFixed(2)}
                                                    %
                                                </Td>
                                                <Td>
                                                    {Math.ceil(
                                                        item?.totalTime / 60
                                                    )}{" "}
                                                    / {item?.quizTime} min
                                                </Td>
                                                <Td>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            shape="circle"
                                                            variant="solid"
                                                            size="sm"
                                                            icon={
                                                                <IoInformation />
                                                            }
                                                            onClick={() => {
                                                                setSelectObject(
                                                                    item
                                                                );
                                                                setIsOpen(true);
                                                            }}
                                                        />
                                                        <Button
                                                            shape="circle"
                                                            variant="solid"
                                                            className="mr-2"
                                                            size="sm"
                                                            icon={<FaEye />}
                                                            onClick={() => {
                                                                const url = `${
                                                                    window.location.href.split(
                                                                        "app"
                                                                    )[0]
                                                                }app/student/quiz-result/${
                                                                    item?.trackingId
                                                                }`;
                                                                window.open(
                                                                    url,
                                                                    "_blank"
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                </Td>
                                            </Tr>
                                        );
                                    })}
                                </TBody>
                            </Table>

                            <div className="flex items-center justify-center mt-4">
                                {totalPage > 1 && (
                                    <Pagination
                                        total={totalPage}
                                        currentPage={page}
                                        onChange={onPaginationChange}
                                    />
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <DataNoFound />
                        </>
                    )}
                </div>
            </Card>
            <Dialog
                isOpen={isOpen}
                contentClassName="pb-0 px-0"
                onClose={() => {
                    setIsOpen(false);
                    // setApiFlag(true);
                }}
                onRequestClose={() => {
                    setIsOpen(false);
                    // setApiFlag(true);
                }}
            >
                {selectObject?.specificField ? (
                    <>
                        {" "}
                        <div className="px-6 pb-6">
                            <h5
                                className={`mb-4 text-${themeColor}-${primaryColorLevel}`}
                            >
                                Student Details
                            </h5>

                            <div className="w-full border border-[#ccc] p-[20px] w-[300px] rounded-lg bg-[#f9f9f9]">
                                {Object.entries(
                                    selectObject?.specificField
                                ).map(([key, value], index) => (
                                    <div
                                        className="mb-[10px] text-base"
                                        key={index}
                                    >
                                        <span className="mr-2 font-bold capitalize">
                                            {key}:
                                        </span>{" "}
                                        <span className="mr-2 font-bold capitalize">
                                            {value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <></>
                )}
            </Dialog>
        </>
    );
};

export default PublicResultList;
