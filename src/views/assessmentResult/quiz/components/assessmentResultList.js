/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Table, Button, Pagination, Select, Switcher } from "components/ui";
import { TableRowSkeleton } from "components/shared";
import axiosInstance from "apiServices/axiosInstance";
import DataNoFound from "assets/svg/dataNoFound";
import appConfig from "configs/app.config";
import openNotification from "views/common/notification";
import { useDebounce } from "use-debounce";
import { useSelector } from "react-redux";
import { SUPERADMIN } from "constants/roles.constant";
import { FaEye } from "react-icons/fa";
import { CSVExport } from "./exportTasks";

const { Tr, Th, Td, THead, TBody } = Table;

const columns = [
  "Roll No",
  "Name",
  "Email",
  "quiz Name",
  "correct Answers	",
  "wrong Answers	",
  "total Marks	",
  "accuracy",
  "total Time	(Min)",
  "Result Visibility",
  "Active"
];

const AssessmentResult = (props) => {
  const { flag, refreshFlag } = props;
  const { userData } = useSelector((state) => state.auth.user);

  const { collegeId } = useSelector((state) => state.auth.user.userData);
  const [currentCollegeTab, setCurrentCollegeTab] = useState(collegeId);
  const [currentBatchTab, setCurrentBatchTab] = useState(null);
  const [currentAssessmentTab, setCurrentAssessmentTab] = useState(null);
  const [resultData, setResultData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText] = useState("");
  const [debouncedText] = useDebounce(searchText, 1000);
  const [batchLoading, setBatchLoading] = useState(false);

  const [batchList, setBatchList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [apiFlag, setApiFlag] = useState(false);
  const [collegeLoading, setCollegeLoading] = useState(false);
  const [collegeList, setCollegeList] = useState([]);
  const [assessmentLoading, setAssessmentsLoading] = useState(false);
  const [assessmentList, setAssessmentsList] = useState([]);
  const [assessmentName, setAssessmentsName] = useState("assessment result");
  const [globalVisibility, setGlobalVisibility] = useState(true);

  const onPaginationChange = (val) => {
    setPage(val);
    setApiFlag(true);
  };
  const getCollegeOptionData = async () => {
    try {
      setCollegeLoading(true);
      const response = await axiosInstance.get(`admin/college-option`);

      if (response.success) {
        setCollegeList(response.data);
      } else {
        openNotification("danger", response.error);
      }
    } catch (error) {
      console.log("getCollegeOptionData error :", error.message);
      openNotification("danger", error.message);
    } finally {
      setCollegeLoading(false);
    }
  };
  const getBatchOptionData = async (collegeId = "") => {
    try {
      setBatchLoading(true);
      const response = collegeId
        ? await axiosInstance.get(`admin/batches-option/${collegeId}`)
        : await axiosInstance.get(`user/batches-option`);

      if (response.success) {
        setBatchList(response.data.filter((e) => e.value !== "all"));
      } else {
        openNotification("danger", response.error);
      }
    } catch (error) {
      console.log("getBatchOptionData error :", error.message);
      openNotification("danger", error.message);
    } finally {
      setBatchLoading(false);
    }
  };
  const getAssessmentOptionData = async (collegeId = "") => {
    try {
      setAssessmentsLoading(true);
      const response = await axiosInstance.get(
        `user/assessment-option-by-college/${collegeId}`
      );
      if (response.success) {
        setAssessmentsList(response.data.filter((e) => e.value !== "all"));
      } else {
        openNotification("danger", response.error);
      }
    } catch (error) {
      console.log("getAssessmentOptionData error :", error.message);
      openNotification("danger", error.message);
    } finally {
      setAssessmentsLoading(false);
    }
  };
  const fetchData = async () => {
    try {
      let formData = {
        pageNo: page,
        perPage: appConfig.pagePerData
      };
      if (currentCollegeTab) {
        formData = { ...formData, collegeId: currentCollegeTab };
      }
      if (currentBatchTab) {
        formData = { ...formData, batchId: currentBatchTab };
      }
      if (currentAssessmentTab) {
        formData = { ...formData, assessmentId: currentAssessmentTab };
      }

      const response = await axiosInstance.post(
        `user/get-all-quiz-result`,
        formData
      );
      if (response.success) {
        setResultData(response?.data);
        setTotalPage(
          response.pagination?.total
            ? Math.ceil(response.pagination?.total / appConfig?.pagePerData)
            : 0
        );
        setIsLoading(false);
      } else {
        openNotification("danger", response.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("get-all-student error:", error);
      openNotification("danger", error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (apiFlag) {
      setApiFlag(false);
      setIsLoading(true);

      fetchData();
    }
  }, [apiFlag]);

  useEffect(() => {
    setApiFlag(true);
    if (userData.authority.toString() !== SUPERADMIN) {
      getBatchOptionData(userData?.collegeId);
    } else {
      getCollegeOptionData();
      getBatchOptionData(collegeId);
    }
  }, []);
  useEffect(() => {
    if (!flag) {
      setApiFlag(true);
    }
  }, [flag]);
  useEffect(() => {
    if (refreshFlag) {
      setApiFlag(true);
    }
  }, [refreshFlag]);
  useEffect(() => {
    setPage(1);
    setApiFlag(true);
  }, [debouncedText]);
  useEffect(() => {
    if (currentCollegeTab) {
      getAssessmentOptionData(currentCollegeTab);
    } else {
      setAssessmentsList([]);
    }
  }, [currentCollegeTab]);

  const changeResultVisibility = async (id, showResult) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.put(
        "user/change-quiz-result-visibility",
        { showResult: showResult, trackingIds: id ? [id] : [] }
      );
      if (response.success) {
        openNotification("success", response.message);
        setApiFlag(true);
      } else {
        openNotification("danger", response.message);
      }
    } catch (error) {
      console.error("changeResultVisibility error:", error);
      openNotification("danger", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="lg:flex items-center justify-between w-[100%]  md:flex md:flex-wrap sm:flex sm:flex-wrap">
        <div className="w-full lg:w-auto flex flex-col md:flex-row lg:items-center gap-x-4 ">
          {userData.authority.toString() === SUPERADMIN && (
            <Select
              size="sm"
              isClearable
              isSearchable={true}
              className="w-[100%] md:mb-0 mb-4 sm:mb-0"
              placeholder="College"
              options={collegeList}
              loading={collegeLoading}
              value={collegeList.find(
                (item) => item?.value === currentCollegeTab
              )}
              onChange={(item) => {
                setCurrentCollegeTab(item?.value ? item?.value : "");
                getBatchOptionData(item?.value ? item?.value : "");
                setApiFlag(true);
                setPage(1);
              }}
            />
          )}
          <Select
            size="sm"
            isClearable
            isSearchable={true}
            className="w-full lg:w-96 md:mb-0 mb-4 sm:mb-0"
            placeholder="Batches"
            options={batchList}
            loading={batchLoading}
            value={
              currentBatchTab
                ? batchList.find((item) => item?.value === currentBatchTab)
                : null
            }
            onChange={(item) => {
              setCurrentBatchTab(item?.value ? item?.value : "");
              setApiFlag(true);
              setPage(1);
            }}
          />
          <Select
            size="sm"
            isClearable
            isSearchable={true}
            className="w-[100%] md:mb-0 mb-4 sm:mb-0"
            placeholder="Assessment"
            options={assessmentList}
            loading={assessmentLoading}
            value={
              currentAssessmentTab
                ? assessmentList.find(
                    (item) => item?.value === currentAssessmentTab
                  )
                : null
            }
            onChange={(item) => {
              setCurrentAssessmentTab(item?.value ? item?.value : "");
              setAssessmentsName(item?.label ? item?.label : "");
              setApiFlag(true);
              setPage(1);
            }}
          />
        </div>
        <div className="flex items-center gap-x-4">
          <div>
            <Switcher
              checked={globalVisibility}
              onChange={(e) => {
                setGlobalVisibility(!e);
                changeResultVisibility(null, !e);
              }}
            />
          </div>
          <CSVExport
            // taskFilter={taskFilter}
            fileName={assessmentName}
            searchedData={resultData}
            exportLoading={isLoading}
          />
        </div>
      </div>

      <div className="mt-4">
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
        ) : resultData && resultData?.length ? (
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
                {resultData?.map((item, key) => {
                  return (
                    <Tr key={item?._id} className="capitalize">
                      <Td>{key + 1}</Td>
                      <Td>{item?.userName}</Td>
                      <Td className="lowercase">
                        {item?.userEmail?.toLowerCase()}
                      </Td>
                      <Td>{item?.quizTitle}</Td>
                      <Td>{`${item?.correctAnswers} / ${item?.quizQuestionsLength}`}</Td>
                      <Td>
                        {" "}
                        {`${item?.wrongAnswers} / ${item?.quizQuestionsLength}`}
                      </Td>
                      <Td>{`${item?.totalMarks} / ${item?.quizTotalMarks}`}</Td>
                      <Td>{`${(
                        (Number(item?.totalMarks) /
                          Number(item?.quizTotalMarks)) *
                        100
                      ).toFixed(2)}%`}</Td>
                      <Td>
                        {Math.floor(item?.totalTime / 60)} / {item?.quizTime}
                      </Td>

                      <Td>
                        <Switcher
                          checked={item?.showResult}
                          onChange={(e) => {
                            changeResultVisibility(item?._id, !e);
                          }}
                        />
                      </Td>

                      <Td>
                        <div className="flex ">
                          <Button
                            shape="circle"
                            variant="solid"
                            className="mr-2"
                            size="sm"
                            icon={<FaEye />}
                            onClick={() => {
                              const url = `${
                                window.location.href.split("app")[0]
                              }app/student/quiz-result/${item?.trackingId}`;
                              window.open(url, "_blank");
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
    </>
  );
};

export default AssessmentResult;
