import React from 'react';

interface DateDisplayProps {
  format?: string; // e.g., "YYYY", "MM", "DD", "Do", "DayName", "YYYY-MM-DD", "DD/MM/YYYY", "Month Do, YYYY", "DayName, Month Do, YYYY"
  className?: string; // For styling
}

const getOrdinalSuffix = (day: number): string => {
  if (day > 3 && day < 21) return 'th'; // Handles 11th, 12th, 13th
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

const getDayName = (dayIndex: number): string => {
  const dayNames = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ];
  return dayNames[dayIndex];
};

const DateDisplay: React.FC<DateDisplayProps> = ({ format = "YYYY-MM-DD", className }) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const monthNum = currentDate.getMonth() + 1; // getMonth() is 0-indexed
  const day = currentDate.getDate();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthName = monthNames[currentDate.getMonth()];
  const dayName = getDayName(currentDate.getDay());

  let displayedDate = format;

  // Replace placeholders
  displayedDate = displayedDate.replace(/YYYY/g, year.toString());
  displayedDate = displayedDate.replace(/MM/g, monthNum.toString().padStart(2, '0')); // Pad with 0 for single digits
  displayedDate = displayedDate.replace(/DD/g, day.toString().padStart(2, '0'));     // Pad with 0 for single digits
  displayedDate = displayedDate.replace(/Do/g, day.toString() + getOrdinalSuffix(day)); // Day with ordinal suffix
  displayedDate = displayedDate.replace(/Month/g, monthName);
  displayedDate = displayedDate.replace(/DayName/g, dayName); // New: Day of the week name

  return (
    <time dateTime={currentDate.toISOString()} className={className}>
      {displayedDate}
    </time>
  );
};

export default DateDisplay;
