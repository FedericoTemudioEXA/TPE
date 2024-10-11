document.addEventListener("DOMContentLoaded", function() {
    "use strict";

    let buttonRight = document.getElementById('slideRight');
    let buttonLeft = document.getElementById('slideLeft');

    buttonRight.onclick = function () {
      document.getElementById('container').scrollLeft += 250;
    };
    buttonLeft.onclick = function () {
      document.getElementById('container').scrollLeft -= 250;
    };



});