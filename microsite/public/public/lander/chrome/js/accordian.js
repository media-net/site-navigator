document.querySelectorAll(".accordion-header").forEach((header) => {
    header.addEventListener("click", () => {
        const parent = header.parentElement;
        const content = header.nextElementSibling;
        
        // Toggle the current accordion
        parent.classList.toggle("active");
        
        if (parent.classList.contains("active")) {
            content.style.maxHeight = content.scrollHeight + "px";
        } else {
            content.style.maxHeight = null;
        }
        
        // Close any other open accordion
        document.querySelectorAll(".accordion-item.active").forEach((item) => {
            if (item !== parent) {
                item.classList.remove("active");
                item.querySelector(".accordion-content").style.maxHeight = null;
            }
        });
    });
});