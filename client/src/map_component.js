import React from 'react';

class MapComponent extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      name: 'Loading...',
      coordinates: [0, 0],
      marker: null,
      distance: null
    };
  }
  componentDidMount() {
    fetch('http://localhost:3000')
      .then(response => response.json())
      .then((json) => {
        const { properties, geometry } = json;
        this.setState({
          name: properties.name,
          coordinates: geometry.coordinates,
        }, ()=>{
          console.log(this.state.coordinates)
          let coords = this.state.coordinates;
          coords.reverse();
          let marker = L.marker(coords).addTo(this.map);
          this.setState({marker})
        });
      })
      .catch((err)=>{
        console.error(err);
      })
    this.map = new L.Map('mapid');
    const osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const attribution = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
    const osm = new L.TileLayer(osmUrl, {
      minZoom: 8,
      maxZoom: 12,
      attribution,
    });
    this.map.setView(new L.LatLng(52.51, 13.40), 9);
    // L.marker([52.51, 13.40]).addTo(this.map);
    this.map.addLayer(osm);
    // console.log(this.map)
    this.map.on('click', (event)=>{
      console.log(event.latlng);
      fetch(`http://localhost:3000/?lat=${event.latlng.lat}&lng=${event.latlng.lng}`)
      .then((response)=>{
        return response.json();
      })
      .then((json)=>{
        console.log(json)
        let coords = json.geometry.coordinates;
        coords.reverse();
        this.map.removeLayer(this.state.marker)
        let marker = L.marker(coords).addTo(this.map);
        this.setState({marker, distance: json.distance.toFixed(2), name: json.properties.name, coordinates: json.geometry.coordinates});
      })
      .catch((err)=>{
        console.error(err);
      })
    })
  }
  render() {
    return (
        <div>
          <div id="container">
            Name: {this.state.name}<br />
            {
              this.state.distance?
              <div id="distance-container">
                Distance: {this.state.distance} Meters
              </div>
              :
              <div><br /></div>
            }
            {this.state.coordinates[1]} {this.state.coordinates[0]}
          </div>
          <div id="mapid"></div>
        </div>);
  }
};

export default MapComponent;
