var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var points = [];
var clicking = false;
var index, select;
var lines = true;
var showCurves = true;
var showPoints = true;
var showCurvOfCurvs = false;
var bezierCurves = [];
var colorInterval = 0;
var colorA = 255;
var colorB = 0;
var colorC = 150;
var Ctop = true;
var curveDegree = prompt("Please enter the degree of the Bezier curves:", "");
var evaluations = prompt("Please enter the amount of evaluations you want:", "");
var curveIndex = -1;
setDegree();
setEvaluation();
function setDegree() {
  if(curveDegree!=null && curveDegree != "") {
    curveDegree = Number(curveDegree) + 1;
  } else {
    curveDegree = prompt("Please enter the degree of the Bezier curves:", "");
    setDegree();
  }
}

function setEvaluation() {
  if(evaluations!=null && evaluations != "") {
    evaluations = Number(evaluations);
  } else {
    evaluations = prompt("Please enter the amount of evaluations you want:", "");
    setEvaluation();
  }
}

function clearCanvas() {
  ctx.clearRect(0,0, canvas.width, canvas.height);
}

function hideLine(checkbox) {
  if (checkbox.checked) {
    lines = false;
  } else {
    lines = true;
  }
  draw();
}

function hidePoints(checkbox) {
  if (checkbox.checked) {
    showPoints = false;
  } else {
    showPoints = true;
  }
  draw();
}

function hideCurves(checkbox) {
  if (checkbox.checked) {
    showCurves = false;
  } else {
    showCurves = true;
  }
  draw();
}

function hideCurveOfCurves(button) {
  if (showCurvOfCurvs) {
    button.innerHTML = 'Desenhe curvas de curvas';
    showCurvOfCurvs = false;
  } else {
    button.innerHTML = 'Apague curvas de curvas';
    showCurvOfCurvs = true;
  }
  draw();
}

function undoCurveOfCurves(){
  var button = document.getElementById("btn");
  button.innerHTML = 'Desenhe curvas de curvas';
  showCurvOfCurvs = false;
}

function draw() {
  clearCanvas();
  if(lines) {
    drawLine();
  }
  if(showPoints) {
    drawCircle();
  }
  if(showCurves) {
    drawCurve(bezierCurves);
  }
  if(showCurvOfCurvs) {
    drawCurveOfCurves();
  }
}

