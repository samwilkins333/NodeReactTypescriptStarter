
import * as React from "react";
import "./main_view.scss";
import { observable, action } from "mobx";
import { observer } from "mobx-react";

export interface MainViewProps {
    background: string;
}

@observer
export default class MainView extends React.Component<MainViewProps> {
    @observable private counter = 0;

    render() {
        const { background } = this.props;
        return (
            <div
                className={"container"}
                style={{ background }}
            >
                <img
                    className={"logo"}
                    src={"/images/logo.png"}
                    onClick={action(() => this.counter++)}
                    style={{ animation: `spin ${8 - (this.counter % 8)}s linear infinite` }}
                />
                <span className={"welcome"}>Hey there! Click the logo to change its rotational speed...</span>
            </div>
        );
    }

}