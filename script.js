// Section Navigation
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        window.scrollTo(0, 0);
    }
}

// Carousel Functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const totalSlides = slides.length;

function goToSlide(index) {
    // Remove active class from all slides and dots
    slides.forEach(slide => slide.classList.remove('active'));
    document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active'));
    
    // Add active class to selected slide and dot
    slides[index].classList.add('active');
    document.querySelectorAll('.dot')[index].classList.add('active');
    currentSlide = index;
}

// Auto-advance carousel (optional)
function autoAdvanceCarousel() {
    setInterval(() => {
        if (document.getElementById('onboarding').classList.contains('active')) {
            currentSlide = (currentSlide + 1) % totalSlides;
            goToSlide(currentSlide);
        }
    }, 5000);
}

// Initialize carousel auto-advance
autoAdvanceCarousel();

// Password Toggle
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    
    if (input.type === 'password') {
        input.type = 'text';
        button.textContent = '🙈';
    } else {
        input.type = 'password';
        button.textContent = '👁️';
    }
}

// Sign Up Method Selection
let selectedSignupMethod = 'email';

function selectSignupMethod(method) {
    selectedSignupMethod = method;
    
    // Update button states
    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Show/hide input groups
    const emailGroup = document.getElementById('emailGroup');
    const phoneGroup = document.getElementById('phoneGroup');
    const emailInput = document.getElementById('signupEmail');
    const phoneInput = document.getElementById('signupPhone');
    
    if (method === 'email') {
        emailGroup.classList.remove('hidden');
        phoneGroup.classList.add('hidden');
        emailInput.required = true;
        phoneInput.required = false;
        phoneInput.value = '';
    } else {
        emailGroup.classList.add('hidden');
        phoneGroup.classList.remove('hidden');
        emailInput.required = false;
        phoneInput.required = true;
        emailInput.value = '';
    }
}

// Handle Sign Up
function handleSignup(event) {
    event.preventDefault();
    
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const acceptTerms = document.getElementById('acceptTerms').checked;
    
    if (!acceptTerms) {
        alert('Please accept the Terms & Conditions to continue.');
        return;
    }
    
    // Store signup method for OTP page
    const target = selectedSignupMethod === 'email' ? email : phone;
    sessionStorage.setItem('signupTarget', target);
    sessionStorage.setItem('signupMethod', selectedSignupMethod);
    
    // Show OTP page
    showSection('otp');
    initializeOTP();
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Simulate login (no backend)
    console.log('Login attempt:', { email, password, rememberMe });
    
    // In a real app, this would make an API call
    alert('Login successful! (This is a demo - no actual authentication)');
    
    // You could redirect to a dashboard here
    // showSection('dashboard');
}

// OTP Functionality
let otpTimer;
let otpTimeLeft = 30;

function initializeOTP() {
    // Set target display
    const target = sessionStorage.getItem('signupTarget');
    const method = sessionStorage.getItem('signupMethod');
    document.getElementById('otpTarget').textContent = target || 'your device';
    
    // Reset OTP inputs
    const otpInputs = document.querySelectorAll('.otp-input');
    otpInputs.forEach(input => {
        input.value = '';
        input.addEventListener('input', handleOTPInput);
        input.addEventListener('keydown', handleOTPKeydown);
    });
    
    // Focus first input
    otpInputs[0].focus();
    
    // Reset and start timer
    otpTimeLeft = 30;
    document.getElementById('timer').textContent = otpTimeLeft;
    document.getElementById('resendBtn').disabled = true;
    
    clearInterval(otpTimer);
    otpTimer = setInterval(updateOTPTimer, 1000);
}

function handleOTPInput(event) {
    const input = event.target;
    const value = input.value.replace(/[^0-9]/g, '');
    input.value = value;
    
    if (value && input.nextElementSibling && input.nextElementSibling.classList.contains('otp-input')) {
        input.nextElementSibling.focus();
    }
}

function handleOTPKeydown(event) {
    const input = event.target;
    
    if (event.key === 'Backspace' && !input.value && input.previousElementSibling) {
        input.previousElementSibling.focus();
    }
}

function updateOTPTimer() {
    otpTimeLeft--;
    document.getElementById('timer').textContent = otpTimeLeft;
    
    if (otpTimeLeft <= 0) {
        clearInterval(otpTimer);
        document.getElementById('resendBtn').disabled = false;
    }
}

