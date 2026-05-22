// MOBILE NAV TOGGLE (OPTIONAL)

const navLinks = document.querySelector(".nav-links");


// BUTTON ANIMATIONS

const buttons = document.querySelectorAll(".btn");

buttons.forEach((button) => {

  button.addEventListener("mouseenter", () => {
    button.style.transform = "translateY(-2px)";
  });

  button.addEventListener("mouseleave", () => {
    button.style.transform = "translateY(0px)";
  });

});


// FEATURE CARD HOVER EFFECT

const featureCards = document.querySelectorAll(".feature-card");

featureCards.forEach((card) => {

  card.addEventListener("mouseenter", () => {
    card.style.transform = "translateY(-10px)";
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(0px)";
  });

});


// NOTE CARD ANIMATION

const noteCards = document.querySelectorAll(".note-card");

noteCards.forEach((card) => {

  card.addEventListener("mouseenter", () => {

    card.style.transform = "translateY(-8px)";
    card.style.transition = "0.3s";

  });

  card.addEventListener("mouseleave", () => {

    card.style.transform = "translateY(0px)";

  });

});


// HERO FLOATING EFFECT

const floatingCards = document.querySelectorAll(".floating-card");

window.addEventListener("mousemove", (e) => {

  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;

  floatingCards.forEach((card, index) => {

    const speed = (index + 1) * 12;

    const moveX = (x - 0.5) * speed;
    const moveY = (y - 0.5) * speed;

    card.style.transform =
      `translate(${moveX}px, ${moveY}px)`;

  });

});


// SCROLL REVEAL ANIMATION

const revealElements = document.querySelectorAll(
  ".feature-card, .note-card, .stat-box"
);

function revealOnScroll() {

  const windowHeight = window.innerHeight;

  revealElements.forEach((element) => {

    const top = element.getBoundingClientRect().top;

    if (top < windowHeight - 100) {

      element.style.opacity = "1";
      element.style.transform = "translateY(0px)";
      element.style.transition = "0.6s ease";

    }

  });

}

revealElements.forEach((element) => {

  element.style.opacity = "0";
  element.style.transform = "translateY(40px)";

});

window.addEventListener("scroll", revealOnScroll);

revealOnScroll();


// CTA BUTTON CLICK

const ctaButton = document.querySelector(".btn-white");

if (ctaButton) {

  ctaButton.addEventListener("click", () => {

    alert("Welcome to StudyHub 🚀");

  });

}


// SMOOTH SCROLL (FOR FUTURE LINKS)

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {

  anchor.addEventListener("click", function (e) {

    e.preventDefault();

    const target = document.querySelector(
      this.getAttribute("href")
    );

    if (target) {

      target.scrollIntoView({
        behavior: "smooth"
      });

    }

  });

});