/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Table, Button, Pagination, Card } from "components/ui";
import { TableRowSkeleton } from "components/shared";
import axiosInstance from "apiServices/axiosInstance";
import DataNoFound from "assets/svg/dataNoFound";
import appConfig from "configs/app.config";
import openNotification from "views/common/notification";
import { useDebounce } from "use-debounce";
import { useSelector } from "react-redux";
import { FaEye } from "react-icons/fa";

const { Tr, Th, Td, THead, TBody } = Table;

const columns = [
  "Roll No",
  // "Name",
  // "Email",
  "quiz Name",
  "correct Answers	",
  "wrong Answers	",
  "total Marks	",
  "total Time	",
  "View"
];

const AssessmentResult = (props) => {
  const { flag, refreshFlag } = props;

  const { userData } = useSelector((state) => state.auth.user);

  const { collegeId } = useSelector((state) => state.auth.user.userData);
  const [resultData, setResultData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText] = useState("");
  const [debouncedText] = useDebounce(searchText, 1000);

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [apiFlag, setApiFlag] = useState(false);

  const onPaginationChange = (val) => {
    setPage(val);
    setApiFlag(true);
  };

  const fetchData = async () => {
    try {
      let formData = {
        pageNo: page,
        perPage: appConfig.pagePerData
      };
      if (collegeId) {
        formData = { ...formData, collegeId: collegeId };
      }
      if (userData.user_id) {
        formData = { ...formData, userId: userData.user_id };
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

  return (
    <>
      <Card className="mt-6">
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
                      {/* <Td>{item?.userName}</Td>
                      <Td className="lowercase">
                        {item?.userEmail.toLowerCase()}
                      </Td> */}
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
      </Card>
    </>
  );
};

export default AssessmentResult;
