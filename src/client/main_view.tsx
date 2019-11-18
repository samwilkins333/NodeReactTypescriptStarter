
import * as React from "react";
import "./main_view.scss";

export default class MainView extends React.Component<{}> {

    render() {
        return (
            <div className={"welcome"}>
                <span>Hey there! Feel free to change me: I'm in main_view.tsx...</span>
                <img src={"/images/wooden_background.jpg"}/>
            </div>
        );
    }

}