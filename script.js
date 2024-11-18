// function handleFormSubmit(event) {
//     event.preventDefault();

//     // Fetch form data and perform validation
//     const firstName = document.getElementById("firstName").value.trim();
//     const lastName = document.getElementById("lastName").value.trim();
//     const studentId = document.getElementById("studentId").value.trim();
//     const zipCode = document.getElementById("zipCode").value.trim();

//     // Simple validation
//     if (firstName === "" || lastName === "" || studentId === "" || zipCode === "") {
//         alert("Please fill in all required fields.");
//         return false;
//     }

//     // Further validations can be added here, like numeric checks or length restrictions

//     // If everything is valid, proceed with form submission actions
//     alert("Form submitted successfully!");

//     // Show the login link
//     const loginLinkDiv = document.getElementById("loginLink");

//     // Clear any existing login link
//     loginLinkDiv.innerHTML = "";

//     // Create and display the login link
//     const loginLink = document.createElement("a");
//     loginLink.href = "login.html";
//     loginLink.textContent = "Proceed to Login";
//     loginLink.classList.add("login-link");

//     loginLinkDiv.appendChild(loginLink);

//     return true;
// }


// Function to handle the Signup Form submission
function handleSignupFormSubmit(event) {
    event.preventDefault();

    // Fetch form data and perform validation
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const zipCode = document.getElementById("zipCode").value.trim();

    // Simple validation
    if (firstName === "" || lastName === "" || email === "" || password === "" || zipCode === "") {
        alert("Please fill in all required fields.");
        return;
    }

    // Further validations (e.g., email format, password strength) can be added here

    // Call the backend API to register the user
    fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    })
        .then((response) => {
            if (response.ok) return response.text();
            return response.text().then((err) => {
                throw new Error(err);
            });
        })
        .then((result) => {
            alert(result); // Alert success message
            // Redirect to login page after successful signup
            window.location.href = "login.html";
        })
        .catch((error) => {
            alert(error.message); // Display error message
        });
}

// Function to handle the Login Form submission
async function handleLoginFormSubmit(event) {
    event.preventDefault();

    // Fetch form data
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Simple validation
    if (email === "" || password === "") {
        alert("Please fill in all required fields.");
        return;
    }

    // Call the backend API to log in the user
    try {
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }

        const result = await response.json();
        alert("Login successful!");
        console.log("Token:", result.token); // Optionally store token in localStorage or sessionStorage

        // Redirect to the dashboard or another page after login
        window.location.href = "dashboard.html";
    } catch (error) {
        alert(error.message); // Display error message
    }
}

// Attach event listeners to forms
document.getElementById("signupForm")?.addEventListener("submit", handleSignupFormSubmit);
document.getElementById("loginForm")?.addEventListener("submit", handleLoginFormSubmit);
