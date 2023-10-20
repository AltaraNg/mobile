import axios from "axios";
import React, { createContext, useState, useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";

const NotificationContext = createContext(undefined);
const NotificationDispatchContext = createContext(undefined);

const url = process.env.EXPO_PUBLIC_API_URL;
axios.defaults.baseURL = url;

function NotificationProvider({ children }) {
    const [totalUnread, setTotalUnread] = useState({
        unread: 0,
    });
    const { authData } = useContext(AuthContext);

    useEffect(() => {
        //Every time the App is opened, this provider is rendered
        //and call de loadStorage function.
        fetchNotification();
    }, []);

    const fetchNotification = async () => {
        try {
            const response = await axios({
                method: "GET",
                url: `/customers/${authData.user.id}/notifications`,
                headers: { Authorization: `Bearer ${authData.token}` },
            });

            const notification = response?.data?.data?.notifications?.data;
            const unread = notification.filter((item) => {
                return item.read_at === null;
            });

            setTotalUnread({
                unread: unread.length,
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <NotificationContext.Provider value={totalUnread}>
            <NotificationDispatchContext.Provider value={setTotalUnread}>{children}</NotificationDispatchContext.Provider>
        </NotificationContext.Provider>
    );
}

export { NotificationProvider, NotificationContext, NotificationDispatchContext };
