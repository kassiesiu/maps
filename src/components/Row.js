/* eslint-disable react/jsx-filename-extension */
import React, { Component } from 'react';

class Row extends Component {
  constructor(props) {
    super(props);
    this.addToPlaces = this.addToPlaces.bind(this);
  }

  addToPlaces() {
    const { item, onAddToPlaces } = this.props;
    onAddToPlaces(item);
  }

  render() {
    const { item } = this.props;
    return (
      <div className="Row">
        <div>
          {item.place_name}
          {item.properties.address}
          {item.properties.foursquare}
        </div>

        <button onClick={this.addToPlaces} type="button">Add</button>
      </div>
    );
  }
}

export default Row;
