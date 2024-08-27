/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  Table,
  Tabs,
  Dialog,
  Button,
  Pagination,
  Input,
  Select,
} from "components/ui";
import { TableRowSkeleton } from "components/shared";
import {
  HiOutlinePencil,
  HiOutlineSearch,
  HiOutlineTrash,
  HiPlusCircle,
} from "react-icons/hi";
import axiosInstance from "apiServices/axiosInstance";
import DataNoFound from "assets/svg/dataNoFound";
import appConfig from "configs/app.config";
import openNotification from "views/common/notification";
import { useDebounce } from "use-debounce";
import { AiOutlineClose } from "react-icons/ai";
import { useSelector } from "react-redux";

const { Tr, Th, Td, THead, TBody } = Table;

const columns = [
  // "College Code",
  // "College Name",
  "Roll No",
  "Name",
  "Email",
  "Dept",
  "Section",
  "Gender",
  "Sem",
  "Active",
];
const columnsWithCollege = [
  "Batch Name",
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
  const { flag, parentCallback, setData, parentCloseCallback } = props;
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );

  const [currentTab, setCurrentTab] = useState();
  const [studentData, setStudentData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectObject, setSelectObject] = useState();
  const [deleteIsOpen, setDeleteIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [debouncedText] = useDebounce(searchText, 1000);

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [apiFlag, setApiFlag] = useState(false);

  const onPaginationChange = (val) => {
    setPage(val);
    setApiFlag(true);
  };
  const getBatchData = async () => {
    try {
      setBatchLoading(true);
      const response = await axiosInstance.get(`user/batches-option`);

      if (response.success) {
        setBatchList(response.data);
        setBatchLoading(false);
        if (!currentTab) {
          setCurrentTab(response.data[0].value);
          fetchData();
        }
      } else {
        openNotification("danger", response.error);
        setBatchLoading(false);
      }
    } catch (error) {
      console.log("getBatchsData error :", error.message);
      openNotification("danger", error.message);
      setBatchLoading(false);
    }
  };
  const fetchData = async () => {
    try {
      // const bodyData =
      //   currentTab === "tab1" ? 0 : currentTab === "tab2" ? 1 : 2;
      let formData = {
        // search: removeSpecials(debouncedText),
        batchId: currentTab ? currentTab : "all",
        pageNo: page,
        perPage: appConfig.pagePerData,
      };

      const response = await axiosInstance.post(
        `user/batch-wise-students`,
        formData
      );
      console.log("response : ", response);
      if (response.success) {
        setStudentData(response.data);
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
      console.log("get-all-student error:", error);
      openNotification("danger", error.message);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (apiFlag) {
      setApiFlag(false);
      setIsLoading(true);
      console.log("fetchData();fetchData();fetchData();: ");
      getBatchData();
      fetchData();
    }
  }, [apiFlag]);
  useEffect(() => {
    setApiFlag(true);
    getBatchData();
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
      <div className="lg:flex items-center justify-between mt-4 w-[100%]  md:flex md:flex-wrap sm:flex sm:flex-wrap">
       
        <div className="w-[25%] md:w-[100%] p-1 lg:w-[25%] sm:w-[100%]">
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
                  {currentTab === "all"
                    ? columnsWithCollege?.map((item) => {
                        return <Th key={item}>{item}</Th>;
                      })
                    : columns?.map((item) => {
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
                  {currentTab === "all"
                    ? columnsWithCollege?.map((item) => {
                        return <Th key={item}>{item}</Th>;
                      })
                    : columns?.map((item) => {
                        return <Th key={item}>{item}</Th>;
                      })}
                </Tr>
              </THead>
              <TBody>
                {studentData?.map((item, key) => {
                  return (
                    <Tr key={item?._id}>
                      {currentTab === "all" ? (
                        <>
                          <Td>{item?.batchId?.batchName}</Td>
                        </>
                      ) : (
                        <>
                          {/* <Td>{item?.collegeUserId?.collegeNo}</Td>
                              <Td>{item?.collegeUserId?.collegeName}</Td> */}
                        </>
                      )}

                      <Td>{item?.rollNo}</Td>
                      <Td>{item?.name}</Td>
                      <Td>{item?.email}</Td>
                      <Td>{item?.department}</Td>
                      <Td>{item?.section}</Td>
                      <Td className="capitalize">{item?.gender}</Td>
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

      <Dialog isOpen={deleteIsOpen} closable={false}>
        <h5 className="mb-4">Delete Student</h5>
        <p>Are you sure you want to delete this Student</p>
        <div className="text-right mt-6">
          <Button
            className="ltr:mr-2 rtl:ml-2"
            variant="plain"
            onClick={() => {
              setDeleteIsOpen(false);
              setApiFlag(true);
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
