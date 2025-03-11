/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axiosInstance from "apiServices/axiosInstance";
import { useSelector } from "react-redux";
import appConfig from "configs/app.config";
import openNotification from "views/common/notification";
import { useDebounce } from "use-debounce";
import removeSpecials from "views/common/serachText";
import { SUPERADMIN } from "constants/roles.constant";
import CourseCard from "./courseCards";
import { Button, Card, Input, Pagination, Select } from "components/ui";
import { DataNoFound } from "assets/svg";
import { HiOutlineSearch, HiPlusCircle } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
const activeFilter = [
  { label: "Published", value: "active" },
  { label: "Unpublished", value: "inactive" }
];
const CourseList = (props) => {
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const {
    flag,
    handleAddNewCourseCloseClick,
    setData,
    handleAddNewCourseClick
  } = props;

  const { userData } = useSelector((state) => state.auth.user);

  const { collegeId } = useSelector((state) => state.auth.user.userData);
  const [currentCollegeTab] = useState(collegeId);
  const [courseData, setCourseData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [debouncedText] = useDebounce(searchText, 1000);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [activeTab, setActiveTab] = useState();

  const [apiFlag, setApiFlag] = useState(false);
  const onPaginationChange = (val) => {
    setPage(val);
    setApiFlag(true);
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
      if (activeTab) {
        formData = {
          ...formData,
          activeFilter: activeTab
        };
      }
      if (userData?.authority.toString() !== SUPERADMIN && currentCollegeTab) {
        formData = {
          ...formData,
          collegeId: currentCollegeTab
        };
      }

      const response = await axiosInstance.post(
        `user/college-wise-courses`,
        formData
      );
      if (response.success) {
        setCourseData(response.data);
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
      console.log("get-all-course error:", error);
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

  return (
    <>
      <Card className="mb-4">
        <div className="flex items-center justify-between ">
          <div
            className={`text-xl font-bold text-${themeColor}-${primaryColorLevel} dark:text-white`}
          >
            Student Content
          </div>
          <div>
            <Button
              size="sm"
              variant="solid"
              icon={<HiPlusCircle color={"#fff"} />}
              onClick={async () => {
                handleAddNewCourseCloseClick();
                //setSelectObject(item)
                setData();
                setTimeout(() => {
                  handleAddNewCourseClick();
                }, 50);
              }}
            >
              Add New Content
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <Select
            size="sm"
            isClearable
            isSearchable={true}
            className="col-span-1 md:mb-0 mb-4 sm:mb-0"
            placeholder="Active Filter"
            options={activeFilter}
            value={
              activeTab
                ? activeFilter.find((item) => item?.value === activeTab)
                : null
            }
            onChange={(item) => {
              setActiveTab(item?.value ? item?.value : "");
              setApiFlag(true);
              setPage(1);
            }}
          />
          <div></div>
          <div></div>
          <Input
            size="sm"
            placeholder="Search By Name"
            className="input-wrapper md:mb-0 mb-4"
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
      </Card>
      <div>
        {isLoading ? (
          <>
            <div className="flex justify-start">
              <div className="flex flex-wrap justify-start gap-6 bg-gray-100 mt-4">
                {[...Array(18).keys()].map((item, index) => {
                  return (
                    <>
                      <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white">
                        {/* Skeleton for Header Section */}
                        <div className="w-60 h-40 bg-gray-300 animate-pulse"></div>

                        {/* Skeleton for Course Details */}
                        <div className="p-4">
                          {/* Skeleton for title */}
                          <div className="h-6 bg-gray-300 animate-pulse rounded w-3/4 mb-2"></div>

                          {/* Skeleton for badges */}
                          <div className="flex gap-2 py-2">
                            <div className="h-4 bg-gray-300 animate-pulse rounded w-1/4"></div>
                            <div className="h-4 bg-gray-300 animate-pulse rounded w-1/4"></div>
                          </div>

                          {/* Skeleton for progress bar */}
                          <div className="mt-4">
                            <div className="flex justify-between items-center text-sm text-gray-600">
                              <span className="h-4 bg-gray-300 animate-pulse rounded w-1/4"></span>
                              <span className="h-4 bg-gray-300 animate-pulse rounded w-1/6"></span>
                            </div>
                            {/* <div className="w-full bg-gray-200 rounded-full mt-1 h-2 animate-pulse"></div> */}
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>
            </div>
          </>
        ) : courseData && courseData?.length ? (
          <>
            <div>
              <div className="w-full flex justify-start">
                <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 bg-gray-100 mt-4">
                  {courseData.map((item, index) => {
                    return <CourseCard item={item} index={index} />;
                  })}
                </div>
              </div>
              <div className="flex items-center justify-center mt-4">
                {totalPage > 1 && (
                  <Pagination
                    total={totalPage}
                    currentPage={page}
                    onChange={onPaginationChange}
                  />
                )}
              </div>
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

export default CourseList;
