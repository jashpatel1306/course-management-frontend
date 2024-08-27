import React from "react";
import { Card, Button } from "components/ui";
import { Chart } from "components/shared";
import { COLORS } from "constants/chart.constant";
import { useSelector } from "react-redux";

const WeeklyActivity = ({ className, data = {} }) => {
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  return (
    <Card className={className}>
      <div className="flex items-center justify-between">
        <h4 className={`text-${themeColor}-${primaryColorLevel}`}>
          weekly activity
        </h4>
      </div>
      <Chart
        options={{
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: "35%",
              borderRadius: 10,
            },
          },
          colors: COLORS,
          dataLabels: {
            enabled: false,
          },
          stroke: {
            show: true,
            width: 2,
            colors: ["transparent"],
          },
          xaxis: {
            categories: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
          },
          fill: {
            opacity: 1,
          },
          tooltip: {
            y: {
              formatter: (val) => `$${val} thousands`,
            },
          },
        }}
        series={data}
        height={400}
        type="bar"
      />
    </Card>
  );
};

export default WeeklyActivity;
