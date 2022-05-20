import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
type OrderContextData = {
  orderRequest;
  setOrderRequests;
  fetchOrderRequest;
};

const OrderContext = createContext<OrderContextData>({} as OrderContextData);
const OrderProvider: React.FC = ({ children }) => {
  const [orderRequest, setOrderRequests] = useState(null);
      const { authData } = useContext(AuthContext);
  useEffect(() => {
    //Every time the App is opened, this provider is rendered
    //and call de fetchOrderRequest function.
    fetchOrderRequest();
  }, []);

  async function fetchOrderRequest(): Promise<void> {
     try {
       let response = await axios({
         method: "GET",
         url: `/customers/${authData.user.id}/requests`,
         headers: { Authorization: `Bearer ${authData.token}` },
       });
       const orderRequest = response.data.data.order_requests;
       setOrderRequests(orderRequest);
     } catch (error: any) {}
  }



  return (
    //This component will be used to encapsulate the whole App,
    //so all components will have access to the Context
    <OrderContext.Provider
      value={{ setOrderRequests, fetchOrderRequest, orderRequest }}
    >
      {children}
    </OrderContext.Provider>
  );
};