/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  Table,
  Badge,
  Dialog,
  Button,
  Pagination,
  Input,
  Select,
} from "components/ui";
import { TableRowSkeleton } from "components/shared";
import {
  HiCheck,
  HiOutlineSearch,
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi";
import axiosInstance from "apiServices/axiosInstance";
import DataNoFound from "assets/svg/dataNoFound";
import appConfig from "configs/app.config";
import openNotification from "views/common/notification";
import { useSelector } from "react-redux";
import { useDebounce } from "use-debounce";
import { AiOutlineClose } from "react-icons/ai";
import useEncryption from "common/useEncryption";
import removeSpecials from "views/common/serachText";
import { components } from "react-select";
import { FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const { Tr, Th, Td, THead, TBody } = Table;
const { Control } = components;
const columns = [
  "Name",
  "Short Name",
  "College No",
  "College Email",
  "Contact Name",
  "Contact Phone No",
  // "Password",
  // "Active",
  "Action",
  "View",
];
const statusOptions = [
  {
    value: "2",
    label: "All",
    color: "bg-indigo-500",
  },
  {
    value: "1",
    label: "ACTIVE",
    color: "bg-green-500",
  },
  {
    value: "0",
    label: "INACTIVE",
    color: "bg-red-500",
  },
];
const CustomSelectOption = ({ innerProps, label, data, isSelected }) => {
  return (
    <div
      className={`flex items-center justify-between p-2 cursor-pointer ${
        isSelected
          ? "bg-gray-100 dark:bg-gray-500"
          : "hover:bg-gray-50 dark:hover:bg-gray-600"
      }`}
      {...innerProps}
    >
      <div className="flex items-center gap-2">
        <Badge innerClass={data.color} />
        <span className=" uppercase">{label}</span>
      </div>
      {isSelected && <HiCheck className="text-emerald-500 text-xl" />}
    </div>
  );
};

const CustomControl = ({ children, ...props }) => {
  const selected = props.getValue()[0];
  return (
    <Control {...props}>
      {selected && (
        <Badge className="ltr:ml-4 rtl:mr-4" innerClass={selected.color} />
      )}
      {children}
    </Control>
  );
};
const AdminList = (props) => {
  const navigate = useNavigate();
  const { flag, parentCallback, setUserData, parentCloseCallback } = props;
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );

  const [currentTab, setCurrentTab] = useState("2");
  const [adminData, setAdminData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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
      const bodyData = currentTab === "0" ? 0 : currentTab === "1" ? 1 : 2;
      let formData = {
        search: removeSpecials(debouncedText),
        pageNo: page,
        perPage: appConfig.pagePerData,
      };

      const response = await axiosInstance.post(
        `admin/colleges/all/${bodyData}`,
        formData
      );
      if (response.success) {
        setAdminData(response.data);
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
      console.log("get-all-admin error:", error);
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
      const response = await axiosInstance.patch(
        `admin/college-status/${selectObject._id}`
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
        <div className="w-[50%] p-1">
          <div
            className={`w-[35%]  text-center rounded-lg font-bold bg-${themeColor}-50 text-${themeColor}-${primaryColorLevel} text-base
                dark:bg-gray-700 dark:text-white dark:border-white px-4 border border-${themeColor}-${primaryColorLevel} py-2 px-2 md:w-[100%] lg:w-[50%] xl:w-[40%] sm:w-[100%]`}
          >
            {resultTitle}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center gap-x-4 lg:w-[25%] md:w-[50%] p-1 sm:w-[50%]">
          <Select
            isSearchable={false}
            className="w-[100%] md:mb-0 mb-4 sm:mb-0"
            placeholder="Status"
            options={statusOptions}
            defaultValue={statusOptions[0]}
            components={{
              Option: CustomSelectOption,
              Control: CustomControl,
            }}
            onChange={(item) => {
              setCurrentTab(item.value);
              setApiFlag(true);
              setPage(1);
            }}
          />
        </div>
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

      <div className="mt-8">
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
              <TableRowSkeleton
                avatarInColumns={[0]}
                columns={5}
                rows={5}
                avatarProps={{
                  width: 30,
                  height: 30,
                }}
              />
            </Table>
          </>
        ) : adminData && adminData?.length ? (
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
                {adminData?.map((item, key) => {
                  return (
                    <Tr
                      key={item?._id}
                      className={
                        currentTab === "2"
                          ? item?.active
                            ? "rounded-lg"
                            : "bg-red-200"
                          : "rounded-lg"
                      }
                    >
                      <Td>{item?.collegeName}</Td>
                      <Td>{item?.shortName}</Td>
                      <Td>{item?.collegeNo}</Td>
                      <Td className="lowercase">{item?.userId?.email}</Td>
                      <Td>{item?.contactPersonName}</Td>
                      <Td>{item?.contactPersonNo}</Td>

                      <Td>
                        <div className="flex gap-2">
                          <Button
                            shape="circle"
                            variant="solid"
                            className=""
                            size="sm"
                            icon={<HiOutlinePencil />}
                            onClick={async () => {
                              item.email = item?.userId?.email;
                              item.password = await useEncryption.decryptData(
                                item?.userId?.password
                              );
                              item.userId = item?.userId?._id;

                              parentCloseCallback();
                              setUserData(item);
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
                      <Td>
                        <Button
                          shape="circle"
                          size="sm"
                          variant="twoTone"
                          className={`flex justify-center items-center gap-1 text-${themeColor}-${primaryColorLevel} border-2 font-semibold border-${themeColor}-${primaryColorLevel}`}
                          onClick={() => {
                            navigate(`/app/admin/college-details/${item._id}`,{
                              state:item
                            });
                          }}
                        >
                          View
                          <FaChevronRight size={15} />
                        </Button>
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
            Confirm Deactivation of College
          </h5>
          <p>Are you sure you want to deactivate this College?</p>
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

export default AdminList;
