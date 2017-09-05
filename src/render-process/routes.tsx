import * as React from 'react';
import { Switch, Route } from 'react-router';
import App from './container/App';
import HomePage from './container/HomePage';
import CounterPage from './container/CounterPage';

export default () => (
    <App>
        <Switch>
            <Route path="/counter" component={CounterPage} />
            <Route path="/" component={HomePage} />
        </Switch>
    </App>
);
