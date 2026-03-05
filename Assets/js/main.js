const navLinks = document.querySelector("#nav-links");
const menuToggle = document.querySelector("#menu-toggle");
const themeToggle = document.querySelector("#theme-toggle");
const backToTop = document.querySelector("#back-to-top");
const modal = document.querySelector("#project-modal");
const modalTitle = document.querySelector("#modal-title");
const modalDescription = document.querySelector("#modal-description");
const closeModalBtn = document.querySelector("#close-modal");
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const copyEmailBtn = document.querySelector("#copy-email");
const toast = document.querySelector("#toast");

// 1) Mobile menu toggle
if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// 2) Smooth scroll + close mobile menu after click
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const targetId = anchor.getAttribute("href");
    if (!targetId) return;
    const target = document.querySelector(targetId);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
    if (navLinks) navLinks.classList.remove("open");
    if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
  });
});

// 3) Dark mode toggle with localStorage
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
}
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    themeToggle.textContent = isDark ? "Light Mode" : "Dark Mode";
  });
  themeToggle.textContent = document.body.classList.contains("dark") ? "Light Mode" : "Dark Mode";
}

// 4) Reveal on scroll using IntersectionObserver
const revealItems = document.querySelectorAll(".reveal");
revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${index * 90}ms`;
});
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.2 }
);
revealItems.forEach((item) => revealObserver.observe(item));

// 5) Active nav link + back-to-top visibility
const sectionIds = ["home", "about", "projects", "contact"];
const navAnchors = document.querySelectorAll(".nav-links a");
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  sectionIds.forEach((id) => {
    const section = document.getElementById(id);
    if (!section) return;
    const offsetTop = section.offsetTop - 130;
    const offsetBottom = offsetTop + section.offsetHeight;
    if (scrollY >= offsetTop && scrollY < offsetBottom) {
      navAnchors.forEach((a) => a.classList.remove("active"));
      const current = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (current) current.classList.add("active");
    }
  });
  if (backToTop) {
    if (scrollY > 400) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  }
});

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// 6) Project quick preview modal
document.querySelectorAll(".project-preview-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!modal || !modalTitle || !modalDescription) return;
    modalTitle.textContent = btn.getAttribute("data-project") || "Project";
    modalDescription.textContent = btn.getAttribute("data-description") || "";
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
  });
});

if (closeModalBtn && modal) {
  closeModalBtn.addEventListener("click", () => {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  });
}

if (modal) {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.remove("show");
      modal.setAttribute("aria-hidden", "true");
    }
  });
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => {
    toast.classList.remove("show");
  }, 1700);
}

if (copyEmailBtn) {
  copyEmailBtn.addEventListener("click", async () => {
    const email = copyEmailBtn.getAttribute("data-email") || "";
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      showToast("Email copied to clipboard.");
    } catch (error) {
      showToast("Copy failed. Please copy manually.");
    }
  });
}

// 7) Contact form validation
if (contactForm && formStatus) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.querySelector("#name")?.value.trim() || "";
    const email = document.querySelector("#email")?.value.trim() || "";
    const message = document.querySelector("#message")?.value.trim() || "";
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !email || !message) {
      formStatus.textContent = "Please fill in all fields.";
      return;
    }

    if (!emailValid) {
      formStatus.textContent = "Please use a valid email format.";
      return;
    }

    formStatus.textContent = "Message sent successfully (demo).";
    showToast("Message sent successfully.");
    contactForm.reset();
  });
}
