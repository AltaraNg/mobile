import React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector } from "react-redux";

import { Wrapper, InnerContainer, BadgeTxt } from "./styles";

export const IconWithBadge = ({ name, color, size, routeName }) => {
    const orders = useSelector((state) => state.order.orderList);
    let badgeCount = 0;
    orders.map((item) => {
        if (item.status === "READY_FOR_PICKUP") {
            return badgeCount++;
        }
    });
    return (
        <Wrapper>
            <Icon name={name} size={size} color={color} />
            {routeName === "Orders" && badgeCount > 0 ? (
                <InnerContainer>
                    <BadgeTxt>{badgeCount}</BadgeTxt>
                </InnerContainer>
            ) : null}
        </Wrapper>
    );
};
