/*
=====================================================
  سواعد الخير - Sawa'ed Al-Khair Charity Website
  Main JavaScript File
=====================================================
  
  Table of Contents:
  1. Mobile Navigation
  2. Smooth Scrolling
  3. Form Validation
  4. Donation Amount Selection
  5. Filter Tabs
  6. UI Interactions
  7. Utility Functions
  8. Initialization
  
=====================================================
*/

// =====================================================
// 1. MOBILE NAVIGATION
// =====================================================

class MobileMenu {
    constructor() {
        this.menuToggle = document.querySelector('.menu-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.body = document.body;
        
        if (this.menuToggle && this.navMenu) {
            this.init();
        }
    }
    
    init() {
        // Toggle menu on button click
        this.menuToggle.addEventListener('click', () => {
            this.toggleMenu();
        });
        
        // Close menu when clicking on a nav link
        const navLinks = this.navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    this.closeMenu();
                }
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!this.navMenu.contains(e.target) && !this.menuToggle.contains(e.target)) {
                    this.closeMenu();
                }
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMenu();
            }
        });
    }
    
    toggleMenu() {
        this.navMenu.classList.toggle('active');
        this.menuToggle.classList.toggle('active');
        this.body.classList.toggle('menu-open');
        
        // Toggle aria-expanded
        const isExpanded = this.navMenu.classList.contains('active');
        this.menuToggle.setAttribute('aria-expanded', isExpanded);
    }
    
    closeMenu() {
        this.navMenu.classList.remove('active');
        this.menuToggle.classList.remove('active');
        this.body.classList.remove('menu-open');
        this.menuToggle.setAttribute('aria-expanded', 'false');
    }
}

// =====================================================
// 2. SMOOTH SCROLLING
// =====================================================

class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        // Handle all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                
                // Skip if href is just "#"
                if (href === '#') {
                    e.preventDefault();
                    return;
                }
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    this.scrollToElement(targetElement);
                }
            });
        });
    }
    
    scrollToElement(element) {
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 80;
        const targetPosition = element.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// =====================================================
// 3. FORM VALIDATION
// =====================================================

class FormValidator {
    constructor() {
        this.forms = document.querySelectorAll('form');
        this.init();
    }
    
    init() {
        this.forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });
            
            // Real-time validation on input
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
                
                input.addEventListener('input', () => {
                    // Clear error on input
                    this.clearError(input);
                });
            });
        });
    }
    
    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        let isValid = true;
        let errorMessage = '';
        
        // Clear previous errors
        this.clearError(field);
        
        // Required field check
        if (field.hasAttribute('required') && !value) {
            errorMessage = 'هذا الحقل مطلوب';
            isValid = false;
        }
        
        // Email validation
        else if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'البريد الإلكتروني غير صحيح';
                isValid = false;
            }
        }
        
        // Phone validation (Egyptian format)
        else if (type === 'tel' && value) {
            const phoneRegex = /^01[0-9]{9}$/;
            if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                errorMessage = 'رقم الهاتف غير صحيح (يجب أن يبدأ بـ 01 ويتكون من 11 رقم)';
                isValid = false;
            }
        }
        
        // Number validation
        else if (type === 'number' && value) {
            const min = field.getAttribute('min');
            const max = field.getAttribute('max');
            const numValue = parseFloat(value);
            
            if (min && numValue < parseFloat(min)) {
                errorMessage = `القيمة يجب أن تكون ${min} على الأقل`;
                isValid = false;
            }
            
            if (max && numValue > parseFloat(max)) {
                errorMessage = `القيمة يجب أن تكون ${max} كحد أقصى`;
                isValid = false;
            }
        }
        
        if (!isValid) {
            this.showError(field, errorMessage);
        }
        
        return isValid;
    }
    
    showError(field, message) {
        field.classList.add('error');
        
        // Create error message element
        let errorElement = field.parentElement.querySelector('.error-message');
        
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            errorElement.style.color = '#f44336';
            errorElement.style.fontSize = '0.85rem';
            errorElement.style.marginTop = '0.25rem';
            errorElement.style.display = 'block';
            field.parentElement.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        field.setAttribute('aria-invalid', 'true');
    }
    
    clearError(field) {
        field.classList.remove('error');
        const errorElement = field.parentElement.querySelector('.error-message');
        
        if (errorElement) {
            errorElement.remove();
        }
        
        field.removeAttribute('aria-invalid');
    }
}

// =====================================================
// 4. DONATION AMOUNT SELECTION
// =====================================================

