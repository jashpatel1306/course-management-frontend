/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Table, Dialog, Button, Pagination, Select } from "components/ui";
import { TableRowSkeleton } from "components/shared";
import axiosInstance from "apiServices/axiosInstance";
import DataNoFound from "assets/svg/dataNoFound";
import appConfig from "configs/app.config";
import openNotification from "views/common/notification";
import { useDebounce } from "use-debounce";
import { useSelector } from "react-redux";
import { SUPERADMIN } from "constants/roles.constant";
import { FaEye } from "react-icons/fa";

const { Tr, Th, Td, THead, TBody } = Table;

const columns = [
  "Roll No",
  "Name",
  "Email",
  "quiz Name",
  "correct Answers	",
  "wrong Answers	",
  "total Marks	",
  "total Time	",
  "Active"
];

const AssessmentResult = (props) => {
  const { flag, refreshFlag } = props;
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const { userData } = useSelector((state) => state.auth.user);

  const { collegeId } = useSelector((state) => state.auth.user.userData);
  const [currentCollegeTab, setCurrentCollegeTab] = useState(collegeId);
  const [currentBatchTab, setCurrentBatchTab] = useState(collegeId);
  const [currentAssessmentTab, setCurrentAssessmentTab] = useState(collegeId);
  const [resultData, setResultData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectObject] = useState();
  const [deleteIsOpen, setDeleteIsOpen] = useState(false);
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
      const response =
        userData.authority.toString() === SUPERADMIN && collegeId
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
        `user/get-all-result`,
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
      getBatchOptionData();
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
  const onHandleDeleteBox = async () => {
    try {
      const response = await axiosInstance.put(
        `user/student/status/${selectObject._id}`
      );
      if (response.success) {
        openNotification("success", response.message);
        setApiFlag(true);
        setDeleteIsOpen(false);
      } else {
        openNotification("danger", response.message);
        setDeleteIsOpen(false);
      }
    } catch (error) {
      console.log("onHandleDeleteBox error:", error);
      openNotification("danger", error.message);
      setDeleteIsOpen(false);
    }
  };

  return (
    <>
      <div className="lg:flex items-center justify-between w-[100%]  md:flex md:flex-wrap sm:flex sm:flex-wrap">
        <div className="w-full lg:w-auto flex flex-col md:flex-row lg:items-center gap-x-4 ">
          {userData.authority.toString() === SUPERADMIN && (
            <Select
              size="sm"
              isSearchable={true}
              className="w-[100%] md:mb-0 mb-4 sm:mb-0"
              placeholder="College"
              options={collegeList}
              loading={collegeLoading}
              value={collegeList.find(
                (item) => item.value === currentCollegeTab
              )}
              onChange={(item) => {
                setCurrentCollegeTab(item.value);
                getBatchOptionData(item.value);
                setApiFlag(true);
                setPage(1);
              }}
            />
          )}
          <Select
            size="sm"
            isSearchable={true}
            className="w-full lg:w-96 md:mb-0 mb-4 sm:mb-0"
            placeholder="Batches"
            options={batchList}
            loading={batchLoading}
            value={
              currentBatchTab
                ? batchList.find((item) => item.value === currentBatchTab)
                : null
            }
            onChange={(item) => {
              setCurrentBatchTab(item.value);
              setApiFlag(true);
              setPage(1);
            }}
          />
          <Select
            size="sm"
            isSearchable={true}
            className="w-[100%] md:mb-0 mb-4 sm:mb-0"
            placeholder="Assessment"
            options={assessmentList}
            loading={assessmentLoading}
            value={
              currentAssessmentTab
                ? assessmentList.find(
                    (item) => item.value === currentAssessmentTab
                  )
                : null
            }
            onChange={(item) => {
              setCurrentAssessmentTab(item.value);
              setApiFlag(true);
              setPage(1);
            }}
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
                        {item?.userEmail.toLowerCase()}
                      </Td>
                      <Td>{item?.quizTitle}</Td>
                      <Td>{`${item?.correctAnswers} / ${item?.quizQuestionsLength}`}</Td>
                      <Td>
                        {" "}
                        {`${item?.wrongAnswers} / ${item?.quizQuestionsLength}`}
                      </Td>
                      <Td>{`${item?.totalMarks} / ${item?.quizTotalMarks}`}</Td>
                      <Td>
                        {Math.floor(item?.totalTime / 60)} / {item?.quizTime}
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

      <Dialog
        isOpen={deleteIsOpen}
        style={{
          content: {
            marginTop: 250
          }
        }}
        contentClassName="pb-0 px-0"
        onClose={() => {
          setDeleteIsOpen(false);
          // setApiFlag(true);
        }}
        onRequestClose={() => {
          setDeleteIsOpen(false);
          // setApiFlag(true);
        }}
      >
        <div className="px-6 pb-6">
          <h5 className={`mb-4 text-${themeColor}-${primaryColorLevel}`}>
            Confirm Deactivation of Student
          </h5>
          <p>Are you sure you want to deactivate this student?</p>
        </div>
        <div className="text-right px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-bl-lg rounded-br-lg">
          <Button
            className="ltr:mr-2 rtl:ml-2"
            onClick={() => {
              setDeleteIsOpen(false);
              // setApiFlag(true);
            }}
          >
            Cancel
          </Button>
          <Button variant="solid" onClick={onHandleDeleteBox}>
            Okay
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default AssessmentResult;
