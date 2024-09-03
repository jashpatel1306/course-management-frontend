/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  Table,
  Dialog,
  Button,
  Pagination,
  Input,
  Select,
  Badge,
} from "components/ui";
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

const column = ["Department", "status", "Action"];

const DepartmentList = (props) => {
  const { flag, parentCallback, setData, parentCloseCallback } = props;
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const { authority } = useSelector((state) => state.auth.user.userData);

  const { userData } = useSelector((state) => state.auth.user);
  const [currentTab, setCurrentTab] = useState(userData.collegeId);
  const [departmentData, setDepartmentData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectObject, setSelectObject] = useState();
  const [deleteIsOpen, setDeleteIsOpen] = useState(false);

  const [apiFlag, setApiFlag] = useState(false);
  const [collegeLoading, setCollegeLoading] = useState(false);
  const [collegeList, setCollegeList] = useState([]);
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

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(
        `user/departments/${currentTab}`
      );
      if (response.success) {
        setDepartmentData(response.data);
        setIsLoading(false);
      } else {
        openNotification("danger", response.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("get-all-departments error:", error);
      openNotification("danger", error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (apiFlag) {
      setApiFlag(false);
      setIsLoading(true);
      if (authority.toString() === SUPERADMIN) {
        getCollegeOptionData();
      }
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
      console.log(" error:", error);
      openNotification("danger", error.message);
      setDeleteIsOpen(false);
    }
  };

  return (
    <>
      {userData.authority.toString() === SUPERADMIN && (
        <div className="lg:flex items-center justify-between mt-2 w-[100%]  md:flex md:flex-wrap sm:flex sm:flex-wrap">
          <div className="flex flex-col lg:flex-row lg:items-center gap-x-4 lg:w-[25%] md:w-[50%] p-1 sm:w-[50%]"></div>
          <div className="w-[25%] md:w-[100%] p-1 lg:w-[25%] sm:w-[100%]">
            <Select
              isSearchable={true}
              className="w-[100%] md:mb-0 mb-4 sm:mb-0"
              placeholder="College"
              options={collegeList}
              loading={collegeLoading}
              value={collegeList.find((item) => item.value === currentTab)}
              onChange={(item) => {
                setCurrentTab(item.value);
                setApiFlag(true);
              }}
            />
          </div>
        </div>
      )}

      <div className="mt-2">
        {isLoading ? (
          <>
            <Table>
              <THead>
                <Tr>
                  {column?.map((item, index) => {
                    return (
                      <Th
                        key={item}
                        className={`${
                          index + 1 === column.length ? "flex justify-end" : ""
                        }`}
                      >
                        {item}
                      </Th>
                    );
                  })}
                </Tr>
              </THead>
              <TableRowSkeleton columns={9} rows={10} />
            </Table>
          </>
        ) : departmentData && departmentData?.length ? (
          <>
            <Table>
              <THead>
                <Tr>
                  {column?.map((item, index) => {
                    return (
                      <Th
                        key={item}
                        className={`${
                          index + 1 === column.length ? "flex justify-end" : ""
                        }`}
                      >
                        {item}
                      </Th>
                    );
                  })}
                </Tr>
              </THead>
              <TBody>
                {departmentData?.map((item, key) => {
                  return (
                    <Tr key={item?._id} className="capitalize">
                      <Td>{item?.department}</Td>
                      <Td>
                        {item?.active ? (
                          <div className="flex items-center gap-2">
                            <Badge className="bg-emerald-500" />
                            <span
                              className={`capitalize font-semibold text-emerald-500`}
                            >
                              Active
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Badge className="bg-red-500" />
                            <span
                              className={`capitalize font-semibold text-red-500`}
                            >
                              Inactive
                            </span>
                          </div>
                        )}
                      </Td>

                      <Td>
                        <div className="flex justify-end ">
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
            Confirm Deactivation of Department
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

export default DepartmentList;
