// Section Navigation
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        window.scrollTo(0, 0);
        
        // Initialize section-specific features
        if (sectionId === 'guest-home') {
            initializeHomePage();
        } else if (sectionId === 'booking') {
            initializeBooking();
        }
    }
}

// Home Page Initialization
function initializeHomePage() {
    initializeReviews();
    // Discount scroll is handled by CSS animation
}

// Reviews Auto-Scroll (Smooth Infinite Loop)
let currentReview = 0;
let reviewInterval;
const reviews = document.querySelectorAll('.review-card');
const totalReviews = reviews.length;

function initializeReviews() {
    if (reviews.length === 0) return;
    
    // Reset to first review
    goToReview(0);
    
    // Clear any existing interval
    if (reviewInterval) {
        clearInterval(reviewInterval);
    }
    
    // Start auto-advance
    reviewInterval = setInterval(() => {
        if (document.getElementById('guest-home').classList.contains('active')) {
            currentReview = (currentReview + 1) % totalReviews;
            goToReview(currentReview);
        }
    }, 5000);
}

function goToReview(index) {
    reviews.forEach((review, i) => {
        review.classList.remove('active', 'prev');
        if (i === index) {
            review.classList.add('active');
        } else if (i === (index - 1 + totalReviews) % totalReviews) {
            review.classList.add('prev');
        }
    });
    currentReview = index;
}

// Booking System
let bookingData = {
    therapist: null,
    service: null,
    date: null,
    time: null
};

let currentStep = 1;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// Therapist Data with Services and Availability
const therapistData = {
    sarah: {
        name: 'Sarah Johnson',
        services: [
            { id: 'swedish', name: 'Swedish Massage', duration: 60, price: 100 },
            { id: 'aromatherapy', name: 'Aromatherapy', duration: 60, price: 130 }
        ],
        availableDays: [1, 2, 3, 4, 5], // Monday to Friday
        availableTimes: ['09:00', '11:00', '14:00', '16:00', '18:00']
    },
    michael: {
        name: 'Michael Chen',
        services: [
            { id: 'deep-tissue', name: 'Deep Tissue', duration: 90, price: 120 },
            { id: 'sports', name: 'Sports Massage', duration: 60, price: 112 }
        ],
        availableDays: [1, 2, 3, 4, 5, 6], // Monday to Saturday
        availableTimes: ['10:00', '12:00', '15:00', '17:00', '19:00']
    },
    emma: {
        name: 'Emma Rodriguez',
        services: [
            { id: 'hot-stone', name: 'Hot Stone', duration: 75, price: 125 },
            { id: 'thai', name: 'Thai Massage', duration: 90, price: 140 }
        ],
        availableDays: [0, 1, 2, 3, 4, 5, 6], // All days
        availableTimes: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00']
    },
    david: {
        name: 'David Kim',
        services: [
            { id: 'swedish', name: 'Swedish Massage', duration: 60, price: 100 },
            { id: 'relaxation', name: 'Relaxation Therapy', duration: 60, price: 110 }
        ],
        availableDays: [1, 2, 3, 4, 5], // Monday to Friday
        availableTimes: ['10:00', '12:00', '14:00', '16:00', '18:00']
    },
    lisa: {
        name: 'Lisa Anderson',
        services: [
            { id: 'aromatherapy', name: 'Aromatherapy', duration: 60, price: 130 },
            { id: 'prenatal', name: 'Prenatal Massage', duration: 75, price: 135 }
        ],
        availableDays: [1, 2, 3, 4, 5], // Monday to Friday
        availableTimes: ['09:00', '11:00', '14:00', '16:00']
    },
    james: {
        name: 'James Wilson',
        services: [
            { id: 'sports', name: 'Sports Massage', duration: 60, price: 112 },
            { id: 'deep-tissue', name: 'Deep Tissue', duration: 90, price: 120 }
        ],
        availableDays: [1, 2, 3, 4, 5, 6], // Monday to Saturday
        availableTimes: ['10:00', '12:00', '15:00', '17:00', '19:00']
    }
};

function initializeBooking() {
    currentStep = 1;
    bookingData = { therapist: null, service: null, date: null, time: null };
    updateBookingSteps();
    showBookingStep(1);
}

