import * as React from 'react';
import { 
    Router,
    Switch, 
    Route 
} from 'react-router';
import App from './container/App';
import HomePage from './container/HomePage';
import CounterPage from './container/CounterPage';
import FrameworkPage from './container/FrameworkPage';

export default () => (
    <App>
        <Switch>
            <Route path="/counter" component={CounterPage} />
            <Route path="/framework" component={FrameworkPage} />
            <Route path="/" component={HomePage} />
            <Route component={HomePage} />
        </Switch>
    </App>
);
