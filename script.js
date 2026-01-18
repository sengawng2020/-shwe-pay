// 3D Coin Animation with Three.js
function init3DCoin() {
    const container = document.getElementById('coin-container');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Create coin geometry
    const geometry = new THREE.CylinderGeometry(1.5, 1.5, 0.2, 64);
    
    // Create material with gold color
    const material = new THREE.MeshPhongMaterial({
        color: 0xFFD700,
        shininess: 100,
        specular: 0xFFF5CC,
        emissive: 0x332200
    });

    const coin = new THREE.Mesh(geometry, material);
    scene.add(coin);

    // Add $ symbol as a plane on the coin
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0a1628';
    ctx.font = 'bold 180px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$', 128, 128);

    const texture = new THREE.CanvasTexture(canvas);
    const symbolMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    const symbolGeometry = new THREE.PlaneGeometry(2, 2);
    
    const symbolFront = new THREE.Mesh(symbolGeometry, symbolMaterial);
    symbolFront.position.z = 0.11;
    coin.add(symbolFront);
    
    const symbolBack = new THREE.Mesh(symbolGeometry, symbolMaterial);
    symbolBack.position.z = -0.11;
    symbolBack.rotation.y = Math.PI;
    coin.add(symbolBack);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xFFD700, 1, 100);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x4169E1, 0.5, 100);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    camera.position.z = 5;

    // Animation
    let floatOffset = 0;
    function animate() {
        requestAnimationFrame(animate);
        
        coin.rotation.x += 0.005;
        coin.rotation.y += 0.01;
        
        // Floating effect
        floatOffset += 0.02;
        coin.position.y = Math.sin(floatOffset) * 0.3;
        
        renderer.render(scene, camera);
    }
    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        if (container.clientWidth > 0) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
    });
}

// Stock Ticker Animation
function animateStockTicker() {
    const stockItems = document.querySelectorAll('.stock-item');
    
    function updatePrice(item) {
        const priceElement = item.querySelector('.stock-price');
        const changeElement = item.querySelector('.stock-change');
        
        // Random price fluctuation (for demo purposes)
        const currentPrice = parseFloat(priceElement.textContent.replace(/[$,]/g, ''));
        const change = (Math.random() - 0.5) * 2;
        const newPrice = currentPrice + change;
        
        const changePercent = ((newPrice - currentPrice) / currentPrice * 100).toFixed(2);
        
        // Update elements
        if (priceElement.textContent.includes(',')) {
            priceElement.textContent = '$' + newPrice.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        } else {
            priceElement.textContent = '$' + newPrice.toFixed(2);
        }
        
        changeElement.textContent = (changePercent > 0 ? '+' : '') + changePercent + '%';
        
        // Update classes
        if (changePercent > 0) {
            priceElement.classList.remove('negative');
            priceElement.classList.add('positive');
            changeElement.classList.remove('negative');
            changeElement.classList.add('positive');
        } else {
            priceElement.classList.remove('positive');
            priceElement.classList.add('negative');
            changeElement.classList.remove('positive');
            changeElement.classList.add('negative');
        }
    }
    
    // Update prices every 3 seconds
    setInterval(() => {
        stockItems.forEach(item => {
            updatePrice(item);
        });
    }, 3000);
}

// Reserve Model Chart
function initReserveChart() {
    const ctx = document.getElementById('reserveChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Stablecoins (30%)', 'US Treasuries (40%)', 'SOL & Crypto (30%)'],
            datasets: [{
                data: [30, 40, 30],
                backgroundColor: [
                    'rgba(255, 215, 0, 0.8)',
                    'rgba(65, 105, 225, 0.8)',
                    'rgba(153, 69, 255, 0.8)'
                ],
                borderColor: [
                    'rgba(255, 215, 0, 1)',
                    'rgba(65, 105, 225, 1)',
                    'rgba(153, 69, 255, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#B8C1D9',
                        font: {
                            size: 14,
                            weight: '600'
                        },
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(10, 22, 40, 0.9)',
                    titleColor: '#FFD700',
                    bodyColor: '#B8C1D9',
                    borderColor: 'rgba(255, 215, 0, 0.3)',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 2000
            }
        }
    });
}

