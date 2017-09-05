import * as React from "react"
import * as ReactDOM from "react-dom"
import { AppContainer } from 'react-hot-loader'
import Root from './root/Root'
// import Hello from "./components/Hello"

const { configureStore, history } = require('./store/configureStore');
const store = configureStore();

ReactDOM.render(
    <AppContainer>
        <Root store={store} history={history} />
    </AppContainer>,
    document.getElementById("root")
);

if (module.hot) {
    module.hot.accept('./root/Root', ()=>{
        const NextApp = require('./root/Root').default
        ReactDOM.render(
            <AppContainer>
                <NextApp store={store} history={history} />
            </AppContainer>,
            document.getElementById("root")
        );
    })
}
