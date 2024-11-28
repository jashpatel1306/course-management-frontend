import { Table, Card,  Pagination, Select, Button, Dialog } from "components/ui";
import React, { useEffect, useState } from "react";
import {
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi";
import { useSelector } from "react-redux";
import axiosInstance from "apiServices/axiosInstance";
import appConfig from "configs/app.config";
import openNotification from "views/common/notification";
import { SUPERADMIN } from "constants/roles.constant";
import { TableRowSkeleton } from "components/shared";
import { DataNoFound } from "assets/svg";
const { Tr, Th, Td, THead, TBody } = Table;

const columns = [
  "assessment name",
  "assessment type",
  "Batch name",
  "course name",
  "postion Type",
  "date",
  "Active",
];
const positionTypeOption = [
  { label: "Preliminary Assessment", value: "pre" },
  { label: "Section-Based Assessment", value: "section" },
  { label: "Grand Test Assessment ", value: "grand" },
];
const getLabelByValue = (value) => {
  const option = positionTypeOption.find((option) => option.value === value);
  return option ? option.label : ""; // Return null if value not found
};
const formatDateRange = (startDate, endDate) => {
  // Create options for formatting
  const options = { day: "numeric", month: "short" };

  // Format the start and end dates
  const start = new Date(startDate).toLocaleDateString("en-GB", options);
  const end = new Date(endDate).toLocaleDateString("en-GB", options);

  // Combine the formatted dates
  return `${start} - ${end}`;
};
const AssessmentList = (props) => {
  const { flag, parentCloseCallback, parentCallback, setData } = props;
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const { userData } = useSelector((state) => state.auth.user);
  const { collegeId } = useSelector((state) => state.auth.user.userData);

  const [isLoading, setIsLoading] = useState(true);
  const [assesssmentData, setAssesssmentData] = useState([]);
  const [currentTab, setCurrentTab] = useState();
  const [page, setPage] = useState(1);
  const [currentCollegeTab, setCurrentCollegeTab] = useState(collegeId);
  const [selectObject, setSelectObject] = useState();
  const [deleteIsOpen, setDeleteIsOpen] = useState(false);
  const [collegeLoading, setCollegeLoading] = useState(false);
  const [collegeList, setCollegeList] = useState([]);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchesList, setBatchesList] = useState([]);
  const [apiFlag, setApiFlag] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const onPaginationChange = (val) => {
    setPage(val);
    setApiFlag(true);
  };
  const fetchData = async () => {
    try {
      // const bodyData =
      //   currentTab === "tab1" ? 0 : currentTab === "tab2" ? 1 : 2;
      let formData = {
        batchId: currentTab ? currentTab : "all",
        pageNo: page,
        perPage: appConfig.pagePerData,
      };
      if (userData?.authority.toString() === SUPERADMIN) {
        formData = {
          ...formData,
          collegeId: currentCollegeTab ? currentCollegeTab : "all",
        };
      }

      const response = await axiosInstance.post(
        `user/get-all-assign-assessments`,
        formData
      );
      if (response.success) {
        setAssesssmentData(response.data);
        setTotalPage(
          response.pagination.total
            ? Math.ceil(response.pagination.total / appConfig.pagePerData)
            : 0
        );
        const start = appConfig.pagePerData * (page - 1);
        const end = start + response.data?.length;

        setIsLoading(false);
      } else {
        openNotification("danger", response.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("get-all-assesssment error:", error);
      openNotification("danger", error.message);
      setIsLoading(false);
    }
  };
  const getCollegeOptionData = async () => {
    try {
      setCollegeLoading(true);
      const response = await axiosInstance.get(`admin/college-option`);

      if (response.success) {
        setCollegeList(response.data);
        setBatchesList([]);
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
        setBatchesList(response.data.filter((e) => e.value !== "all"));
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
  const onHandleDeleteBox = async () => {
    try {
      const response = await axiosInstance.delete(
        `user/assign-assessment/${selectObject._id}`
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
      <Card className="mt-4">
        <div className="lg:flex items-center justify-between mt-4 w-[100%]  md:flex md:flex-wrap sm:flex sm:flex-wrap">
          <div className="flex flex-col lg:flex-row lg:items-center gap-x-4 lg:w-[25%] md:w-[50%] p-1 sm:w-[50%]">
            {userData.authority.toString() === SUPERADMIN && (
              <Select
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
                  setCurrentTab(null);
                  getBatchOptionData(item.value);
                  setApiFlag(true);
                  setPage(1);
                }}
              />
            )}
            <Select
              isSearchable={true}
              className="w-[100%] md:mb-0 mb-4 sm:mb-0"
              placeholder="Batches"
              options={batchesList}
              loading={batchLoading}
              value={
                currentTab
                  ? batchesList.find((item) => item.value === currentTab)
                  : null
              }
              onChange={(item) => {
                setCurrentTab(item.value);
                setApiFlag(true);
                setPage(1);
              }}
            />
          </div>
          <div className="w-[25%] md:w-[100%] p-1 lg:w-[25%] sm:w-[100%]"></div>
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
          ) : assesssmentData && assesssmentData?.length ? (
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
                  {assesssmentData?.map((item, key) => {
                    return (
                      <Tr key={item?._id} className="capitalize">
                        <Td>{item?.assessmentId?.title}</Td>
                        <Td>{item?.type}</Td>
                        <Td>{item?.batchId?.batchName}</Td>
                        <Td>{item?.courseId?.courseName || "-"}</Td>
                        <Td>
                          {item?.positionType
                            ? getLabelByValue(item?.positionType)
                            : "-"}
                        </Td>
                        <Td>
                          {formatDateRange(item?.startDate, item?.endDate)}
                        </Td>
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

      </Card>
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
            Confirm Delete Assessment
          </h5>
          <p>Are you sure you want to Delete this Assessment?</p>
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

export default AssessmentList;
