import moment from "moment";

export const timeFromNow = (date) => {
    return moment(date).fromNow();
};
