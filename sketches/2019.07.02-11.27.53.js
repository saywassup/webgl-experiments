
const canvasSketch = require('canvas-sketch');
const { value } = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 2048, 2048 ],
  animate: true
};

class Circle {
  constructor(x, y) {
    this.posY = settings.dimensions[0] * y;
    this.posX = settings.dimensions[0] * x;
  }

  update() { // Velocity
    this.posX += value() * 5;
    this.posY += value() * 1;
  }

  draw(context) { // Render
    context.beginPath();
      context.arc( this.posX, this.posY, 35, 0, 2 * Math.PI);
      context.lineWidth = 5;
      context.stroke();
    context.closePath();
  }
};

const generateCircles = (quantity) => {
  let circles = [];
  
  for(let i = 0; i < quantity; i++) {
    circles.push(new Circle(i * 0.1, i * 0.1));
  }

  return circles;
};

const sketch = () => {
  
  const circles = generateCircles(10);
  
  return ({ context, width, height, }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    circles.forEach(circle => {
      circle.update();
      circle.draw(context);
    });
  };
};

canvasSketch(sketch, settings);
