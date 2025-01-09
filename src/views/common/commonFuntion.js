export const formatTimestampToReadableDate = (isoTimestamp) => {
  const date = new Date(isoTimestamp);

  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true
  };

  return date?.toLocaleString("en-US", options);
};

export const getDateRange = (value) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  let startDate, endDate;

  switch (value) {
    case "0": // Last 6 Months
      endDate = new Date(today);
      startDate = new Date(today);
      startDate.setMonth(currentMonth - 6);
      break;

    case "1": // This Year
      startDate = new Date(currentYear, 0, 1); // January 1st
      endDate = new Date(currentYear, 11, 31); // December 31st
      break;

    case "2": // Previous Year
      startDate = new Date(currentYear - 1, 0, 1); // January 1st of last year
      endDate = new Date(currentYear - 1, 11, 31); // December 31st of last year
      break;

    default:
      throw new Error("Invalid option selected.");
  }

  return { startDate, endDate };
};

export const getCurrentToPreviousYearDateRange = () => {
  const currentDate = new Date(); // Current date
  const previousYearDate = new Date(currentDate); // Clone current date
  previousYearDate.setFullYear(currentDate.getFullYear() - 1); // Subtract 1 year

  // Format dates (e.g., YYYY-MM-DD)
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    return new Date(`${year}-${month}-${day}`);
  };

  return {
    startDateFilter: formatDate(previousYearDate),
    endDateFilter: formatDate(currentDate)
  };
};