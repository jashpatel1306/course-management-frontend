/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Card, Input, Pagination, Select } from "components/ui";
import React, { useEffect, useState } from "react";
import AssessmentCard from "./assessmentCard";
import { HiOutlineSearch } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useDebounce } from "use-debounce";
import removeSpecials from "views/common/serachText";
import axiosInstance from "apiServices/axiosInstance";
import appConfig from "configs/app.config";
import { AiOutlineClose } from "react-icons/ai";
import openNotification from "views/common/notification";
import { DataNoFound } from "assets/svg";

const activeFilter = [
  { label: "All", value: "all" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Ongoing", value: "active" },
  { label: "Completed", value: "expired" }
];

const AssessmentList = () => {
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [debouncedText] = useDebounce(searchText, 1000);
  const [assesssmentData, setAssesssmentData] = useState([]);
  const [page, setPage] = useState(1);
  const [apiFlag, setApiFlag] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [activeTab, setActiveTab] = useState("all");

  const onPaginationChange = (val) => {
    setPage(val);
    setApiFlag(true);
  };
  const fetchData = async () => {
    try {
      let formData = {
        search: removeSpecials(debouncedText),
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
        `student/get-all-assign-assessments`,
        formData
      );
      if (response.success) {
        setAssesssmentData(response.data);
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
      console.log("get-all-assesssment error:", error);
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
    setPage(1);
    setApiFlag(true);
  }, [debouncedText]);
  return (
    <>
      <Card>
        <div className="lg:flex items-center justify-between w-[100%]  md:flex md:flex-wrap sm:flex sm:flex-wrap">
          <div className="flex flex-col lg:flex-row lg:items-center gap-x-4 lg:w-[25%] md:w-[50%] p-1 sm:w-[50%]">
            <div
              className={`text-xl font-bold text-${themeColor}-${primaryColorLevel} dark:text-white`}
            >
              My Assessments
            </div>
          </div>
          <div className="w-full flex gap-2 md:w-[100%] p-1 lg:w-[25%] sm:w-[100%]">
            <Select
              isSearchable={true}
              className="w-[55%]"
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
            <Input
              placeholder="Search By Name, Email"
              className=" input-wrapper"
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
      </Card>
      <Card className="mt-4">
        <div className="flex flex-wrap gap-4">
          {assesssmentData.length > 0 ? (
            assesssmentData?.map((data, index) => {
              return (
                <>
                  <AssessmentCard variant="full" assessmentData={data} />
                </>
              );
            })
          ) : (
            <>
              <DataNoFound />
            </>
          )}
        </div>
        <div className="flex items-center justify-center mt-4">
          <Pagination
            total={totalPage}
            currentPage={page}
            onChange={onPaginationChange}
          />
        </div>
      </Card>
    </>
  );
};

export default AssessmentList;
