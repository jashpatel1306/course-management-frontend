import React from "react";
import { Card, Badge } from "components/ui";
import { Chart } from "components/shared";
import { COLORS } from "constants/chart.constant";
import { useSelector } from "react-redux";

const StudentRegistrations = () => {
  const data = [
    {
      name: "series1",
      data: [31, 40, 28, 51, 42, 109, 100],
    },
    {
      name: "series2",
      data: [11, 32, 45, 32, 34, 52, 41],
    },
  ];
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  return (
    <Card>
      <h4 className={`text-${themeColor}-${primaryColorLevel}`}>
        Student Registrations
      </h4>
      <div className="mt-6">
        <Chart
          options={{
            dataLabels: {
              enabled: false,
            },
            colors: COLORS,
            stroke: {
              curve: "smooth",
            },
            xaxis: {
              type: "datetime",
              categories: [
                "2018-09-19T00:00:00.000Z",
                "2018-09-19T01:30:00.000Z",
                "2018-09-19T02:30:00.000Z",
                "2018-09-19T03:30:00.000Z",
                "2018-09-19T04:30:00.000Z",
                "2018-09-19T05:30:00.000Z",
                "2018-09-19T06:30:00.000Z",
              ],
            },
            tooltip: {
              x: {
                format: "dd/MM/yy HH:mm",
              },
            },
          }}
          series={data}
          type="area"
          height={400}
        />
      </div>
    </Card>
  );
};

export default StudentRegistrations;
