function validateForm() {
    // Fetch form data
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
    
    // If everything is valid
    alert("Form submitted successfully!");
    return true;
}