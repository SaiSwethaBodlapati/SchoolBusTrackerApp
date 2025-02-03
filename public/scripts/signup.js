document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registerForm');
    const errorSpan = document.getElementById('error');

    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        const form = new FormData(event.target);
        let formData = {};
        form.forEach((value, key) => {
            formData[key] = value;
        });

        // Password validation
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$#!%*?&]{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            displayError(
                'Password must be at least 8 characters long, contain at least 1 letter, 1 number, and 1 special character.'
            );
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            displayError('Passwords do not match. Please try again.');
            return;
        }
    });

    function displayError(msg){
        errorSpan.style.display = "block";
        errorSpan.innerHTML = msg;
        setTimeout(function() {
            errorSpan.style.display = "none";
        }, 5000);
    }

});