class DonationSelector {
    constructor() {
        this.amountButtons = document.querySelectorAll('.amount-btn');
        this.customAmountInput = document.querySelector('.custom-amount-input');
        this.customAmountField = document.querySelector('#custom-donation-amount');
        
        if (this.amountButtons.length > 0) {
            this.init();
        }
    }
    
    init() {
        this.amountButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove selected class from all buttons
                this.amountButtons.forEach(btn => btn.classList.remove('selected'));
                
                // Add selected class to clicked button
                button.classList.add('selected');
                
                // Check if custom amount button
                if (button.classList.contains('custom-amount')) {
                    this.showCustomInput();
                } else {
                    this.hideCustomInput();
                    const amount = button.getAttribute('data-amount');
                    this.setSelectedAmount(amount);
                }
            });
        });
        
        // Handle custom amount input
        if (this.customAmountField) {
            this.customAmountField.addEventListener('input', (e) => {
                this.setSelectedAmount(e.target.value);
            });
        }
    }
    
    showCustomInput() {
        if (this.customAmountInput) {
            this.customAmountInput.style.display = 'block';
            this.customAmountField?.focus();
        }
    }
    
    hideCustomInput() {
        if (this.customAmountInput) {
            this.customAmountInput.style.display = 'none';
            if (this.customAmountField) {
                this.customAmountField.value = '';
            }
        }
    }
    
    setSelectedAmount(amount) {
        // Store selected amount (could be used for form submission)
        sessionStorage.setItem('selectedDonationAmount', amount);
        console.log('Selected donation amount:', amount);
    }
}

// =====================================================
// 5. FILTER TABS
// =====================================================

class FilterTabs {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-tab');
        this.filterableItems = document.querySelectorAll('[data-status]');
        
        if (this.filterButtons.length > 0) {
            this.init();
        }
    }
    
    init() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                this.filterItems(filter);
                this.setActiveButton(button);
            });
        });
    }
    
    filterItems(filter) {
        this.filterableItems.forEach(item => {
            const status = item.getAttribute('data-status');
            
            if (filter === 'all') {
                item.style.display = '';
                this.fadeIn(item);
            } else if (status.includes(filter)) {
                item.style.display = '';
                this.fadeIn(item);
            } else {
                this.fadeOut(item);
            }
        });
    }
    
    setActiveButton(activeButton) {
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        activeButton.classList.add('active');
    }
    
    fadeIn(element) {
        element.style.opacity = '0';
        element.style.display = '';
        
        setTimeout(() => {
            element.style.transition = 'opacity 0.3s ease';
            element.style.opacity = '1';
        }, 10);
    }
    
    fadeOut(element) {
        element.style.transition = 'opacity 0.3s ease';
        element.style.opacity = '0';
        
        setTimeout(() => {
            element.style.display = 'none';
        }, 300);
    }
}

// =====================================================
// 6. UI INTERACTIONS
// =====================================================

class UIInteractions {
    constructor() {
        this.init();
    }
    
    init() {
        this.initCategorySelection();
        this.initRecurringDonation();
        this.initCopyToClipboard();
        this.initBackToTop();
    }
    
    // Category Selection for Donations
    initCategorySelection() {
        const categoryButtons = document.querySelectorAll('.select-category');
        
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.getAttribute('data-category');
                const amount = button.getAttribute('data-amount');
                
                // Store selection
                sessionStorage.setItem('selectedCategory', category);
                if (amount) {
                    sessionStorage.setItem('selectedDonationAmount', amount);
                }
                
                // Scroll to payment section or form
                const paymentSection = document.querySelector('.payment-methods');
                if (paymentSection) {
                    const headerHeight = document.querySelector('.site-header')?.offsetHeight || 80;
                    const targetPosition = paymentSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Recurring Donation Toggle
    initRecurringDonation() {
        const recurringOptions = document.querySelectorAll('input[name="donation-frequency"]');
        
        recurringOptions.forEach(option => {
            option.addEventListener('change', (e) => {
                const frequency = e.target.value;
                sessionStorage.setItem('donationFrequency', frequency);
                console.log('Donation frequency:', frequency);
            });
        });
    }
    
    // Copy to Clipboard (for account numbers, phone numbers)
    initCopyToClipboard() {
        const copyableElements = document.querySelectorAll('.account-number, .phone-number');
        
        copyableElements.forEach(element => {
            // Make element clickable
            element.style.cursor = 'pointer';
            element.title = 'انقر للنسخ';
            
            element.addEventListener('click', () => {
                const text = element.textContent.trim();
                
                // Copy to clipboard
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(text).then(() => {
                        this.showCopyNotification(element, 'تم النسخ!');
                    }).catch(() => {
                        this.fallbackCopy(text, element);
                    });
                } else {
                    this.fallbackCopy(text, element);
                }
            });
        });
    }
    
    fallbackCopy(text, element) {
        // Fallback copy method for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            this.showCopyNotification(element, 'تم النسخ!');
        } catch (err) {
            this.showCopyNotification(element, 'فشل النسخ');
        }
        
        document.body.removeChild(textarea);
    }
    
