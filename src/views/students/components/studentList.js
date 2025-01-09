/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  Table,
  Dialog,
  Button,
  Pagination,
  Input,
  Select
} from "components/ui";
import { TableRowSkeleton } from "components/shared";
import {
  HiOutlinePencil,
  HiOutlineSearch,
  HiOutlineTrash
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
  "Phone No",
  "Batch Name",
  "Section",
  // "Gender",
  "Sem",
  "Active"
];
const activeFilter = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" }
];
const StudentList = (props) => {
  const {
    flag,
    parentCallback,
    setAllCollegeList,
    setData,
    parentCloseCallback,
    setAllBatchList,
    refreshFlag
  } = props;
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const { userData } = useSelector((state) => state.auth.user);

  const { collegeId } = useSelector((state) => state.auth.user.userData);
  const [batchTab, setBatchTab] = useState();
  const [departmentTab, setDepartmentTab] = useState();
  const [activeTab, setActiveTab] = useState();
  const [currentCollegeTab, setCurrentCollegeTab] = useState(collegeId);
  const [studentData, setStudentData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectObject, setSelectObject] = useState();
  const [deleteIsOpen, setDeleteIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [debouncedText] = useDebounce(searchText, 1000);
  const [batchLoading, setBatchLoading] = useState(false);

  const [batchList, setBatchList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [apiFlag, setApiFlag] = useState(false);
  const [collegeLoading, setCollegeLoading] = useState(false);
  const [collegeList, setCollegeList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);

  const [departmentLoading, setDepartmentLoading] = useState(false);

  const onPaginationChange = (val) => {
    setPage(val);
    setApiFlag(true);
  };
  const getCollegeOptionData = async () => {
    try {
      setCollegeLoading(true);
      const response = await axiosInstance.get(`admin/college-option`);

      if (response.success) {
        const tempList = response.data;
        tempList.unshift({
          label: "All Colleges",
          value: "all"
        });
        setCollegeList(tempList);
        setAllCollegeList(tempList.filter((e) => e.value !== "all"));
        setAllBatchList([]);
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
        console.log("response.data: ", response.data);
        setBatchList(response.data);
        setAllBatchList(response.data.filter((e) => e.value !== "all"));
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
  const getDepartmentOptionData = async (collegeId) => {
    try {
      setDepartmentLoading(true);
      const response = await axiosInstance.get(
        `user/department-options/${collegeId}`
      );

      if (response.success) {
        const departmentOption = response.data.filter((e) => e.value !== "all");
        setDepartmentList(departmentOption);
        console.log("response.data department: ", departmentOption);
      } else {
        openNotification("danger", response.error);
      }
    } catch (error) {
      console.log("getDepartmentOptionData error :", error.message);
      openNotification("danger", error.message);
    } finally {
      setDepartmentLoading(false);
    }
  };
  const fetchData = async () => {
    try {
      // const bodyData =
      //   batchTab === "tab1" ? 0 : batchTab === "tab2" ? 1 : 2;
      let formData = {
        search: removeSpecials(debouncedText),
        batchId: batchTab ? batchTab : "all",
        departmentId: departmentTab
          ? departmentTab === "all"
            ? ""
            : departmentTab
          : "",
        pageNo: page,
        perPage: appConfig.pagePerData
      };
      if (userData?.authority.toString() === SUPERADMIN) {
        formData = {
          ...formData,
          collegeId: currentCollegeTab ? currentCollegeTab : "all"
        };
      }
      if (departmentTab) {
        formData = {
          ...formData,
          departmentId: departmentTab === "all" ? "" : departmentTab
        };
      }
      if (activeTab) {
        formData = {
          ...formData,
          active: activeTab
        };
      }
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
      getBatchOptionData(userData.collegeId);
      getDepartmentOptionData(userData.collegeId);
    } else {
      getCollegeOptionData();
      if (collegeId !== "all") {
        getBatchOptionData(collegeId);
      }
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
      <div className="lg:flex items-center justify-between mt-4 w-[100%]  md:flex md:flex-wrap sm:flex sm:flex-wrap">
        <div className="flex flex-col lg:flex-row lg:items-center gap-x-4 lg:w-[40%] md:w-[50%]  sm:w-[50%] ">
          {userData.authority.toString() === SUPERADMIN && (
            <Select
              isSearchable={true}
              className="w-[684px] md:mb-0 mb-4 sm:mb-0"
              placeholder="College"
              options={collegeList}
              loading={collegeLoading}
              value={collegeList.find(
                (item) => item.value === currentCollegeTab
              )}
              onChange={(item) => {
                setCurrentCollegeTab(item.value);
                setBatchTab(null);
                setDepartmentTab(null);
                setActiveTab(null);
                setBatchList([]);
                setDepartmentList([]);
                if (item.value !== "all") {
                  getBatchOptionData(item.value);
                  getDepartmentOptionData(item.value);
                }

                setApiFlag(true);
                setPage(1);
              }}
            />
          )}
          <Select
            isSearchable={true}
            className="w-[684px] md:mb-0 mb-4 sm:mb-0 capitalize"
            placeholder="Batches"
            options={batchList}
            loading={batchLoading}
            value={
              batchTab
                ? batchList.find((item) => item.value === batchTab)
                : null
            }
            onChange={(item) => {
              setActiveTab(null);
              setBatchTab(item.value);
              setApiFlag(true);
              setPage(1);
            }}
          />
          <Select
            isSearchable={true}
            className="w-[684px] md:mb-0 mb-4 sm:mb-0"
            placeholder="Departments"
            options={departmentList}
            loading={departmentLoading}
            value={
              departmentTab
                ? departmentList.find((item) => item.value === departmentTab)
                : null
            }
            onChange={(item) => {
              setActiveTab(null);
              setDepartmentTab(item.value);
              setApiFlag(true);
              setPage(1);
            }}
          />
        </div>
        <div className="flex gap-2 w-[25%] md:w-[100%] p-1 lg:w-[40%] sm:w-[100%]">
          <Select
            isSearchable={true}
            className="w-[284px] md:mb-0 mb-4 sm:mb-0"
            placeholder="Active Filter"
            options={activeFilter}
            value={
              activeTab
                ? activeFilter.find((item) => item.value === activeTab)
                : null
            }
            onChange={(item) => {
              setActiveTab(item.value);
              setApiFlag(true);
              setPage(1);
            }}
          />
          <Input
            placeholder="Search By Name, Email"
            className="w-[684px] input-wrapper md:mb-0 mb-4"
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
                    <Tr
                      key={item?._id}
                      className={`capitalize ${
                        item?.active ? "" : "bg-red-100"
                      }`}
                    >
                      <Td>{item?.rollNo}</Td>
                      <Td>{item?.name}</Td>
                      <Td className="lowercase">{item?.email.toLowerCase()}</Td>
                      <Td>
                        {item?.department?._id
                          ? item?.department?.department
                          : "NO"}
                      </Td>
                      <Td>{item?.phone}</Td>
                      <Td className="capitalize">
                        {" "}
                        {item?.batchId?.batchName}
                      </Td>
                      <Td>{item?.section}</Td>
                      {/* <Td className="capitalize">{item?.gender}</Td> */}
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

export default StudentList;
