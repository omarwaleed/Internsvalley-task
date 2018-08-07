const express = require('express')
const app = express()

const fuelStations = require('./fuelstations.json').features;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => {

  // Converts numeric degrees to radians
  function toRad(value) 
  {
    // console.log("Value", value, typeof value);
    return value * Math.PI / 180;
  }

  //This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
  function getDistance(lat1, lon1, lat2, lon2) 
  {
    console.log("params", lat1, lon1, lat2, lon2)
    var R = 6371e3; // metres
    var φ1 = toRad(lat1)
    var φ2 = toRad(lat2)
    var Δφ = toRad(lat2-lat1)
    var Δλ = toRad(lon2-lon1)
    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c;
    return d;
  }

  let { lat, lng } = req.query;
  let coordinateToSend = fuelStations[0];
  if(lat && lng){
    let minimum = {
      distance: 999999,
      index: -1
    }
    for (let index = 0; index < fuelStations.length; index++) {
      const station = fuelStations[index];
      // console.log(station);
      const { geometry } = station;
      const { coordinates } = geometry;
      let distance = getDistance(parseFloat(lat), parseFloat(lng), coordinates[1], coordinates[0]);
      console.log("Distance", distance)
      if(distance < minimum.distance){
        minimum.distance = distance;
        minimum.index = index;
      }
    }
    console.log(minimum);
    fuelStations[minimum.index].distance = minimum.distance;
    coordinateToSend = fuelStations[minimum.index];
  }
  console.log('sending', coordinateToSend);
  res.send(coordinateToSend)
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
