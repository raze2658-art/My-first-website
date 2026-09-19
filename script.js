const form = document.getElementById('loanForm');
const steps = Array.from(document.querySelectorAll('.form-step'));
const indicators = Array.from(document.querySelectorAll('.step-indicator'));
const progressBar = document.getElementById('progressBar');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const btnContainer = document.getElementById('btnContainer');
const successScreen = document.getElementById('successScreen');

let currentStep = 1;

// RegEx Patterns
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+\$/;
const phoneRegex = /^[0-9+()-\s]{7,15}\$/;

// Dynamic Payment Preview Elements
const loanAmountInput = document.getElementById('loanAmount');
const loanTermSelect = document.getElementById('loanTerm');
const calcPreview = document.getElementById('calcPreview');
const monthlyEst = document.getElementById('monthlyEst');

function updateFormProgress() {
    // Adjust Steps Display
    steps.forEach(step => {
        step.classList.toggle('active', parseInt(step.dataset.step) === currentStep);
    });

    // Adjust Indicators
    indicators.forEach((ind, index) => {
        if (index + 1 < currentStep) {
            ind.className = 'step-indicator completed';
            ind.innerText = '✓';
        } else if (index + 1 === currentStep) {
            ind.className = 'step-indicator active';
            ind.innerText = index + 1;
        } else {
            ind.className = 'step-indicator';
            ind.innerText = index + 1;
        }
    });

    // Move Progress Line
    const progressPercent = ((currentStep - 1) / (indicators.length - 1)) * 100;
    progressBar.style.width = progressPercent + '%';

    // Toggle Navigation Buttons
    prevBtn.style.display = currentStep === 1 ? 'none' : 'block';
    nextBtn.innerText = currentStep === steps.length ? 'Submit Application' : 'Next';
}

function validateField(input) {
    let isValid = true;
    const errorDiv = input.parentElement.querySelector('.error-message');

    // Reset Styles
    input.classList.remove('invalid');
    if (errorDiv) errorDiv.style.display = 'none';

    // Required Check
    if (input.hasAttribute('required') && !input.value.trim()) {
        isValid = false;
    }

    // Email Match
    if (isValid && input.type === 'email' && !emailRegex.test(input.value)) {
        isValid = false;
    }

    // Phone Match
    if (isValid && input.type === 'tel' && !phoneRegex.test(input.value)) {
        isValid = false;
    }

    // Min/Max bounds check
    if (isValid && input.type === 'number') {
        const val = parseFloat(input.value);
        const min = parseFloat(input.getAttribute('min'));
        const max = parseFloat(input.getAttribute('max'));
        if (!isNaN(min) && val < min) isValid = false;
        if (!isNaN(max) && val > max) isValid = false;
    }

    // Validation Response UI
    if (!isValid) {
        input.classList.add('invalid');
        if (errorDiv) errorDiv.style.display = 'block';
    }

    return isValid;
}

function validateCurrentStep() {
    const currentStepContainer = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    const inputs = currentStepContainer.querySelectorAll('input, select');
    let stepValid = true;

    inputs.forEach(input => {
        const fieldValid = validateField(input);
        if (!fieldValid) stepValid = false;
    });

    return stepValid;
}

// Dynamic Monthly Payment Calculator (Assume 5.5% Fixed APR)
function calculatePayments() {
    const amount = parseFloat(loanAmountInput.value);
    const months = parseInt(loanTermSelect.value);

    if (!isNaN(amount) && amount >= 1000 && amount <= 100000 && !isNaN(months)) {
        const monthlyRate = 0.055 / 12;
        const payment = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
        monthlyEst.innerText = `$${payment.toFixed(2)}`;
        calcPreview.style.display = 'block';
    } else {
        calcPreview.style.display = 'none';
    }
}

// Event Listeners
nextBtn.addEventListener('click', () => {
    if (validateCurrentStep()) {
        if (currentStep < steps.length) {
            currentStep++;
            updateFormProgress();
        } else {
            // Final submission mock action
            steps.forEach(step => step.style.display = 'none');
            indicators.forEach(ind => ind.className = 'step-indicator completed');
            progressBar.style.width = '100%';
            btnContainer.style.display = 'none';
            successScreen.style.display = 'block';
        }
    }
});

prevBtn.addEventListener('click', () => {
    if (currentStep > 1) {
        currentStep--;
        updateFormProgress();
    }
});

// Real-time live validation cleanup & calculations
form.addEventListener('input', (e) => {
    if (e.target.classList.contains('invalid')) {
        validateField(e.target);
    }
    if (e.target === loanAmountInput || e.target === loanTermSelect) {
        calculatePayments();
    }
});

form.addEventListener('change', (e) => {
    if (e.target.tagName === 'SELECT') {
        validateField(e.target);
        if (e.target === loanTermSelect) calculatePayments();
    }
});
