document.addEventListener('DOMContentLoaded', function () {
    // For the first registration form
    const form1 = document.getElementById('registerForm');
    if (form1) {
        form1.addEventListener('submit', async function (event) {
            event.preventDefault();

            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                class: document.getElementById('class').value,
                busStop: document.getElementById('busStop').value,
                studentId: document.getElementById('studentId').value,
                busPassId: document.getElementById('busPassId').value,
                addressLine1: document.getElementById('addressLine1').value,
                addressLine2: document.getElementById('addressLine2').value,
                city: document.getElementById('city').value,
                zipCode: document.getElementById('zipCode').value,
            };

            try {
                const response = await fetch('http://localhost:3000/api/register/step1', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                const data = await response.json();

                if (response.ok) {
                    // Store tempId for step 2
                    localStorage.setItem('registrationTempId', data.tempId);
                    window.location.href = 'signup2.html';
                } else {
                    alert(data.error || 'Step 1 registration failed. Please try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while submitting Step 1. Please try again.');
            }
        });
    }

});
