document.addEventListener("DOMContentLoaded", function() {
    "use strict";

    let buttonRight = document.getElementById('slideRight');
    let buttonLeft = document.getElementById('slideLeft');

    buttonRight.onclick = function () {
      document.getElementById('container').scrollLeft += 900;
    };
    buttonLeft.onclick = function () {
      document.getElementById('container').scrollLeft -= 900;
    };

    let buttonRight2 = document.getElementById('slideRight2');
    let buttonLeft2 = document.getElementById('slideLeft2');

    buttonRight2.onclick = function () {
      document.getElementById('container2').scrollLeft += 1200;
    };
    buttonLeft2.onclick = function () {
      document.getElementById('container2').scrollLeft -= 1200;
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