import moment from "moment";

export const sql_date_format = (date: string | Date, date_time = true) => {

    if (date_time) {
        return moment.utc(date).format("YYYY-MM-DD HH:mm:ss");
    } else {
        return moment.utc(date).format("YYYY-MM-DD");
    }
};


export const biomax_date_to_js_date = (date: string | Date) => {
    // return moment.utc(date).toDate();
    const newDate = new Date(date);
    // Subtract 5 hours and 30 minutes
    newDate.setHours(newDate.getHours() - 5);
    newDate.setMinutes(newDate.getMinutes() - 30);
    return newDate;

};


// export const biomax_date_to_js_date_with_time_reduction = (date: string | Date) => {
//     const newDate = new Date(date);
//     // Subtract 5 hours and 30 minutes
//     newDate.setHours(newDate.getHours() - 5);
//     newDate.setMinutes(newDate.getMinutes() - 30);
//     return newDate;
// };

export const sql_time_format = (date: string | Date) => {
    return moment.utc(date).format("HH:mm:ss");
};
