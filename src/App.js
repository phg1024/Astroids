import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class Circle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pos: [props['x'], props['y']],
      velo: [(Math.random()-0.5)*10, (Math.random()-0.5)*10],
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
    velo[0] *= 0.995;
    velo[1] *= 0.995;

    velo[0] += (Math.random()-0.5)*Math.max(1.0, Math.abs(velo[0]));
    velo[1] += (Math.random()-0.5)*Math.max(1.0, Math.abs(velo[1]));

    // limit the speed
    velo[0] = Math.min(Math.abs(velo[0]), 15) * (velo[0]>0?1:-1);
    velo[1] = Math.min(Math.abs(velo[1]), 15) * (velo[1]>0?1:-1);

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
    this.state = {
      date: new Date(),
      pos: [0, 0],
      init_date: new Date()
    };
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
        <h1>Start playing!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
        <h3>You have played for {Math.floor((this.state.date - this.state.init_date)/1000.0)} seconds.</h3>
      </div>
    );
  }
}

class Ship extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pos: [props['x'], props['y']],
      velo: [0, 0],
      ang_velo: 0,
      theta: 0,
      color: props['color']
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
    velo[0] *= 0.95;
    velo[1] *= 0.95;

    var ang_velo = this.state.ang_velo;
    var oldtheta = this.state.theta;
    var theta = oldtheta + ang_velo;
    ang_velo *= 0.75;

    var new_x = parseFloat(oldpos[0]) + this.state.velo[0];
    var new_y = parseFloat(oldpos[1]) + this.state.velo[1];
    if(new_x < 0) new_x += 640;
    if(new_x >= 640) new_x -= 640;
    if(new_y < 0) new_y += 480;
    if(new_y >= 480) new_y -= 480;

    this.setState({pos: [new_x, new_y], velo: velo, theta: theta, ang_velo: ang_velo});
  }

  move = (x, y) => {
    var oldpos = this.state.pos;
    var new_x = parseFloat(oldpos[0]) + x;
    var new_y = parseFloat(oldpos[1]) + y;
    this.setState({pos: [new_x, new_y]});
  }

  turn = (delta) => {
    var ang_velo = this.state.ang_velo;
    ang_velo += delta;
    this.setState({ang_velo: ang_velo});
  }

  move_forward = (s) => {
    var oldpos = this.state.pos;
    var move_dir = [Math.cos((this.state.theta+90)/180.0*Math.PI),
                    Math.sin((this.state.theta+90)/180.0*Math.PI)];
    var velo = this.state.velo;
    velo[0] -= move_dir[0] * s;
    velo[1] -= move_dir[1] * s;
    this.setState({velo: velo});
  }
  render() {
    var translate_op = "translate(" + parseFloat(this.state.pos[0]) + "," + parseFloat(this.state.pos[1]) + ")";
    var rotate_op = "rotate(" + parseFloat(this.state.theta) + ")";
    var transform_op = translate_op + " " + rotate_op;
    var velo = this.state.velo;
    var vmag = Math.min(1.0, Math.sqrt(velo[0] * velo[0] + velo[1] * velo[1]) / 5.0);
    var scale_op = "scale(" + vmag + "," + vmag + ")";
    var transform_op2 = transform_op + " " + scale_op;
    return (
      <g>
      <polygon className="ship" points="0,25 5,15 -5,15" transform={transform_op2} fill="yellow"/>
      <polygon className="ship" points="0,20 2.5,15 -2.5,15" transform={transform_op2} fill="red"/>
      <polygon className="ship" points="0,-25 10,15 -10,15" transform={transform_op} fill="white"/>
      </g>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    var circles = [];
    for(var i=0;i<8;++i) {
      var r = Math.floor(Math.random() * 255);
      var g = Math.floor(Math.random() * 255);
      var b = Math.floor(Math.random() * 255);
      var theta = Math.random()*6.28;
      circles.push(
        {
          pos: [320 + Math.cos(theta) * (150 + Math.random()*250),
                240 + Math.sin(theta) * (150 + Math.random()*250)],
          color: 'rgb('+ r + ',' + g + ',' + b +')'
        });
    }
    console.log(circles);
    var ship = {
      pos: [320, 240],
      color: 'white'
    };
    this.state = {circles: circles, ship: ship, num_astroids: 8, key: null};
    document.getElementById("body").onkeypress = this.handleKeyPress;
  }
  renderCircle(i) {
    var obj = this.state.circles[i];
    return obj;
  }
  renderAllCircles() {
    var cicles_to_draw = this.state.circles.slice(0, this.state.num_astroids);
    var all_circles = cicles_to_draw.map((obj) =>
      <Circle x={String(obj.pos[0])} y={String(obj.pos[1])} color={obj.color} radius={String(Math.random()*5.0 + 5.0)} />
    );
    return all_circles;
  }

  renderShip() {
    var ship = this.state.ship;
    return (<Ship ref="ship" x={String(ship.pos[0])} y={String(ship.pos[1])} color={ship.color}/>);
  }

  handleKeyPress = (event) => {
    console.log(event);
    this.setState({key: event.key});
    switch(event.key) {
      case 'A':
      case 'a': {
        console.log('turn left');
        this.refs.ship.turn(-5);
        break;
      }
      case 'D':
      case 'd': {
        console.log('turn right');
        //this.refs.ship.move(1, 0);
        this.refs.ship.turn(5);
        break;
      }
      case 'W':
      case 'w': {
        console.log('move forward');
        this.refs.ship.move_forward(5);
        break;
      }
      case ' ': {
        console.log('shoot');
        break;
      }
    }
  }

  handleClick(event) {
    console.log(event);
  }

  changeDifficulty = (event) => {
    console.log(event.target.value);
    var num_astroids = 0;
    if(event.target.value == 'Easy') {
        num_astroids = 8;
    } else if (event.target.value === 'Normal') {
        num_astroids = 16;
    } else if (event.target.value === 'Hard') {
        num_astroids = 32;
    } else if (event.target.value === 'Expert') {
        num_astroids = 64;
    } else if (event.target.value === 'Good Luck') {
        num_astroids = 128;
    }

    // reinitialize the positions
    var circles = [];
    for(var i=0;i<num_astroids;++i) {
      var r = Math.floor(Math.random() * 255);
      var g = Math.floor(Math.random() * 255);
      var b = Math.floor(Math.random() * 255);
      var theta = Math.random()*6.28;
      circles.push(
        {
          pos: [320 + Math.cos(theta) * (150 + Math.random()*250),
                240 + Math.sin(theta) * (150 + Math.random()*250)],
          color: 'rgb('+ r + ',' + g + ',' + b +')'
        });
    }
    this.setState({num_astroids: num_astroids, circles: circles});
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Escaping Nebular</h2>
        </div>
        <p className="App-intro">
          Yet another Astroids game simulator. Created just for fun.<br/>
          Use <code>A</code> and <code>D</code> to change orientation, and <code>W</code> to move forward!
        </p>
        <svg className="canvas-region" onClick={this.handleClick}>
          {this.renderAllCircles()}
          {this.renderShip()}
        </svg>
        <br/>
        Difficulty: <select onChange={this.changeDifficulty}>
        <option>Easy</option>
        <option>Normal</option>
        <option>Hard</option>
        <option>Expert</option>
        <option>Good Luck</option>
        </select>
        <Clock />
      </div>
    );
  }
}

export default App;
