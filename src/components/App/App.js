import React, { Component } from "react";
import Row from "../Row/Row";
import Search from "../Search/Search";
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
      bounds: {},
    };

    this.search = this.search.bind(this);
    this.change = this.change.bind(this);
    this.addToPlaces = this.addToPlaces.bind(this);
  }

  change(key, value) {
    this.setState({ [key]: value });
  }

  search(value) {
    const { center, bounds } = this.state;

    console.log("bounds :>> ", bounds);
    request(
      `geocoding/v5/mapbox.places/${value}.json?proximity=${center[0]},${center[1]}&`,
      (res) => {
        if (!res.features) {
          this.setState({
            searchResults: [],
          });

          return;
        }

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
          <div>{convertToHoursAndMinutes(duration)}</div>
          <Route places={addedPlaces} />
        </div>

        <Map
          route={route}
          places={addedPlaces}
          center={center}
          onChange={this.change}
        />
      </div>
    );
  }
}

export default App;
