const {
  exec
} = require('child_process');

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var zoombaStatsPath = zoombaPath + '/zoombaStats.json';
let testWallPath = 'testWalls.json'
var rawZoombadata = fs.readFileSync(zoombaStatsPath);
var zoombaData = JSON.parse(rawZoombadata);
var rawTestWalldata = fs.readFileSync(testWallPath);
var zoombaPositionDataPath = zoombaPath + "/positionData.json"
var rawZoombaPositionData = fs.readFileSync(zoombaPositionDataPath);
var zoombaPositionData = JSON.parse(rawZoombaPositionData);
var djZoomba = false;
var turnRight = false;
var turnLeft = false;
var moveForward = false;
// test
const canvasW = c.getBoundingClientRect().width;
const canvasH = c.getBoundingClientRect().height;

var zoombaPathfindingDataPath = zoombaPath + "/path.json"
var rawZoombaPathfindingData = fs.readFileSync(zoombaPathfindingDataPath);
var zoombaPathData = JSON.parse(rawZoombaPathfindingData);



zoomba = {
  zoombaImg: document.getElementById("zoombaImg"),
  x: zoombaPositionData.x,
  y: zoombaPositionData.y,
  rotation: (zoombaPositionData.rotation) * (Math.PI / 180), //shifts so up is 0 deg, and converts to radians
  radius: zoombaData.radius,
  visualDistance: zoombaData.visualDistance,

  correctRotation: function(input) {
    return (-input) * (Math.PI / 180)
  },

  draw: function() {
    ctx.setTransform(1, 0, 0, 1, this.x + this.radius, this.y + this.radius); // sets scale and origin
    ctx.rotate(this.rotation + (Math.PI / 2));
    ctx.drawImage(this.zoombaImg, -this.zoombaImg.width / 2, -this.zoombaImg.height / 2);
    ctx.setTransform(1, 0, 0, 1, 0, 0)
  },
  drawVision: function() {
    ctx.moveTo(this.x + this.radius, this.y + this.radius)
    var newX = Math.cos(this.rotation) * this.visualDistance + this.x + this.radius
    var newY = Math.sin(this.rotation) * this.visualDistance + this.y + this.radius
    ctx.lineTo(newX, newY)
    ctx.strokeStyle = "#fc0107"
    ctx.stroke()
  },
  cycle: function() {
    this.draw();
    this.drawVision();
  },
  rotate: function(degrees) {
    zoombaPositionData.rotation += (degrees * (Math.PI / 180))
  },
  moveForward: function(distance) {
    if (config.testingMode) {
      zoombaPositionData.x += Math.cos(this.rotation) * distance
      zoombaPositionData.y += Math.sin(this.rotation) * distance
    }
  },
  turn: function(direction) {
    if (config.testingMode) {
      if (direction == 'clockwise') {
        this.moveForward(1)
        this.rotate(50)
      }
      if (direction == 'counterClockwise') {
        this.moveForward(1)
        this.rotate(-50)
      }
    }

  }
}



function setActionList(actionList) {
  var paras = document.getElementsByClassName('action');
  var actionListContainer = document.getElementById("incomingActions")
  while (paras[0]) {
    paras[0].parentNode.removeChild(paras[0]);
  }
  for (var i = 0; i < actionList.length; i++) {
    actionListContainer.innerHTML += "<div class='action'>" + actionList[i] + "</div>"
  }
}


function generateDestinationNode() {
  nodeX = zoombaData.destination.x
  nodeY = canvasH - zoombaData.destination.y
}

function generateRandomNode() {
  zoombaData.destination.x = Math.floor(Math.random() * c.width)
  zoombaData.destination.y = Math.floor(Math.random() * c.height)
  writeZoombaJson();
}

function drawRandomNode() {
  ctx.beginPath()
  ctx.arc(nodeX, nodeY, 5, 0, 2 * Math.PI)
  ctx.fill()
}

