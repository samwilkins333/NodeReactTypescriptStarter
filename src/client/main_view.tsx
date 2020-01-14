
import * as React from "react";
import "./main_view.scss";
import { observable, action, runInAction } from "mobx";
import { observer } from "mobx-react";
import { Utilities } from "./utilities";
 
export interface MainViewProps {
    background: string;
}

@observer
export default class MainView extends React.Component<MainViewProps> {
    @observable private counter = 0;
    @observable private resolvedBackgroundColor?: string;
    private get backgroundColor() {
        if (!this.resolvedBackgroundColor) {
            return this.props.background;
        }
        return this.resolvedBackgroundColor;
    }

    private requestPreferredBackgroundColor = async () => {
        const { backgroundColor } = await Utilities.get("/backgroundColor");
        runInAction(() => this.resolvedBackgroundColor = backgroundColor);
    }

    componentDidMount() {
        setTimeout(this.requestPreferredBackgroundColor, 3000);
        Utilities.post("/recordMostRecentClient", { mostRecentClient: new Date().toUTCString() })
    }

    render() {
        const { backgroundColor } = this;
        return (
            <div
                className={"main-container"}
                style={{ background: backgroundColor }}
            >
                <img
                    className={"logo"}
                    src={"/images/logo.png"}
                    style={{ animation: `spin ${8 - (this.counter % 8)}s linear infinite` }}
                    onClick={action(() => this.counter++)}
                />
                <span className={"welcome"}>Hey there! Click the logo to change its rotational speed...</span>
            </div>
        );
    }

}