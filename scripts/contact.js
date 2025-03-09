/**
 * Contact Page Form Validation
 */

document.addEventListener("DOMContentLoaded", function() {
    // Resetting after reload
    document.getElementById("contact-form").reset();
    document.getElementById("submit-btn").disabled = true;

    const form = document.getElementById("contact-form");

    // Inputs
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const checkbox = document.getElementById("confirm");
    const messageInput = document.getElementById("message-box");
    const sbmtBtn = document.getElementById("submit-btn");

    // Error messages
    const nameError = document.querySelector("#name-error p");
    const emailError = document.querySelector("#email-error p");
    const confirmError = document.querySelector("#confirm-error p");

    // Regex for validation. Regex is a pattern matching language used for strings.
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/ // Special characters - !@#$%^&*()_+-=[]{};':"\\|,.<>/?
    const hasNumber = /\d/; // Numbers
    const isEmail = /^$|^\S+@\S+\.\S+$/; // Email - [string]@[string].[string]

    let nameValid = false;
    let emailValid = false;
    let confirmValid = false;

    // --- Event Listeners ---
    // Validating the name input
    nameInput.addEventListener("input", function() {
        let currentValue = nameInput.value.trim();
        nameValid = !(hasNumber.test(currentValue) || hasSymbol.test(currentValue));

        if (!nameValid) {
            displayError("name");
        } else {
            removeError("name");
        }

        if (checkbox.checked) {
            checkbox.dispatchEvent(new Event("change"));
        }
    })

    // Validating the email input
    // Ensuring the email follows "[string]@[string].[string]"
    emailInput.addEventListener("input", function() {
        let currentValue = emailInput.value.trim();
        emailValid = (isEmail.test(currentValue));

        if (!emailValid) {
            displayError("email");
        } else {
            removeError("email");
        }

        if (checkbox.checked) {
            checkbox.dispatchEvent(new Event("change"));
        }
    })

    // Validating the confirm checkbox
    // Ensuring the name and email fields are not empty,
    // and that they are valid.
    checkbox.addEventListener("change", function() {
        if (!checkbox.checked) {
            removeError("confirm");
            confirmValid = false;
            checkFormValidity();
            return;
        }
        
        removeError("confirm-empty"); 
        removeError("confirm-name");
        removeError("confirm-email");

        let nameValue = nameInput.value.trim();
        let emailValue = emailInput.value.trim();
        
        if (!isNotEmpty(nameValue) || !isNotEmpty(emailValue)) {
            displayError("confirm-empty");
            confirmValid = false;
        } else if (!nameValid) {
            displayError("confirm-name")
            confirmValid = false;
        } else if (!emailValid) {
            displayError("confirm-email");
            confirmValid = false;
        } else {
            removeError("confirm");
            confirmValid = true;
        }

        checkFormValidity();
    })


    // Submit
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        console.log("The mail has been sent!")

        alert("Your message has been sent!")
        form.reset();
    })
    
    // === Functions ===
    
    /**
     * Displays an error message for the specified field
     * @param {string} field - What field the error is for.
     */
    function displayError(field) {
        switch (field) {
            case "name":
                nameError.innerText = "Must only contain letters!";
                break;
            case "email":
                emailError.innerText = "Invalid email address!";
                break;
            case "confirm-empty":
                confirmError.innerText = "You must enter both name and Email!"
                break;
            case "confirm-name":
                confirmError.innerText = "Please check your entered name."
                break;
            case "confirm-email":
                confirmError.innerText = "Please check your entered email."
                break;
            
            default:
                break;
        }
    }

    /**
     * Removes the error message for the specified field
     * @param {string} field - What field to be removed.
     */
    function removeError(field) {
        switch (field) {
            case "name":
                nameError.innerText = "";
                break;
            case "email":
                emailError.innerText = "";
                break;
            case "confirm":
                confirmError.innerText = "";
                break;
            default:
                break;
        }
    }

    /**
     * Checks if all fields are valid and enables the submit button
     */
    function checkFormValidity() {
        if (nameValid && emailValid && confirmValid) {
            removeError("confirm");
            removeError("name");
            removeError("email");
            sbmtBtn.disabled = false;
        } else {
            sbmtBtn.disabled = true;
        }
    }

    /**
     * Checks if a string is empty
     * @param {string} string - The string to be checked
     * @returns {boolean} - True if the string is not empty, false otherwise
     */
    function isNotEmpty(string) {
        if (string) {
            return true;
        } else {
            return false;
        }
    }
})
