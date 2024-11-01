document.addEventListener("DOMContentLoaded", function() {
  "use strict";

  let buttonRight = document.getElementById('slideRight');
  let buttonLeft = document.getElementById('slideLeft');

  const slider = document.querySelector('.slider');
  const cards = document.querySelectorAll('.card_vertical');
  const prevButton = document.querySelector('.prev');
  const nextButton = document.querySelector('.next');
  let currentIndex = 0;


  function updateSlider() {
    cards.forEach((card, index) => {
        let offset = index - currentIndex;
        if (offset < 0) offset += cards.length;
        if (offset > cards.length / 2) offset -= cards.length;
        
        card.style.transform = `translateX(${offset * 260}px) translateZ(${Math.abs(offset) * -50}px) rotateY(${offset * -30}deg) translateY(-50%)`;
        card.classList.toggle('active', index === currentIndex);
    });
}

function showNext() {
    currentIndex = (currentIndex + 1) % cards.length;
    updateSlider();
}

function showPrev() {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    updateSlider();
}

prevButton.addEventListener('click', showPrev);
nextButton.addEventListener('click', showNext);

// Initialize
updateSlider();

  buttonRight.onclick = function () {
    document.getElementById('container').scrollLeft += 900;
  };
  buttonLeft.onclick = function () {
    document.getElementById('container').scrollLeft -= 900;
  };

  let buttonRight3 = document.getElementById('slideRight3');
  let buttonLeft3 = document.getElementById('slideLeft3');

  buttonRight3.onclick = function () {
    document.getElementById('container3').scrollLeft += 900;
  };
  buttonLeft3.onclick = function () {
    document.getElementById('container3').scrollLeft -= 900;
  };
});