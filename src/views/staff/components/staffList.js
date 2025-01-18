/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  Table,
  Dialog,
  Button,
  Pagination,
  Input,
  Select,
  Dropdown,
  MenuItem
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
import { BsThreeDots } from "react-icons/bs";

const { Tr, Th, Td, THead, TBody } = Table;

const columns = ["Name", "Email", "Phone No", "permissions", "Active"];

const StaffList = (props) => {
  const { flag, parentCallback, setData, parentCloseCallback, refreshFlag } =
    props;
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const { userData } = useSelector((state) => state.auth.user);

  const { collegeId } = useSelector((state) => state.auth.user.userData);
  const [currentTab, setCurrentTab] = useState();
  const [currentCollegeTab, setCurrentCollegeTab] = useState(collegeId);
  const [staffData, setStaffData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectObject, setSelectObject] = useState();
  const [deleteIsOpen, setDeleteIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [debouncedText] = useDebounce(searchText, 1000);

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [apiFlag, setApiFlag] = useState(false);
  const [collegeLoading, setCollegeLoading] = useState(false);
  const [collegeList, setCollegeList] = useState([]);
  const onPaginationChange = (val) => {
    setPage(val);
    setApiFlag(true);
  };
  const getCollegeOptionData = async () => {
    try {
      setCollegeLoading(true);
      const response = await axiosInstance.get(`admin/college-option`);

      if (response.success) {
        setCollegeList([
          { label: "All", value: "all" },
          { label: "Own Staff", value: "own" },
          ...response.data
        ]);
        setCurrentTab(response.data[0].value);
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
      // const bodyData =
      //   currentTab === "tab1" ? 0 : currentTab === "tab2" ? 1 : 2;
      let formData = {
        search: removeSpecials(debouncedText),
        pageNo: page,
        perPage: appConfig.pagePerData
      };
      if (userData?.authority.toString() === SUPERADMIN) {
        formData = {
          ...formData,
          collegeId: currentCollegeTab ? currentCollegeTab : "all"
        };
      }

      const response = await axiosInstance.post(
        `user/college-wise-staff`,
        formData
      );
      if (response.success) {
        setStaffData(response.data);
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
      console.log("get-all-staff error:", error);
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
        `user/staff/status/${selectObject._id}`
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
  console.log("collegeList: ", collegeList);
  return (
    <>
      <div className="lg:flex items-center justify-between mt-4 w-[100%]  md:flex md:flex-wrap sm:flex sm:flex-wrap">
        <div className="flex flex-col lg:flex-row lg:items-center gap-x-4 lg:w-[25%] md:w-[50%] p-1 sm:w-[50%]">
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
                setApiFlag(true);
                setPage(1);
              }}
            />
          )}
        </div>
        <div className="w-full p-1 md:w-52 lg:w-[25%]">
          {userData.authority.toString() === SUPERADMIN && (
            <Input
              size="sm"
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
          )}
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
        ) : staffData && staffData?.length ? (
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
                {staffData?.map((item, key) => {
                  return (
                    <Tr key={item?._id} className="capitalize">
                      <Td>{item?.name}</Td>
                      <Td className="lowercase">{item?.email.toLowerCase()}</Td>

                      <Td>{item?.phone}</Td>
                      <Td className="capitalize">
                        {" "}
                        {item?.permissions.toString()}
                      </Td>

                      <Td>
                        <div className="flex items-center">
                        <Dropdown trigger="click" menuClass="min-w-0 flex justify-center items-center" renderTitle={
                            <MenuItem key='actions' eventKey='actions'>
                              <BsThreeDots className={`cursor-pointer text-2xl text-${themeColor}-${primaryColorLevel}`} />
                            </MenuItem>}
                            placement="middle-end-top">
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
            Confirm Deactivation of Staff
          </h5>
          <p>Are you sure you want to deactivate this staff?</p>
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

export default StaffList;
