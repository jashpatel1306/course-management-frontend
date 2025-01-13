/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Card, Select } from "components/ui";
import { Chart } from "components/shared";
import { useSelector } from "react-redux";
import { getDateRange } from "views/common/commonFuntion";
import axiosInstance from "apiServices/axiosInstance";
import { RANDOM_COLOR } from "constants/chart.constant";
const filterOptions = [
  { value: "0", label: "Last 6 Months" },
  { value: "1", label: "This Year" },
  { value: "2", label: "Previous Year" }
];
const ActiveUserAnalysis = (props) => {
  const { data, college = false } = props;
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  const [monthsArray, setMonthsArray] = useState(data?.monthsArray);
  const [valuesArray, setValuesArray] = useState(data?.valuesArray);
  const [filter, setFilter] = useState({});
  const [filterStatus, setFilterStatus] = useState(false);
  const signupUserChartoptions = {
    chart: {
      fontFamily: "Apple-System, sans-serif",
      width: "100%",
      height: "auto",
      type: "area",
      zoom: {
        enabled: false
      }
    },
    colors: [RANDOM_COLOR],
    dataLabels: {
      enabled: false
    },
    noData: {
      text: undefined,
      align: "center",
      verticalAlign: "middle",
      offsetX: 0,
      offsetY: 0,
      style: {
        color: undefined,
        fontSize: "14px",
        fontFamily: undefined
      }
    },
    fill: {
      type: "gradient"
    },

    series: [
      {
        name: "Users",
        data: valuesArray
      }
    ],
    stroke: {
      curve: "smooth"
    },
    legend: {
      position: "bottom"
    },
    xaxis: {
      categories: monthsArray
    },
    responsive: [
      {
        breakpoint: 1000,
        yaxis: {
          categories: monthsArray
        },
        options: {
          plotOptions: {
            line: {
              horizontal: true,
              columnWidth: "80%"
            }
          },
          legend: {
            position: "bottom"
          }
        }
      }
    ]
  };

  const fetchDashboard = async () => {
    try {
      const response = await axiosInstance.post(
        college ? `user/college-dashboard/` : `admin/dashboard`,
        {
          startDateFilter: filter.startDate,
          endDateFilter: filter.endDate
        }
      );
      if (response.success) {
        const result = response.data?.activeStudentsChart[0];
        setMonthsArray(result.monthsArray);
        setValuesArray(result.valuesArray);
      }
    } catch (error) {
      console.log("fetch sprint error: " + error);
    }
  };
  useEffect(() => {
    if (filterStatus) {
      setFilterStatus(false);
      fetchDashboard();
    }
  }, [filterStatus]);
  return (
    <Card>
      <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="">
          <h3 className={`text-${themeColor}-${primaryColorLevel}`}>
            Active User Analysis
          </h3>
          <p>Active Users Vs Month</p>
        </div>
        <div className="w-full md:w-1/3 mt-4 md:mt-0">
              <Select
                className="w-full"
                size="sm"
                placeholder="Please Select"
                options={filterOptions}
                // value={selectfilter.filter}
                onChange={(e) => {
                  console.group("Value Changed", e);
                  setFilter(getDateRange(e.value));
                  setFilterStatus(true);
                }}
              />
            </div>
      </div>
      <div className="mt-6">
        {monthsArray?.length && valuesArray?.length ? (
          <>
            {" "}
            <Chart
              options={signupUserChartoptions}
              type="area"
              series={signupUserChartoptions.series}
              height={400}
            />
          </>
        ) : (
          <></>
        )}
      </div>
    </Card>
  );
};

export default ActiveUserAnalysis;