    showCopyNotification(element, message) {
        // Create notification
        const notification = document.createElement('span');
        notification.textContent = message;
        notification.style.position = 'absolute';
        notification.style.background = '#2e7d32';
        notification.style.color = 'white';
        notification.style.padding = '0.5rem 1rem';
        notification.style.borderRadius = '4px';
        notification.style.fontSize = '0.85rem';
        notification.style.marginRight = '1rem';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease';
        notification.style.zIndex = '1000';
        
        element.parentElement.style.position = 'relative';
        element.parentElement.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);
        
        // Remove after 2 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }
    
    // Back to Top Button
    initBackToTop() {
        // Create back to top button
        const backToTopBtn = document.createElement('button');
        backToTopBtn.innerHTML = '↑';
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.setAttribute('aria-label', 'العودة للأعلى');
        backToTopBtn.style.cssText = `
            position: fixed;
            bottom: 2rem;
            left: 2rem;
            width: 50px;
            height: 50px;
            background: #2e7d32;
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 999;
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        `;
        
        document.body.appendChild(backToTopBtn);
        
        // Show/hide based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.visibility = 'visible';
            } else {
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.visibility = 'hidden';
            }
        });
        
        // Scroll to top on click
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Hover effect
        backToTopBtn.addEventListener('mouseenter', () => {
            backToTopBtn.style.background = '#1b5e20';
            backToTopBtn.style.transform = 'translateY(-3px)';
        });
        
        backToTopBtn.addEventListener('mouseleave', () => {
            backToTopBtn.style.background = '#2e7d32';
            backToTopBtn.style.transform = 'translateY(0)';
        });
    }
}

// =====================================================
// 7. UTILITY FUNCTIONS
// =====================================================

class Utils {
    // Format currency
    static formatCurrency(amount) {
        return new Intl.NumberFormat('ar-EG', {
            style: 'currency',
            currency: 'EGP'
        }).format(amount);
    }
    
    // Format phone number
    static formatPhoneNumber(phone) {
        const cleaned = phone.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{4})(\d{3})(\d{4})$/);
        
        if (match) {
            return `${match[1]} ${match[2]} ${match[3]}`;
        }
        
        return phone;
    }
    
    // Debounce function
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Check if element is in viewport
    static isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
}

// =====================================================
// 8. SCROLL ANIMATIONS (OPTIONAL - CAN BE DISABLED FOR FASTER LOAD)
// =====================================================

class ScrollAnimations {
    constructor() {
        // Skip if user prefers reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        
        this.animatedElements = document.querySelectorAll('.stat-card, .activity-card, .project-card, .testimonial-card, .goal-card, .value-card, .opportunity-card, .category-card, .benefit-card, .cta-option');
        
        // Only animate elements that are NOT in viewport on load
        // Elements in viewport will use CSS animation
        if (this.animatedElements.length > 0) {
            this.init();
        }
    }
    
