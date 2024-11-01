document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    let currentIndex = 0;

    function updateSlider() {
        slides.forEach((slide, index) => {
            let offset = index - currentIndex;
            if (offset < 0) offset += slides.length;
            if (offset > slides.length / 2) offset -= slides.length;
            
            slide.style.transform = `translateX(${offset * 100}%) translateZ(${Math.abs(offset) * -100}px) rotateY(${offset * -45}deg)`;
            slide.classList.toggle('active', index === currentIndex);
        });
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlider();
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlider();
    }

    prevButton.addEventListener('click', showPrev);
    nextButton.addEventListener('click', showNext);

    // Initialize
    updateSlider();
// Change slide every 5 seconds
});