function drawPathPoints(x, y) {
  ctx.beginPath()
  ctx.arc(x, canvasH - y, 1, 0, 2 * Math.PI)
  ctx.fill()
}


function writeZoombaJson() {
  fs.writeFileSync(zoombaStatsPath, JSON.stringify(zoombaData))
  fs.writeFileSync(zoombaPositionDataPath, JSON.stringify(zoombaPositionData))
}

function drawPathfinding() {
  for (var i = 0; i < zoombaPathData.path.length; i++) {
    ctx.strokeStyle = "#21ff06"
    ctx.beginPath()
    ctx.moveTo(zoombaPathData.path[i].start[0], canvasH - zoombaPathData.path[i].start[1]);
    ctx.lineTo(zoombaPathData.path[i].end[0], canvasH - zoombaPathData.path[i].end[1]);
    ctx.stroke();
  }
}

function pathfind() {
  console.log("Pathfinding...")
  document.getElementById("pathfindButton").className = "inProgress"
  document.getElementById("pathfindButton").innerHTML = "Pathfinding..."
  exec('cd ' + zoombaPath + "; python3 pathfinder.py", (err, stdout, stderr) => {
    if (err) {
      //some err occurred
      console.error(err)
    } else {
      document.getElementById("pathfindButton").className = ""
      document.getElementById("pathfindButton").innerHTML = "Pathfinder"
    }
  })
}

function preformCycle() {

  try {
    if (config.testingMode) {
      writeZoombaJson();
    }
    //Refreshing The Frame
    c.width += 0

    //Updating Up Zoomba Path Data
    zoombaPath = zoombaPathInput.value

    //Upading The Zoomba JSON Files


    //Setting Up The Zoomba Data JSON Reading
    zoombaStatsPath = zoombaPath + '/zoombaStats.json';
    rawZoombadata = fs.readFileSync(zoombaStatsPath);
    zoombaData = JSON.parse(rawZoombadata);


    //Setting Up Test Wall Data
    rawTestWalldata = fs.readFileSync(testWallPath);

    //Setting Up Position Data JSON Reading
    zoombaPositionDataPath = zoombaPath + "/positionData.json"
    rawZoombaPositionData = fs.readFileSync(zoombaPositionDataPath);
    zoombaPositionData = JSON.parse(rawZoombaPositionData);


    //Setting Up Pathfinding Data
    zoombaPathfindingDataPath = zoombaPath + "/path.json"
    rawZoombaPathfindingData = fs.readFileSync(zoombaPathfindingDataPath);
    zoombaPathData = JSON.parse(rawZoombaPathfindingData);


    //Setting Up Pathfinding Data
    zoombaPathPointsDataPath = zoombaPath + "/pathPoints.json"
    rawZoombaPathPointsData = fs.readFileSync(zoombaPathPointsDataPath);
    zoombaPathPointsData = JSON.parse(rawZoombaPathPointsData);

    zoombaPathPointsData.points.forEach(function(point) {
      drawPathPoints(point[0], point[1]);
    })


    //Updating Position Data
    if (isNaN(zoomba.x) || isNaN(zoomba.x) || isNaN(zoomba.x)) {

    } else {
      setActionList(zoombaData.actions)
      zoomba.x = zoombaPositionData.x;
      zoomba.y = canvasH - zoombaPositionData.y;
      zoomba.rotation = zoomba.correctRotation(zoombaPositionData.rotation);
      zoomba.visualDistance = zoombaData.visualDistance;
      generateDestinationNode()
    }







    zoomba.cycle()
    drawPathfinding()
    if (turnRight) {
      zoomba.turn("clockwise")
    } else if (turnLeft) {
      zoomba.turn("counterClockwise")
    }
    if (moveForward) {
      zoomba.moveForward(1)
    }
    drawRandomNode()
  } catch (e) {
    console.log(e)
  }
  setTimeout(function() {
    preformCycle()
  }, 5)
}
preformCycle()