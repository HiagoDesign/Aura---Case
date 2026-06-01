const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const newsletter = document.querySelector("[data-newsletter]");
const note = document.querySelector("[data-form-note]");
const search = document.querySelector("[data-search]");
const searchInput = document.querySelector("[data-search-input]");
const searchClear = document.querySelector("[data-search-clear]");

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
