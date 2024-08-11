const canvas = document.getElementById('network');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const nodes = [];
const nodeCount = 200;
const maxDistance = 100;
const groupCount = 100;


function calculateColor(x, y) {
    const r = Math.round(172 + (x / canvas.width) * (35 - 172));
    const g = Math.round(30 + (y / canvas.height) * (251 - 30));
    const b = Math.round(255 + (x / canvas.width) * (224 - 255));
    
    return `rgb(${r}, ${g}, ${b})`;
}

class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.z = Math.random();  
        this.dx = (Math.random() - 0.5) * 2; 
        this.dy = (Math.random() - 0.5) * 2; 
    }

    update() {
        this.x += this.dx * this.z;  
        this.y += this.dy * this.z;  
        if (this.x < 0 || this.x > canvas.width) this.dx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.dy *= -1;

        this.draw();
    }

    draw() {
        const radius = 4 * this.z + 1; 
        const opacity = this.z;
        const color = calculateColor(this.x, this.y);
        const highlightRadius = radius * 0.2;
        const gradient = ctx.createRadialGradient(this.x, this.y, highlightRadius * 0.3, this.x, this.y, radius);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.4})`);
        gradient.addColorStop(0.5, `rgba(${color.slice(4, -1)}, ${opacity})`);
        gradient.addColorStop(1, `rgba(${color.slice(4, -1)}, 0)`);
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
    }
}

function drawConnections() {
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
            if (dist < maxDistance) {
                const color1 = calculateColor(nodes[i].x, nodes[i].y);
                const color2 = calculateColor(nodes[j].x, nodes[j].y);

                const gradient = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
                gradient.addColorStop(0, color1);
                gradient.addColorStop(1, color2);

                ctx.beginPath();
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
                ctx.strokeStyle = gradient;
                ctx.globalAlpha = 0.5;
                ctx.stroke();
            }
        }
    }
    ctx.globalAlpha = 1;
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawConnections();
    nodes.forEach(node => node.update());
    requestAnimationFrame(animate);
}

for (let g = 0; g < groupCount; g++) {
    const groupX = Math.random() * canvas.width;
    const groupY = Math.random() * canvas.height;

    for (let i = 0; i < nodeCount / groupCount; i++) {
        nodes.push(new Node(
            groupX + Math.random() * 100 - 50,
            groupY + Math.random() * 100 - 50
        ));
    }
}

animate();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
