/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axiosInstance from "apiServices/axiosInstance";
import openNotification from "views/common/notification";
import CourseCard from "./courseCards";
import { DataNoFound } from "assets/svg";
import { Card } from "components/ui";
import { useSelector } from "react-redux";

const CourseList = (props) => {
  const { flag } = props;
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const [courseData, setCourseData] = useState([]);
  const [certificateData, setCertificateData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiFlag, setApiFlag] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`student/student-wise-courses`);
      if (response.success) {
        setCourseData(response.data.courses);
        setCertificateData(response.data.certificateData);
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

  return (
    <>
      <Card bodyClass="p-3 sm:p-[1.25rem]">
        <div className="flex items-center justify-between ">
          <div
            className={`text-xl font-bold text-${themeColor}-${primaryColorLevel} dark:text-white`}
          >
            My Certificate
          </div>
        </div>
      </Card>
      <div>
        {isLoading ? (
          <>
            <div className="w-full flex justify-center">
              <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 bg-gray-100 mt-4">
                {[...Array(8).keys()].map((item, index) => {
                  return (
                    <>
                      <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white">
                        {/* Skeleton for Header Section */}
                        <div className="w-full h-40 bg-gray-300 animate-pulse"></div>

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
              <div className="flex justify-start">
                <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 bg-gray-100 mt-4">
                  {courseData.map((item, index) => {
                    const certificateRecode = certificateData.find(
                      (info) => info.courseId === item._id
                    );
                    return (
                      certificateRecode && (
                        <CourseCard
                          item={item}
                          index={index}
                          certificateRecode={certificateRecode}
                        />
                      )
                    );
                  })}
                </div>
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
