import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Counter, IProps } from '../components/Counter';
import * as CounterActions from '../actions/counter';
import { IState } from '../reducers';
import { bindActionCreators } from 'redux';

function mapStateToProps(state: any){
  return {
    counter: state.counter
  };
}

function mapDispatchToProps(dispatch: any) {
  return bindActionCreators(CounterActions as any, dispatch);
}

export default class App extends React.Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
