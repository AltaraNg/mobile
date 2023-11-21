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
