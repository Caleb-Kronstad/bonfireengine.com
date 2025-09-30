// Purpose: Animate a pixelated background gradient to smoothly transition
// through day/night phases (midnight → sunrise → midday → sunset → midnight).
// We use JavaScript instead of pure CSS because many browsers treat
// gradients as static images and won't interpolate them smoothly.
// The "pixel effect" is created by rendering the gradient at a very low
// resolution on a <canvas> and scaling it up with image-rendering: pixelated.

// === Canvas Setup ===
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

// Internal resolution of the canvas.
// Smaller values → chunkier pixels when scaled to full screen.
const pixelSize = 50;
canvas.width = pixelSize;
canvas.height = pixelSize;

// === Utility Functions ===

// Blend two RGB colors by percentage t (0 → start, 1 → end).
function blendRGB(c1, c2, t) {
  const r = Math.round(c1[0] + t * (c2[0] - c1[0]));
  const g = Math.round(c1[1] + t * (c2[1] - c1[1]));
  const b = Math.round(c1[2] + t * (c2[2] - c1[2]));
  return [r, g, b]; // return as [r,g,b] so we can reuse in pixel painting
}

// Convert a CSS "rgb(r,g,b)" string into [r,g,b].
function parseRGB(rgb) {
  return rgb.match(/\d+/g).map(Number);
}

// === Animation Parameters ===

// Length of one full cycle in milliseconds (60s = 1 day/night cycle here).
const duration = 60000;

// Key gradient "checkpoints" (top + bottom color).
// Each pair represents a phase of the sky.
const gradients = [
  ["rgb(45, 13, 1)", "rgb(0, 0, 0)"],           // midnight
  ["rgb(255, 204, 102)", "rgb(135, 206, 235)"], // sunrise
  ["rgb(135, 206, 235)", "rgb(102, 204, 255)"], // midday
  ["rgb(255, 153, 102)", "rgb(51, 0, 102)"],    // sunset
  ["rgb(45, 13, 1)", "rgb(0, 0, 0)"]            // midnight again
];

// === Core Animation Loop ===
function animate() {
  const now = Date.now();
  const time = (now % duration) / duration; // normalized cycle time [0,1)

  // Step size between gradient checkpoints (e.g., midnight→sunrise).
  const step = 1 / (gradients.length - 1);
  const index = Math.floor(time / step);   // which checkpoint we’re on
  const t = (time - index * step) / step;  // % progress to next checkpoint

  // Get the current + next gradient colors.
  const [c1Start, c2Start] = gradients[index];
  const [c1End, c2End] = gradients[index + 1];

  // Interpolate both top and bottom colors.
  const blended1 = blendRGB(parseRGB(c1Start), parseRGB(c1End), t);
  const blended2 = blendRGB(parseRGB(c2Start), parseRGB(c2End), t);

  // Paint vertical gradient on the low-res canvas.
  // Then the browser scales it up to screen size → chunky pixel look.
  const img = ctx.createImageData(canvas.width, canvas.height);
  for (let y = 0; y < canvas.height; y++) {
    const p = y / canvas.height; // vertical interpolation (top→bottom)
    const color = blendRGB(blended1, blended2, p);

    for (let x = 0; x < canvas.width; x++) {
      const idx = (y * canvas.width + x) * 4;
      img.data[idx] = color[0];     // R
      img.data[idx + 1] = color[1]; // G
      img.data[idx + 2] = color[2]; // B
      img.data[idx + 3] = 255;      // Alpha (opaque)
    }
  }
  ctx.putImageData(img, 0, 0);

  // Request the next frame → creates the loop.
  requestAnimationFrame(animate);
}

// Start animation.
animate();
