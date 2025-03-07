document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split("/").pop();
    document.querySelectorAll(".nav-links a").forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.style.color = "var(--accent-color)";
        }
    })
})