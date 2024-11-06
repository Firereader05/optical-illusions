// fractal.js

const canvas = document.getElementById('fractalCanvas');
const ctx = canvas.getContext('2d');

// Initial zoom and pan settings
let scale = 200;  // Starting scale (controls zoom level)
let offsetX = canvas.width / 2;
let offsetY = canvas.height / 2;
let maxDepth = 6;  // Starting depth (for zoom level 0)
let zoomCount = 0;  // Counter to track zoom clicks for delayed rendering

// Function to resize the canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawFractal();
}

window.addEventListener('resize', resizeCanvas);

// Function to draw a single triangle
function drawTriangle(p1, p2, p3, depth) {
    if (depth <= 0) {
        ctx.beginPath();
        ctx.moveTo(p1.x * scale + offsetX, p1.y * scale + offsetY);
        ctx.lineTo(p2.x * scale + offsetX, p2.y * scale + offsetY);
        ctx.lineTo(p3.x * scale + offsetX, p3.y * scale + offsetY);
        ctx.closePath();
        ctx.fill();
    } else {
        const mid1 = midpoint(p1, p2);
        const mid2 = midpoint(p2, p3);
        const mid3 = midpoint(p3, p1);

        // Draw smaller triangles recursively
        drawTriangle(p1, mid1, mid3, depth - 1);
        drawTriangle(mid1, p2, mid2, depth - 1);
        drawTriangle(mid3, mid2, p3, depth - 1);
    }
}

// Helper function to calculate the midpoint between two points
function midpoint(p1, p2) {
    return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
}

// Define the three points of the main triangle (equilateral triangle)
const trianglePoints = [
    { x: 0, y: -1 },
    { x: 1, y: 1 },
    { x: -1, y: 1 }
];

// Main function to draw the fractal
function drawFractal() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear canvas before redrawing
    ctx.fillStyle = 'blue';
    drawTriangle(trianglePoints[0], trianglePoints[1], trianglePoints[2], maxDepth);
}

// Zoom In and Zoom Out functionality
document.getElementById('zoomIn').addEventListener('click', () => {
    zoomCount++;
    if (zoomCount >= 2) {
        scale *= 1.5;  // Zoom in
        maxDepth += 1; // Increase depth
        zoomCount = 0;  // Reset the zoom count after 2 clicks
        drawFractal();
    }
});

document.getElementById('zoomOut').addEventListener('click', () => {
    zoomCount++;
    if (zoomCount >= 2) {
        scale /= 1.5;  // Zoom out
        maxDepth = Math.max(maxDepth - 1, 1);  // Decrease depth, but not below 1
        zoomCount = 0;  // Reset the zoom count after 2 clicks
        drawFractal();
    }
});

// Arrow key panning functionality
window.addEventListener('keydown', (event) => {
    const panAmount = 20;
    switch (event.key) {
        case 'ArrowUp':
            offsetY += panAmount;
            break;
        case 'ArrowDown':
            offsetY -= panAmount;
            break;
        case 'ArrowLeft':
            offsetX += panAmount;
            break;
        case 'ArrowRight':
            offsetX -= panAmount;
            break;
    }
    drawFractal();
});

// Initial canvas resize
resizeCanvas();
