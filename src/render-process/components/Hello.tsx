import * as React from "react";

export interface HelloProps {  }

// 'HelloProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
export default class Hello extends React.Component<HelloProps, undefined> {
    render() {
        return <h1>
            Welcome to Steamer Electron
            <p>Please press the button to continue</p>
        </h1>;
    }
}