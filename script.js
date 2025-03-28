// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');
const body = document.body;

if (mobileMenuBtn && navLinks) {
    const toggleMenu = () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
        
        // Toggle body scroll
        if (navLinks.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    };

    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            navLinks.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
            body.style.overflow = '';
        }
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
            body.style.overflow = '';
        });
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navLinks.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
            body.style.overflow = '';
        }
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Close mobile menu after clicking a link
            navLinks.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
    });
});

// Testimonial Slider
const testimonialSlider = document.querySelector('.testimonial-slider');
if (testimonialSlider) {
    const testimonials = testimonialSlider.querySelectorAll('.testimonial');
    const prevBtn = testimonialSlider.querySelector('.prev-btn');
    const nextBtn = testimonialSlider.querySelector('.next-btn');
    const dotsContainer = testimonialSlider.querySelector('.dots');
    let currentIndex = 0;
    let autoplayInterval;

    // Create dots
    testimonials.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.dot');

    const updateSlider = () => {
        // Update testimonials
        testimonials.forEach((testimonial, index) => {
            testimonial.style.transform = `translateX(${100 * (index - currentIndex)}%)`;
            testimonial.style.opacity = index === currentIndex ? '1' : '0';
        });

        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    };

    const goToSlide = (index) => {
        currentIndex = index;
        updateSlider();
        resetAutoplay();
    };

    const nextSlide = () => {
        currentIndex = (currentIndex + 1) % testimonials.length;
        updateSlider();
    };

    const prevSlide = () => {
        currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
        updateSlider();
    };

    const startAutoplay = () => {
        autoplayInterval = setInterval(nextSlide, 5000);
    };

    const resetAutoplay = () => {
        clearInterval(autoplayInterval);
        startAutoplay();
    };

    // Event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoplay();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoplay();
        });
    }

    // Pause autoplay on hover
    testimonialSlider.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });

    testimonialSlider.addEventListener('mouseleave', startAutoplay);

    // Start autoplay
    startAutoplay();

    // Initialize slider
    updateSlider();
}

