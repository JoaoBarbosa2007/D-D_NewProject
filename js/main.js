// ============================================================
// MENU
// ============================================================

document.querySelectorAll(".site-nav a").forEach((link) => {
  if (link.pathname === window.location.pathname) {
    link.classList.add("active");
  }
});


// ============================================================
// CARROSSEL
// ============================================================

const carouselSlides = document.querySelectorAll(".carousel-slide");
const carouselIndicators = document.querySelectorAll(".carousel-indicator");

const carouselPrevious = document.querySelector(".carousel-prev");
const carouselNext = document.querySelector(".carousel-next");

let currentSlide = 0;
let carouselInterval;


// ------------------------------------------------------------
// MOSTRAR SLIDE
// ------------------------------------------------------------

function showSlide(index) {
  if (!carouselSlides.length) return;

  if (index >= carouselSlides.length) {
    currentSlide = 0;
  } else if (index < 0) {
    currentSlide = carouselSlides.length - 1;
  } else {
    currentSlide = index;
  }

  carouselSlides.forEach((slide, index) => {
    slide.classList.toggle("active", index === currentSlide);
  });

  carouselIndicators.forEach((indicator, index) => {
    indicator.classList.toggle(
      "active",
      index === currentSlide
    );
  });
}


// ------------------------------------------------------------
// PRÓXIMO SLIDE
// ------------------------------------------------------------

function nextSlide() {
  showSlide(currentSlide + 1);
}


// ------------------------------------------------------------
// SLIDE ANTERIOR
// ------------------------------------------------------------

function previousSlide() {
  showSlide(currentSlide - 1);
}


// ------------------------------------------------------------
// BOTÕES
// ------------------------------------------------------------

if (carouselNext) {
  carouselNext.addEventListener("click", () => {
    nextSlide();
    restartCarousel();
  });
}

if (carouselPrevious) {
  carouselPrevious.addEventListener("click", () => {
    previousSlide();
    restartCarousel();
  });
}


// ------------------------------------------------------------
// INDICADORES
// ------------------------------------------------------------

carouselIndicators.forEach((indicator, index) => {
  indicator.addEventListener("click", () => {
    showSlide(index);
    restartCarousel();
  });
});


// ------------------------------------------------------------
// PASSAGEM AUTOMÁTICA
// ------------------------------------------------------------

function startCarousel() {
  carouselInterval = setInterval(nextSlide, 5000);
}

function restartCarousel() {
  clearInterval(carouselInterval);
  startCarousel();
}


// ------------------------------------------------------------
// INICIALIZAÇÃO
// ------------------------------------------------------------

if (carouselSlides.length > 0) {
  showSlide(0);
  startCarousel();
}