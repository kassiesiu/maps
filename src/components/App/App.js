import React, { Component } from "react";
import Row from "../Row/Row";
import Search from "../Search/Search";
import Button from "../Button/Button";
import Map from "../Map/Map";
import request from "../../api/request";
import convertToHoursAndMinutes from "../../utils/convert-time";

import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { results: [], places: [], duration: 0 };

    this.search = this.search.bind(this);
    this.addToPlaces = this.addToPlaces.bind(this);
    this.retrieveDirections = this.retrieveDirections.bind(this);
  }

  setDuration(duration) {
    this.setState({
      duration,
    });
  }

  search(value) {
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
      results: [],
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
          return;
        }

        const [route] = res.routes;

        this.setState({ route });
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
    const { duration, results, route, places } = this.state;
    return (
      <div className="App">
        <div className="left-side">
          <Search
            placeholder="Search"
            items={results}
            onChange={this.search}
            onClick={this.addToPlaces}
          />
          <Button
            label="Retrieve Directions"
            onClick={this.retrieveDirections}
          />
          <div>{convertToHoursAndMinutes(duration)}</div>
        </div>

        <Map route={route} places={places} />
      </div>
    );
  }
}

export default App;
