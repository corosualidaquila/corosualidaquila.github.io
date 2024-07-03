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

 function switchMode(){
            const body = document.querySelector('body');
            body.classList.toggle('dark');
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






