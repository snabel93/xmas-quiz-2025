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
    let speedMultiplier = 1; // Normal speed
    let isShaking = false;

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
        this.y += this.speed * speedMultiplier;
        this.x += this.wind * speedMultiplier;

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

    // Shake detection for mobile devices
    let lastX = 0, lastY = 0, lastZ = 0;
    let shakeTimeout = null;

    const handleDeviceMotion = (event) => {
      const acceleration = event.accelerationIncludingGravity;
      if (!acceleration) return;

      const { x, y, z } = acceleration;
      const threshold = 15; // Shake sensitivity

      // Calculate change in acceleration
      const deltaX = Math.abs(x - lastX);
      const deltaY = Math.abs(y - lastY);
      const deltaZ = Math.abs(z - lastZ);

      // Detect shake
      if (deltaX > threshold || deltaY > threshold || deltaZ > threshold) {
        if (!isShaking) {
          isShaking = true;
          speedMultiplier = 4; // Speed up snow significantly

          // Gradually slow down over 3 seconds
          const slowDown = () => {
            if (speedMultiplier > 1) {
              speedMultiplier -= 0.05;
              shakeTimeout = setTimeout(slowDown, 50);
            } else {
              speedMultiplier = 1;
              isShaking = false;
            }
          };

          // Clear any existing slowdown
          if (shakeTimeout) clearTimeout(shakeTimeout);

          // Start slowing down after a brief moment
          setTimeout(slowDown, 500);
        }
      }

      lastX = x;
      lastY = y;
      lastZ = z;
    };

    // Add shake listener
    window.addEventListener('devicemotion', handleDeviceMotion);

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
      window.removeEventListener('devicemotion', handleDeviceMotion);
      if (shakeTimeout) clearTimeout(shakeTimeout);
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
