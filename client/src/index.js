import React from "react";
import ReactDOM from "react-dom";
import MapComponent from './map_component';

const Index = () => {
  return (
    <div>
      <div className="specColor" style={{textAlign: 'center', fontSize: 30, fontFamily: "Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif"}}>
        Welcome to the example task!
      </div>
      <MapComponent />
    </div>);
};

ReactDOM.render(<Index />, document.getElementById("index"));
