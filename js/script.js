let intro = document.querySelector(".splash-screen");
let logo = document.querySelector(".logo-header");
let logoSpan = document.querySelectorAll(".logo");

window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    logoSpan.forEach((span, idx) => {
      setTimeout(() => {
        span.classList.add("active");
      }, (idx + 1) * 400);
    });

    setTimeout(() => {
      logoSpan.forEach(() => {
        span.classList.remove("active");
        span.classList.add("fade");
      }, (idx + 1) * 50);
    }, 2000);

    setTimeout(() => {
      intro.style.top = "-100vh";
    }, 2300);
  });
});


/* -------- FOR CHANGE DARK/LIGHT MODE --------*/

function myFunction() {
   var element = document.body;
   element.classList.toggle("dark-mode");
}


/* --------- NAV MENU --------- */
function myNavFunction() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}






