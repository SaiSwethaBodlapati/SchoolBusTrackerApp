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
    // For the second registration form
    const form2 = document.getElementById('registerForm2');
    if (form2) {
        form2.addEventListener('submit', async function (event) {
            event.preventDefault();

            // Retrieve tempId from localStorage
            const tempId = localStorage.getItem('registrationTempId');

            if (!tempId) {
                alert('Session expired. Please restart the registration process.');
                window.location.href = 'signup1.html';
                return;
            }

            const formData = {
                tempId: tempId,
                fatherName: document.getElementById('fatherName').value,
                fatherPhone: document.getElementById('fatherPhone').value,
                motherName: document.getElementById('motherName').value,
                motherPhone: document.getElementById('motherPhone').value,
                username: document.getElementById('username').value,
                password: document.getElementById('password').value,
                confirmPassword: document.getElementById('confirmPassword').value,
            };

            if (formData.password !== formData.confirmPassword) {
                alert('Passwords do not match. Please try again.');
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/api/register/step2', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Registration successful!');
                    localStorage.removeItem('registrationTempId');
                    window.location.href = 'login.html';
                } else {
                    if (data.error === 'Registration session expired or invalid') {
                        alert('Your session has expired. Please restart the registration process.');
                        localStorage.removeItem('registrationTempId');
                        window.location.href = 'signup1.html';
                    } else {
                        alert(data.error || 'Step 2 registration failed. Please try again.');
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while submitting Step 2. Please try again.');
            }
        });
    }

    // For the login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const formData = {
                username: document.getElementById('username').value,
                password: document.getElementById('password').value,
            };

            try {
                const response = await fetch('http://localhost:3000/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Login successful!');
                    // Redirect to dashboard or home page
                    window.location.href = 'dashboard.html';
                } else {
                    alert(data.error || 'Login failed. Please check your credentials and try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while logging in. Please try again.');
            }
        });
    }

});
