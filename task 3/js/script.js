document.addEventListener('DOMContentLoaded', () => {
    // We already handle staggered animations on load using CSS variables
    // But we can add an intersection observer for elements that are added later
    // or elements lower down the page if the user expands this website!
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // If it doesn't already have the animation class, we can add it
                // (though for the header we're doing it on load)
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // If we had elements with a generic .animate-on-scroll class
    const scrollElements = document.querySelectorAll('.animate-on-scroll');
    scrollElements.forEach(el => observer.observe(el));
});
