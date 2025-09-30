// Ember particle system
class EmberSystem {
    constructor() {
        this.canvas = document.getElementById('ember-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.embers = [];
        this.pixelSize = 3;

        this.colors = [
            '#ff6b35', // Bright orange
            '#ff9558', // Light orange
            '#ffb347', // Peach
            '#ffd700', // Gold
            '#ffed4e', // Light yellow
            '#ff4500', // Red-orange
            '#ff8c00'  // Dark orange
        ];

        this.init();
        this.animate();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.spawnX = this.canvas.width / 2;
        this.spawnY = this.canvas.height - 100;
        this.spawnRadius = 50;
    }

    createEmber() {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * this.spawnRadius;

        return {
            x: this.spawnX + Math.cos(angle) * radius,
            y: this.spawnY + Math.random() * 20,
            x_velocity: (Math.random() - 0.5) * 0.3,
            y_velocity: clamp(-Math.random(), -0.5, -1),
            life: 1,
            maxLife: Math.random() * 10,
            size: Math.floor(Math.random() * 2) + 2,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            flicker: Math.random() * 0.5 + 0.5
        };
    }

    update() {
        if (Math.random() < 0.02) { // 2% chance each frame
            if (this.embers.length <= 10) {
                this.embers.push(this.createEmber());
            }
        }

        for (let i = this.embers.length - 1; i >= 0; i--) {
            const ember = this.embers[i];

            ember.x += ember.x_velocity;
            ember.y += ember.y_velocity;

            ember.x_velocity += (Math.random() - 0.5) * 0.02;
            ember.y_velocity += 0.0005;

            ember.life -= 0.005 / ember.maxLife;
            ember.flicker = Math.random() * 0.5 + 0.5;

            if (ember.life <= 0 || ember.y < -10) {
                this.embers.splice(i, 1);
            }
        }

        if (this.embers.length > 100) {
            this.embers.splice(0, this.embers.length - 100);
        }
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.embers.forEach(ember => {
            const opacity = ember.life * ember.flicker;
            this.ctx.globalAlpha = opacity;
            this.ctx.fillStyle = ember.color;

            const size = ember.size * this.pixelSize;
            this.ctx.fillRect(ember.x, ember.y, size, size);
        });

        this.ctx.globalAlpha = 1;
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new EmberSystem();
});