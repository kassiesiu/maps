import React, { Component } from "react";
import mapboxgl from "mapbox-gl";
import Row from "../Row/Row";
import Search from "../Search/Search";
import request from "../../api/request";
import convertToHoursAndMinutes from "../../utils/convert-time";

import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";

class App extends Component {
  static createMarker(text) {
    const marker = document.createElement("div");
    marker.className = "marker";

    const innerMarker = document.createElement("div");
    innerMarker.className = "marker-after";
    innerMarker.innerText = text;

    marker.appendChild(innerMarker);

    return marker;
  }

  constructor(props) {
    super(props);

    this.state = { results: [], places: [], duration: 0 };

    this.search = this.search.bind(this);
    this.addToPlaces = this.addToPlaces.bind(this);
    this.retrieveDirections = this.retrieveDirections.bind(this);
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      accessToken: process.env.REACT_APP_MAP_BOX_API_KEY,
      container: "map",
      style: "mapbox://styles/kassiewong/cklersodi4c3a17rzyjwptw61",
      center: [-115.1492, 36.1663],
      zoom: 9,
    });
  }

  search(value) {
    if (value.length < 3) {
      return;
    }

    request(`geocoding/v5/mapbox.places/${value}.json?`, (res) => {
      const formattedRes = res.features.map((feature) => ({
        place_name: feature.place_name,
        address: feature.properties.address,
        foursquare: feature.properties.foursquare,
        wikidata: feature.properties.wikidata,
        center: feature.center,
      }));

      this.setState({
        results: formattedRes,
      });
    });
  }

  addToPlaces(item) {
    const { places } = this.state;
    this.setState({
      places: [...places, item],
    });
  }

  retrieveDirections() {
    const { places } = this.state;
    const stringifiedCoordinates = places
      .map(({ center }) => center.join(","))
      .join(";");

    request(
      `directions/v5/mapbox/driving/${stringifiedCoordinates}?annotations=duration&overview=full&geometries=geojson&`,
      (res) => {
        if (res.code === "InvalidInput") {
          console.log("error");
          return;
        }

        const [route] = res.routes;

        this.setState({ duration: route.duration });
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
          new mapboxgl.Marker(App.createMarker(index + 1))
            .setLngLat(center)
            .addTo(this.map);
        });
      }
    );
  }

  renderResults() {
    const { results } = this.state;

    return results.map((item) => (
      <Row item={item} onAddToPlaces={this.addToPlaces} />
    ));
  }

  render() {
    const { duration } = this.state;
    return (
      <div className="App">
        <div className="left-side">
          <Search onChange={this.search} />
          {this.renderResults()}
          <button onClick={this.retrieveDirections} type="button">
            Retrieve Directions
          </button>
          <div>{convertToHoursAndMinutes(duration)}</div>
        </div>

        <div id="map" className="map" />
      </div>
    );
  }
}

export default App;
