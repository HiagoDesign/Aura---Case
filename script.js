const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const newsletter = document.querySelector("[data-newsletter]");
const note = document.querySelector("[data-form-note]");
const search = document.querySelector("[data-search]");
const searchInput = document.querySelector("[data-search-input]");
const searchClear = document.querySelector("[data-search-clear]");
const promoCarousel = document.querySelector("[data-promo-carousel]");
const categoryCarousel = document.querySelector("[data-category-carousel]");
const categoryTrack = document.querySelector("[data-category-track]");
const categoryNext = document.querySelector("[data-category-next]");
const testimonialCarousel = document.querySelector("[data-testimonial-carousel]");
const testimonialTrack = document.querySelector("[data-testimonial-track]");
const testimonialNext = document.querySelector("[data-testimonial-next]");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setHeaderState() {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
}

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

menuToggle?.addEventListener("click", () => {
  const isOpen = header.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
});

nav?.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    header.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Abrir menu");
  }
});

const syncSearchClear = () => {
  search?.classList.toggle("has-value", Boolean(searchInput?.value));
};

searchInput?.addEventListener("input", syncSearchClear);

searchClear?.addEventListener("click", () => {
  if (!searchInput) return;
  searchInput.value = "";
  syncSearchClear();
  searchInput.focus();
});

syncSearchClear();

if (promoCarousel) {
  const promoMessages = Array.from(promoCarousel.querySelectorAll(".promo-message"));
  let promoIndex = 0;

  if (promoMessages.length > 1 && !reducedMotion) {
    window.setInterval(() => {
      promoMessages[promoIndex].classList.remove("is-active");
      promoIndex = (promoIndex + 1) % promoMessages.length;
      promoMessages[promoIndex].classList.add("is-active");
    }, 4000);
  }
}

if (categoryCarousel && categoryTrack && categoryNext) {
  let categoryIndex = 0;
  const originalCards = Array.from(categoryTrack.querySelectorAll(".image-card"));

  originalCards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.setAttribute("tabindex", "-1");
    categoryTrack.appendChild(clone);
  });

  const getCategoryMetrics = () => {
    const styles = window.getComputedStyle(categoryCarousel);
    const visible = Number.parseInt(styles.getPropertyValue("--category-visible"), 10) || 4;
    const gap = Number.parseFloat(styles.getPropertyValue("--category-gap")) || 24;
    const cardWidth = originalCards[0]?.getBoundingClientRect().width || 0;

    return {
      visible,
      step: cardWidth + gap,
      originalCount: originalCards.length,
    };
  };

  const updateCategoryCarousel = (animate = true) => {
    const { step } = getCategoryMetrics();
    categoryTrack.style.transition = animate ? "" : "none";
    categoryTrack.style.transform = `translateX(-${categoryIndex * step}px)`;
  };

  categoryNext.addEventListener("click", () => {
    categoryIndex += 1;
    updateCategoryCarousel();
  });

  categoryTrack.addEventListener("transitionend", () => {
    const { originalCount } = getCategoryMetrics();

    if (categoryIndex < originalCount) return;
    categoryIndex = 0;
    updateCategoryCarousel(false);
  });

  window.addEventListener("resize", updateCategoryCarousel);
  updateCategoryCarousel();
}

if (testimonialCarousel && testimonialTrack && testimonialNext) {
  let testimonialIndex = 0;
  const originalTestimonials = Array.from(testimonialTrack.querySelectorAll("blockquote"));

  originalTestimonials.forEach((testimonial) => {
    const clone = testimonial.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    testimonialTrack.appendChild(clone);
  });

  const getTestimonialMetrics = () => {
    const styles = window.getComputedStyle(testimonialCarousel);
    const gap = Number.parseFloat(styles.getPropertyValue("--testimonial-gap")) || 24;
    const cardWidth = originalTestimonials[0]?.getBoundingClientRect().width || 0;

    return {
      step: cardWidth + gap,
      originalCount: originalTestimonials.length,
    };
  };

  const updateTestimonialCarousel = (animate = true) => {
    const { step } = getTestimonialMetrics();
    testimonialTrack.style.transition = animate ? "" : "none";
    testimonialTrack.style.transform = `translateX(-${testimonialIndex * step}px)`;
  };

  testimonialNext.addEventListener("click", () => {
    testimonialIndex += 1;
    updateTestimonialCarousel();
  });

  testimonialTrack.addEventListener("transitionend", () => {
    const { originalCount } = getTestimonialMetrics();

    if (testimonialIndex < originalCount) return;
    testimonialIndex = 0;
    updateTestimonialCarousel(false);
  });

  window.addEventListener("resize", updateTestimonialCarousel);
  updateTestimonialCarousel();
}

const revealItems = document.querySelectorAll(".reveal");

if (reducedMotion) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -80px 0px" }
  );

  revealItems.forEach((item) => observer.observe(item));
}

document.querySelectorAll(".favorite").forEach((button) => {
  button.addEventListener("click", () => {
    const active = button.classList.toggle("is-active");
    button.setAttribute("aria-label", active ? "Remover dos favoritos" : "Adicionar aos favoritos");
  });
});

newsletter?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector("button");

  button.disabled = true;
  button.textContent = "Enviando";
  note.classList.remove("is-success");

  window.setTimeout(() => {
    form.reset();
    button.disabled = false;
    button.textContent = "Enviar";
    note.textContent = "Cadastro confirmado. Bem-vinda a lista da Aura.";
    note.classList.add("is-success");
  }, 650);
});
