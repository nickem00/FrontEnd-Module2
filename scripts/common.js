// This file is for code that affects all pages, such as
// animations and marking the current page as active.

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const header = document.querySelector("header div");
    const hero = document.querySelector(".hero");
    const contactForm = document.querySelector(".contact-form-container")
    const informationSection = document.getElementById("information-section")
    const footer = document.querySelector("footer")

    // Apply animations. Timeout is used to ensure the animations
    // are applied after the page has loaded.
    if (header) {
        setTimeout(() => {
            header.classList.add("header-loaded")
        }, 50)
    }

    if (hero) {
        setTimeout(() => {
            hero.classList.add("fade-fall")
        }, 50)
    }

    if (contactForm) {
        setTimeout(() => {
            contactForm.classList.add("fade-fall")
        }, 50)
    }

    if (informationSection) {
        setTimeout(() => {
            informationSection.classList.add("fade-fall")
        }, 50)
    }

    if (footer) {
        setTimeout(() => {
            footer.classList.add("fade-rise")
        }, 50)
    }
    
    
    // Marking the current page as active in the navigation
    const currentPage = window.location.pathname.split("/").pop();
    document.querySelectorAll(".nav-links a").forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.style.color = "var(--accent-color)";
        }
    })
})