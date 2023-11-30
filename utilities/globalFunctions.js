import axios from "axios";

export const logActivity = async (token, activity_id) => {
    try {
        const result = await axios({
            method: "POST",
            url: `/app/audit`,
            headers: { Authorization: `Bearer ${token}` },
            data: {
                mobile_app_activity_id: activity_id,
                meta: {},
            },
        });
    } catch (error) {}
};

export const formatAsMoney = (figure) => {
    return figure?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const getOrdinal = (n) => {
    let ord = "th";

    if (n % 10 == 1 && n % 100 != 11) {
        ord = "st";
    } else if (n % 10 == 2 && n % 100 != 12) {
        ord = "nd";
    } else if (n % 10 == 3 && n % 100 != 13) {
        ord = "rd";
    }

    return ord;
};
