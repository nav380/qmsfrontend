



// dateUtils.js

/**
 * Format date as MM/DD/YYYY.
 * @param {Date} date The input date object.
 * @returns {string} The formatted date string in MM/DD/YYYY format.
 */
export const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0'); // Get day and ensure two-digit format
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get month (zero-based) and ensure two-digit format
    const year = date.getFullYear(); // Get full year

    return `${month}/${day}/${year}`;
};

/**
 * Format date and time as MM/DD/YYYY HH:MM:SS.
 * @param {Date} date The input date object.
 * @returns {string} The formatted date and time string in MM/DD/YYYY HH:MM:SS format.
 */
export const formatDateTime = (date) => {
    const formattedDate = formatDate(date);
    const hours = date.getHours().toString().padStart(2, '0'); // Get hours and ensure two-digit format
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Get minutes and ensure two-digit format
    const seconds = date.getSeconds().toString().padStart(2, '0'); // Get seconds and ensure two-digit format

    return `${formattedDate} ${hours}:${minutes}:${seconds}`;
};

/**
 * Get only the date part (MM/DD/YYYY) from a date object.
 * @param {Date} date The input date object.
 * @returns {string} The date part string in MM/DD/YYYY format.
 */
export const getDateOnly = (date) => {
    return formatDate(date); // Utilizing formatDate function to get date part
};

/**
 * Get only the time part (HH:MM:SS) from a date object.
 * @param {Date} date The input date object.
 * @returns {string} The time part string in HH:MM:SS format.
 */
export const getTimeOnly = (date) => {
    const hours = date.getHours().toString().padStart(2, '0'); // Get hours and ensure two-digit format
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Get minutes and ensure two-digit format
    const seconds = date.getSeconds().toString().padStart(2, '0'); // Get seconds and ensure two-digit format

    return `${hours}:${minutes}:${seconds}`;
};

/**
 * Add days to a given date.
 * @param {Date} date The input date object.
 * @param {number} days The number of days to add (can be negative to subtract days).
 * @returns {Date} The new date object after adding/subtracting days.
 */
export const addDays = (date, days) => {
    const result = new Date(date); // Create a new date object to avoid mutating the original
    result.setDate(result.getDate() + days);
    return result;
};

/**
 * Check if two dates represent the same calendar day.
 * @param {Date} date1 The first date object.
 * @param {Date} date2 The second date object.
 * @returns {boolean} True if both dates represent the same calendar day, otherwise false.
 */
export const isSameDay = (date1, date2) => {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
};

/**
 * Compare two dates.
 * @param {Date} date1 The first date object.
 * @param {Date} date2 The second date object.
 * @returns {number} A negative value if date1 is earlier, a positive value if date2 is earlier, or 0 if they are the same.
 */
export const compareDates = (date1, date2) => {
    return date1.getTime() - date2.getTime();
};
