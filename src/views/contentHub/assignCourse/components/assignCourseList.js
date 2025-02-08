/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  Table,
  Dialog,
  Button,
  Select,
} from "components/ui";
import { TableRowSkeleton } from "components/shared";

import axiosInstance from "apiServices/axiosInstance";
import DataNoFound from "assets/svg/dataNoFound";
import openNotification from "views/common/notification";
import { useDebounce } from "use-debounce";
import { useSelector } from "react-redux";
import { SUPERADMIN } from "constants/roles.constant";

const { Tr, Th, Td, THead, TBody } = Table;

const columns = [
  "College Name",
  "Batch Number",
  "Batch Name",
  "Total Student",
  "Courses",
  "Instructor Name"
];
const adminColumns = columns.slice(1);
const InstructorList = (props) => {
  const { flag, setAllCollegeList } = props;
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const { userData } = useSelector((state) => state.auth.user);

  const { collegeId } = useSelector((state) => state.auth.user.userData);
  const [currentCollegeTab, setCurrentCollegeTab] = useState(collegeId);
  const [instructorData, setInstructorData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectObject, setSelectObject] = useState();
  const [deleteIsOpen, setDeleteIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [debouncedText] = useDebounce(searchText, 1000);

  const [page, setPage] = useState(1);
  const [apiFlag, setApiFlag] = useState(false);
  const [collegeLoading, setCollegeLoading] = useState(false);
  const [collegeList, setCollegeList] = useState([]);

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
        setAllCollegeList(response.data);
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

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(
        `user/batches/${currentCollegeTab ? currentCollegeTab : "all"}`
      );

      if (response.success) {
        setInstructorData(response.data);
        setIsLoading(false);
      } else {
        openNotification("danger", response.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("get-all-instructor error:", error);
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
    if (userData.authority.toString() === SUPERADMIN) {
      getCollegeOptionData();
    }
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
        `user/instructor/status/${selectObject._id}`
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
      <div className="flex justify-end">
        <div className="w-96">
          {userData.authority.toString() === SUPERADMIN && (
            <Select
              isSearchable={true}
              className="md:mb-0 mb-4 sm:mb-0"
              placeholder="College"
              options={collegeList}
              loading={collegeLoading}
              value={collegeList.find(
                (item) => item.value === currentCollegeTab
              )}
              onChange={(item) => {
                setCurrentCollegeTab(item.value);
                setApiFlag(true);
                setPage(1);
              }}
            />
          )}
        </div>
      </div>

      <div className="mt-2">
        {isLoading ? (
          <>
            <Table>
              <THead>
                <Tr>
                  {userData.authority.toString() === SUPERADMIN ? (
                    <>
                      {" "}
                      {columns?.map((item) => {
                        return <Th key={item}>{item}</Th>;
                      })}
                    </>
                  ) : (
                    <>
                      {adminColumns?.map((item) => {
                        return <Th key={item}>{item}</Th>;
                      })}
                    </>
                  )}
                </Tr>
              </THead>
              <TableRowSkeleton columns={9} rows={10} />
            </Table>
          </>
        ) : instructorData && instructorData?.length ? (
          <>
            <Table>
              <THead>
                <Tr>
                  {userData.authority.toString() === SUPERADMIN ? (
                    <>
                      {" "}
                      {columns?.map((item) => {
                        return <Th key={item}>{item}</Th>;
                      })}
                    </>
                  ) : (
                    <>
                      {adminColumns?.map((item) => {
                        return <Th key={item}>{item}</Th>;
                      })}
                    </>
                  )}
                </Tr>
              </THead>
              <TBody>
                {instructorData?.map((item, key) => {
                  return (
                    <Tr key={item?._id} className="capitalize">
                      {userData.authority.toString() === SUPERADMIN ? (
                        <Td>{item.collegeId.collegeName}</Td>
                      ) : (
                        <></>
                      )}
                      <Td>{key + 1}</Td>
                      <Td>{item?.batchName}</Td>
                      <Td>{item?.studentCount}</Td>
                      <Td>
                        <p className="capitalize w-full max-w-lg">
                          {item.courses
                            .map((course) => course.courseName)
                            .join(", ")}
                        </p>
                      </Td>
                      <Td>
                        {item.instructorIds
                          ?.map((instructor) => instructor.name)
                          .join(", ")}
                      </Td>
                    </Tr>
                  );
                })}
              </TBody>
            </Table>
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
            Confirm Deactivation of Instructor
          </h5>
          <p>Are you sure you want to deactivate this instructor?</p>
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

export default InstructorList;
