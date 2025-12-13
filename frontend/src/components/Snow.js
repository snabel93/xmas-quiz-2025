import React, { useEffect, useRef } from 'react';

const Snow = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Snowflake configuration
    const snowflakes = [];
    const numberOfSnowflakes = 100;

    class Snowflake {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * -canvas.height;
        this.radius = Math.random() * 3 + 1;
        this.speed = Math.random() * 1 + 0.5;
        this.wind = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.3;
      }

      update() {
        this.y += this.speed;
        this.x += this.wind;

        // Reset snowflake when it goes off screen
        if (this.y > canvas.height) {
          this.y = -10;
          this.x = Math.random() * canvas.width;
        }
        if (this.x > canvas.width) {
          this.x = 0;
        } else if (this.x < 0) {
          this.x = canvas.width;
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.lineWidth = this.radius * 0.5;
        ctx.lineCap = 'round';

        // Draw snowflake with 6 branches
        for (let i = 0; i < 6; i++) {
          ctx.rotate(Math.PI / 3);

          // Main branch
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(0, -this.radius * 2);
          ctx.stroke();

          // Side branches
          ctx.beginPath();
          ctx.moveTo(0, -this.radius * 0.8);
          ctx.lineTo(-this.radius * 0.6, -this.radius * 1.4);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(0, -this.radius * 0.8);
          ctx.lineTo(this.radius * 0.6, -this.radius * 1.4);
          ctx.stroke();
        }

        ctx.restore();
      }
    }

    // Create snowflakes
    for (let i = 0; i < numberOfSnowflakes; i++) {
      snowflakes.push(new Snowflake());
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      snowflakes.forEach(snowflake => {
        snowflake.update();
        snowflake.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999
      }}
    />
  );
};

export default Snow;