function selectTherapist(therapistId) {
    bookingData.therapist = therapistId;
    
    // Update UI
    document.querySelectorAll('.therapist-select-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    
    // Show services for this therapist
    showServicesForTherapist(therapistId);
    
    // Move to next step
    setTimeout(() => {
        nextStep();
    }, 300);
}

function showServicesForTherapist(therapistId) {
    const therapist = therapistData[therapistId];
    const serviceGrid = document.getElementById('serviceSelectionGrid');
    
    if (!therapist || !serviceGrid) return;
    
    serviceGrid.innerHTML = therapist.services.map(service => `
        <div class="service-select-card" onclick="selectService('${service.id}', '${therapistId}')">
            <h4>${service.name}</h4>
            <p>Professional ${service.name.toLowerCase()} therapy</p>
            <div class="service-select-info">
                <span class="service-select-duration">${service.duration} min</span>
                <span class="service-select-price">$${service.price}</span>
            </div>
        </div>
    `).join('');
}

function selectService(serviceId, therapistId) {
    const therapist = therapistData[therapistId];
    const service = therapist.services.find(s => s.id === serviceId);
    
    bookingData.service = serviceId;
    bookingData.serviceData = service;
    
    // Update UI
    document.querySelectorAll('.service-select-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    
    // Move to next step
    setTimeout(() => {
        nextStep();
    }, 300);
}

function showBookingStep(step) {
    document.querySelectorAll('.booking-step-content').forEach(content => {
        content.classList.remove('active');
    });
    
    const stepContent = document.getElementById(`step${step}`);
    if (stepContent) {
        stepContent.classList.add('active');
    }
    
    // Show/hide navigation buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (step === 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
    } else if (step === 4) {
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'none';
        updateBookingSummary();
    } else {
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'block';
    }
    
    // Initialize step-specific content
    if (step === 3) {
        generateCalendar();
        updateTimeSlots();
    }
}

function updateBookingSteps() {
    document.querySelectorAll('.step').forEach((step, index) => {
        const stepNum = index + 1;
        if (stepNum < currentStep) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (stepNum === currentStep) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
}

function nextStep() {
    if (currentStep < 4) {
        currentStep++;
        updateBookingSteps();
        showBookingStep(currentStep);
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        updateBookingSteps();
        showBookingStep(currentStep);
    }
}

// Calendar Functions
function generateCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    
    document.getElementById('calendarMonth').textContent = 
        `${monthNames[currentMonth]} ${currentYear}`;
    
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date();
    const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;
    
    let html = '<div class="calendar-day-header">Sun</div>';
    html += '<div class="calendar-day-header">Mon</div>';
    html += '<div class="calendar-day-header">Tue</div>';
    html += '<div class="calendar-day-header">Wed</div>';
    html += '<div class="calendar-day-header">Thu</div>';
    html += '<div class="calendar-day-header">Fri</div>';
    html += '<div class="calendar-day-header">Sat</div>';
    
    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        html += '<div class="calendar-day"></div>';
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        const dayOfWeek = date.getDay();
        const isPast = date < today && !(isCurrentMonth && day === today.getDate());
        const isAvailable = bookingData.therapist && 
            therapistData[bookingData.therapist].availableDays.includes(dayOfWeek);
        
        let classes = 'calendar-day';
        if (isPast) {
            classes += ' disabled';
        } else if (isCurrentMonth && day === today.getDate()) {
            classes += ' today';
        }
        if (bookingData.date && bookingData.date === `${currentYear}-${currentMonth}-${day}`) {
            classes += ' selected';
        }
        
        html += `<div class="${classes}" onclick="selectDate(${day}, ${currentMonth}, ${currentYear})" 
            ${isPast || !isAvailable ? 'style="opacity: 0.3; cursor: not-allowed;"' : ''}>
            ${day}
        </div>`;
    }
    
    calendarGrid.innerHTML = html;
}

function changeMonth(direction) {
    currentMonth += direction;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    generateCalendar();
    updateTimeSlots();
}

function selectDate(day, month, year) {
    const date = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) return;
    
    if (!bookingData.therapist) return;
    
    const therapist = therapistData[bookingData.therapist];
    const dayOfWeek = date.getDay();
    
    if (!therapist.availableDays.includes(dayOfWeek)) return;
    
    bookingData.date = `${year}-${month}-${day}`;
    bookingData.dateObj = date;
    
    generateCalendar();
    updateTimeSlots();
}

function updateTimeSlots() {
    const timeSlotsGrid = document.getElementById('timeSlotsGrid');
    if (!timeSlotsGrid) return;
    
    if (!bookingData.therapist || !bookingData.date) {
        timeSlotsGrid.innerHTML = '<p style="text-align: center; color: var(--color-text-light);">Please select a date first</p>';
        return;
    }
    
    const therapist = therapistData[bookingData.therapist];
    const selectedDate = bookingData.dateObj || new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isToday = selectedDate.getTime() === today.getTime();
    const currentHour = new Date().getHours();
    
    const availableTimes = therapist.availableTimes.filter(time => {
        if (isToday) {
            const timeHour = parseInt(time.split(':')[0]);
            return timeHour > currentHour;
        }
        return true;
    });
    
    if (availableTimes.length === 0) {
        timeSlotsGrid.innerHTML = '<p style="text-align: center; color: var(--color-text-light);">No available times for this date</p>';
        return;
    }
    
    timeSlotsGrid.innerHTML = availableTimes.map(time => {
        const isSelected = bookingData.time === time;
        return `<div class="time-slot ${isSelected ? 'selected' : ''}" 
            onclick="selectTime('${time}')">${time}</div>`;
    }).join('');
}

function selectTime(time) {
    bookingData.time = time;
    updateTimeSlots();
    
    // Auto-advance to confirmation after a short delay
    setTimeout(() => {
        if (bookingData.date && bookingData.time) {
            nextStep();
        }
    }, 500);
}

