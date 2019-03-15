import React, { Component } from 'react';

const API = 'https://api.coindesk.com/v1/bpi/currentprice.json'

class PrintTable extends Component {

  render() {
    let {current, previous} = this.props;

    if (Object.keys(previous).length === 0) previous = current;

    let currencies = Object.keys(current).map( key => {
      let delta = current[key].rate_float - previous[key].rate_float;

      return <tr
        key={key}>
        <th
          dangerouslySetInnerHTML={{__html: current[key].symbol}}>
        </th>
        <td>
          {previous[key].rate_float.toFixed(4)}
        </td>
        <td>
          {current[key].rate_float.toFixed(4)}
        </td>
        <td>
          {delta > 0 ? '+' + delta : delta }
        </td>
      </tr>
    })

    return (
      <div>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Previous</th>
              <th>Current</th>
              <th>Delta</th>
            </tr>
          </thead>
          <tbody>
            {currencies}
          </tbody>
        </table>
      </div>
    )
  }
}


class Final extends Component {

  state = {
    current: {},
    previous: {},
    isLoading: false,
    error: null
  }

  componentDidMount() {
    this.refresh()
  }

  refresh = () => {
    this.setState({isLoading: true})

    fetch(API)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong...');
        }
      })
      .then(data => this.setState({
        current: data.bpi,
        previous: this.state.current,
        isLoading:false}))
      .catch(error => this.setState({
        error,
        isLoading: false}))
  }

  render() {
    let {current, previous, isLoading, error} = this.state;

    if (error) {
      return <p>{error.message}</p>
    }

    if (isLoading) {
      return <p>Loading...</p>
    }

    return (
      <div>
        <div>
          <PrintTable
            current = {current}
            previous = {previous}
          />
        </div>
        <button
          onClick = {this.refresh}
        >
          refresh
        </button>
      </div>
    );
  }
}

export default Final;
