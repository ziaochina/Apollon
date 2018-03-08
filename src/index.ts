import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./gui/App";
import { Theme } from "./gui/theme";
import { ReduxState } from "./redux";

export interface ApollonOptions {
    initialState: ReduxState | null;
    theme: Partial<Theme>;
}

export default class ApollonEditor {
    private readonly options: Partial<ApollonOptions>;

    constructor(options: Partial<ApollonOptions> = {}) {
        this.options = options;
    }

    render(container: HTMLElement | null) {
        if (container === null) {
            return;
        }

        const { initialState = null, theme = {} } = this.options;

        const app = React.createElement(App, { initialState, theme });
        ReactDOM.render(app, container);
    }
}