(() => {
  const year = document.querySelectorAll("[data-year]");
  year.forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  const toggle = document.querySelector("[data-nav-toggle]");
  const panel = document.querySelector("[data-mobile-panel]");
  if (toggle && panel) {
    toggle.addEventListener("click", () => {
      const open = panel.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  const form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const lines = [];
      data.forEach((value, key) => {
        lines.push(`${key}: ${value}`);
      });
      const subject = encodeURIComponent("BraggSense project enquiry");
      const body = encodeURIComponent(lines.join("\n"));
      const success = form.querySelector(".form-success");
      if (success) success.style.display = "block";
      window.location.href = `mailto:nagulapallysamanth@gmail.com?subject=${subject}&body=${body}`;
    });
  }
})();
