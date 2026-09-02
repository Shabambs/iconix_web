/* ==========================================================================
   PARTICLES & BACKGROUND CANVAS ENGINE
   Interactive floating butterflies, starry sparkles & ambient dark glow
   ========================================================================== */

class ParticleEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleType = 'butterflies'; // 'butterflies', 'stars', 'matrix'
        this.mouse = { x: null, y: null, radius: 100 };

        this.init();
        this.animate();
        this.addEventListeners();
    }

    init() {
        this.resize();
        this.createParticles(50);
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setParticleType(type) {
        this.particleType = type;
        this.createParticles(50);
    }

    createParticles(count) {
        this.particles = [];
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 4 + 2,
                speedX: (Math.random() - 0.5) * 0.8,
                speedY: -Math.random() * 0.6 - 0.2, // move upwards slowly
                alpha: Math.random() * 0.7 + 0.3,
                color: Math.random() > 0.3 ? '#ff0000' : '#cc0000',
                wingAngle: Math.random() * Math.PI * 2,
                wingSpeed: Math.random() * 0.15 + 0.05
            });
        }
    }

    addEventListeners() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    drawButterfly(p) {
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.globalAlpha = p.alpha;

        // Glow effect
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = p.color;

        // Wing flap factor
        p.wingAngle += p.wingSpeed;
        const wingScale = Math.abs(Math.sin(p.wingAngle)) * 0.7 + 0.3;

        this.ctx.fillStyle = p.color;

        // Left wing
        this.ctx.beginPath();
        this.ctx.ellipse(-p.size * wingScale, 0, p.size * 1.5, p.size, Math.PI / 4, 0, Math.PI * 2);
        this.ctx.fill();

        // Right wing
        this.ctx.beginPath();
        this.ctx.ellipse(p.size * wingScale, 0, p.size * 1.5, p.size, -Math.PI / 4, 0, Math.PI * 2);
        this.ctx.fill();

        // Butterfly body
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size * 0.4, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
    }

    drawStar(p) {
        this.ctx.save();
        this.ctx.globalAlpha = p.alpha;
        this.ctx.shadowBlur = 12;
        this.ctx.shadowColor = p.color;
        this.ctx.fillStyle = p.color;

        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((p) => {
            // Update position
            p.x += p.speedX;
            p.y += p.speedY;

            // Wrap around edges
            if (p.y < -10) p.y = this.canvas.height + 10;
            if (p.x < -10) p.x = this.canvas.width + 10;
            if (p.x > this.canvas.width + 10) p.x = -10;

            // Mouse repulsion subtle effect
            if (this.mouse.x && this.mouse.y) {
                const dx = p.x - this.mouse.x;
                const dy = p.y - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < this.mouse.radius) {
                    const angle = Math.atan2(dy, dx);
                    p.x += Math.cos(angle) * 1.5;
                    p.y += Math.sin(angle) * 1.5;
                }
            }

            // Render based on type
            if (this.particleType === 'stars') {
                this.drawStar(p);
            } else {
                this.drawButterfly(p);
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}
