import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppContainer } from 'react-hot-loader';
import Hello from "./components/Hello";

ReactDOM.render(
    <AppContainer>
        <Hello />
    </AppContainer>,
    document.getElementById("root")
);

if (module.hot) {
    module.hot.accept('./components/Hello.tsx', ()=>{
        console.log('Accepting Hello');
        const NextApp = require('./components/Hello').default;
        ReactDOM.render(
            <AppContainer>
                <NextApp />
            </AppContainer>,
            document.getElementById("root")
        );
    })
}