function pointBlank(a) {
  for (var j = 0; j < bezierCurves.length ; j++) {
    for (var i = 0; i < bezierCurves[j].controlPoints.length; i++) {
      if (Math.sqrt(Math.pow(a.x - bezierCurves[j].controlPoints[i].x, 2) + Math.pow(a.y - bezierCurves[j].controlPoints[i].y, 2)) <= 20) {
        return [false, j, i];
      }
    }
  }
  return [true, -1, -1];
}
function drawCircle() {
  if(showPoints) {
    for (var j = 0; j < bezierCurves.length; j++) {
      for(var i = 0; i < bezierCurves[j].controlPoints.length; i++) {
        ctx.beginPath();
        ctx.arc(bezierCurves[j].controlPoints[i].x, bezierCurves[j].controlPoints[i].y, 10, 0, 2* Math.PI);
        ctx.fillStyle = 'blue';
        ctx.fill();
      }
    }
  }
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

function drawLine () {
  for (var j = 0; j < bezierCurves.length; j++) {
    for (var i = 0; i < bezierCurves[j].controlPoints.length -1; i++) {
      ctx.beginPath();
      ctx.moveTo(bezierCurves[j].controlPoints[i].x, bezierCurves[j].controlPoints[i].y);
      ctx.lineTo(bezierCurves[j].controlPoints[i+1].x, bezierCurves[j].controlPoints[i+1].y);
      ctx.lineWidth = 8;
      ctx.strokeStyle = 'red';
      ctx.stroke();
      ctx.closePath();

    }
  }
}


class Bezier {
  constructor(controlPoints, curvePoints) {
    this.controlPoints = controlPoints;
    this.curvePoints = curvePoints;
  }
}

function curve (point) {
  var curvePoints = [];
  for (var i=0;i <= evaluations; i++) {
    curvePoints.push(casteljau(point, i/evaluations));
  }
  return curvePoints;
}

function drawCurve() {
  for (var j = 0; j < bezierCurves.length; j++) {
    var cPoints = curve(bezierCurves[j].controlPoints);
        for (var i = 0; i < cPoints.length -1; i++) {

          ctx.beginPath();
          ctx.moveTo(cPoints[i].x, cPoints[i].y);
          ctx.lineTo(cPoints[i+1].x, cPoints[i+1].y);
          ctx.lineWidth = 6;
          ctx.strokeStyle = 'green';
          ctx.stroke();
          ctx.closePath();

        }
  }
}

function curveOfCurves() {
  var newCurves = [];
  var finalCurves = [];
  for (var i = 0; i < curveDegree; i++) {
    var newCurvesPoints = [];
    for(var j = 0; j < bezierCurves.length; j++) {
      newCurvesPoints.push(bezierCurves[j].controlPoints[i]);
    }
    newCurves.push(newCurvesPoints);
  }
  for (var i=0;i <= evaluations; i++) {
    finalCurves[i] = [];
    for(var j=0; j<newCurves.length; j++) {
      finalCurves[i].push(casteljau(newCurves[j], i/evaluations));
    }
  }
  return finalCurves;
}

function drawCurveOfCurves() {
  for(var i=0; i<bezierCurves.length ; i++) {
    if(bezierCurves[i].controlPoints.length < curveDegree) {
      alert("Complete the control points of all curves!");
      return;
    }
  }
  var cvc = curveOfCurves();
  for (var j = 0; j < cvc.length; j++) {
    var cPoints = curve(cvc[j]);
    var rndColor = getRndColor();
    for (var i = 0; i < cPoints.length -1; i++) {

        ctx.beginPath();
        ctx.moveTo(cPoints[i].x, cPoints[i].y);
        ctx.lineTo(cPoints[i+1].x, cPoints[i+1].y);
        ctx.lineWidth = 2;
        ctx.strokeStyle = rndColor;
        ctx.globalAlpha = 0.5;
        ctx.stroke();
        ctx.closePath();

    }
  }
}

function casteljau(point, t) {

  if (point.length == 0) {
    return null;
  } else if (point.length == 1) {
    return point[0];
  } else {
    var newPoints = [];
    for (var i = 0; i < point.length-1; i++) {
      var x = (1-t) * point[i].x + t * point[i+1].x;
      var y = (1-t) * point[i].y + t * point[i+1].y;
      newPoints.push(new Point(x, y));
    }
    return casteljau (newPoints, t);
  }
}

function getRndColor() {
  //return('hsl(200, 50%, 50%)');

  var r, g, b;
  if(colorInterval == 0){
    r = colorA;
    g = colorB;
    b = colorC;
  } else if (colorInterval == 1) {
    r = colorC;
    g = colorA;
    b = colorB;
  } else {
    r = colorB;
    g = colorC;
    b = colorA;
  }
  colorA--;
  colorB++;
  if(Ctop){
    colorC++;
    if(colorC > 255){
      Ctop = false;
    }
  }else{
    colorC--;
    if(colorC < 0){
      Ctop = true;
    }
  }

  //colorC = (colorC + 1)%255;
  if(colorA < 0) {
    colorA = 255;
    colorB = 0;
    colorInterval = (colorInterval + 1) % 3;
  }
  return 'rgb(' + r + ',' + g + ',' + b + ')';
}


canvas.addEventListener('mousedown', e => {
  clicking = true;
  var a = new Point(e.offsetX, e.offsetY);
  if (pointBlank(a)[0]) {
    if(bezierCurves.length == 0 || bezierCurves[curveIndex].controlPoints.length >= curveDegree) {
      curveIndex++;
      var b = new Bezier([a], curve([a]));
      bezierCurves.push(b);
    } else {
      bezierCurves[curveIndex].controlPoints.push(a);
    }
    undoCurveOfCurves()
    draw();
  }
});

canvas.addEventListener('mouseup', e => {
  clicking = false;
});
canvas.addEventListener('mousemove', e => {
  var a = new Point(e.offsetX, e.offsetY);
  if(!clicking) {
    selectedPointIndex = pointBlank(a)[2];
    selectedCurveIndex = pointBlank(a)[1];
    select = !pointBlank(a)[0];
  }
  if(clicking && select) {
    bezierCurves[selectedCurveIndex].controlPoints[selectedPointIndex].x = e.offsetX;
    bezierCurves[selectedCurveIndex].controlPoints[selectedPointIndex].y = e.offsetY;
    draw();
  }
});

//APAGANDO CURVAS DE BEZIER

canvas.addEventListener('dblclick', e => {
  var a = new Point(e.offsetX, e.offsetY);
  if(!pointBlank(a)[0]) {
    bezierCurves.splice(pointBlank(a)[1], 1);
    curveIndex--;
    undoCurveOfCurves()
  }
  draw();
});
