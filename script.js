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
/* ... existing styles ... */

/* Guest Button */
.btn-guest {
    padding: 12px 24px;
    border: 2px dashed var(--color-dark-green);
    border-radius: var(--border-radius);
    background: transparent;
    color: var(--color-dark-green);
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
    font-family: 'Inter', sans-serif;
    margin-top: 15px;
    width: 100%;
}

.btn-guest:hover {
    background: var(--color-beige);
    border-style: solid;
    transform: translateY(-2px);
}

/* Guest Home Page */
#guest-home {
    background: var(--color-beige);
    padding: 0;
    display: block;
    overflow-y: auto;
}

#guest-home.active {
    display: block;
}

.guest-header {
    background: var(--color-white);
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    position: sticky;
    top: 0;
    z-index: 100;
}

.header-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-logo {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-dark-green);
}

.btn-login-header {
    padding: 10px 20px;
    border: 2px solid var(--color-dark-green);
    border-radius: 12px;
    background: var(--color-white);
    color: var(--color-dark-green);
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
}

.btn-login-header:hover {
    background: var(--color-dark-green);
    color: var(--color-white);
}

/* Discount Section */
.discount-section {
    padding: 40px 20px;
    background: linear-gradient(135deg, var(--color-soft-green) 0%, var(--color-muted-blue) 100%);
}

.section-title {
    font-size: 2rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 30px;
    color: var(--color-text);
}

.discount-scroll {
    display: flex;
    gap: 20px;
    overflow-x: auto;
    padding: 20px 0;
    scroll-behavior: smooth;
    scrollbar-width: thin;
    -webkit-overflow-scrolling: touch;
}

.discount-scroll::-webkit-scrollbar {
    height: 8px;
}

.discount-scroll::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
}

.discount-scroll::-webkit-scrollbar-thumb {
    background: var(--color-white);
    border-radius: 10px;
}

.discount-card {
    min-width: 280px;
    background: var(--color-white);
    border-radius: var(--border-radius);
    padding: 25px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    position: relative;
    transition: var(--transition);
}

.discount-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.discount-badge {
    position: absolute;
    top: -10px;
    right: 20px;
    background: #FF6B6B;
    color: var(--color-white);
    padding: 8px 15px;
    border-radius: 20px;
    font-weight: 700;
    font-size: 0.9rem;
    box-shadow: 0 3px 10px rgba(255, 107, 107, 0.3);
}

.discount-card h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 10px;
    color: var(--color-text);
}

.discount-card p {
    color: var(--color-text-light);
    margin-bottom: 15px;
    font-size: 0.95rem;
}

.discount-price {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-dark-green);
}

.original-price {
    font-size: 1rem;
    color: var(--color-text-light);
    text-decoration: line-through;
    margin-left: 10px;
}

/* Services Section */
.services-section {
    padding: 60px 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 30px;
    margin-top: 40px;
}

.service-card {
    background: var(--color-white);
    border-radius: var(--border-radius);
    overflow: hidden;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
    transition: var(--transition);
}

.service-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}

.service-image {
    width: 100%;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.service-emoji {
    font-size: 60px;
}

.service-card h3 {
    padding: 20px 20px 10px;
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--color-text);
}

.service-card p {
    padding: 0 20px;
    color: var(--color-text-light);
    font-size: 0.95rem;
    line-height: 1.6;
}

.service-duration {
    padding: 10px 20px;
    color: var(--color-dark-green);
    font-weight: 600;
    font-size: 0.9rem;
}

.btn-book {
    width: calc(100% - 40px);
    margin: 15px 20px 20px;
    padding: 12px;
    border: none;
    border-radius: 12px;
    background: var(--color-dark-green);
    color: var(--color-white);
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
}

.btn-book:hover {
    background: var(--color-soft-green);
    transform: translateY(-2px);
}

/* Masseuse Section */
.masseuse-section {
    padding: 60px 20px;
    background: var(--color-white);
}

.masseuse-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
    max-width: 1200px;
    margin: 40px auto 0;
}

.masseuse-card {
    background: var(--color-beige);
    border-radius: var(--border-radius);
    padding: 25px;
    text-align: center;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
    transition: var(--transition);
}

.masseuse-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}

.masseuse-photo {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    margin: 0 auto 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 4px solid var(--color-white);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.photo-placeholder {
    font-size: 50px;
}

.masseuse-card h3 {
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 8px;
    color: var(--color-text);
}

.masseuse-specialty {
    color: var(--color-dark-green);
    font-weight: 600;
    font-size: 0.95rem;
    margin-bottom: 10px;
}

.masseuse-experience {
    color: var(--color-text-light);
    font-size: 0.9rem;
    margin-bottom: 10px;
}

.masseuse-rating {
    color: var(--color-dark-green);
    font-weight: 600;
    font-size: 0.95rem;
}

/* Reviews Section */
.reviews-section {
    padding: 60px 20px;
    background: linear-gradient(135deg, var(--color-beige) 0%, var(--color-muted-blue) 100%);
}

.reviews-container {
    max-width: 700px;
    margin: 40px auto;
    position: relative;
    height: 250px;
}

.review-card {
    position: absolute;
    width: 100%;
    background: var(--color-white);
    border-radius: var(--border-radius);
    padding: 40px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    opacity: 0;
    transform: translateX(50px);
    transition: var(--transition);
    text-align: center;
}

.review-card.active {
    opacity: 1;
    transform: translateX(0);
    z-index: 10;
}

.review-stars {
    font-size: 1.5rem;
    margin-bottom: 20px;
}

.review-text {
    font-size: 1.1rem;
    line-height: 1.8;
    color: var(--color-text);
    font-style: italic;
    margin-bottom: 20px;
}

.review-author {
    font-weight: 600;
    color: var(--color-dark-green);
    font-size: 1rem;
}

.reviews-pagination {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 30px;
}

.review-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    transition: var(--transition);
}

.review-dot.active {
    background: var(--color-white);
    transform: scale(1.3);
}

/* CTA Section */
.cta-section {
    padding: 80px 20px;
    background: linear-gradient(135deg, var(--color-dark-green) 0%, var(--color-dark-blue) 100%);
    text-align: center;
}

.cta-content {
    max-width: 600px;
    margin: 0 auto;
}

.cta-content h2 {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--color-white);
    margin-bottom: 15px;
}

.cta-content p {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 30px;
}

.btn-large {
    padding: 18px 50px;
    font-size: 1.2rem;
}

/* Mobile Responsive Updates */
@media (max-width: 768px) {
    .section-title {
        font-size: 1.75rem;
    }
    
    .discount-card {
        min-width: 250px;
    }
    
    .services-grid {
        grid-template-columns: 1fr;
    }
    
    .masseuse-grid {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    }
    
    .review-card {
        padding: 30px 20px;
    }
    
    .cta-content h2 {
        font-size: 2rem;
    }
    
    .cta-content p {
        font-size: 1rem;
    }
}

@media (max-width: 480px) {
    .discount-card {
        min-width: 220px;
    }
    
    .masseuse-grid {
        grid-template-columns: 1fr;
    }
    
    .reviews-container {
        height: 300px;
    }
    
    .review-text {
        font-size: 1rem;
    }
}
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
