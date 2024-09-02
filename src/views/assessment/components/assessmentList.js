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
const AssessmentList = () => {
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const { authority } = useSelector((state) => state.auth.user.userData);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [debouncedText] = useDebounce(searchText, 1000);
  const [assesssmentData, setAssesssmentData] = useState([]);
  const [currentTab, setCurrentTab] = useState();
  const [page, setPage] = useState(1);
  const [resultTitle, setResultTitle] = useState(
    `Result 0 - ${appConfig.pagePerData} of ${appConfig.pagePerData}`
  );
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchList, setBatchList] = useState([]);
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
        perPage: appConfig.pagePerData,
      };

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
        setResultTitle(
          `Result ${start + 1} - ${end} of ${response.pagination.total}`
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
  const getBatchData = async () => {
    try {
      setBatchLoading(true);
      const response = await axiosInstance.get(`user/batches-option`);

      if (response.success) {
        setBatchList(response.data);
        setBatchLoading(false);
        if (!currentTab) {
          setCurrentTab(response.data[0].value);
          const importBatchList = [...response.data];
          importBatchList.shift();
          setBatchesList(importBatchList);
          fetchData();
        }
      } else {
        openNotification("danger", response.error);
        setBatchLoading(false);
      }
    } catch (error) {
      console.log("getBatchsData error :", error.message);
      openNotification("danger", error.message);
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
    getBatchData();
  }, []);

  useEffect(() => {
    setPage(1);
    setApiFlag(true);
  }, [debouncedText]);
  return (
    <>
      <Card className="mt-4">
        <div className="lg:flex items-center justify-between mt-4 w-[100%]  md:flex md:flex-wrap sm:flex sm:flex-wrap">
          <div className="flex flex-col lg:flex-row lg:items-center gap-x-4 lg:w-[25%] md:w-[50%] p-1 sm:w-[50%]">
            <Select
              isSearchable={true}
              className="w-[100%] md:mb-0 mb-4 sm:mb-0"
              placeholder="Batches"
              options={batchList}
              loading={batchLoading}
              value={batchList.find((item) => item.value === currentTab)}
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
        <div className="flex flex-wrap gap-4  p-4">
          {assesssmentData?.map((data, index) => {
            return (
              <>
                <AssessmentCard
                  variant="full"
                  assessmentData={data}
                  setApiFlag={setApiFlag}
                  batchList={batchesList}
                />
              </>
            );
          })}
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
