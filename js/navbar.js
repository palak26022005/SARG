// ========================================
// NAVBAR JAVASCRIPT
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const dropdownToggles = document.querySelectorAll('.has-dropdown > .dropdown-toggle');
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const regularNavLinks = document.querySelectorAll('.nav-item:not(.has-dropdown) > .nav-link:not(.nav-cta)');
    const ctaButton = document.querySelector('.nav-cta');

    // Navbar scroll effect
    function handleNavbarScroll() {
        if (!navbar || !document.body.classList.contains('home-page')) return;

        if (window.scrollY > 48) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    handleNavbarScroll();
    window.addEventListener('scroll', handleNavbarScroll, { passive: true });

    // Mobile menu toggle function
    function toggleMobileMenu() {
        navMenu.classList.toggle('active');
        mobileToggle.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    // Close mobile menu function
    function closeMobileMenu() {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
        // Close all dropdowns
        document.querySelectorAll('.nav-item.dropdown-open').forEach(item => {
            item.classList.remove('dropdown-open');
        });
    }

    // Mobile toggle click event
    mobileToggle.addEventListener('click', toggleMobileMenu);

    // Menu overlay click event
    menuOverlay.addEventListener('click', closeMobileMenu);

    // Handle dropdown toggles on mobile
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            // Check if mobile view
            if (window.innerWidth <= 992) {
                e.preventDefault();
                e.stopPropagation();
                
                const parentItem = this.parentElement;
                const isOpen = parentItem.classList.contains('dropdown-open');
                
                // Close all other dropdowns
                document.querySelectorAll('.nav-item.dropdown-open').forEach(item => {
                    if (item !== parentItem) {
                        item.classList.remove('dropdown-open');
                    }
                });
                
                // Toggle current dropdown
                parentItem.classList.toggle('dropdown-open');
            }
        });
    });

    // Handle dropdown item clicks - close menu after navigation
    dropdownItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 992) {
                // Small delay to allow navigation
                setTimeout(closeMobileMenu, 100);
            }
        });
    });

    // Handle regular nav links (non-dropdown) - close menu immediately
    regularNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 992) {
                closeMobileMenu();
            }
        });
    });

    // Handle CTA button click
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            if (window.innerWidth <= 992) {
                closeMobileMenu();
            }
        });
    }

    // Close mobile menu on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992) {
            closeMobileMenu();
        }
    });

    // Escape key to close mobile menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    closeMobileMenu();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});


// ========================================
// FOOTER JAVASCRIPT
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Scroll to Top Button
    const scrollTopBtn = document.getElementById('scrollTop');

    // Show/hide scroll to top button
    function handleScrollTopVisibility() {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', handleScrollTopVisibility);

    // Scroll to top functionality
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

// Newsletter Form Handler
function handleNewsletterSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    
    // You can replace this with actual form submission logic
    console.log('Newsletter subscription:', email);
    
    // Show success message (you can customize this)
    alert('Thank you for subscribing to our newsletter!');
    
    // Reset form
    form.reset();
    
    return false;
}
