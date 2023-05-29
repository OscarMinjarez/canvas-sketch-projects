const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 720, 720 ],
  animate: true
};

const sketch = ({ context, width, height }) => {
  const particles = [];

  for (let i = 0; i < 200; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    particles.push(new Particle(x, y, context, width, height));
  }

  return ({ context, width, height }) => {
    context.fillStyle = "rgba(0, 0, 0, 0.18)";
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];
      particle.update();
      particle.draw();
    }
  };
};

canvasSketch(sketch, settings);

class Particle {
  constructor(x, y, ctx, width, height) {
    this.x = x;
    this.y = y;
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.speed = 2;
    this.angle = Math.random() * 2 * Math.PI;
    this.turnAngle = Math.PI / 6;
    this.radius = 5;
    this.colors = ["#FF0000", "#00FF00", "#FFFFFF"];
    this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = "white";
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = 4;
    this.ctx.stroke();
    this.ctx.fill();
    this.ctx.closePath();
  }

  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;

    this.angle += (Math.random() - 0.5) * this.turnAngle;

    if (this.x + this.radius > this.width) {
      this.x = this.width - this.radius;
      this.angle = Math.PI - this.angle;
    } else if (this.x - this.radius < 0) {
      this.x = this.radius;
      this.angle = Math.PI - this.angle;
    }

    if (this.y + this.radius > this.height) {
      this.y = this.height - this.radius;
      this.angle = -this.angle;
    } else if (this.y - this.radius < 0) {
      this.y = this.radius;
      this.angle = -this.angle;
    }
  }
}