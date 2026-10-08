// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Live local clock (New York)
const clock = document.getElementById("clock");
function tick() {
  const time = new Date().toLocaleTimeString("en-US", {
    timeZone: "America/New_York",
    hour: "2-digit",
    minute: "2-digit",
  });
  clock.textContent = `New York, ${time}`;
}
tick();
setInterval(tick, 30000);

// Reveal elements on scroll
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${Math.min(i % 4, 3) * 80}ms`;
  observer.observe(el);
});

// Subtle 3D tilt on bento cards
const fine = window.matchMedia("(pointer: fine)").matches;
if (fine) {
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 4).toFixed(2)}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}
