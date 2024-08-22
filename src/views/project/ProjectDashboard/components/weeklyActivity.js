import React from "react";
import { Card, Button } from "components/ui";
import { Chart } from "components/shared";
import { COLORS } from "constants/chart.constant";

const WeeklyActivity = ({ className, data = {} }) => {
  return (
    <Card className={className}>
      <div className="flex items-center justify-between">
        <h4>weekly activity</h4>
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
