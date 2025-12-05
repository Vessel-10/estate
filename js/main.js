const App = {
    getJsonPath() {
        return window.location.pathname.includes('/pages/') ? '../js/main.json' : 'js/main.json';
    },

    getPropertyCardHTML(property, showDescription = false) {
        if (!property) return ''; 
        
        const featuredBadge = property.isFeatured ? '<span class="property-badge featured">Featured</span>' : '';
        const description = showDescription ? 
            `<p class="property-description" style="color: var(--text-light); font-size: 0.9rem; margin-bottom: 1rem;">${property.description}</p>` : 
            '';
        
        return `
            <div class="property-card" data-id="${property.id}">
                <div class="property-image">
                    <img src="${property.image}" alt="${property.alt}" loading="lazy">
                    ${featuredBadge}
                </div>
                <div class="property-info">
                    <div class="property-price">${property.price}</div>
                    <div class="property-address">${property.address}</div>
                    ${description}
                    <div class="property-details">
                        <div class="property-detail">
                            <div class="property-detail-value">${property.beds}</div>
                            <div class="property-detail-label">Beds</div>
                        </div>
                        <div class="property-detail">
                            <div class="property-detail-value">${property.baths}</div>
                            <div class="property-detail-label">Baths</div>
                        </div>
                        <div class="property-detail">
                            <div class="property-detail-value">${property.sqft}</div>
                            <div class="property-detail-label">Sq Ft</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    getFooterHTML() {
        const isRoot = !window.location.pathname.includes('/pages/');
        const prefix = isRoot ? 'pages/' : '';
        
        return `
            <div class="footer-content">
                <div class="footer-section">
                    <h4>About Sarah</h4>
                    <p>Real estate specialist with 15+ years of experience helping clients find their dream homes and make smart investment decisions.</p>
                </div>
                <div class="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="${prefix}listings.html">View Listings</a></li>
                        <li><a href="${prefix}about.html">About Me</a></li>
                        <li><a href="${prefix}neighborhoods.html">Neighborhoods</a></li>
                        <li><a href="${prefix}contact.html">Contact</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>Contact Info</h4>
                    <p>(996) 522-780</p>
                    <p>magombochikondi40@gmail.com</p>
                    <p>Blantyre City,Malawi</p>
                </div>
                <div class="footer-section">
                    <h4>Follow Me</h4>
                    <div class="social-links">
                        <a href="#" title="Facebook">f</a>
                        <a href="#" title="Instagram">📷</a>
                        <a href="#" title="LinkedIn">in</a>
                        <a href="#" title="Twitter">𝕏</a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 Sarah Martinez Real Estate. All rights reserved.</p>
            </div>
        `;
    },

    async loadProperties() {
        const featuredContainer = document.getElementById('featured-properties-container');
        const allListingsContainer = document.getElementById('all-listings-container');
        
        if (!featuredContainer && !allListingsContainer) return;

        try {
            const response = await fetch(this.getJsonPath());
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            const properties = data.properties;

            if (featuredContainer) {
                const featuredProperties = properties.slice(0, 3);
                featuredContainer.innerHTML = featuredProperties
                    .map(p => this.getPropertyCardHTML(p, false))
                    .join('');
            }

            if (allListingsContainer) {
                allListingsContainer.innerHTML = properties
                    .map(p => this.getPropertyCardHTML(p, true))
                    .join('');
            }
            
            this.setupPropertyCardAnimations();

        } catch (error) {
            console.error("Could not load properties:", error);
            const errorMessage = '<p style="color: red; text-align: center; padding: 20px;">Error loading property data. Please ensure **js/data.json** exists and the path is correct.</p>';
            if (featuredContainer) featuredContainer.innerHTML = errorMessage;
            if (allListingsContainer) allListingsContainer.innerHTML = errorMessage;
        }
    },
    
    handleFormSubmit(event) {
        // event.preventDefault();
        
        const form = document.getElementById('contactForm');
        const messageDiv = document.getElementById('formMessage');
        
        if (!form) return;

        const formData = new FormData(form);
        const firstName = formData.get('firstName').trim();
        const date = formData.get('date').trim();
        const time = formData.get('time').trim();
        
        // --- Custom Validation Check ---
        if (!firstName || !date || !time) {
            messageDiv.textContent = 'Please fill out all required fields (First Name, Date, and Time).';
            messageDiv.style.backgroundColor = '#f8d7da'; // red/error color
            messageDiv.style.color = '#721c24';
            messageDiv.style.border = '1px solid #f5c6cb';
            messageDiv.style.display = 'block';

            // Clear the error message after 5 seconds
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
            return; // STOP submission if validation fails
        }
        // --- End Custom Validation Check ---

        // Submission Success Logic
        messageDiv.textContent = `Thank you, ${firstName}! Your showing has been scheduled for ${date} at ${time}. I'll confirm via email shortly.`;
        messageDiv.style.backgroundColor = '#d4edda'; // green success color
        messageDiv.style.color = '#155724';
        messageDiv.style.border = '1px solid #c3e6cb';
        messageDiv.style.display = 'block';
        
        // Reset form after a delay
        setTimeout(() => {
            form.reset();
            messageDiv.style.display = 'none';
        }, 4000);
    },

    updateActiveNav() {
        const navLinks = document.querySelectorAll('.nav-links a');
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';

        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href').split('/').pop();
            if (linkPath === currentPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    },

    toggleMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        if (hamburger && navLinks) {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        }
    },
    
    setupMobileMenuCloseOnClick() {
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                const navContainer = document.querySelector('.nav-links');
                if (navContainer && navContainer.classList.contains('active')) {
                    this.toggleMobileMenu();
                }
            });
        });
    },

    setupPropertyCardAnimations() {
        document.querySelectorAll('.property-card').forEach(card => {
            card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-10px)');
            card.addEventListener('mouseleave', () => card.style.transform = 'translateY(0)');
        });
    },
    
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    },

    setupFooter() {
        const footerElement = document.querySelector('#app-footer');
        if (footerElement) {
            footerElement.innerHTML = this.getFooterHTML();
        }
    },
    
    setupContactFormHandler() {
        const form = document.getElementById('contactForm');
        if (form) {
            form.addEventListener('submit', this.handleFormSubmit.bind(this));
        }
    },

    setupScrollAnimations() {
        window.addEventListener('scroll', function() {
            const animatedElements = document.querySelectorAll('[data-animate]');
            
            animatedElements.forEach(element => {
                const elementPosition = element.getBoundingClientRect().top;
                const screenPosition = window.innerHeight / 1.3;
                
                if (elementPosition < screenPosition) {
                    element.classList.add('animated');
                }
            });
        });
    },

    lazyLoadImages() {
        if ('IntersectionObserver' in window) {
            const images = document.querySelectorAll('img[data-src]');
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            document.querySelectorAll('img[data-src]').forEach(img => {
                img.src = img.dataset.src;
                img.classList.add('loaded');
            });
        }
    },

    init() {
        window.toggleMobileMenu = this.toggleMobileMenu; 
        this.setupFooter();
        this.updateActiveNav();
        this.loadProperties();
        this.setupSmoothScroll();
        this.setupMobileMenuCloseOnClick();
        this.setupContactFormHandler();
        this.setupScrollAnimations();
        this.lazyLoadImages();
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());