import React from 'react';

const convertToPercentage = (value, total) => {
  return Math.round((value / total) * 100);
};

const convertToDegrees = (value) => {
  return Math.round((value / 100) * 360);
};

 const DonutChart = ({ data, total, used, type, className }) => {
  let cssString = data
    .sort((a, b) => a.value - b.value)
    .reduce((prev, current, currentIndex, array) => {
      const startPercentage = convertToPercentage(
        currentIndex === 0 ? 0 : array[currentIndex - 1].value,
        total
      );
      const startDegrees = convertToDegrees(startPercentage);
      const endPercentage = convertToPercentage(current.value, total);
      const endDegrees = convertToDegrees(endPercentage);
      const color = current.color;

      return `${prev} ${color} ${startDegrees}deg ${endDegrees}deg,`;
    }, ``);

  const lastItem = data[data.length - 1];
  const lastEndDegrees = convertToDegrees(convertToPercentage(lastItem.value, total));
  cssString = `${cssString} ${lastItem.color} ${lastEndDegrees}deg 360deg`;

  const percentage = convertToPercentage(used, total);

  return (
    <div className={className}>
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full rounded-full"
      >
        <clipPath id="hole">
          <path d="M 50 0 a 50 50 0 0 1 0 100 50 50 0 0 1 0 -100 v 18 a 2 2 0 0 0 0 64 2 2 0 0 0 0 -64" />
        </clipPath>

        <foreignObject
          x="0"
          y="0"
          width="100"
          height="100"
          clipPath="url(#hole)"
        >
          <div
            className="w-full h-full"
            style={{
              background: `conic-gradient(${cssString})`,
            }}
          />
        </foreignObject>

        <text
          x="50"
          y="40"
          dominantBaseline="middle"
          textAnchor="middle"
          fontWeight={700}
          className="text-[#1AC1E] font-medium text-[18px]"
        >
          {percentage}%
          <tspan
            x="50"
            y="55"
            style={{
              fill: "#676E71",
              fontSize: "8px",
              fontWeight: 300,
            }}
            fontWeight={300}
          >
            {type === "time" ? `of total time` : `of answers`}
          </tspan>
          <tspan
            x="50"
            y="65"
            style={{
              fill: "#676E71",
              fontSize: "8px",
              fontWeight: 300,
            }}
            fontWeight={300}
          >
            {type === "time" ? `used` : `were correct`}
          </tspan>
        </text>
      </svg>
    </div>
  );
};

export default DonutChart;
