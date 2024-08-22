import React from "react";
import { Card, Badge } from "components/ui";
import { Chart } from "components/shared";
import { COLORS } from "constants/chart.constant";

const CourseStatistics = ({ data = {} }) => {
  return (
    <Card>
      <h4>Course Statistics</h4>
      <div className="mt-6">
        <Chart
          options={{
            colors: COLORS,
            labels: ["Python", "C++", "Others", "Java", "Team E"],
            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: {
                    width: 200,
                  },
                  legend: {
                    position: "bottom",
                  },
                },
              },
            ],
          }}
          series={[30, 15, 35, 20]}
          height={400}
          type="pie"
        />
      </div>
    </Card>
  );
};

export default CourseStatistics;
