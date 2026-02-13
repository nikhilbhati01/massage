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
    
    // Redirect to home page
    showSection('home');
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
    
    // Redirect to home page after profile setup
    showSection('home');
}

function skipProfile() {
    if (confirm('Are you sure you want to skip profile setup? You can complete it later.')) {
        alert('Welcome to Serenity Spa!');
        showSection('home');
    }
}

// ==================== DATA STRUCTURES ====================

const services = [
    { id: 'swedish', name: 'Swedish Massage', price: 80, duration: '60 min', icon: '💆‍♀️' },
    { id: 'deep-tissue', name: 'Deep Tissue', price: 100, duration: '60 min', icon: '💪' },
    { id: 'hot-stone', name: 'Hot Stone Massage', price: 120, duration: '90 min', icon: '🔥' },
    { id: 'aromatherapy', name: 'Aromatherapy', price: 90, duration: '60 min', icon: '🌸' },
    { id: 'sports', name: 'Sports Massage', price: 95, duration: '60 min', icon: '🏃' },
    { id: 'prenatal', name: 'Prenatal Massage', price: 85, duration: '60 min', icon: '🤰' },
    { id: 'reflexology', name: 'Reflexology', price: 70, duration: '45 min', icon: '🦶' },
    { id: 'thai', name: 'Thai Massage', price: 110, duration: '90 min', icon: '🧘' }
];

const specialOffers = [
    { id: 'swedish', serviceId: 'swedish', title: 'Swedish Special', discount: 20, icon: '✨' },
    { id: 'hot-stone', serviceId: 'hot-stone', title: 'Hot Stone Deal', discount: 25, icon: '🔥' },
    { id: 'aromatherapy', serviceId: 'aromatherapy', title: 'Aromatherapy Bliss', discount: 15, icon: '🌸' },
    { id: 'thai', serviceId: 'thai', title: 'Thai Experience', discount: 30, icon: '🧘' }
];

const therapists = [
    {
        id: 'sarah',
        name: 'Sarah Johnson',
        rating: 4.9,
        experience: '8 years',
        specialties: ['swedish', 'aromatherapy', 'prenatal'],
        bio: 'Specialized in relaxation and stress relief',
        avatar: '👩‍⚕️'
    },
    {
        id: 'michael',
        name: 'Michael Chen',
        rating: 4.8,
        experience: '10 years',
        specialties: ['deep-tissue', 'sports', 'thai'],
        bio: 'Expert in therapeutic and sports massage',
        avatar: '👨‍⚕️'
    },
    {
        id: 'emma',
        name: 'Emma Williams',
        rating: 5.0,
        experience: '6 years',
        specialties: ['hot-stone', 'aromatherapy', 'reflexology'],
        bio: 'Master of hot stone and aromatherapy techniques',
        avatar: '👩‍⚕️'
    },
    {
        id: 'david',
        name: 'David Martinez',
        rating: 4.7,
        experience: '12 years',
        specialties: ['thai', 'deep-tissue', 'sports'],
        bio: 'Certified Thai massage therapist',
        avatar: '👨‍⚕️'
    },
    {
        id: 'lisa',
        name: 'Lisa Anderson',
        rating: 4.9,
        experience: '7 years',
        specialties: ['prenatal', 'swedish', 'reflexology'],
        bio: 'Gentle touch specialist for prenatal care',
        avatar: '👩‍⚕️'
    },
    {
        id: 'james',
        name: 'James Taylor',
        rating: 4.8,
        experience: '9 years',
        specialties: ['sports', 'deep-tissue', 'thai'],
        bio: 'Athletic performance and recovery expert',
        avatar: '👨‍⚕️'
    }
];

// ==================== FILTERING STATE ====================
let currentFilter = {
    type: null, // 'service' or 'therapist'
    value: null // service id or therapist id
};

// ==================== RENDERING FUNCTIONS ====================

function renderServices() {
    const grid = document.getElementById('servicesGrid');
    if (!grid) return;
    
    grid.innerHTML = services.map(service => `
        <div class="service-card" onclick="filterByService('${service.id}')">
            <div class="service-icon">${service.icon}</div>
            <h3>${service.name}</h3>
            <p class="service-duration">${service.duration}</p>
            <p class="service-price">$${service.price}</p>
        </div>
    `).join('');
}

function renderOffers() {
    const grid = document.getElementById('offersGrid');
    if (!grid) return;
    
    grid.innerHTML = specialOffers.map(offer => {
        const service = services.find(s => s.id === offer.serviceId);
        return `
            <div class="offer-card" onclick="filterByService('${offer.serviceId}')">
                <div class="offer-icon">${offer.icon}</div>
                <h3>${offer.title}</h3>
                <p class="offer-discount">${offer.discount}% OFF</p>
                <p class="offer-service">${service ? service.name : ''}</p>
            </div>
        `;
    }).join('');
}

