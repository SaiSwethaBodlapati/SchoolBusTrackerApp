document.addEventListener('DOMContentLoaded', function () {
    // Get the single registration form
    const form = document.getElementById('registerForm');
    if (form) {
        form.addEventListener('submit', async function (event) {
            event.preventDefault();

            // Convert all input values to strings explicitly
            const formData = {
                firstName: String(document.getElementById('firstName').value),
                lastName: String(document.getElementById('lastName').value),
                class: String(document.getElementById('class').value),
                busStop: String(document.getElementById('busStop').value),
                studentId: String(document.getElementById('studentId').value),
                busPassId: String(document.getElementById('busPassId').value),
                addressLine1: String(document.getElementById('addressLine1').value),
                addressLine2: String(document.getElementById('addressLine2').value),
                city: String(document.getElementById('city').value),
                zipCode: String(document.getElementById('zipCode').value),
                fatherName: String(document.getElementById('fatherName').value),
                fatherPhone: String(document.getElementById('fatherPhone').value),
                motherName: String(document.getElementById('motherName').value),
                motherPhone: String(document.getElementById('motherPhone').value),
                username: String(document.getElementById('username').value),
                password: String(document.getElementById('password').value),
                confirmPassword: String(document.getElementById('confirmPassword').value),
            };

            // Password validation
            if (formData.password !== formData.confirmPassword) {
                alert('Passwords do not match. Please try again.');
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Registration completed successfully!');
                    window.location.href = 'login.html'; // Redirect to login page
                } else {
                    console.error('Server responded with error:', data);
                    alert(data.error || 'Registration failed. Please try again.');
                }
            } catch (error) {
                console.error('Network error or other issue:', error);
                alert('An error occurred during registration. Please check the console for details.');
            }
        });
    }

    // For the login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            // Convert all input values to strings explicitly
            const formData = {
                username: String(document.getElementById('username').value),
                password: String(document.getElementById('password').value),
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
                    window.location.href = 'dashboard.html'; // Redirect to dashboard
                } else {
                    alert(data.error || 'Login failed. Please check your credentials and try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred during login. Please try again.');
            }
        });
    }
});
