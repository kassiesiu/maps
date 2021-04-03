/* eslint-disable import/prefer-default-export */
import PropTypes from "prop-types";

export const addedPlaces = {
  propTypes: PropTypes.arrayOf(
    PropTypes.shape({
      address: PropTypes.string,
      center: PropTypes.arrayOf(PropTypes.number),
      foursquare: PropTypes.string,
      place_name: PropTypes.string,
      wikidata: PropTypes.string,
    })
  ),
  default: [],
};
