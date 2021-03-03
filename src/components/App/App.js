import React, { Component } from "react";
import Row from "../Row/Row";
import Search from "../Search/Search";
import Button from "../Button/Button";
import Map from "../Map/Map";
import Route from "../Route/Route";
import request from "../../api/request";
import convertToHoursAndMinutes from "../../utils/convert-time";

import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      addedPlaces: [],
      duration: 0,
      center: [-115.1492, 36.1663],
    };

    this.search = this.search.bind(this);
    this.setCenter = this.setCenter.bind(this);
    this.addToPlaces = this.addToPlaces.bind(this);
    this.retrieveDirections = this.retrieveDirections.bind(this);
  }

  setCenter({ lng, lat }) {
    this.setState({ center: [lng, lat] });
  }

  search(value) {
    const { center } = this.state;

    request(
      `geocoding/v5/mapbox.places/${value}.json?proximity=${center[0]},${center[1]}&`,
      (res) => {
        const formattedRes = res.features.map((feature) => ({
          place_name: feature.place_name,
          text: feature.text,
          address: feature.properties.address,
          foursquare: feature.properties.foursquare,
          wikidata: feature.properties.wikidata,
          center: feature.center,
        }));

        this.setState({
          searchResults: formattedRes,
        });
      }
    );
  }

  addToPlaces(item) {
    const { addedPlaces } = this.state;
    this.setState({
      addedPlaces: [...addedPlaces, item],
      searchResults: [],
    });
  }

  retrieveDirections() {
    const { addedPlaces } = this.state;
    const stringifiedCoordinates = addedPlaces
      .map(({ center }) => center.join(","))
      .join(";");

    request(
      `directions/v5/mapbox/driving/${stringifiedCoordinates}?annotations=duration&overview=full&geometries=geojson&`,
      (res) => {
        if (res.code === "InvalidInput") {
          return;
        }

        const [route] = res.routes;

        this.setState({
          duration: route.duration,
        });

        this.setState({ route });
      }
    );
  }

  renderSearchResults() {
    const { searchResults } = this.state;

    return searchResults.map((item) => (
      <Row item={item} onAddToPlaces={this.addToPlaces} />
    ));
  }

  render() {
    const { duration, searchResults, route, addedPlaces, center } = this.state;
    return (
      <div className="App">
        <div>
          <Search
            placeholder="Search"
            items={searchResults}
            onChange={this.search}
            onClick={this.addToPlaces}
          />
          <Button
            label="Retrieve Directions"
            onClick={this.retrieveDirections}
          />
          <div>{convertToHoursAndMinutes(duration)}</div>
          <Route places={addedPlaces} />
        </div>

        <Map
          route={route}
          places={addedPlaces}
          center={center}
          onChange={this.setCenter}
        />
      </div>
    );
  }
}

export default App;
