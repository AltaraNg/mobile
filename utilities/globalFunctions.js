import axios from "axios";

export const logActivity = async (token, activity_id) => {
    try {
        await axios({
            method: "POST",
            url: `/app/audit`,
            headers: { Authorization: `Bearer ${token}` },
            data: {
                mobile_app_activity_id: activity_id,
                meta: {},
            },
        });
    } catch (error) {
        console.log(error);
    }
};

export const formatAsMoney = (figure) => {
    return figure
        ?.toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
