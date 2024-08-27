import React from "react";
import { Card } from "components/ui";
import { Chart } from "components/shared";
import { COLORS } from "constants/chart.constant";
import { useSelector } from "react-redux";

const CourseStatistics = ({ data = {} }) => {
  const themeColor = useSelector((state) => state?.theme?.themeColor);
  const primaryColorLevel = useSelector(
    (state) => state?.theme?.primaryColorLevel
  );
  return (
    <Card>
      <h4 className={`text-${themeColor}-${primaryColorLevel}`}>
        Course Statistics
      </h4>
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
