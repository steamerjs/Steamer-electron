import React, { Component } from 'react'
import { Provider } from 'react-redux'
import configureStore from '../stores/configureStore'

import IndexWrapper from '../container/index'

let store = configureStore()

export default class Root extends Component {
    render() {
        return (
            <Provider store={store}>
                <IndexWrapper />
            </Provider>
        )
    }
}