function resendOTP() {
    // Reset timer
    otpTimeLeft = 30;
    document.getElementById('timer').textContent = otpTimeLeft;
    document.getElementById('resendBtn').disabled = true;
    
    // Clear OTP inputs
    document.querySelectorAll('.otp-input').forEach(input => {
        input.value = '';
    });
    document.querySelectorAll('.otp-input')[0].focus();
    
    // Restart timer
    clearInterval(otpTimer);
    otpTimer = setInterval(updateOTPTimer, 1000);
    
    alert('OTP resent! (This is a demo - check console for simulated code)');
    console.log('Simulated OTP:', generateSimulatedOTP());
}

function generateSimulatedOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function handleOTP(event) {
    event.preventDefault();
    
    const otpInputs = document.querySelectorAll('.otp-input');
    let otpValue = '';
    
    otpInputs.forEach(input => {
        otpValue += input.value;
    });
    
    if (otpValue.length !== 6) {
        alert('Please enter the complete 6-digit OTP code.');
        return;
    }
    
    // Simulate OTP verification (accepts any 6 digits in demo)
    console.log('OTP entered:', otpValue);
    
    // Show success and move to profile
    alert('OTP verified successfully!');
    showSection('profile');
    
    // Pre-fill email/phone in profile if available
    const target = sessionStorage.getItem('signupTarget');
    const method = sessionStorage.getItem('signupMethod');
    
    if (method === 'email') {
        document.getElementById('profileEmail').value = target;
    } else {
        document.getElementById('profilePhone').value = target;
    }
}

// Handle Profile Setup
function handleProfile(event) {
    event.preventDefault();
    
    const name = document.getElementById('profileName').value;
    const age = document.getElementById('profileAge').value;
    const email = document.getElementById('profileEmail').value;
    const phone = document.getElementById('profilePhone').value;
    const address = document.getElementById('profileAddress').value;
    
    // Store profile data (in real app, send to backend)
    const profileData = { name, age, email, phone, address };
    console.log('Profile data:', profileData);
    
    alert('Profile setup complete! Welcome to Serenity Spa!');
    
    // In a real app, redirect to dashboard/home
    // For demo, you could show a success page or redirect to landing
    showSection('landing');
}

function skipProfile() {
    if (confirm('Are you sure you want to skip profile setup? You can complete it later.')) {
        alert('Welcome to Serenity Spa!');
        showSection('landing');
    }
}
// ... existing code ...

// Guest Home Functions
function handleBookService(serviceName) {
    alert(`Booking ${serviceName}...\n\nIn a real app, this would open a booking calendar.\n\nFor now, please sign up or login to complete your booking!`);
    console.log('Booking service:', serviceName);
}

// Reviews Auto-Scroll
let currentReview = 0;
const reviews = document.querySelectorAll('.review-card');
const totalReviews = reviews.length;
let reviewInterval;

function goToReview(index) {
    reviews.forEach(review => review.classList.remove('active'));
    document.querySelectorAll('.review-dot').forEach(dot => dot.classList.remove('active'));
    
    reviews[index].classList.add('active');
    document.querySelectorAll('.review-dot')[index].classList.add('active');
    currentReview = index;
}

function autoAdvanceReviews() {
    reviewInterval = setInterval(() => {
        if (document.getElementById('guest-home').classList.contains('active')) {
            currentReview = (currentReview + 1) % totalReviews;
            goToReview(currentReview);
        }
    }, 5000);
}

// Discount Scroll Animation
function animateDiscountScroll() {
    const discountScroll = document.getElementById('discountScroll');
    if (!discountScroll) return;
    
    let scrollPosition = 0;
    const scrollSpeed = 1;
    
    function scroll() {
        if (document.getElementById('guest-home').classList.contains('active')) {
            scrollPosition += scrollSpeed;
            discountScroll.scrollLeft = scrollPosition;
            
            // Reset scroll when reaching the end
            if (scrollPosition >= discountScroll.scrollWidth - discountScroll.clientWidth) {
                scrollPosition = 0;
            }
        }
    }
    
    // Smooth auto-scroll (slower, more subtle)
    setInterval(scroll, 50);
}

// Initialize guest home features when section is shown
const originalShowSection = showSection;
showSection = function(sectionId) {
    originalShowSection(sectionId);
    
    if (sectionId === 'guest-home') {
        // Initialize reviews
        setTimeout(() => {
            goToReview(0);
            autoAdvanceReviews();
        }, 100);
        
        // Initialize discount scroll
        setTimeout(() => {
            animateDiscountScroll();
        }, 100);
    } else {
        // Clear intervals when leaving guest home
        if (reviewInterval) {
            clearInterval(reviewInterval);
        }
    }
};

// ... rest of existing code ...
// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Show landing page by default
    showSection('landing');
    
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Debug helper - log current section
    console.log('Wellness Website Loaded');
    console.log('Available sections: landing, onboarding, login, signup, otp, profile');
    console.log('Use showSection("sectionName") to navigate');
});
