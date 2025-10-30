// Mobile Navigation Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.getElementById('nav-menu');

mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.15)';
        navbar.style.boxShadow = '0 4px 20px rgba(8, 145, 178, 0.08)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.1)';
        navbar.style.boxShadow = '0 4px 6px -1px rgba(8, 145, 178, 0.05)';
    }
});

// Contact form handling
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const message = formData.get('message');
    const adults = formData.get('adults');
    const children = formData.get('children');
    const checkin = formData.get('checkin');
    const checkout = formData.get('checkout');
    
    // Basic validation
    if (!name || !email || !phone || !message || !adults) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    // Phone number validation (basic)
    const phonePattern = /^[\d\s\-\+\(\)]+$/;
    if (!phonePattern.test(phone)) {
        showNotification('Please enter a valid phone number.', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Date validation
    if (checkin && checkout) {
        const checkinDate = new Date(checkin);
        const checkoutDate = new Date(checkout);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (checkinDate < today) {
            showNotification('Check-in date cannot be in the past.', 'error');
            return;
        }
        
        if (checkoutDate <= checkinDate) {
            showNotification('Check-out date must be after check-in date.', 'error');
            return;
        }
    }
    
    // Simulate form submission
    showNotification('Thank you for your message! We will get back to you soon.', 'success');
    
    // Reset form
    this.reset();
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1001;
        max-width: 350px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#10b981';
            break;
        case 'error':
            notification.style.backgroundColor = '#ef4444';
            break;
        default:
            notification.style.backgroundColor = '#3b82f6';
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    // Elements to animate on scroll
    const elementsToAnimate = document.querySelectorAll(`
        .accommodation-card,
        .activity-card,
        .about-text,
        .contact-info,
        .contact-form
    `);
    
    elementsToAnimate.forEach(el => {
        // Set initial state
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        // Observe element
        observer.observe(el);
    });
});

// Add loading class removal after page load
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Handle back to top functionality
let backToTopButton;

function createBackToTopButton() {
    backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '↑';
    backToTopButton.className = 'back-to-top';
    backToTopButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border: none;
        border-radius: 50%;
        background-color: var(--primary-color);
        color: white;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    document.body.appendChild(backToTopButton);
}

// Show/hide back to top button based on scroll position
window.addEventListener('scroll', () => {
    if (!backToTopButton) {
        createBackToTopButton();
    }
    
    if (window.scrollY > 300) {
        backToTopButton.style.opacity = '1';
        backToTopButton.style.visibility = 'visible';
    } else {
        backToTopButton.style.opacity = '0';
        backToTopButton.style.visibility = 'hidden';
    }
});

// Lazy loading for images (when real images are added)
function setupLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', setupLazyLoading);

// Parallax effect for hero section (optional enhancement)
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    const heroImage = document.querySelector('.hero-image');
    if (heroImage && window.innerWidth > 768) {
        heroImage.style.transform = `translateY(${rate}px)`;
    }
});

// Preload critical resources
function preloadCriticalResources() {
    // Preload fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    fontLink.as = 'style';
    document.head.appendChild(fontLink);
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    preloadCriticalResources();
    
    // Add loaded class for CSS animations
    setTimeout(() => {
        document.body.classList.add('page-loaded');
    }, 100);
    
    // Initialize date inputs
    initializeDateInputs();
});

// Initialize date inputs with constraints
function initializeDateInputs() {
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    
    if (checkinInput && checkoutInput) {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        checkinInput.min = today;
        checkoutInput.min = today;
        
        // Update checkout minimum when checkin changes
        checkinInput.addEventListener('change', function() {
            const checkinDate = new Date(this.value);
            checkinDate.setDate(checkinDate.getDate() + 1); // Minimum 1 night stay
            checkoutInput.min = checkinDate.toISOString().split('T')[0];
            
            // Clear checkout if it's before the new minimum
            if (checkoutInput.value && new Date(checkoutInput.value) <= new Date(this.value)) {
                checkoutInput.value = '';
            }
        });
        
        // Validate checkout date
        checkoutInput.addEventListener('change', function() {
            if (checkinInput.value && this.value) {
                const checkinDate = new Date(checkinInput.value);
                const checkoutDate = new Date(this.value);
                
                if (checkoutDate <= checkinDate) {
                    showNotification('Check-out date must be after check-in date.', 'error');
                    this.value = '';
                }
            }
        });
    }
}