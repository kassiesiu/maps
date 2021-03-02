import React, { Component } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarker } from "@fortawesome/free-solid-svg-icons";

import styles from "./Route.module.css";

class Route extends Component {
  static renderAddress(address) {
    return address ? (
      <span className={styles.addressPlace}>
        <FontAwesomeIcon className={styles.icon} icon={faMapMarker} />
        {address}
      </span>
    ) : (
      ""
    );
  }

  render() {
    const { places } = this.props;

    return (
      <div>
        {places.map((place, index) => (
          <div className={styles.containerPlace}>
            <div className={styles.bullet}>{index + 1}</div>

            <div className={styles.place}>
              <span className={styles.namePlace}>{place.text}</span>
              {Route.renderAddress(place.address)}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

Route.propTypes = {
  places: PropTypes.arrayOf(
    PropTypes.shape({
      address: PropTypes.string,
      center: PropTypes.arrayOf(PropTypes.number),
      foursquare: PropTypes.string,
      place_name: PropTypes.string,
      text: PropTypes.string,
      wikidata: PropTypes.string,
    })
  ),
};

Route.defaultProps = {
  places: [],
};

export default Route;
