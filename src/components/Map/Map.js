/* eslint-disable react/prop-types */
import React, { Component } from "react";
import mapboxgl from "mapbox-gl";
import PropTypes from "prop-types";
import equal from "fast-deep-equal";
import styles from "./Map.module.css";
import "mapbox-gl/dist/mapbox-gl.css";

class Map extends Component {
  static createMarker(text) {
    const marker = document.createElement("div");
    marker.className = styles.marker;

    const innerMarker = document.createElement("div");
    innerMarker.className = styles.markerAfter;
    innerMarker.innerText = text;

    marker.appendChild(innerMarker);

    return marker;
  }

  constructor(props) {
    super(props);

    this.updateMap = this.updateMap.bind(this);
  }

  componentDidMount() {
    const { center } = this.props;
    this.map = new mapboxgl.Map({
      accessToken: process.env.REACT_APP_MAP_BOX_API_KEY,
      container: "map",
      style: "mapbox://styles/kassiewong/cklersodi4c3a17rzyjwptw61",
      center,
      zoom: 9,
    });

    this.map.on("drag", () => {
      const { onChange } = this.props;

      onChange(this.map.getCenter());
    });
  }

  componentDidUpdate(prevProps) {
    const { route } = this.props;
    if (!equal(prevProps.route, route)) {
      this.updateMap();
    }
  }

  getCenter() {
    return this.map.getCenter();
  }

  updateMap() {
    const { route, places } = this.props;

    const line = this.map.getSource("route");

    if (!line) {
      this.map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: route.geometry,
        },
      });

      this.map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#BBDC2F",
          "line-width": 4,
        },
      });
    } else {
      line.setData({
        type: "Feature",
        properties: {},
        geometry: route.geometry,
      });
    }

    const { coordinates } = route.geometry;

    const boundss = coordinates.reduce(
      (bounds, coord) => bounds.extend(coord),
      new mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
    );

    this.map.fitBounds(boundss, {
      padding: 40,
    });

    places.forEach(({ center }, index) => {
      new mapboxgl.Marker(Map.createMarker(index + 1))
        .setLngLat(center)
        .addTo(this.map);
    });
  }

  render() {
    return <div id="map" className={styles.Map} />;
  }
}

Map.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number),
  route: PropTypes.shape({
    geometry: PropTypes.shape({
      coordinates: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    }),
  }),
  onChange: PropTypes.func,
};

Map.defaultProps = {
  center: [],
  route: {
    geometry: {
      coordinates: [],
    },
  },
  onChange: () => {},
};

export default Map;