function updateBookingSummary() {
    const summary = document.getElementById('bookingSummary');
    if (!summary) return;
    
    const therapist = therapistData[bookingData.therapist];
    const service = bookingData.serviceData;
    const date = bookingData.dateObj || new Date();
    const dateStr = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    summary.innerHTML = `
        <h4>Booking Summary</h4>
        <div class="summary-item">
            <span class="summary-label">Therapist:</span>
            <span class="summary-value">${therapist.name}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Service:</span>
            <span class="summary-value">${service.name}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Duration:</span>
            <span class="summary-value">${service.duration} minutes</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Date:</span>
            <span class="summary-value">${dateStr}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Time:</span>
            <span class="summary-value">${bookingData.time}</span>
        </div>
        <div class="summary-item summary-total">
            <span class="summary-label">Total:</span>
            <span class="summary-value">$${service.price}</span>
        </div>
    `;
}

function confirmBooking() {
    const name = document.getElementById('bookingName').value;
    const email = document.getElementById('bookingEmail').value;
    const phone = document.getElementById('bookingPhone').value;
    const address = document.getElementById('bookingAddress').value;
    
    if (!name || !email || !phone || !address) {
        alert('Please fill in all fields');
        return;
    }
    
    const bookingInfo = {
        ...bookingData,
        customer: { name, email, phone, address }
    };
    
    console.log('Booking confirmed:', bookingInfo);
    
    alert(`Booking confirmed!\n\n${therapistData[bookingData.therapist].name} will arrive at ${bookingData.time} on ${bookingData.dateObj.toLocaleDateString()}.\n\nA confirmation email has been sent to ${email}.\n\nThank you for choosing Serenity Spa!`);
    
    // Reset and go back to home
    showSection('guest-home');
}

// Login/Signup Functions
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    console.log('Login attempt:', { email });
    alert('Login successful! (This is a demo)');
    showSection('guest-home');
}

function handleSignup(event) {
    event.preventDefault();
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const acceptTerms = document.getElementById('acceptTerms').checked;
    
    if (!acceptTerms) {
        alert('Please accept the Terms & Conditions');
        return;
    }
    
    const target = selectedSignupMethod === 'email' ? email : phone;
    sessionStorage.setItem('signupTarget', target);
    sessionStorage.setItem('signupMethod', selectedSignupMethod);
    
    showSection('otp');
    initializeOTP();
}

let selectedSignupMethod = 'email';

function selectSignupMethod(method) {
    selectedSignupMethod = method;
    
    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
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

// OTP Functions
let otpTimer;
let otpTimeLeft = 30;

function initializeOTP() {
    const target = sessionStorage.getItem('signupTarget');
    document.getElementById('otpTarget').textContent = target || 'your device';
    
    const otpInputs = document.querySelectorAll('.otp-input');
    otpInputs.forEach(input => {
        input.value = '';
        input.addEventListener('input', handleOTPInput);
        input.addEventListener('keydown', handleOTPKeydown);
    });
    
    otpInputs[0].focus();
    
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
    otpTimeLeft = 30;
    document.getElementById('timer').textContent = otpTimeLeft;
    document.getElementById('resendBtn').disabled = true;
    
    document.querySelectorAll('.otp-input').forEach(input => {
        input.value = '';
    });
    document.querySelectorAll('.otp-input')[0].focus();
    
    clearInterval(otpTimer);
    otpTimer = setInterval(updateOTPTimer, 1000);
    
    alert('OTP resent!');
}

function handleOTP(event) {
    event.preventDefault();
    
    const otpInputs = document.querySelectorAll('.otp-input');
    let otpValue = '';
    otpInputs.forEach(input => {
        otpValue += input.value;
    });
    
    if (otpValue.length !== 6) {
        alert('Please enter the complete 6-digit OTP code');
        return;
    }
    
    alert('OTP verified successfully!');
    showSection('profile');
    
    const target = sessionStorage.getItem('signupTarget');
    const method = sessionStorage.getItem('signupMethod');
    
    if (method === 'email') {
        document.getElementById('profileEmail').value = target;
    } else {
        document.getElementById('profilePhone').value = target;
    }
}

function handleProfile(event) {
    event.preventDefault();
    
    const name = document.getElementById('profileName').value;
    const age = document.getElementById('profileAge').value;
    const email = document.getElementById('profileEmail').value;
    const phone = document.getElementById('profilePhone').value;
    const address = document.getElementById('profileAddress').value;
    
    console.log('Profile data:', { name, age, email, phone, address });
    alert('Profile setup complete! Welcome to Serenity Spa!');
    showSection('guest-home');
}

function skipProfile() {
    if (confirm('Are you sure you want to skip profile setup? You can complete it later.')) {
        alert('Welcome to Serenity Spa!');
        showSection('guest-home');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    showSection('guest-home');
    document.documentElement.style.scrollBehavior = 'smooth';
    console.log('Serenity Spa Website Loaded');
});
