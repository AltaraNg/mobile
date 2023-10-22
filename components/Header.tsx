import React from "react";
import { View } from "../components/Themed";
import SVGImage from "../assets/svgs/splash.svg";

export default function Header(props) {
    return (
        <View style={{ backgroundColor: props.backgroundColor, paddingTop: 60, paddingLeft: 24 }}>
            <SVGImage width={150} height={75} />
        </View>
    );
}
