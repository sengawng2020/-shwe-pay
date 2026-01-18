// CSS-based 3D Coin Animation
function init3DCoin() {
    const container = document.getElementById('coin-container');
    if (!container) return;

    // Create coin element with CSS 3D transforms
    const coin = document.createElement('div');
    coin.className = 'coin-3d';
    coin.innerHTML = `
        <div class="coin-face coin-front">$</div>
        <div class="coin-face coin-back">$</div>
        <div class="coin-edge"></div>
    `;
    container.appendChild(coin);

    // Animate the coin
    let rotationX = 0;
    let rotationY = 0;
    let floatOffset = 0;

    function animate() {
        rotationX += 0.5;
        rotationY += 1;
        floatOffset += 0.02;
        
        const translateY = Math.sin(floatOffset) * 20;
        
        coin.style.transform = `
            translateY(${translateY}px)
            rotateX(${rotationX}deg)
            rotateY(${rotationY}deg)
        `;
        
        requestAnimationFrame(animate);
    }
    animate();
}

// Stock Ticker Animation
function animateStockTicker() {
    const stockItems = document.querySelectorAll('.stock-item');
    
    function updatePrice(item) {
        const priceElement = item.querySelector('.stock-price');
        const changeElement = item.querySelector('.stock-change');
        
        // Random price fluctuation (for demo purposes)
        const currentPriceText = priceElement.textContent.replace(/[$,]/g, '');
        const currentPrice = parseFloat(currentPriceText);
        const changePercent = (Math.random() - 0.48) * 3;
        const newPrice = currentPrice * (1 + changePercent / 100);
        
        // Update elements
        if (currentPriceText.includes(',') || currentPrice > 1000) {
            priceElement.textContent = '$' + Math.floor(newPrice).toLocaleString('en-US');
        } else {
            priceElement.textContent = '$' + newPrice.toFixed(2);
        }
        
        changeElement.textContent = (changePercent > 0 ? '+' : '') + changePercent.toFixed(2) + '%';
        
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

// Reserve Model Chart using Canvas
function initReserveChart() {
    const canvas = document.getElementById('reserveChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth * 2;
    const height = canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    
    const centerX = canvas.offsetWidth / 2;
    const centerY = canvas.offsetHeight / 2;
    const radius = Math.min(centerX, centerY) - 40;

    const data = [
        { label: 'Stablecoins', value: 30, color: '#FFD700', endColor: '#FFA500' },
        { label: 'US Treasuries', value: 40, color: '#4169E1', endColor: '#1E90FF' },
        { label: 'SOL & Crypto', value: 30, color: '#9945FF', endColor: '#14F195' }
    ];

    let currentAngle = -Math.PI / 2;

    data.forEach((segment, index) => {
        const sliceAngle = (segment.value / 100) * Math.PI * 2;
        
        // Create gradient
        const gradient = ctx.createLinearGradient(
            centerX - radius, centerY,
            centerX + radius, centerY
        );
        gradient.addColorStop(0, segment.color);
        gradient.addColorStop(1, segment.endColor);

        // Draw slice
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Draw border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();

        currentAngle += sliceAngle;
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = '#0a1628';
    ctx.fill();

    // Draw legend
    const legendY = canvas.offsetHeight - 80;
    const legendX = 20;
    data.forEach((segment, index) => {
        const x = legendX + (index * 140);
        const y = legendY;
        
        // Draw color box
        ctx.fillStyle = segment.color;
        ctx.fillRect(x, y, 15, 15);
        
        // Draw text
        ctx.fillStyle = '#B8C1D9';
        ctx.font = '12px Inter, sans-serif';
        ctx.fillText(`${segment.label} (${segment.value}%)`, x + 20, y + 12);
    });
}

// Dashboard Mini Charts
function initDashboardCharts() {
    createMiniChart('tvlChart', '#FFD700');
    createMiniChart('usersChart', '#14F195');
    createMiniChart('txChart', '#4169E1');
}

function createMiniChart(canvasId, color) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth * 2;
    const height = canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const data = generateTrendData(30);
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue;

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    const padding = 10;

    // Draw area
    ctx.beginPath();
    ctx.moveTo(0, h);
    
    data.forEach((value, index) => {
        const x = (index / (data.length - 1)) * w;
        const y = h - padding - ((value - minValue) / range) * (h - padding * 2);
        
        if (index === 0) {
            ctx.lineTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.lineTo(w, h);
    ctx.closePath();
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, color + '80');
    gradient.addColorStop(1, color + '00');
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw line
    ctx.beginPath();
    data.forEach((value, index) => {
        const x = (index / (data.length - 1)) * w;
        const y = h - padding - ((value - minValue) / range) * (h - padding * 2);
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
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
            displayValue = config.prefix + Math.floor(current).toLocaleString('en-US');
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
    
    // Wait a bit for layout to settle before drawing charts
    setTimeout(() => {
        initReserveChart();
        initDashboardCharts();
    }, 100);
    
    initSmoothScroll();
    initScrollAnimations();
    initNavbarScroll();
    animateDashboardMetrics();
});

// Handle window resize
window.addEventListener('resize', () => {
    // Redraw charts on resize
    initReserveChart();
    initDashboardCharts();
});
