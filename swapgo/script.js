// ========================================
// SWAP&GO - INTERACTIVE FUNCTIONALITY
// ========================================

'use strict';

// --- Navbar Scroll Effect ---
const navbar = document.querySelector('.navbar');
const navbarHeight = navbar ? navbar.offsetHeight : 0;

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// --- Smooth Scroll for Anchor Links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') { e.preventDefault(); return; }
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const offsetTop = target.offsetTop - navbarHeight;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
    });
});

// --- Intersection Observer for Scroll Animations ---
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            if (entry.target.classList.contains('stat-item')) {
                const numberElement = entry.target.querySelector('.stat-number');
                if (numberElement && !numberElement.classList.contains('counted')) {
                    animateCounter(numberElement);
                }
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// --- Counter Animation ---
function animateCounter(element) {
    const target = parseFloat(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    element.classList.add('counted');
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            if (target % 1 !== 0) {
                element.textContent = current.toFixed(1);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
            requestAnimationFrame(updateCounter);
        } else {
            if (target % 1 !== 0) {
                element.textContent = target.toFixed(1) + (target === 99.9 ? '%' : '');
            } else {
                element.textContent = target.toLocaleString();
            }
        }
    };
    updateCounter();
}

// --- Magnetic Button Effect ---
document.querySelectorAll('.btn, .btn-app').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.02)`;
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0) scale(1)';
    });
});

// --- Parallax Effect ---
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            document.querySelectorAll('.benefit-image[data-parallax]').forEach(el => {
                const speed = parseFloat(el.getAttribute('data-parallax'));
                const yPos = -(scrolled * speed * 0.1); // Reduced intensity for smoother effect
                const img = el.querySelector('img');
                if (img) img.style.transform = `translateY(${yPos}px)`;
            });
            ticking = false;
        });
        ticking = true;
    }
});

// --- Mobile Menu Toggle ---
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.navbar nav');
if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        const spans = mobileMenuToggle.querySelectorAll('span');
        if (mobileMenuToggle.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// --- LEAFLET MAP INTEGRATION (Replaces Mappls) ---
document.addEventListener('DOMContentLoaded', function() {
    const mapContainer = document.getElementById('map-container');
    
    if (mapContainer && typeof L !== 'undefined') {
        // 1. Initialize Map (Center on India)
        const map = L.map('map-container').setView([20.5937, 78.9629], 5);

        // 2. Add Dark Mode Tiles (CartoDB Dark Matter)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(map);

        // 3. Station Data
        const stations = [
            { name: "Delhi Station", coords: [28.6139, 77.2090], info: "30 Bays • 24/7" },
            { name: "Mumbai Central", coords: [19.0760, 72.8777], info: "23 Bays • Fast Swap" },
            { name: "Hyderabad Hub", coords: [17.3850, 78.4867], info: "14 Bays • Active" },
            { name: "Chennai Point", coords: [13.0827, 80.2707], info: "10 Bays • Active" },
            { name: "Pune HQ", coords: [18.5204, 73.8567], info: "R&D & Manufacturing" }
        ];

        // 4. Add Custom Markers
        stations.forEach(station => {
            // Create a custom icon (optional, default used here for simplicity)
            const marker = L.marker(station.coords).addTo(map);
            
            const popupContent = `
                <div style="text-align: center; font-family: 'Poppins', sans-serif;">
                    <h3 style="color: #00d26a; margin: 0 0 5px; font-size: 16px;">${station.name}</h3>
                    <p style="margin: 0; color: #333; font-size: 13px;">${station.info}</p>
                </div>
            `;
            marker.bindPopup(popupContent);
        });

        console.log('Leaflet Map Loaded Successfully');
    } else {
        console.log('Map container not found or Leaflet library missing');
    }
});

// --- Console Welcome ---
console.log('%cSwap&Go', 'color: #00ffff; font-size: 24px; font-weight: bold;');
console.log('%cThe Future of EV Charging', 'color: #a0a0a0; font-size: 14px;');