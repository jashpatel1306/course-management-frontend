/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Table, Dialog, Button, Pagination } from "components/ui";
import { TableRowSkeleton } from "components/shared";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import axiosInstance from "apiServices/axiosInstance";
import DataNoFound from "assets/svg/dataNoFound";
import appConfig from "configs/app.config";
import openNotification from "views/common/notification";
import { formatTimestampToReadableDate } from "views/common/commonFuntion";
import { useSelector } from "react-redux";
import removeSpecials from "views/common/serachText";
import { FaLink } from "react-icons/fa";
import { RiFileChartFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { FRONTEND_BASE_URL } from "apiServices/baseurl";

const { Tr, Th, Td, THead, TBody } = Table;

const columns = [
  "Name",
  "no of Hits",
  "start Date",
  "end Date",
  "Active",
  "Results"
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
    navigator.clipboard.writeText(link);
    openNotification("success", "Copied");
  };
  return (
    <>
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
                        <div className="flex ">
                          <Button
                            shape="circle"
                            variant="solid"
                            className="mr-2"
                            size="sm"
                            icon={<FaLink />}
                            onClick={async () => {
                              handleCopyClick(
                                `${
                                  process.env.REACT_APP_URL
                                    ? process.env.REACT_APP_URL
                                    : FRONTEND_BASE_URL
                                }/app/quiz/${item._id}/public`
                              );
                            }}
                          />
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
                      <Td>
                        <div className="flex items-center ">
                          <Button
                            shape="circle"
                            variant="solid"
                            className="mr-2"
                            size="sm"
                            icon={<RiFileChartFill />}
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
