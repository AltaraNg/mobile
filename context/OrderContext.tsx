import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
type OrderContextData = {
  orderRequest;
  setOrderRequest;
  fetchOrderRequestContext;
  showLoader2;
  setShowLoader;
};

const OrderContext = createContext<OrderContextData>({} as OrderContextData);
const OrderProvider: React.FC = ({ children }) => {
  const [orderRequest, setOrderRequest] = useState(null);
  const { authData } = useContext(AuthContext);
  const [showLoader2, setShowLoader] = useState(false);
  useEffect(() => {
    //Every time the App is opened, this provider is rendered
    //and call de fetchOrderRequestContext function.
    fetchOrderRequestContext();
  }, []);

  async function fetchOrderRequestContext(): Promise<void> {
    setShowLoader(true)
    try {
      let response = await axios({
        method: "GET",
        url: `/customers/${authData.user.id}/requests`,
        headers: { Authorization: `Bearer ${authData.token}` },
      });
      const orderRequestContext = response.data.data.order_requests;
      const reversed = orderRequestContext.reverse();
      setOrderRequest(reversed);
      // const isPending = orderRequestContext?.some(
      //   (item) => item.status === "pending"
      // );
      // isPending ? setShowButton(false) : setShowButton(true);
       setShowLoader(false);
    } catch (error: any) {setShowLoader(false);}
    
     
  }
  return (
    //This component will be used to encapsulate the whole App,
    //so all components will have access to the Context
    <OrderContext.Provider
      value={{
        setOrderRequest,
        fetchOrderRequestContext,
        orderRequest,
        showLoader2,
        setShowLoader,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
//A simple hooks to facilitate the access to the AuthContext
// and permit components to subscribe to AuthContext updates
function useOrder(): OrderContextData {
  const context = useContext(OrderContext);

  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }

  return context;
}

export { OrderContext, OrderProvider, useOrder };
