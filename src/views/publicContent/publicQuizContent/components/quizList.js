/* eslint-disable react-hooks/exhaustive-deps */
import {
  Table,
  Card,
  Pagination,
  Button,
  Dialog,
  Badge,
  Select,
  Dropdown,
  MenuItem
} from "components/ui";
import React, { useEffect, useState } from "react";
import { HiOutlinePencil } from "react-icons/hi";
import { useSelector } from "react-redux";
import axiosInstance from "apiServices/axiosInstance";
import appConfig from "configs/app.config";
import openNotification from "views/common/notification";
import { TableRowSkeleton } from "components/shared";
import { DataNoFound } from "assets/svg";
import { useNavigate } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
const { Tr, Th, Td, THead, TBody } = Table;

const columns = [
  "Quiz name",
  "Quiz Time",
  "questions",
  "totalMarks",
  "publish",
  "Active"
];
const activeFilter = [
  { label: "All", value: "all" },

  { label: "Published", value: "published" },
  { label: "Unpublished", value: "unpublished" }
];
const QuizList = (props) => {
  const { flag } = props;
  const navigate = useNavigate();

  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );

  const [isLoading, setIsLoading] = useState(true);
  const [quizzesData, setQuizzesData] = useState([]);
  const [page, setPage] = useState(1);
  const [selectObject] = useState();
  const [deleteIsOpen, setDeleteIsOpen] = useState(false);
  const [apiFlag, setApiFlag] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [activeTab, setActiveTab] = useState("all");

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
      if (activeTab && activeTab !== "all") {
        formData = {
          ...formData,
          status: activeTab
        };
      }
      const response = await axiosInstance.post(
        `user/get-public-quizzes`,
        formData
      );
      if (response.success) {
        setQuizzesData(response.data);
        setTotalPage(
          response.pagination.total
            ? Math.ceil(response.pagination.total / appConfig.pagePerData)
            : 0
        );

        setIsLoading(false);
      } else {
        openNotification("danger", response.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("get-all-quizzes error:", error);
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
    if (!flag) {
      setApiFlag(true);
    }
  }, [flag]);
  const onHandleDeleteBox = async () => {
    try {
      const response = await axiosInstance.delete(
        `user/quiz/${selectObject._id}`
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
      <Card className="mt-4" bodyClass="p-3 sm:p-[1.25rem]">
        <div className="lg:flex items-center justify-between mt-2 w-[100%]  md:flex md:flex-wrap sm:flex sm:flex-wrap">
          <div className="flex flex-col lg:flex-row lg:items-center gap-x-4 lg:w-[25%] md:w-[50%] p-1 sm:w-[50%]"></div>
          <div className="w-full md:w-56 p-1 lg:w-[25%]">
            <Select
              isSearchable={true}
              className=""
              isClearable
              placeholder="Filter"
              options={activeFilter}
              value={
                activeTab
                  ? activeFilter.find((item) => item?.value === activeTab)
                  : null
              }
              onChange={(item) => {
                setActiveTab(item?.value ? item?.value : "");
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
                <TableRowSkeleton columns={6} rows={10} />
              </Table>
            </>
          ) : quizzesData && quizzesData?.length ? (
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
                  {quizzesData?.map((item, key) => {
                    return (
                      <Tr key={item?._id} className="capitalize">
                        <Td>{item?.title}</Td>
                        <Td>{item?.time}</Td>
                        <Td>{item?.questions?.length}</Td>
                        <Td>{item?.totalMarks}</Td>
                        <Td>
                          {item?.isPublish ? (
                            <div className="flex items-center gap-2">
                              <Badge className="bg-emerald-500" />
                              <span
                                className={`capitalize font-semibold text-emerald-500`}
                              >
                                publish
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Badge className="bg-red-500" />
                              <span
                                className={`capitalize font-semibold text-red-500`}
                              >
                                unpublish
                              </span>
                            </div>
                          )}
                        </Td>

                        <Td>
                          <div className="flex items-center">
                            <Dropdown
                              trigger="click"
                              menuClass="min-w-0 flex justify-center items-center"
                              renderTitle={
                                <MenuItem key="actions" eventKey="actions">
                                  <BsThreeDots
                                    className={`cursor-pointer text-2xl text-${themeColor}-${primaryColorLevel}`}
                                  />
                                </MenuItem>
                              }
                              placement="middle-end-bottom"
                            >
                              <Button
                                shape="circle"
                                variant="solid"
                                size="sm"
                                icon={<HiOutlinePencil />}
                                onClick={async () => {
                                  navigate(
                                    `/app/admin/public-content/quiz-form/${item._id}`
                                  );
                                }}
                              />
                              {/* {item?.active && (
                                <Button
                                  shape="circle"
                                  color="red-700"
                                  variant="solid"
                                  size="sm"
                                  icon={<HiOutlineTrash />}
                                  onClick={() => {
                                    setSelectObject(item);
                                    setDeleteIsOpen(true);
                                  }}
                                />
                              )} */}
                            </Dropdown>
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
            Confirm Delete Assessment
          </h5>
          <p>Are you sure you want to Delete this quize?</p>
        </div>
        <div className="text-right px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-bl-lg rounded-br-lg">
          <Button
            className="ltr:mr-2 rtl:ml-2"
            onClick={() => {
              setDeleteIsOpen(false);
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

export default QuizList;