// Form Validation
const form = document.querySelector('#registration-form');
if (form) {
    const validateField = (field, rules) => {
        const value = field.value.trim();
        const errorElement = field.nextElementSibling;
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (rules.required && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (rules.email && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Phone validation
        if (rules.phone && value) {
            const phoneRegex = /^\+?[\d\s-]{10,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }

        // Min length validation
        if (rules.minLength && value.length < rules.minLength) {
            isValid = false;
            errorMessage = `Please enter at least ${rules.minLength} characters`;
        }

        // Update field and error message
        field.classList.toggle('error', !isValid);
        if (errorElement && errorElement.classList.contains('form-error')) {
            errorElement.textContent = errorMessage;
            errorElement.style.display = isValid ? 'none' : 'block';
        }

        return isValid;
    };

    const validateForm = () => {
        let isValid = true;
        const fields = form.querySelectorAll('.form-control');

        fields.forEach(field => {
            const rules = {
                required: field.hasAttribute('required'),
                email: field.type === 'email',
                phone: field.type === 'tel',
                minLength: field.dataset.minLength ? parseInt(field.dataset.minLength) : null
            };

            if (!validateField(field, rules)) {
                isValid = false;
            }
        });

        return isValid;
    };

    // Real-time validation
    form.querySelectorAll('.form-control').forEach(field => {
        field.addEventListener('input', () => {
            const rules = {
                required: field.hasAttribute('required'),
                email: field.type === 'email',
                phone: field.type === 'tel',
                minLength: field.dataset.minLength ? parseInt(field.dataset.minLength) : null
            };
            validateField(field, rules);
        });

        field.addEventListener('blur', () => {
            const rules = {
                required: field.hasAttribute('required'),
                email: field.type === 'email',
                phone: field.type === 'tel',
                minLength: field.dataset.minLength ? parseInt(field.dataset.minLength) : null
            };
            validateField(field, rules);
        });
    });

    // Form submission
    form.addEventListener('submit', (e) => {
        // Only prevent default if validation fails
        if (!validateForm()) {
            e.preventDefault();
            return;
        }
        
        // If validation passes, let the form submit normally to Formspree
        // The form will redirect to success.html as specified in the hidden _next field
        
        // We can show a loading state on the button
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        
        // The form will submit to Formspree and redirect
        // No need to reset the form or add success message here
        // as we'll redirect to success.html
    });
}

// Cookie Notice
const cookieNotice = document.querySelector('.cookie-notice');
if (cookieNotice) {
    const cookieAccepted = localStorage.getItem('cookieAccepted');
    
    if (!cookieAccepted) {
        setTimeout(() => {
            cookieNotice.classList.add('active');
        }, 2000);
    }

    const acceptCookies = () => {
        localStorage.setItem('cookieAccepted', 'true');
        cookieNotice.classList.remove('active');
    };

    const declineCookies = () => {
        localStorage.setItem('cookieAccepted', 'false');
        cookieNotice.classList.remove('active');
    };

    const acceptBtn = cookieNotice.querySelector('.cookie-btn-accept');
    const declineBtn = cookieNotice.querySelector('.cookie-btn-decline');

    if (acceptBtn) {
        acceptBtn.addEventListener('click', acceptCookies);
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', declineCookies);
    }
}

// Scroll Animation
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-fade-in, .animate-slide-in-left, .animate-slide-in-right, .animate-scale-in');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight * 0.8 && elementBottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Initial check for elements in view
window.addEventListener('load', animateOnScroll);

// Check on scroll
window.addEventListener('scroll', animateOnScroll);

// Contact Form Validation and Submission
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    const validateField = (field, rules) => {
        const value = field.value.trim();
        const errorElement = field.nextElementSibling;
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (rules.required && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (rules.email && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Min length validation
        if (rules.minLength && value.length < rules.minLength) {
            isValid = false;
            errorMessage = `Please enter at least ${rules.minLength} characters`;
        }

        // Update field and error message
        field.classList.toggle('error', !isValid);
        if (errorElement && errorElement.classList.contains('form-error')) {
            errorElement.textContent = errorMessage;
            errorElement.style.display = isValid ? 'none' : 'block';
        }

        return isValid;
    };

    const validateForm = () => {
        let isValid = true;
        const fields = contactForm.querySelectorAll('.form-control');

        fields.forEach(field => {
            const rules = {
                required: field.hasAttribute('required'),
                email: field.type === 'email',
                minLength: field.dataset.minLength ? parseInt(field.dataset.minLength) : null
            };

            if (!validateField(field, rules)) {
                isValid = false;
            }
        });

        return isValid;
    };

    // Real-time validation
    contactForm.querySelectorAll('.form-control').forEach(field => {
        field.addEventListener('input', () => {
            const rules = {
                required: field.hasAttribute('required'),
                email: field.type === 'email',
                minLength: field.dataset.minLength ? parseInt(field.dataset.minLength) : null
            };
            validateField(field, rules);
        });

        field.addEventListener('blur', () => {
            const rules = {
                required: field.hasAttribute('required'),
                email: field.type === 'email',
                minLength: field.dataset.minLength ? parseInt(field.dataset.minLength) : null
            };
            validateField(field, rules);
        });
    });

    // Form submission
    contactForm.addEventListener('submit', (e) => {
        // Only prevent default if validation fails
        if (!validateForm()) {
            e.preventDefault();
            return;
        }
        
        // If validation passes, let the form submit normally to Formspree
        // The form will redirect to success.html as specified in the hidden _next field
        
        // We can show a loading state on the button
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        // The form will submit to Formspree and redirect
        // No need to reset the form or add success message here
    });
}

// Lead generation modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const leadModal = document.getElementById('lead-modal');
    if (!leadModal) return; // Exit if modal doesn't exist
    
    const closeBtn = leadModal.querySelector('.modal-close');
    const leadForm = document.getElementById('lead-form');
    
    // Only show modal if user hasn't seen it before
    const hasSeenModal = localStorage.getItem('modalClosed') === 'true' || 
                         localStorage.getItem('leadSubmitted') === 'true';
    
    if (!hasSeenModal) {
        // Show modal after 5 seconds
        const modalTimeout = setTimeout(function() {
            leadModal.classList.add('show');
        }, 5000); // 5000 milliseconds = 5 seconds
    }
    
    // Close modal when close button is clicked
    closeBtn.addEventListener('click', function() {
        leadModal.classList.remove('show');
        // Store in localStorage that user closed the modal
        localStorage.setItem('modalClosed', 'true');
    });
    
    // Close modal when clicking outside content
    window.addEventListener('click', function(event) {
        if (event.target === leadModal) {
            leadModal.classList.remove('show');
            localStorage.setItem('modalClosed', 'true');
        }
    });
    
    // Handle lead form submission
    if (leadForm) {
        leadForm.addEventListener('submit', function() {
            // Set flag that form was submitted - this will happen before the redirect
            localStorage.setItem('leadSubmitted', 'true');
            
            // The form will submit normally to Formspree and redirect to the success page
            // No need to prevent the default behavior or add our own success message
        });
    }
}); 