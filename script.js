function handleFormSubmit(event) {
    event.preventDefault();

    // Fetch form data and perform validation
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const studentId = document.getElementById("studentId").value.trim();
    const zipCode = document.getElementById("zipCode").value.trim();

    // Simple validation
    if (firstName === "" || lastName === "" || studentId === "" || zipCode === "") {
        alert("Please fill in all required fields.");
        return false;
    }

    // Further validations can be added here, like numeric checks or length restrictions

    // If everything is valid, proceed with form submission actions
    alert("Form submitted successfully!");

    // Show the login link
    const loginLinkDiv = document.getElementById("loginLink");

    // Clear any existing login link
    loginLinkDiv.innerHTML = "";

    // Create and display the login link
    const loginLink = document.createElement("a");
    loginLink.href = "login.html";
    loginLink.textContent = "Proceed to Login";
    loginLink.classList.add("login-link");

    loginLinkDiv.appendChild(loginLink);

    return true;
}
