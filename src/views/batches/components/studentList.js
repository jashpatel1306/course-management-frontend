/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Table, Dialog, Button, Pagination, Input } from "components/ui";
import { TableRowSkeleton } from "components/shared";
import {
  HiOutlinePencil,
  HiOutlineSearch,
  HiOutlineTrash,
} from "react-icons/hi";
import axiosInstance from "apiServices/axiosInstance";
import DataNoFound from "assets/svg/dataNoFound";
import appConfig from "configs/app.config";
import openNotification from "views/common/notification";
import { useDebounce } from "use-debounce";
import { AiOutlineClose } from "react-icons/ai";
import { useSelector } from "react-redux";
import removeSpecials from "views/common/serachText";
import { SUPERADMIN } from "constants/roles.constant";

const { Tr, Th, Td, THead, TBody } = Table;

const columns = [
  "Roll No",
  "Name",
  "Email",
  "Dept",
  "Section",
  "Gender",
  "Sem",
  "Active",
];

const StudentList = (props) => {
  const { flag, parentCallback, batchId, setData, parentCloseCallback } = props;
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const { authority } = useSelector((state) => state.auth.user.userData);

  const [studentData, setStudentData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectObject, setSelectObject] = useState();
  const [deleteIsOpen, setDeleteIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [debouncedText] = useDebounce(searchText, 1000);
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
        search: removeSpecials(debouncedText),
        batchId: batchId,
        pageNo: page,
        perPage: appConfig.pagePerData,
      };

      const response = await axiosInstance.post(
        `user/batch-wise-students`,
        formData
      );
      if (response.success) {
        setStudentData(response.data);
        setTotalPage(
          response.pagination.total
            ? Math.ceil(response.pagination.total / appConfig.pagePerData)
            : 0
        );
        if (response.data) {
          const start = appConfig.pagePerData * (page - 1);
          const end = start + response.data?.length;
          setResultTitle(
            `Result ${start + 1} - ${end} of ${response.pagination.total}`
          );
        }
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
    setPage(1);
    setApiFlag(true);
  }, [debouncedText]);

  const onHandleDeleteBox = async () => {
    try {
      const response = await axiosInstance.put(
        `user/student/status/${selectObject.student_id}`
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
      console.log(" error:", error);
      openNotification("danger", error.message);
      setDeleteIsOpen(false);
    }
  };

  return (
    <>
      <div className="lg:flex items-center justify-between mb-4 w-[100%]  md:flex md:flex-wrap sm:flex sm:flex-wrap">
        {" "}
        <div className="w-[50%] ">
          <div
            className={`w-[35%]  text-center rounded-lg font-bold bg-${themeColor}-50 text-${themeColor}-${primaryColorLevel} text-base
                dark:bg-gray-700 dark:text-white dark:border-white px-4 border border-${themeColor}-${primaryColorLevel} py-2 px-2 md:w-[100%] lg:w-[50%] xl:w-[40%] sm:w-[100%]`}
          >
            {resultTitle}
          </div>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center gap-x-4 lg:w-[25%] md:w-[50%] p-1 sm:w-[50%]">
          <Input
            placeholder="Search By Name, Email"
            className=" input-wrapper md:mb-0 mb-4"
            value={searchText}
            prefix={
              <HiOutlineSearch
                className={`text-xl text-${themeColor}-${primaryColorLevel}`}
              />
            }
            onChange={(e) => {
              setSearchText(e.target.value);
              setPage(1);
              setApiFlag(true);
            }}
            suffix={
              searchText && (
                <AiOutlineClose
                  className={`text-xl text-${themeColor}-${primaryColorLevel}`}
                  onClick={() => {
                    setSearchText("");
                    setApiFlag(true);
                  }}
                />
              )
            }
          />
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
        ) : studentData && studentData?.length ? (
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
                {studentData?.map((item, key) => {
                  return (
                    <Tr key={item?._id} className="capitalize">
                      <Td>{item?.rollNo}</Td>
                      <Td>{item?.name}</Td>
                      <Td className="lowercase">{item?.email}</Td>
                      <Td>{item?.department}</Td>
                      <Td>{item?.section}</Td>
                      <Td>{item?.gender}</Td>
                      <Td>{item?.semester}</Td>

                      <Td>
                        <div className="flex ">
                          <Button
                            shape="circle"
                            variant="solid"
                            className="mr-2"
                            size="sm"
                            icon={<HiOutlinePencil />}
                            onClick={async () => {
                              parentCloseCallback();
                              setData(item);
                              setTimeout(() => {
                                parentCallback();
                              }, 50);
                            }}
                          />
                          {item?.active && (
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
                          )}
                        </div>
                      </Td>
                    </Tr>
                  );
                })}
              </TBody>
            </Table>

            <div className="flex items-center justify-center mt-4">
              <Pagination
                total={totalPage}
                currentPage={page}
                onChange={onPaginationChange}
              />
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
            marginTop: 250,
          },
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

export default StudentList;
