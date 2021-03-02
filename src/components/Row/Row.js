import React, { Component } from "react";
import PropTypes from "prop-types";

import styles from "./Row.module.css";

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
      <div className={styles.Row}>
        <span className={styles.name}>{item.place_name}</span>
        {item.address}
        {item.foursquare}

        <button onClick={this.addToPlaces} type="button">
          Add
        </button>
      </div>
    );
  }
}

Row.propTypes = {
  item: PropTypes.shape({
    place_name: PropTypes.string,
    address: PropTypes.string,
    foursquare: PropTypes.string,
  }),
  onAddToPlaces: PropTypes.func,
};

Row.defaultProps = {
  item: {},
  onAddToPlaces: () => {},
};

export default Row;