// Dashboard Mini Charts
function initDashboardCharts() {
    // TVL Chart
    const tvlCtx = document.getElementById('tvlChart');
    if (tvlCtx) {
        createMiniChart(tvlCtx, generateTrendData(30), 'rgba(255, 215, 0, 0.5)');
    }

    // Users Chart
    const usersCtx = document.getElementById('usersChart');
    if (usersCtx) {
        createMiniChart(usersCtx, generateTrendData(30), 'rgba(20, 241, 149, 0.5)');
    }

    // Transactions Chart
    const txCtx = document.getElementById('txChart');
    if (txCtx) {
        createMiniChart(txCtx, generateTrendData(30), 'rgba(65, 105, 225, 0.5)');
    }
}

function createMiniChart(ctx, data, color) {
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map((_, i) => ''),
            datasets: [{
                data: data,
                borderColor: color.replace('0.5', '1'),
                backgroundColor: color,
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            },
            scales: {
                x: { display: false },
                y: { display: false }
            },
            interaction: {
                mode: 'index',
                intersect: false
            }
        }
    });
}

function generateTrendData(points) {
    const data = [];
    let value = 50 + Math.random() * 50;
    for (let i = 0; i < points; i++) {
        value += (Math.random() - 0.4) * 10;
        value = Math.max(20, Math.min(100, value));
        data.push(value);
    }
    return data;
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Intersection Observer for animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.value-card, .reserve-item, .dashboard-card, .benefit-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Navbar background on scroll
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 22, 40, 0.95)';
        } else {
            navbar.style.background = 'rgba(10, 22, 40, 0.8)';
        }
    });
}

// Dashboard metrics animation
function animateDashboardMetrics() {
    const metrics = [
        { selector: '.dashboard-card:nth-child(1) .metric-value', target: 12450000, prefix: '$', format: 'currency' },
        { selector: '.dashboard-card:nth-child(2) .metric-value', target: 45678, prefix: '', format: 'number' },
        { selector: '.dashboard-card:nth-child(3) .metric-value', target: 128945, prefix: '', format: 'number' },
        { selector: '.dashboard-card:nth-child(4) .metric-value', target: 98.5, prefix: '', suffix: '%', format: 'percentage' }
    ];

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                metrics.forEach(metric => {
                    const element = entry.target.querySelector(metric.selector);
                    if (element && !element.dataset.animated) {
                        element.dataset.animated = 'true';
                        animateValue(element, 0, metric.target, 2000, metric);
                    }
                });
            }
        });
    }, { threshold: 0.5 });

    const dashboardSection = document.querySelector('.dashboard-section');
    if (dashboardSection) {
        observer.observe(dashboardSection);
    }
}

function animateValue(element, start, end, duration, config) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = start + (end - start) * easeOutQuart;
        
        let displayValue;
        if (config.format === 'currency') {
            displayValue = config.prefix + current.toLocaleString('en-US', { maximumFractionDigits: 0 });
        } else if (config.format === 'percentage') {
            displayValue = current.toFixed(1) + config.suffix;
        } else {
            displayValue = Math.floor(current).toLocaleString('en-US');
        }
        
        element.textContent = displayValue;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    init3DCoin();
    animateStockTicker();
    initReserveChart();
    initDashboardCharts();
    initSmoothScroll();
    initScrollAnimations();
    initNavbarScroll();
    animateDashboardMetrics();
});

// Handle window resize
window.addEventListener('resize', () => {
    // Reinitialize charts on significant resize
    const width = window.innerWidth;
    if (width !== window.lastWidth) {
        window.lastWidth = width;
    }
});
