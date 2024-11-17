export const formatTimestampToReadableDate =  (isoTimestamp) => {
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
