import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import List from './components/list';
import Error from './components/error'
import { Provider } from 'react-redux';
import store from './store';

class ErrorBoundery extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo)
  }
  render() {
    const { hasError } = this.state;
    return <Provider store={store}>
      {!hasError && <List />}
      {hasError && <Error />}
    </Provider>
  }
}

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundery />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