    init() {
        // Faster timing for better UX
        const ANIMATION_DURATION = 0.3; // 300ms - fast but smooth
        const STAGGER_DELAY = 0.04; // 40ms between each card
        
        // Only set up scroll animation for elements BELOW the fold
        this.animatedElements.forEach((element, index) => {
            // Check if element is already visible
            if (!Utils.isInViewport(element)) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(15px)'; // Reduced from 20px
                element.style.transition = `opacity ${ANIMATION_DURATION}s ease, transform ${ANIMATION_DURATION}s ease`;
                element.setAttribute('data-animate', 'true');
                
                // Add stagger delay only for elements in same row/section
                element.style.transitionDelay = `${index * STAGGER_DELAY}s`;
            } else {
                // Elements already in viewport - show immediately without animation
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
        
        // Check on scroll with minimal debounce for instant response
        const handleScroll = Utils.debounce(() => {
            this.checkElements();
        }, 20); // Reduced from 50ms to 20ms
        
        window.addEventListener('scroll', handleScroll);
        
        // Use requestAnimationFrame for smoother initial check
        requestAnimationFrame(() => {
            this.checkElements();
        });
    }
    
    checkElements() {
        this.animatedElements.forEach(element => {
            if (element.hasAttribute('data-animate') && Utils.isInViewport(element)) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                element.removeAttribute('data-animate');
            }
        });
    }
}

// =====================================================
// 9. LOADING INDICATOR
// =====================================================

class LoadingIndicator {
    static show() {
        const loader = document.createElement('div');
        loader.className = 'loading-indicator';
        loader.innerHTML = '<div class="spinner"></div>';
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;
        
        const spinner = loader.querySelector('.spinner');
        spinner.style.cssText = `
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255,255,255,0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        `;
        
        // Add keyframe animation
        if (!document.querySelector('#spinner-keyframes')) {
            const style = document.createElement('style');
            style.id = 'spinner-keyframes';
            style.textContent = `
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(loader);
        return loader;
    }
    
    static hide(loader) {
        if (loader && loader.parentElement) {
            loader.remove();
        }
    }
}

// =====================================================
// 10. FORM SUBMISSION HANDLER
// =====================================================

class FormSubmissionHandler {
    constructor() {
        this.forms = document.querySelectorAll('form');
        this.init();
    }
    
    init() {
        this.forms.forEach(form => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                // Show loading
                const loader = LoadingIndicator.show();
                
                // Simulate form submission (replace with actual API call)
                setTimeout(() => {
                    LoadingIndicator.hide(loader);
                    this.showSuccessMessage(form);
                    form.reset();
                }, 1500);
            });
        });
    }
    
    showSuccessMessage(form) {
        const message = document.createElement('div');
        message.className = 'success-message';
        message.textContent = 'تم الإرسال بنجاح! شكراً لك.';
        message.style.cssText = `
            background: #4caf50;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            margin-top: 1rem;
            text-align: center;
            animation: slideDown 0.3s ease;
        `;
        
        // Add animation
        if (!document.querySelector('#message-keyframes')) {
            const style = document.createElement('style');
            style.id = 'message-keyframes';
            style.textContent = `
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        form.appendChild(message);
        
        // Remove after 5 seconds
        setTimeout(() => {
            message.style.opacity = '0';
            setTimeout(() => message.remove(), 300);
        }, 5000);
    }
}

// =====================================================
// 11. INITIALIZATION
// =====================================================

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new MobileMenu();
    new SmoothScroll();
    new FormValidator();
    new DonationSelector();
    new FilterTabs();
    new UIInteractions();
    new ScrollAnimations();
    new FormSubmissionHandler();
    
    // Log initialization
    console.log('سواعد الخير - Website initialized successfully');
});

// Handle page visibility
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page hidden');
    } else {
        console.log('Page visible');
    }
});

// Handle offline/online status
window.addEventListener('offline', () => {
    console.log('Connection lost');
    // Could show a notification to user
});

window.addEventListener('online', () => {
    console.log('Connection restored');
});

// Export utilities for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Utils, LoadingIndicator };
}


document.addEventListener('DOMContentLoaded', () => {

    // === فورم التطوع ===
    const volunteerForm = document.getElementById('volunteer-form');
    if (volunteerForm) {
        volunteerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('full-name').value;
            const age = document.getElementById('age').value;
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email').value || '-';
            const city = document.getElementById('city').value;
            const field = document.getElementById('field').value;
            const availability = document.getElementById('availability').value;
            const experience = document.getElementById('experience').value || '-';
            const motivation = document.getElementById('motivation').value;
            const skills = document.getElementById('skills').value || '-';

            const text = `طلب تطوع جديد:%0A
الاسم الكامل: ${fullName}%0A
العمر: ${age}%0A
رقم الهاتف: ${phone}%0A
البريد الإلكتروني: ${email}%0A
المحافظة/المدينة: ${city}%0A
المجال المهتم به: ${field}%0A
الوقت المتاح: ${availability}%0A
الخبرة السابقة: ${experience}%0A
الدافع للتطوع: ${motivation}%0A
المهارات الخاصة: ${skills}`;

            const phoneNumber = '201012448385';
            window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');
        });
    }

    // === فورم الاتصال ===
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('contact-name').value;
            const phone = document.getElementById('contact-phone').value;
            const email = document.getElementById('contact-email').value || '-';
            const subject = document.getElementById('contact-subject').value;
            const message = document.getElementById('contact-message').value;

            const text = `رسالة جديدة من نموذج الاتصال من الموقع:%0A
الاسم الكامل: ${name}%0A
رقم الهاتف: ${phone}%0A
البريد الإلكتروني: ${email}%0A
الموضوع: ${subject}%0A
الرسالة: ${message}`;

            const phoneNumber = '201012448385';
            window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');
        });
    }

});
/*
=====================================================
  END OF MAIN JAVASCRIPT FILE
=====================================================
*/