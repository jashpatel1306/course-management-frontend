import React, { useEffect, useState } from "react";
import UserBatchAnalysis from "./components/userBatchAnalysis";
import TopList from "./components/toplist";
import axiosInstance from "apiServices/axiosInstance";

const InstructorsDashboard = () => {
  const [apiFlag, setApiFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [topBatcheData, setTopBatcheData] = useState([
    { name: "batch name", student: 120 }
  ]);
  const [userBatchChartsData, setUserBatchChartsData] = useState({
    monthsArray: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ],
    valuesArray: [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  });
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`user/instructor-dashboard`);
      if (response.success) {
        const chartData = {
          monthsArray: response.data?.batches,
          valuesArray: response.data?.students
        };
        setUserBatchChartsData(chartData);
        setTopBatcheData(
          response.data?.batchData.map((item) => {
            return {
              name: item.batchName,
              students: item.students
              // url: `/app/admin/college-details/${item._id}`
            };
          })
        );
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (apiFlag) {
      setApiFlag(false);
      fetchDashboard();
    }
  }, [apiFlag]);
  useEffect(() => {
    setApiFlag(true);
  }, []);
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 mb-6 gap-4">
        <div className="col-span-1 ">
          {!loading && <TopList data={topBatcheData} title={"Batches"} />}
        </div>
        <div className="col-span-3  ">
          {!loading && <UserBatchAnalysis data={userBatchChartsData} />}
        </div>
      </div>
    </div>
  );
};

export default InstructorsDashboard;
