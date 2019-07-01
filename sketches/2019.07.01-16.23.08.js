const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 2048, 2048 ]
};

const step = 100;
const lines = [];
const size = settings.dimensions[0] + 50;

const createGrid = () => {
  for(var i = step; i <= size - step; i += step) {
    var line = [];
    for(var j = step; j <= size - step; j+= step) {
      var distanceToCenter = Math.abs(j - size / 2);
      var variance = Math.max(size / 2 - 300 - distanceToCenter, 0);
      var random = Math.random() * variance / 2 * -1;
      var point = {x: j, y: i + random};
      line.push(point);
    } 
    lines.push(line);
  }
};

const renderLines = (context) => {
  for(var i = 5; i < lines.length; i++) {

    context.beginPath();
    context.moveTo(lines[i][0].x, lines[i][0].y);
    
    for(var j = 0; j < lines[i].length - 2; j++) {
      var xc = (lines[i][j].x + lines[i][j + 1].x) / 2;
      var yc = (lines[i][j].y + lines[i][j + 1].y) / 2;
      context.quadraticCurveTo(lines[i][j].x, lines[i][j].y, xc, yc);
    }

    context.quadraticCurveTo(lines[i][j].x, lines[i][j].y, lines[i][j + 1].x, lines[i][j + 1].y);
    context.save();
    context.globalCompositeOperation = 'destination-out';
    context.fill();
    context.restore();
    context.stroke();
  }
};

const sketch = () => {

  createGrid();

  return ({ context, width, height }) => {
    context.lineWidth = 6;
    renderLines(context);
  };
};

canvasSketch(sketch, settings);
