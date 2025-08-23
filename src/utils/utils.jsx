
// export const formatDate = (dateStr) => {
//     const [month, day, year] = dateStr.split('/').map(Number);
//     const date = new Date(year, month - 1, day);

//     // Format the date as DD/MM/YY
//     const dayFormatted = String(date.getDate()).padStart(2, '0');
//     const monthFormatted = String(date.getMonth() + 1).padStart(2, '0');
//     const yearFormatted = String(date.getFullYear()).slice(-4); 

//     return `${dayFormatted}/${monthFormatted}/${yearFormatted}`;
// };

// const dateEntry = "07/29/2024";
// console.log(formatDate(dateEntry)); 


export const formatDate = (dateStr) => {
    // Define regular expressions for various date formats
    if (!dateStr || typeof dateStr !== 'string') {
        return 'Invalid Date';
    }
    const formats = [
        /^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY
        /^\d{2}\/\d{2}\/\d{2}$/, // MM/DD/YY
        /^\d{4}-\d{2}-\d{2}$/,   // YYYY-MM-DD
        /^\d{2}-\d{2}-\d{4}$/,   // DD-MM-YYYY
        /^\d{2}-\d{2}-\d{2}$/,   // DD-MM-YY
        /^\d{2}\.\d{2}\.\d{4}$/, // DD.MM.YYYY
        /^\d{2}\.\d{2}\.\d{2}$/  // DD.MM.YY
    ];

    let year, month, day;

    // Check which format matches the dateStr
    for (const format of formats) {
        const match = dateStr.match(format);
        if (match) {
            if (format.toString() === /^\d{2}\/\d{2}\/\d{4}$/.toString()) {
                [month, day, year] = dateStr.split('/').map(Number);
            } else if (format.toString() === /^\d{2}\/\d{2}\/\d{2}$/.toString()) {
                [month, day, year] = dateStr.split('/').map(Number);
                year += 2000; // Adjust YY to YYYY
            } else if (format.toString() === /^\d{4}-\d{2}-\d{2}$/.toString()) {
                [year, month, day] = dateStr.split('-').map(Number);
            } else if (format.toString() === /^\d{2}-\d{2}-\d{4}$/.toString()) {
                [day, month, year] = dateStr.split('-').map(Number);
            } else if (format.toString() === /^\d{2}-\d{2}-\d{2}$/.toString()) {
                [day, month, year] = dateStr.split('-').map(Number);
                year += 2000; // Adjust YY to YYYY
            } else if (format.toString() === /^\d{2}\.\d{2}\.\d{4}$/.toString()) {
                [day, month, year] = dateStr.split('.').map(Number);
            } else if (format.toString() === /^\d{2}\.\d{2}\.\d{2}$/.toString()) {
                [day, month, year] = dateStr.split('.').map(Number);
                year += 2000; // Adjust YY to YYYY
            }
            break;
        }
    }

    // Create a new date object with the parsed values
    const date = new Date(year, month - 1, day);

    // Format the date as DD/MM/YYYY
    const dayFormatted = String(date.getDate()).padStart(2, '0');
    const monthFormatted = String(date.getMonth() + 1).padStart(2, '0');
    const yearFormatted = String(date.getFullYear());

    return `${dayFormatted}/${monthFormatted}/${yearFormatted}`;
};

// Example usage
// const dateEntry = "07/29/2024";
// console.log(formatDate(dateEntry));  // Output: 29/07/2024

