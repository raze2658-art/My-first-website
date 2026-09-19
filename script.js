const steps = Array.from(document.querySelectorAll('.step'));
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const btnGroup = document.getElementById('btnGroup');
const successScreen = document.getElementById('successScreen');

let currentStep = 1;

function showStep() {
    steps.forEach(step => {
        step.classList.toggle('active', parseInt(step.dataset.step) === currentStep);
    });

    // Control visibility of back button
    prevBtn.style.display = currentStep === 1 ? 'none' : 'block';
    
    // Change button text on final step
    nextBtn.innerText = currentStep === steps.length ? 'Submit' : 'Next';
}

function validateCurrentStep() {
    const currentStepFields = steps[currentStep - 1].querySelectorAll('input, select');
    let isValid = true;

    currentStepFields.forEach(field => {
        const errorText = field.parentElement.querySelector('.error-text');
        
        // Reset old errors
        field.classList.remove('error-field');
        if (errorText) errorText.style.display = 'none';

        // Check if empty
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            field.classList.add('error-field');
            if (errorText) errorText.style.display = 'block';
        }
    });

    return isValid;
}

nextBtn.addEventListener('click', () => {
    if (validateCurrentStep()) {
        if (currentStep < steps.length) {
            currentStep++;
            showStep();
        } else {
            // Hide everything else and show success screen
            steps.forEach(step => step.style.display = 'none');
            btnGroup.style.display = 'none';
            successScreen.style.display = 'block';
        }
    }
});

prevBtn.addEventListener('click', () => {
    if (currentStep > 1) {
        currentStep--;
        showStep();
    }
});