function renderTherapists() {
    const grid = document.getElementById('therapistsGrid');
    if (!grid) return;
    
    grid.innerHTML = therapists.map(therapist => `
        <div class="therapist-card" onclick="filterByTherapist('${therapist.id}')">
            <div class="therapist-avatar">${therapist.avatar}</div>
            <h3>${therapist.name}</h3>
            <div class="therapist-rating">
                ${'⭐'.repeat(Math.floor(therapist.rating))} ${therapist.rating}
            </div>
            <p class="therapist-experience">${therapist.experience} experience</p>
            <p class="therapist-bio">${therapist.bio}</p>
            <div class="therapist-skills">
                ${therapist.specialties.map(sid => {
                    const service = services.find(s => s.id === sid);
                    return `<span class="skill-tag">${service ? service.name : sid}</span>`;
                }).join('')}
            </div>
        </div>
    `).join('');
}

// ==================== FILTERING LOGIC ====================

function filterByService(serviceId) {
    currentFilter = { type: 'service', value: serviceId };
    const service = services.find(s => s.id === serviceId);
    const filteredTherapists = therapists.filter(t => t.specialties.includes(serviceId));
    
    const filteredSection = document.getElementById('filteredResults');
    const filteredTitle = document.getElementById('filteredTitle');
    const filteredContent = document.getElementById('filteredContent');
    
    if (filteredSection && filteredTitle && filteredContent) {
        filteredTitle.textContent = `Therapists Offering ${service ? service.name : serviceId}`;
        filteredContent.innerHTML = `
            <div class="filtered-therapists">
                ${filteredTherapists.length > 0 ? filteredTherapists.map(therapist => `
                    <div class="therapist-card">
                        <div class="therapist-avatar">${therapist.avatar}</div>
                        <h3>${therapist.name}</h3>
                        <div class="therapist-rating">
                            ${'⭐'.repeat(Math.floor(therapist.rating))} ${therapist.rating}
                        </div>
                        <p class="therapist-experience">${therapist.experience} experience</p>
                        <p class="therapist-bio">${therapist.bio}</p>
                    </div>
                `).join('') : '<p>No therapists available for this service.</p>'}
            </div>
        `;
        filteredSection.style.display = 'block';
        filteredSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function filterByTherapist(therapistId) {
    currentFilter = { type: 'therapist', value: therapistId };
    const therapist = therapists.find(t => t.id === therapistId);
    const filteredServices = services.filter(s => therapist.specialties.includes(s.id));
    
    const filteredSection = document.getElementById('filteredResults');
    const filteredTitle = document.getElementById('filteredTitle');
    const filteredContent = document.getElementById('filteredContent');
    
    if (filteredSection && filteredTitle && filteredContent) {
        filteredTitle.textContent = `Services Offered by ${therapist.name}`;
        filteredContent.innerHTML = `
            <div class="filtered-services">
                ${filteredServices.length > 0 ? filteredServices.map(service => `
                    <div class="service-card">
                        <div class="service-icon">${service.icon}</div>
                        <h3>${service.name}</h3>
                        <p class="service-duration">${service.duration}</p>
                        <p class="service-price">$${service.price}</p>
                    </div>
                `).join('') : '<p>No services available for this therapist.</p>'}
            </div>
        `;
        filteredSection.style.display = 'block';
        filteredSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function clearFilters() {
    currentFilter = { type: null, value: null };
    const filteredSection = document.getElementById('filteredResults');
    if (filteredSection) {
        filteredSection.style.display = 'none';
    }
}

// ==================== BOOKING FLOW ====================

let bookingData = {
    therapist: null,
    date: null,
    time: null,
    service: null,
    insurance: {
        used: false,
        provider: null,
        policyNumber: null,
        memberId: null,
        coverage: 0,
        remainingBalance: 0
    },
    finalPrice: null,
    userDetails: {
        address: null,
        specialRequests: null
    }
};

function renderBookingTherapists() {
    const container = document.getElementById('bookingTherapists');
    if (!container) return;
    
    container.innerHTML = therapists.map(therapist => `
        <div class="booking-therapist-card" onclick="selectTherapist('${therapist.id}', event)">
            <div class="therapist-avatar">${therapist.avatar}</div>
            <h3>${therapist.name}</h3>
            <div class="therapist-rating">
                ${'⭐'.repeat(Math.floor(therapist.rating))} ${therapist.rating}
            </div>
            <p class="therapist-experience">${therapist.experience} experience</p>
        </div>
    `).join('');
}

function selectTherapist(therapistId, evt) {
    bookingData.therapist = therapistId;
    document.querySelectorAll('.booking-therapist-card').forEach(card => {
        card.classList.remove('selected');
    });
    if (evt && evt.currentTarget) {
        evt.currentTarget.classList.add('selected');
    } else if (evt && evt.target) {
        evt.target.closest('.booking-therapist-card')?.classList.add('selected');
    }
    document.getElementById('step1Next').disabled = false;
}

function renderBookingServices() {
    const container = document.getElementById('bookingServices');
    if (!container) return;
    
    if (!bookingData.therapist) return;
    
    const therapist = therapists.find(t => t.id === bookingData.therapist);
    const availableServices = services.filter(s => therapist.specialties.includes(s.id));
    
    container.innerHTML = availableServices.map(service => `
        <div class="booking-service-card" onclick="selectService('${service.id}', event)">
            <div class="service-icon">${service.icon}</div>
            <h3>${service.name}</h3>
            <p class="service-duration">${service.duration}</p>
            <p class="service-price">$${service.price}</p>
        </div>
    `).join('');
}

function selectService(serviceId, evt) {
    bookingData.service = serviceId;
    document.querySelectorAll('.booking-service-card').forEach(card => {
        card.classList.remove('selected');
    });
    if (evt && evt.currentTarget) {
        evt.currentTarget.classList.add('selected');
    } else if (evt && evt.target) {
        evt.target.closest('.booking-service-card')?.classList.add('selected');
    }
    document.getElementById('step4Next').disabled = false;
}

function nextStep(step) {
    // Validate current step
    if (step === 2 && !bookingData.therapist) return;
    if (step === 3 && !bookingData.date) return;
    if (step === 4 && !bookingData.time) return;
    if (step === 5 && !bookingData.service) return;
    
    // Hide current step
    document.querySelectorAll('.booking-step').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    
    // Show next step
    const nextStepEl = document.getElementById(`step${step}`);
    const nextStepIndicator = document.querySelector(`.step[data-step="${step}"]`);
    if (nextStepEl) nextStepEl.classList.add('active');
    if (nextStepIndicator) nextStepIndicator.classList.add('active');
    
    // Special handling for each step
    if (step === 2) {
        // Set minimum date to today
        const dateInput = document.getElementById('bookingDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;
            dateInput.addEventListener('change', function() {
                bookingData.date = this.value;
                document.getElementById('step2Next').disabled = !this.value;
            });
        }
    }
    
    if (step === 3) {
        generateTimeSlots();
    }
    
    if (step === 4) {
        renderBookingServices();
    }
    
    if (step === 5) {
        renderBookingSummary();
    }
}

function prevStep(step) {
    document.querySelectorAll('.booking-step').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    
    const prevStepEl = document.getElementById(`step${step}`);
    const prevStepIndicator = document.querySelector(`.step[data-step="${step}"]`);
    if (prevStepEl) prevStepEl.classList.add('active');
    if (prevStepIndicator) prevStepIndicator.classList.add('active');
}

function generateTimeSlots() {
    const container = document.getElementById('timeSlots');
    if (!container) return;
    
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
        slots.push(`${hour.toString().padStart(2, '0')}:00`);
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    
    container.innerHTML = slots.map(slot => `
        <button class="time-slot" onclick="selectTime('${slot}', event)">${slot}</button>
    `).join('');
}

function selectTime(time, evt) {
    bookingData.time = time;
    document.querySelectorAll('.time-slot').forEach(btn => {
        btn.classList.remove('selected');
    });
    if (evt && evt.currentTarget) {
        evt.currentTarget.classList.add('selected');
    } else if (evt && evt.target) {
        evt.target.classList.add('selected');
    }
    document.getElementById('step3Next').disabled = false;
}

function renderBookingSummary() {
    const summary = document.getElementById('bookingSummary');
    if (!summary) return;
    
    const therapist = therapists.find(t => t.id === bookingData.therapist);
    const service = services.find(s => s.id === bookingData.service);
    
    summary.innerHTML = `
        <div class="summary-item">
            <strong>Therapist:</strong> ${therapist ? therapist.name : 'N/A'}
        </div>
        <div class="summary-item">
            <strong>Date:</strong> ${bookingData.date || 'N/A'}
        </div>
        <div class="summary-item">
            <strong>Time:</strong> ${bookingData.time || 'N/A'}
        </div>
        <div class="summary-item">
            <strong>Service:</strong> ${service ? service.name : 'N/A'}
        </div>
    `;
    
    updatePriceDisplay();
}

// ==================== INSURANCE LOGIC ====================

function toggleInsuranceForm() {
    const checkbox = document.getElementById('useInsurance');
    const form = document.getElementById('insuranceForm');
    
    if (checkbox && form) {
        bookingData.insurance.used = checkbox.checked;
        form.style.display = checkbox.checked ? 'block' : 'none';
        
        if (!checkbox.checked) {
            bookingData.insurance.coverage = 0;
            bookingData.insurance.remainingBalance = 0;
            updatePriceDisplay();
        }
    }
}

async function calculateInsurance() {
    const provider = document.getElementById('insuranceProvider')?.value;
    const policyNumber = document.getElementById('policyNumber')?.value;
    const memberId = document.getElementById('memberId')?.value;
    
    if (!provider || !policyNumber || !memberId) {
        alert('Please fill in all insurance details');
        return;
    }
    
    bookingData.insurance.provider = provider;
    bookingData.insurance.policyNumber = policyNumber;
    bookingData.insurance.memberId = memberId;
    
    // Mock backend call - in real app, this would be an API call
    const result = await mockInsuranceCheck(provider, policyNumber, memberId);
    
    bookingData.insurance.coverage = result.coverage;
    bookingData.insurance.remainingBalance = result.remainingBalance;
    
    updatePriceDisplay();
    
    // Show user details section after insurance calculation
    const userDetailsSection = document.getElementById('userDetailsSection');
    if (userDetailsSection) {
        userDetailsSection.style.display = 'block';
    }
}

async function mockInsuranceCheck(provider, policyNumber, memberId) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock insurance coverage calculation
    const service = services.find(s => s.id === bookingData.service);
    const servicePrice = service ? service.price : 0;
    
    // Mock: Insurance covers 60% of the service, user has $500 remaining balance
    const coveragePercentage = 0.6;
    const coverageAmount = Math.min(servicePrice * coveragePercentage, 500);
    const remainingBalance = 500 - coverageAmount;
    
    return {
        coverage: coverageAmount,
        remainingBalance: Math.max(0, remainingBalance)
    };
}

function updatePriceDisplay() {
    const display = document.getElementById('priceDisplay');
    if (!display) return;
    
    const service = services.find(s => s.id === bookingData.service);
    if (!service) return;
    
    const originalPrice = service.price;
    let insuranceCoverage = 0;
    let finalPrice = originalPrice;
    
    if (bookingData.insurance.used && bookingData.insurance.coverage > 0) {
        insuranceCoverage = bookingData.insurance.coverage;
        finalPrice = Math.max(0, originalPrice - insuranceCoverage);
    }
    
    bookingData.finalPrice = finalPrice;
    
    display.innerHTML = `
        <div class="price-breakdown">
            <div class="price-row">
                <span>Original Price:</span>
                <span>$${originalPrice}</span>
            </div>
            ${bookingData.insurance.used && insuranceCoverage > 0 ? `
                <div class="price-row insurance-row">
                    <span>Insurance Coverage:</span>
                    <span class="insurance-amount">-$${insuranceCoverage}</span>
                </div>
            ` : ''}
            <div class="price-row total-row">
                <span><strong>Final Price:</strong></span>
                <span><strong>$${finalPrice}</strong></span>
            </div>
        </div>
    `;
}

function confirmBooking() {
    const address = document.getElementById('userAddress')?.value;
    const specialRequests = document.getElementById('specialRequests')?.value;
    
    bookingData.userDetails.address = address;
    bookingData.userDetails.specialRequests = specialRequests;
    
    // In a real app, this would send data to backend
    console.log('Booking confirmed:', bookingData);
    
    alert(`Booking confirmed!\n\nTherapist: ${therapists.find(t => t.id === bookingData.therapist)?.name}\nDate: ${bookingData.date}\nTime: ${bookingData.time}\nService: ${services.find(s => s.id === bookingData.service)?.name}\nFinal Price: $${bookingData.finalPrice}\n\nThank you for booking with Serenity Spa!`);
    
    // Reset booking data
    bookingData = {
        therapist: null,
        date: null,
        time: null,
        service: null,
        insurance: { used: false, provider: null, policyNumber: null, memberId: null, coverage: 0, remainingBalance: 0 },
        finalPrice: null,
        userDetails: { address: null, specialRequests: null }
    };
    
    showSection('home');
}

// ==================== INITIALIZATION ====================

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Show landing page by default
    showSection('landing');
    
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Render main content sections
    renderServices();
    renderOffers();
    renderTherapists();
    renderBookingTherapists();
    
    // Set up date input minimum
    const dateInput = document.getElementById('bookingDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
    
    console.log('Wellness Website Loaded');
    console.log('Available sections: landing, onboarding, login, signup, otp, profile, home, booking');
});
