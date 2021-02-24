const convertToHoursAndMinutes = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(seconds / 60) - (hours * 60);

  return `${hours}h ${minutes}m`;
};

export default convertToHoursAndMinutes;
