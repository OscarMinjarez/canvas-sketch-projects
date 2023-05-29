const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [1080, 1080],
  animate: true,
  timeScale: 1
};

const sketch = ({ context, width, height }) => {
    const effect = new Effect(width, height);

  return ({ context, width, height }) => {
    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);

    effect.handleParticles(context);
    effect.connectParticles(context);
  };
};

class Particle {
  constructor(effect) {
    this.effect = effect;
    this.radius = Math.random() * 6 + 4;
    this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
    this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
    this.vx = Math.random() * 1 - 0.5;
    this.vy = Math.random() * 1 - 0.5;
    this.color = 1;
  }

  draw(context) {
    context.fillStyle = "hsl(" + this.color + ", 100%, 50%)";
    context.strokeStyle = "hsl(" + this.color + ", 100%, 50%)";

    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.color += 0.5;

    if (this.x > this.effect.width - this.radius || this.x < this.radius) this.vx *= -1;
    if (this.y > this.effect.height - this.radius || this.y < this.radius) this.vy *= -1;
  }
}

class Effect {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.particles = [];
    this.numberOfParticles = 500;
    this.createParticles();
  }

  createParticles() {
    for (let i = 0; i < this.numberOfParticles; i++) {
      this.particles.push(new Particle(this));
    }
  }

  handleParticles(context) {
    this.connectParticles(context);

    this.particles.forEach(particle => {
      particle.draw(context);
      particle.update();
    });
  }

  connectParticles(context) {
    const maxDistance = 100;

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;

        const distance = Math.hypot(dx, dy);

        if (distance < maxDistance) {
          const opacity = 1 - (distance / maxDistance);

          context.save();
          context.globalAlpha = opacity;
          context.beginPath();
          context.moveTo(this.particles[i].x, this.particles[i].y);
          context.lineTo(this.particles[j].x, this.particles[j].y);
          context.stroke();
          context.restore();
        }
      }
    }
  }
}

canvasSketch(sketch, settings);
