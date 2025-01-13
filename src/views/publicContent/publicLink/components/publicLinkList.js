/* eslint-disable react-hooks/exhaustive-deps */
import axiosInstance from "apiServices/axiosInstance";
import { FRONTEND_BASE_URL } from "apiServices/baseurl";
import DataNoFound from "assets/svg/dataNoFound";
import { TableRowSkeleton } from "components/shared";
import { Button, Dialog, Pagination, Select, Table } from "components/ui";
import appConfig from "configs/app.config";
import { useEffect, useState } from "react";
import { CgFileDocument } from "react-icons/cg";
import { FaLink, FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { formatTimestampToReadableDate } from "views/common/commonFuntion";
import openNotification from "views/common/notification";
import removeSpecials from "views/common/serachText";

const { Tr, Th, Td, THead, TBody } = Table;

const columns = [
  "Name",
  "licenses",
  "start Date",
  "end Date",
  "like",
  "edit",
  "Results",
  "delete"
];
const activeFilter = [
  { label: "All", value: "all" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Ongoing", value: "active" },
  { label: "Completed", value: "expired" }
];
const PublicLinkList = (props) => {
  const { flag, parentCallback, setData, parentCloseCallback, refreshFlag } =
    props;
  const navigate = useNavigate();

  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );

  const [publicLinkData, setPublicLinkData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectObject, setSelectObject] = useState();
  const [deleteIsOpen, setDeleteIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [apiFlag, setApiFlag] = useState(false);

  const onPaginationChange = (val) => {
    setPage(val);
    setApiFlag(true);
  };

  const fetchData = async () => {
    try {
      let formData = {
        search: removeSpecials(""),
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
        `admin/public-link/all`,
        formData
      );
      if (response.success) {
        setPublicLinkData(response.data);
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
      console.log("get-all-publicLink error:", error);
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
  useEffect(() => {
    if (refreshFlag) {
      setApiFlag(true);
    }
  }, [refreshFlag]);

  const onHandleDeleteBox = async () => {
    try {
      const response = await axiosInstance.delete(
        `admin/public-link/${selectObject._id}`
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
  const handleCopyClick = (link = "") => {
    window.open(link, "_blank");
    openNotification("success", "Copied");
  };
  return (
    <>
      <div className="lg:flex items-center justify-between mt-2 w-[100%]  md:flex md:flex-wrap sm:flex sm:flex-wrap">
        <div className="flex flex-col lg:flex-row lg:items-center gap-x-4 lg:w-[25%] md:w-[50%] p-1 sm:w-[50%]"></div>
        <div className="w-[25%] md:w-[100%] p-1 lg:w-[25%] sm:w-[100%]">
          <Select
            isSearchable={true}
            className=""
            placeholder="Filter"
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
              <TableRowSkeleton columns={8} rows={10} />
            </Table>
          </>
        ) : publicLinkData && publicLinkData?.length ? (
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
                {publicLinkData?.map((item, key) => {
                  return (
                    <Tr key={item?._id} className="capitalize">
                      <Td>{item?.publicLinkName}</Td>

                      <Td>{item?.noofHits}</Td>
                      <Td>{formatTimestampToReadableDate(item?.startDate)}</Td>
                      <Td>{formatTimestampToReadableDate(item?.endDate)}</Td>
                      <Td>
                        {" "}
                        <Button
                          shape="circle"
                          variant="transparent"
                          className="mr-2 border-none !bg-transparent"
                          size="sm"
                          icon={<FaLink className="text-blue-700" />}
                          onClick={async () => {
                         
                            handleCopyClick(
                              `${FRONTEND_BASE_URL}/app/quiz/${item._id}/public`
                            );
                          }}
                        />
                      </Td>
                      <Td>
                        <Button
                          shape="circle"
                          variant="transparent"
                          className="mr-2 border-none !bg-transparent"
                          size="sm"
                          icon={<FaRegEdit size={20} className="text-blue-700" />}
                          onClick={async () => {
                            parentCloseCallback();
                            setData(item);
                            setTimeout(() => {
                              parentCallback();
                            }, 50);
                          }}
                        />
                      </Td>
                      <Td>
                        <div className="flex items-center ">
                          <Button
                            shape="circle"
                            variant="solid"
                            className="mr-2 border-none !bg-transparent"
                            size="sm"
                            icon={<CgFileDocument size={20} className="text-blue-700" />}
                            onClick={async () => {
                              navigate(
                                `/app/admin/public-content/quiz-result/${item._id}`,
                                {
                                  state: {
                                    quizName: item?.publicLinkName
                                  }
                                }
                              );
                            }}
                          />
                        </div>
                      </Td>
                      <Td>
                        {item?.active && (
                          <Button
                            shape="circle"
                            variant="solid"
                            size="sm"
                            className="mr-2 border-none !bg-transparent"
                            icon={<FaRegTrashAlt size={20} className="text-red-700" />}
                            onClick={() => {
                              setSelectObject(item);
                              setDeleteIsOpen(true);
                            }}
                          />
                        )}
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
            Confirm delete of Public Link
          </h5>
          <p>Are you sure you want to delete this public Link?</p>
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

export default PublicLinkList;
