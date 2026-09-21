        const canvas = document.getElementById('mainCanvas');
        const ctx = canvas.getContext('2d');
        const startCanvas = document.getElementById('startFlowerCanvas');
        const startCtx = startCanvas.getContext('2d');

        const startOverlay = document.getElementById('start-overlay');
        const clickTrigger = document.getElementById('click-trigger');
        const textLetter = document.getElementById('text-letter');
        const btnRestart = document.getElementById('btn-restart');

        let animFrame;
        let isStarted = false;
        let startTime = null;
        let particles = [];
        let sunflowerHeartPoints = [];
        let branchStructure = [];

        function setupCanvasSize() {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
        }

        // Draw initial single sunflower
        function drawStartFlower() {
            const cx = startCanvas.width / 2;
            const cy = startCanvas.height / 2;
            const radius = 35;

            startCtx.clearRect(0, 0, startCanvas.width, startCanvas.height);

            const petalCount = 20;
            startCtx.fillStyle = '#FBBF24';
            for (let i = 0; i < petalCount; i++) {
                const angle = (i * Math.PI * 2) / petalCount;
                startCtx.save();
                startCtx.translate(cx, cy);
                startCtx.rotate(angle);
                startCtx.beginPath();
                startCtx.ellipse(0, -radius - 12, 8, 20, 0, 0, Math.PI * 2);
                startCtx.fill();
                startCtx.restore();
            }

            startCtx.fillStyle = '#3A1E05';
            startCtx.beginPath();
            startCtx.arc(cx, cy, radius, 0, Math.PI * 2);
            startCtx.fill();

            startCtx.fillStyle = '#653813';
            for (let r = 5; r < radius - 3; r += 6) {
                for (let a = 0; a < Math.PI * 2; a += 0.5) {
                    const x = cx + Math.cos(a) * r;
                    const y = cy + Math.sin(a) * r;
                    startCtx.fillRect(x, y, 2, 2);
                }
            }
        }

        // Generate branch structure exactly like image_7da61f.jpg
        function generateBranches(w, h) {
            branchStructure = [];
            const baseY = h * 0.88;
            const centerX = w * 0.5;
            const trunkHeight = h * 0.48;

            // Main central curved trunk
            const mainTrunk = {
                startX: centerX,
                startY: baseY,
                cp1X: centerX + 5,
                cp1Y: baseY - trunkHeight * 0.4,
                cp2X: centerX - 10,
                cp2Y: baseY - trunkHeight * 0.7,
                endX: centerX - 5,
                endY: baseY - trunkHeight,
                startWidth: 32,
                endWidth: 10,
                startTime: 0,
                endTime: 0.35
            };
            branchStructure.push(mainTrunk);

            // Side Branches with natural bifurcations
            const branches = [
                // Lower Left Branch
                {
                    startX: centerX - 3, startY: baseY - trunkHeight * 0.3,
                    cp1X: centerX - 40, cp1Y: baseY - trunkHeight * 0.35,
                    cp2X: centerX - 80, cp2Y: baseY - trunkHeight * 0.38,
                    endX: centerX - 120, endY: baseY - trunkHeight * 0.42,
                    startWidth: 14, endWidth: 3, startTime: 0.12, endTime: 0.38
                },
                // Lower Left Bifurcation
                {
                    startX: centerX - 65, startY: baseY - trunkHeight * 0.36,
                    cp1X: centerX - 80, cp1Y: baseY - trunkHeight * 0.42,
                    cp2X: centerX - 95, cp2Y: baseY - trunkHeight * 0.5,
                    endX: centerX - 110, endY: baseY - trunkHeight * 0.58,
                    startWidth: 8, endWidth: 2, startTime: 0.22, endTime: 0.42
                },

                // Lower Right Branch
                {
                    startX: centerX + 2, startY: baseY - trunkHeight * 0.35,
                    cp1X: centerX + 45, cp1Y: baseY - trunkHeight * 0.38,
                    cp2X: centerX + 85, cp2Y: baseY - trunkHeight * 0.4,
                    endX: centerX + 125, endY: baseY - trunkHeight * 0.43,
                    startWidth: 14, endWidth: 3, startTime: 0.15, endTime: 0.4
                },

                // Middle Left Branch
                {
                    startX: centerX - 6, startY: baseY - trunkHeight * 0.55,
                    cp1X: centerX - 50, cp1Y: baseY - trunkHeight * 0.62,
                    cp2X: centerX - 90, cp2Y: baseY - trunkHeight * 0.68,
                    endX: centerX - 135, endY: baseY - trunkHeight * 0.72,
                    startWidth: 12, endWidth: 2, startTime: 0.2, endTime: 0.45
                },
                // Middle Left Sub-branch
                {
                    startX: centerX - 70, startY: baseY - trunkHeight * 0.64,
                    cp1X: centerX - 85, cp1Y: baseY - trunkHeight * 0.74,
                    cp2X: centerX - 100, cp2Y: baseY - trunkHeight * 0.82,
                    endX: centerX - 115, endY: baseY - trunkHeight * 0.88,
                    startWidth: 7, endWidth: 2, startTime: 0.28, endTime: 0.5
                },

                // Middle Right Branch
                {
                    startX: centerX - 2, startY: baseY - trunkHeight * 0.58,
                    cp1X: centerX + 45, cp1Y: baseY - trunkHeight * 0.62,
                    cp2X: centerX + 85, cp2Y: baseY - trunkHeight * 0.66,
                    endX: centerX + 130, endY: baseY - trunkHeight * 0.68,
                    startWidth: 11, endWidth: 2, startTime: 0.22, endTime: 0.46
                },
                // Middle Right Sub-branch
                {
                    startX: centerX + 60, startY: baseY - trunkHeight * 0.63,
                    cp1X: centerX + 80, cp1Y: baseY - trunkHeight * 0.75,
                    cp2X: centerX + 95, cp2Y: baseY - trunkHeight * 0.82,
                    endX: centerX + 105, endY: baseY - trunkHeight * 0.9,
                    startWidth: 7, endWidth: 2, startTime: 0.3, endTime: 0.52
                },

                // Upper Left Top Branch
                {
                    startX: centerX - 5, startY: baseY - trunkHeight * 0.8,
                    cp1X: centerX - 35, cp1Y: baseY - trunkHeight * 0.9,
                    cp2X: centerX - 65, cp2Y: baseY - trunkHeight * 0.98,
                    endX: centerX - 90, endY: baseY - trunkHeight * 1.05,
                    startWidth: 8, endWidth: 2, startTime: 0.3, endTime: 0.52
                },
                // Upper Right Top Branch
                {
                    startX: centerX - 5, startY: baseY - trunkHeight * 0.82,
                    cp1X: centerX + 25, cp1Y: baseY - trunkHeight * 0.92,
                    cp2X: centerX + 45, cp2Y: baseY - trunkHeight * 1.02,
                    endX: centerX + 60, endY: baseY - trunkHeight * 1.1,
                    startWidth: 8, endWidth: 2, startTime: 0.32, endTime: 0.55
                }
            ];

            branchStructure.push(...branches);
        }

        // Heart Parametric Equation
        function heartPoint(t) {
            const x = 16 * Math.pow(Math.sin(t), 3);
            const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
            return { x: x / 16, y: y / 16 };
        }

        function drawSunflower(x, y, size) {
            ctx.save();
            ctx.translate(x, y);

            const petals = 14;
            const petalLength = size * 0.9;
            const petalWidth = size * 0.35;

            // Outer layer
            ctx.fillStyle = '#F59E0B';
            for (let i = 0; i < petals; i++) {
                const angle = (i * Math.PI * 2) / petals;
                ctx.rotate(angle);
                ctx.beginPath();
                ctx.ellipse(0, -petalLength, petalWidth, petalLength, 0, 0, Math.PI * 2);
                ctx.fill();
            }

            // Inner layer
            ctx.fillStyle = '#FCD34D';
            for (let i = 0; i < petals; i++) {
                const angle = (i * Math.PI * 2) / petals + (Math.PI / petals);
                ctx.rotate(angle);
                ctx.beginPath();
                ctx.ellipse(0, -petalLength * 0.8, petalWidth * 0.8, petalLength * 0.8, 0, 0, Math.PI * 2);
                ctx.fill();
            }

            // Dark Center
            const centerR = size * 0.45;
            ctx.fillStyle = '#291405';
            ctx.beginPath();
            ctx.arc(0, 0, centerR, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }

        // Over 500 dense sunflowers in a heart shape
        function generateSunflowerHeart(width, height) {
            sunflowerHeartPoints = [];
            const count = 520;
            const scale = Math.min(width, height) * 0.33;
            const centerX = width * 0.5;
            const centerY = height * 0.4;

            for (let i = 0; i < count; i++) {
                const t = Math.random() * Math.PI * 2;
                const r = Math.sqrt(Math.random());
                const hp = heartPoint(t);

                sunflowerHeartPoints.push({
                    x: centerX + hp.x * scale * r,
                    y: centerY + hp.y * scale * r,
                    size: Math.random() * 5 + 8.5,
                    delay: 0.42 + (1 - r) * 0.28 + Math.random() * 0.22
                });
            }

            sunflowerHeartPoints.sort((a, b) => a.delay - b.delay);
        }

        // Particle class for floating petals and small falling sunflowers
        class FloatingParticle {
            constructor(w, h) {
                this.reset(w, h);
            }

            reset(w, h) {
                this.x = Math.random() * w;
                this.y = -20 - Math.random() * 80;
                this.size = Math.random() * 4 + 4;
                this.speedY = Math.random() * 1.2 + 0.6;
                this.speedX = Math.sin(Math.random() * Math.PI) * 0.8 - 0.4;
                this.isFullFlower = Math.random() < 0.25;
                this.opacity = Math.random() * 0.7 + 0.3;
            }

            update(w, h) {
                this.y += this.speedY;
                this.x += Math.sin(this.y * 0.02) * 0.6 + this.speedX;
                if (this.y > h + 20) this.reset(w, h);
            }

            draw(ctx) {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                if (this.isFullFlower) {
                    drawSunflower(this.x, this.y, this.size);
                } else {
                    ctx.fillStyle = '#FBBF24';
                    ctx.beginPath();
                    ctx.ellipse(this.x, this.y, this.size, this.size * 0.5, Math.PI / 4, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            }
        }

        function initParticles(w, h) {
            particles = [];
            for (let i = 0; i < 45; i++) {
                particles.push(new FloatingParticle(w, h));
            }
        }

        // Draw Bezier Branch segment progressively
        function drawBezierBranch(b, progress) {
            if (progress < b.startTime) return;
            const localP = Math.min(1, (progress - b.startTime) / (b.endTime - b.startTime));

            ctx.strokeStyle = '#0D5C50'; // Dark Emerald Teal
            ctx.fillStyle = '#0D5C50';
            ctx.lineCap = 'round';

            // Quadratic interpolation for progressive drawing
            const currentX = Math.pow(1 - localP, 3) * b.startX +
                             3 * Math.pow(1 - localP, 2) * localP * b.cp1X +
                             3 * (1 - localP) * Math.pow(localP, 2) * b.cp2X +
                             Math.pow(localP, 3) * b.endX;

            const currentY = Math.pow(1 - localP, 3) * b.startY +
                             3 * Math.pow(1 - localP, 2) * localP * b.cp1Y +
                             3 * (1 - localP) * Math.pow(localP, 2) * b.cp2Y +
                             Math.pow(localP, 3) * b.endY;

            const currentWidth = b.startWidth - (b.startWidth - b.endWidth) * localP;

            ctx.lineWidth = currentWidth;
            ctx.beginPath();
            ctx.moveTo(b.startX, b.startY);

            // Subdivided curve drawing up to current progress
            const steps = 30;
            const currentStep = Math.floor(steps * localP);
            for (let i = 1; i <= currentStep; i++) {
                const t = i / steps;
                const x = Math.pow(1 - t, 3) * b.startX + 3 * Math.pow(1 - t, 2) * t * b.cp1X + 3 * (1 - t) * Math.pow(t, 2) * b.cp2X + Math.pow(t, 3) * b.endX;
                const y = Math.pow(1 - t, 3) * b.startY + 3 * Math.pow(1 - t, 2) * t * b.cp1Y + 3 * (1 - t) * Math.pow(t, 2) * b.cp2Y + Math.pow(t, 3) * b.endY;
                ctx.lineTo(x, y);
            }
            ctx.stroke();
        }

        function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const duration = 4800; // 4.8 seconds duration

            const rect = canvas.getBoundingClientRect();
            const w = rect.width;
            const h = rect.height;

            ctx.clearRect(0, 0, w, h);

            const progress = Math.min(1, elapsed / duration);

            // 1. Ground Line
            const baseY = h * 0.88;
            ctx.strokeStyle = '#111827';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(w * 0.05, baseY);
            ctx.lineTo(w * 0.95, baseY);
            ctx.stroke();

            // 2. Render Curved Trunk & Bifurcated Branches
            branchStructure.forEach(b => drawBezierBranch(b, progress));

            // 3. Bloom Heart Sunflowers
            sunflowerHeartPoints.forEach(pt => {
                if (progress > pt.delay) {
                    const bloomP = Math.min(1, (progress - pt.delay) * 3.5);
                    drawSunflower(pt.x, pt.y, pt.size * bloomP);
                }
            });

            // 4. Update Detached Petals & Small Falling Flowers
            particles.forEach(p => {
                p.update(w, h);
                p.draw(ctx);
            });

            // 5. Trigger Letter Fade-in
            if (progress >= 0.6) {
                textLetter.classList.add('visible');
            }

            if (progress < 1) {
                animFrame = requestAnimationFrame(animate);
            } else {
                animFrame = requestAnimationFrame(loopStatic);
            }
        }

        function loopStatic() {
            const rect = canvas.getBoundingClientRect();
            const w = rect.width;
            const h = rect.height;

            ctx.clearRect(0, 0, w, h);

            // Ground
            const baseY = h * 0.88;
            ctx.strokeStyle = '#111827';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(w * 0.05, baseY);
            ctx.lineTo(w * 0.95, baseY);
            ctx.stroke();

            // Draw full branches
            branchStructure.forEach(b => drawBezierBranch(b, 1));

            // All Flowers Full Size
            sunflowerHeartPoints.forEach(pt => {
                drawSunflower(pt.x, pt.y, pt.size);
            });

            // Floating petals animation keeps running
            particles.forEach(p => {
                p.update(w, h);
                p.draw(ctx);
            });

            animFrame = requestAnimationFrame(loopStatic);
        }

        function startExperience() {
            startOverlay.classList.add('opacity-0', 'pointer-events-none');
            setTimeout(() => {
                startOverlay.style.display = 'none';
            }, 1000);

            setupCanvasSize();
            const rect = canvas.getBoundingClientRect();
            generateBranches(rect.width, rect.height);
            generateSunflowerHeart(rect.width, rect.height);
            initParticles(rect.width, rect.height);

            startTime = null;
            cancelAnimationFrame(animFrame);
            animFrame = requestAnimationFrame(animate);
        }

        function restartExperience() {
            textLetter.classList.remove('visible');
            cancelAnimationFrame(animFrame);
            setTimeout(() => {
                setupCanvasSize();
                const rect = canvas.getBoundingClientRect();
                generateBranches(rect.width, rect.height);
                generateSunflowerHeart(rect.width, rect.height);
                startTime = null;
                animFrame = requestAnimationFrame(animate);
            }, 300);
        }

        window.addEventListener('load', () => {
            drawStartFlower();
            setupCanvasSize();
        });

        window.addEventListener('resize', () => {
            setupCanvasSize();
            if (isStarted) {
                const rect = canvas.getBoundingClientRect();
                generateBranches(rect.width, rect.height);
                generateSunflowerHeart(rect.width, rect.height);
            }
        });

        clickTrigger.addEventListener('click', () => {
            isStarted = true;
            startExperience();
        });

        btnRestart.addEventListener('click', restartExperience);
