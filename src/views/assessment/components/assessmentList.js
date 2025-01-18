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
import { SUPERADMIN } from "constants/roles.constant";
import { DataNoFound } from "assets/svg";

const AssessmentList = () => {
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const { userData } = useSelector((state) => state.auth.user);
  const { collegeId } = useSelector((state) => state.auth.user.userData);

  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [debouncedText] = useDebounce(searchText, 1000);
  const [assesssmentData, setAssesssmentData] = useState([]);
  const [currentTab, setCurrentTab] = useState();
  const [page, setPage] = useState(1);
  const [currentCollegeTab, setCurrentCollegeTab] = useState(collegeId);

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
        search: removeSpecials(debouncedText),
        batchId: currentTab ? currentTab : "all",
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
        `user/get-all-assessments`,
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
        const tempList = response.data;
        tempList.unshift({
          label: "All Colleges",
          value: "all"
        });
        setCollegeList(tempList);
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
        setBatchesList(response.data);
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
      if (collegeId !== "all") {
        getBatchOptionData(collegeId);
      }
    }
  }, []);

  useEffect(() => {
    setPage(1);
    setApiFlag(true);
  }, [debouncedText]);
  return (
    <>
      <Card className="mt-4" bodyClass="p-3 sm:p-[1.25rem]">
        <div className="lg:flex items-center justify-between mt-4 w-[100%]  md:flex md:flex-wrap sm:flex sm:flex-wrap">
          <div className="flex flex-col md:flex-row lg:items-center gap-x-4 lg:w-1/2 md:w-full sm:w-[50%]">
            {userData.authority.toString() === SUPERADMIN && (
              <Select
                size="sm"
                isSearchable={true}
                className="w-full mb-4 lg:mb-0"
                placeholder="College"
                options={collegeList}
                loading={collegeLoading}
                value={collegeList.find(
                  (item) => item.value === currentCollegeTab
                )}
                onChange={(item) => {
                  setCurrentCollegeTab(item.value);
                  setCurrentTab(null);
                  setBatchesList([]);
                  if (item.value !== "all") {
                    getBatchOptionData(item.value);
                  }
                  setApiFlag(true);
                  setPage(1);
                }}
              />
            )}
            <Select
              size="sm"
              isSearchable={true}
              className="w-full mb-4 lg:mb-0"
              placeholder="Batches"
              options={batchesList}
              loading={batchLoading}
              value={
                currentTab
                  ? batchesList?.find((item) => item.value === currentTab)
                  : null
              }
              onChange={(item) => {
                setCurrentTab(item.value);
                setApiFlag(true);
                setPage(1);
              }}
            />
          </div>
          <div className="w-full md:w-[100%] lg:w-[25%] sm:w-[100%]">
            <Input
              size="sm"
              placeholder="Search By Name"
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
        <div className="flex flex-wrap px-0 py-4 lg:p-4">
          {assesssmentData.length > 0 ? (
            assesssmentData?.map((data, index) => {
              return (
                <>
                  <AssessmentCard
                    variant="full"
                    assessmentData={data}
                    setApiFlag={setApiFlag}
                    batchList={batchesList}
                  />{" "}
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
          {totalPage > 1 && (
            <Pagination
              total={totalPage}
              currentPage={page}
              onChange={onPaginationChange}
            />
          )}
        </div>
      </Card>
    </>
  );
};

export default AssessmentList;
