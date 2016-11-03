import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class Circle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pos: [props['x'], props['y']],
      velo: [(Math.random()-0.5)*100, (Math.random()-0.5)*100],
      color: props['color'],
      radius: props['radius']
    };
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.updatePos(),
      40,
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  updatePos() {
    var oldpos = this.state.pos;
    var velo = this.state.velo;
    velo[0] += (Math.random()-0.5)*Math.max(1.0, Math.abs(velo[0]));
    velo[1] += (Math.random()-0.5)*Math.max(1.0, Math.abs(velo[1]));

    var new_x = parseFloat(oldpos[0]) + this.state.velo[0];
    var new_y = parseFloat(oldpos[1]) + this.state.velo[1];
    if(new_x < 0) new_x += 640;
    if(new_x >= 640) new_x -= 640;
    if(new_y < 0) new_y += 480;
    if(new_y >= 480) new_y -= 480;

    this.setState({pos: [new_x, new_y]})
  }
  render() {
    return <circle className="circle" cx={String(this.state.pos[0])} cy={String(this.state.pos[1])} r={this.state.radius} stroke="green" strokeWidth="1" fill={this.state.color} />;
  }
}

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date(), pos: [0, 0]};
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date(),
      pos: [Math.random(), Math.random()]
    });
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
        <h3>Pos: {this.state.pos[0]}, {this.state.pos[1]}</h3>
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    var circles = [];
    for(var i=0;i<256;++i) {
      var r = Math.floor(Math.random() * 255);
      var g = Math.floor(Math.random() * 255);
      var b = Math.floor(Math.random() * 255);
      circles.push(
        {
          pos: [Math.random()*640, Math.random()*480],
          color: 'rgb('+ r + ',' + g + ',' + b +')'
        });
    }
      console.log(circles);
    this.state = {circles: circles};
  }
  renderCircle(i) {
    var obj = this.state.circles[i];
    return obj;
  }
  renderAllCircles() {
    var all_circles = this.state.circles.map((obj) =>
      <Circle x={String(obj.pos[0])} y={String(obj.pos[1])} color={obj.color} radius={String(Math.random()*20)} />
    );
    return all_circles;
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <svg className="canvas-region">
          {this.renderAllCircles()}
        </svg>
        <Clock />
      </div>
    );
  }
}

export default App;
