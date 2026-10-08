/* Mobile portfolio — vanilla JS, no dependencies */
(() => {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  /* ---------- Footer year + New York clock ---------- */
  $("#year").textContent = new Date().getFullYear();
  const clock = $("#clock");
  const tickClock = () => {
    const time = new Date().toLocaleTimeString("en-US", {
      timeZone: "America/New_York",
      hour: "2-digit",
      minute: "2-digit",
    });
    clock.textContent = `New York · ${time}`;
  };
  tickClock();
  setInterval(tickClock, 15000);

  /* ---------- Text splitting ---------- */
  function splitChars(el) {
    const words = el.textContent.trim().split(/\s+/);
    let index = 0;
    el.textContent = "";
    words.forEach((word, wi) => {
      const wordEl = document.createElement("span");
      wordEl.className = "word";
      for (const ch of word) {
        const c = document.createElement("span");
        c.className = "char";
        c.style.setProperty("--i", index++);
        c.textContent = ch;
        wordEl.appendChild(c);
      }
      el.appendChild(wordEl);
      if (wi < words.length - 1) el.appendChild(document.createTextNode(" "));
    });
  }

  function splitWords(el) {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map((w) => `<span class="w">${w}</span>`).join(" ");
    return $$(".w", el);
  }

  $$("[data-split]").forEach(splitChars);
  const aboutWords = splitWords($("#aboutText"));

  /* ---------- Loader + hero intro ---------- */
  const loader = $("#loader");
  const startHero = () => {
    $$(".hero [data-split]").forEach((el) => el.classList.add("is-in"));
  };

  if (reduce) {
    loader.remove();
    document.body.classList.remove("is-loading");
    startHero();
  } else {
    setTimeout(() => {
      loader.classList.add("done");
      document.body.classList.remove("is-loading");
      startHero();
      setTimeout(() => loader.remove(), 1000);
    }, 1100);
  }

  /* ---------- Rotating role text (typewriter) ---------- */
  const roles = ["UI/UX Designer", "Brand Builder", "Motion Artist", "Web Creator"];
  const roleEl = $("#roleText");
  if (!reduce) {
    let ri = 0;
    let ci = 0;
    let deleting = false;
    const typeLoop = () => {
      const word = roles[ri];
      if (!deleting) {
        ci += 1;
        roleEl.textContent = word.slice(0, ci);
        if (ci === word.length) {
          deleting = true;
          return setTimeout(typeLoop, 1600);
        }
        return setTimeout(typeLoop, 90);
      }
      ci -= 1;
      roleEl.textContent = word.slice(0, ci);
      if (ci === 0) {
        deleting = false;
        ri = (ri + 1) % roles.length;
        return setTimeout(typeLoop, 300);
      }
      return setTimeout(typeLoop, 40);
    };
    setTimeout(() => {
      roleEl.textContent = "";
      typeLoop();
    }, 1400);
  }

  /* ---------- Count-up numbers ---------- */
  const counters = $$("[data-count]");
  const countUp = (el) => {
    const target = Number(el.dataset.count);
    const duration = 1400;
    const t0 = performance.now();
    const step = (now) => {
      const p = clamp((now - t0) / duration, 0, 1);
      el.textContent = Math.round((1 - Math.pow(1 - p, 4)) * target);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (!reduce) counters.forEach((el) => (el.textContent = "0"));

  /* ---------- Scroll reveal ---------- */
  const revealTargets = $$("[data-reveal], [data-split], [data-count]").filter(
    (el) => !el.closest(".hero")
  );

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add("is-in");
        if (el.hasAttribute("data-count")) countUp(el);
        io.unobserve(el);
      });
    },
    { threshold: 0.15 }
  );

  if (reduce) {
    revealTargets.forEach((el) => el.classList.add("is-in"));
    counters.forEach((el) => (el.textContent = el.dataset.count));
  } else {
    revealTargets.forEach((el) => io.observe(el));
  }

  /* ---------- Top bar, bottom nav, scroll effects ---------- */
  const topbar = $("#topbar");
  const bottomNav = $(".bottom-nav");
  const indicator = $("#indicator");
  const navLinks = $$(".bottom-nav a");
  let lastY = window.scrollY;

  function moveIndicator(link) {
    if (!link) return;
    indicator.style.width = `${link.offsetWidth}px`;
    indicator.style.transform = `translateX(${link.offsetLeft - 6}px)`;
  }

  const sections = navLinks
    .map((a) => document.getElementById(a.dataset.target))
    .filter(Boolean);

  function setActive(id) {
    navLinks.forEach((a) => {
      const on = a.dataset.target === id;
      a.classList.toggle("active", on);
      if (on) moveIndicator(a);
    });
  }

  // Highlight the section currently in view in the bottom nav.
  const navIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setActive(e.target.id);
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => navIO.observe(s));

  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    topbar.classList.toggle("scrolled", y > 30);

    const dy = y - lastY;
    if (y > 240 && dy > 6) topbar.classList.add("hide");
    else if (dy < -6) topbar.classList.remove("hide");
    lastY = y;

    // Hide the bottom nav while the hero is on screen.
    const hero = $(".hero").getBoundingClientRect();
    bottomNav.classList.toggle("hidden", hero.bottom > window.innerHeight * 0.6);

    // Word-by-word highlight for the about paragraph.
    if (aboutWords.length) {
      const r = $("#about").getBoundingClientRect();
      const vh = window.innerHeight;
      const p = reduce ? 1 : clamp((vh * 0.85 - r.top) / (r.height + vh * 0.4), 0, 1);
      const n = aboutWords.length;
      aboutWords.forEach((w, i) => w.classList.toggle("lit", p >= i / n));
    }
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(onScroll);
    },
    { passive: true }
  );
  window.addEventListener("resize", () => {
    const active = navLinks.find((a) => a.classList.contains("active"));
    moveIndicator(active);
  });
  onScroll();

  /* ---------- Full-screen menu ---------- */
  const menuBtn = $("#menuBtn");
  const setMenu = (open) => {
    document.body.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  menuBtn.addEventListener("click", () => {
    setMenu(!document.body.classList.contains("menu-open"));
  });
  $$(".menu a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  /* ---------- Project chips (filter) ---------- */
  const chips = $$(".chip");
  const projects = $$(".project");
  const carousel = $("#carousel");
  chips.forEach((btn) => {
    btn.addEventListener("click", () => {
      const f = btn.dataset.filter;
      chips.forEach((c) => c.classList.toggle("is-active", c === btn));
      projects.forEach((p) => {
        const show = f === "all" || p.dataset.cat === f;
        p.classList.toggle("hidden", !show);
        if (show) {
          p.classList.remove("pop");
          void p.offsetWidth; // restart animation
          p.classList.add("pop");
        }
      });
      if (carousel.scrollTo) carousel.scrollTo({ left: 0, behavior: reduce ? "auto" : "smooth" });
    });
  });
})();
