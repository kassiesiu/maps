/* eslint-disable react/jsx-filename-extension */
import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import Row from './Row';
import request from '../api/request';
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';

const acc = 'pk.eyJ1Ijoia2Fzc2lld29uZyIsImEiOiJjandvZmozNTcwbjE2NDhxcXJkdDk4cTQzIn0.M_IAIl2WS48X0B_yAeiGww';

class App extends Component {
  static createMarker(text) {
    const marker = document.createElement('div');
    marker.className = 'marker';

    const innerMarker = document.createElement('div');
    innerMarker.className = 'marker-after';
    innerMarker.innerText = text;

    marker.appendChild(innerMarker);

    return marker;
  }

  constructor(props) {
    super(props);

    this.state = { results: [], places: [] };

    this.search = this.search.bind(this);
    this.addToPlaces = this.addToPlaces.bind(this);
    this.retrieveDirections = this.retrieveDirections.bind(this);
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      accessToken: acc,
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-115.1492, 36.1663],
      zoom: 9,
    });
  }

  search({ target: { value } }) {
    if (value.length < 3) {
      return;
    }

    request(`geocoding/v5/mapbox.places/${value}.json?`, (res) => {
      this.setState({
        results: res.features,
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
    const coordinates = places.map(({ center }) => center.join(',')).join(';');
    request(`directions/v5/mapbox/driving/${coordinates}?annotations=duration&overview=full&geometries=geojson&`, (res) => {
      const [routes] = res.routes;
      this.map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: routes.geometry,
        },
      });
      this.map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#BBDC2F',
          'line-width': 4,
        },
      });

      this.map.fitBounds(
        places.map(({ center }) => center),
      );

      places.forEach(({ center }, index) => {
        new mapboxgl.Marker(App.createMarker(index + 1))
          .setLngLat(center).addTo(this.map);
      });
    });
  }

  renderResults() {
    const { results } = this.state;

    return results.map((item) => (
      (<Row item={item} onAddToPlaces={this.addToPlaces} />)
    ));
  }

  render() {
    return (
      <div className="App">
        <div className="left-side">
          <input onChange={this.search} />
          {this.renderResults()}
          <button onClick={this.retrieveDirections} type="button">Retrieve Directions</button>
        </div>

        <div id="map" className="map" />
      </div>
    );
  }
}

export default App;
