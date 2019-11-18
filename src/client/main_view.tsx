
import * as React from "react";
import "./main_view.scss";

export default class MainView extends React.Component<{}> {

    render() {
        return (
            <div
                className={"welcome"}
                style={{ background: "url('/images/wooden_background.jpg')" }}>
                <span>Hey there! Feel free to change me: I'm in main_view.tsx...</span>
            </div>
        );
    }

}