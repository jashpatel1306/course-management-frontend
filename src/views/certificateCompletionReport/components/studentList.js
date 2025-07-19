/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Table, Pagination, Select, Switcher } from "components/ui";
import { TableRowSkeleton } from "components/shared";

import axiosInstance from "apiServices/axiosInstance";
import DataNoFound from "assets/svg/dataNoFound";
import appConfig from "configs/app.config";
import openNotification from "views/common/notification";
import { useSelector } from "react-redux";
import { SUPERADMIN } from "constants/roles.constant";

const { Tr, Th, Td, THead, TBody } = Table;

const columns = [
  "Sr No",
  "Name",
  "College Name",
  "Batch Name",
  "Course Name",
  "Status",
  "Action"
];

const StudentList = () => {
  const { userData } = useSelector((state) => state.auth.user);

  const { collegeId } = useSelector((state) => state.auth.user.userData);
  const [batchTab, setBatchTab] = useState();
  const [departmentTab, setDepartmentTab] = useState();
  const [currentCollegeTab, setCurrentCollegeTab] = useState(collegeId);
  const [studentData, setStudentData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchList, setBatchList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [apiFlag, setApiFlag] = useState(false);
  const [collegeLoading, setCollegeLoading] = useState(false);
  const [collegeList, setCollegeList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [departmentLoading, setDepartmentLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursesList, setCoursesList] = useState(false);
  const [courseTab, setCourseTab] = useState();

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

  const getDepartmentOptionData = async (collegeId) => {
    try {
      setDepartmentLoading(true);
      const response = await axiosInstance.get(
        `user/department-options/${collegeId}`
      );

      if (response.success) {
        const departmentOption = response.data.filter((e) => e.value !== "all");
        setDepartmentList(departmentOption);
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
  const getCoursesOptionData = async (collegeId = "") => {
    try {
      setCoursesLoading(true);
      const response = await axiosInstance.get(
        `user/college-wise-courses-options/${collegeId}`
      );
      if (response.success) {
        setCoursesList(response.data.filter((e) => e.value !== "all"));
      } else {
        openNotification("danger", response.error);
      }
    } catch (error) {
      console.log("getCoursesOptionData error :", error.message);
      openNotification("danger", error.message);
    } finally {
      setCoursesLoading(false);
    }
  };
  const fetchData = async () => {
    try {
      let formData = {
        pageNo: page,
        perPage: appConfig.pagePerData
      };
      if (userData?.authority.toString() === SUPERADMIN) {
        formData = {
          ...formData,
          collegeId: currentCollegeTab ? currentCollegeTab : ""
        };
      } else {
        formData = {
          ...formData,
          collegeId: userData.collegeId ? userData.collegeId : ""
        };
      }

      if (batchTab) {
        formData = {
          ...formData,
          batchId: batchTab === "all" ? "" : batchTab
        };
      }

      if (courseTab) {
        formData = {
          ...formData,
          courseId: courseTab === "all" ? "" : courseTab
        };
      }

      const response = await axiosInstance.post(
        `/api/student-certificates/all`,
        formData
      );
      if (response.status) {
        setStudentData(response.data);
        openNotification("success", response.message);

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
    console.log("userData", userData);

    if (userData.authority.toString() !== SUPERADMIN) {
      getBatchOptionData(userData.collegeId);
      getCoursesOptionData(userData.collegeId);
    } else {
      getCollegeOptionData();
      if (collegeId !== "all") {
        getBatchOptionData(collegeId);
      }
    }
  }, []);
  const changeVisibility = async (id, showResult, collegeId) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        "/api/student-certificates/certificate-visibility",
        {
          certificateStatus: showResult,
          collegeId: collegeId,
          certificateIds: id ? id : []
        }
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
      <div className="lg:flex flex-col items-start justify-center gap-y-3 gap-x-4 my-5 w-[100%]  md:flex md:flex-wrap sm:flex sm:flex-wrap">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-2">
          {userData.authority.toString() === SUPERADMIN && (
            <Select
              isClearable
              size="small"
              isSearchable={true}
              className="w-full md:mb-0 mb-4 sm:mb-0"
              placeholder="College"
              options={collegeList}
              loading={collegeLoading}
              value={collegeList.find(
                (item) => item?.value === currentCollegeTab
              )}
              onChange={(item) => {
                if (item?.value) {
                  setCurrentCollegeTab(item?.value);
                  setBatchTab(null);
                  setDepartmentTab(null);
                  setBatchList([]);
                  setDepartmentList([]);
                  setCoursesList([]);

                  if (item.value !== "all") {
                    getBatchOptionData(item.value);
                    getDepartmentOptionData(item.value);
                    getCoursesOptionData(item.value);
                  }
                } else {
                  setCurrentCollegeTab("");
                  setBatchTab(null);
                  setDepartmentTab(null);
                  setBatchList([]);
                  setCoursesList([]);
                  setDepartmentList([]);
                }
                setApiFlag(true);
                setPage(1);
              }}
            />
          )}
          <Select
            isClearable
            size="small"
            isSearchable={true}
            className="w-full md:mb-0 mb-4 sm:mb-0 capitalize"
            placeholder="Batches"
            options={batchList}
            loading={batchLoading}
            isDisabled={currentCollegeTab ? false : true}
            value={
              batchTab
                ? batchList.find((item) => item?.value === batchTab)
                : null
            }
            onChange={(item) => {
              setBatchTab(item?.value ? item?.value : "");
              setApiFlag(true);
              setPage(1);
            }}
          />

          <Select
            isClearable
            size="small"
            isSearchable={true}
            className="w-full md:mb-0 mb-4 sm:mb-0"
            placeholder="Courses"
            options={coursesList}
            loading={coursesLoading}
            isDisabled={currentCollegeTab ? false : true}
            value={
              courseTab
                ? departmentList.find((item) => item?.value === courseTab)
                : null
            }
            onChange={(item) => {
              setCourseTab(item?.value ? item?.value : "");
              setApiFlag(true);
              setPage(1);
            }}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-0 md:gap-y-3 gap-x-5 w-full"></div>
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
                {studentData?.map((item, index) => {
                  return (
                    <Tr key={item?._id} className="capitalize">
                      <Td>{index + 1}</Td>
                      <Td>{item?.studentName}</Td>

                      <Td>{item?.collegeName ? item?.collegeName : "--"}</Td>
                      <Td>{item?.batchName ? item?.batchName : "--"}</Td>
                      <Td>{item?.courseName ? item?.courseName : "--"}</Td>
                      <Td>
                        {item?.certificateStatus ? "Approved" : "Pending"}
                      </Td>
                      <Td>
                        <Switcher
                          checked={item?.certificateStatus}
                          onChange={(e) => {
                            changeVisibility(item?._id, !e);
                          }}
                        />
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

export default StudentList;
