import axios from 'axios';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';

const NotificationContext = createContext(undefined);
const NotificationDispatchContext = createContext(undefined);
import Constants from 'expo-constants';

let url = Constants?.manifest?.extra?.URL;
axios.defaults.baseURL = url;

function NotificationProvider({children}){
    const [totalUnread, setTotalUnread] = useState({
        unread: 0
    });
    const { authData, setAuthData, showLoader, setShowLoader } =
    useContext(AuthContext);

    console.log(authData.user);

    useEffect(() => {
		//Every time the App is opened, this provider is rendered
		//and call de loadStorage function.
		fetchNotification();
	}, []);

    const getUnread = async () => {

    }

    const fetchNotification = async () => {
        
            try {
                let response = await axios({
                    method: 'GET',
                    url: `/customers/${authData.user.id}/notifications`,
                    headers: { 'Authorization': `Bearer ${authData.token}` },
                });
         
    
                const notification = response?.data?.data?.notifications?.data;
                let unread = notification.filter(item => {
                    return item.read_at === null;
                })
               
                setTotalUnread({
                    unread: unread.length
                })
                
            } catch (error: any) {
            }
        };



    return (
        <NotificationContext.Provider value={totalUnread}>
            <NotificationDispatchContext.Provider value={setTotalUnread}>
                {children}
            </NotificationDispatchContext.Provider>
        </NotificationContext.Provider>
    );
}

export {NotificationProvider, NotificationContext, NotificationDispatchContext};





