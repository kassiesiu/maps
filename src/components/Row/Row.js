import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
          <span className="name">{item.place_name}</span>
          {item.properties.address}
          {item.properties.foursquare}
        </div>

        <button onClick={this.addToPlaces} type="button">Add</button>
      </div>
    );
  }
}

Row.propTypes = {
  item: PropTypes.shape({
    place_name: PropTypes.string,
    properties: PropTypes.shape({
      address: PropTypes.string,
      foursquare: PropTypes.string,
    }),
  }),
  onAddToPlaces: PropTypes.func,
};

Row.defaultProps = {
  item: {},
  onAddToPlaces: () => {},
};

export default Row;
